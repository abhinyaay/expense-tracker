import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const baseQuery = { userId: session.user.id, ...dateFilter };

    // Total expenses
    const totalResult = await Expense.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Expenses by category
    const categoryExpenses = await Expense.aggregate([
      { $match: baseQuery },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$category',
          name: { $first: '$categoryInfo.name' },
          color: { $first: '$categoryInfo.color' },
          icon: { $first: '$categoryInfo.icon' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Monthly expenses (last 12 months)
    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          userId: session.user.id,
          date: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Top places
    const topPlaces = await Expense.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$place',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;
    const count = totalResult.length > 0 ? totalResult[0].count : 0;

    return NextResponse.json({
      summary: {
        total,
        count,
        average: count > 0 ? total / count : 0,
      },
      categoryBreakdown: categoryExpenses,
      monthlyTrend: monthlyExpenses,
      topPlaces,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
