import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';
import Category from '@/models/Category';

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
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    let query: any = { userId: session.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query)
      .populate('category', 'name color icon')
      .sort({ date: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description, category, place, date } = body;

    if (!amount || !description || !category || !place) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify category belongs to user
    const categoryDoc = await Category.findOne({
      _id: category,
      userId: session.user.id,
    });

    if (!categoryDoc) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const expense = await Expense.create({
      amount: parseFloat(amount),
      description,
      category,
      place,
      date: date ? new Date(date) : new Date(),
      userId: session.user.id,
    });

    const populatedExpense = await Expense.findById(expense._id).populate(
      'category',
      'name color icon'
    );

    return NextResponse.json(populatedExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
