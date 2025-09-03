import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';
import Category from '@/models/Category';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description, category, place, date } = body;

    await connectDB();

    // Verify expense belongs to user
    const expense = await Expense.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // If category is being updated, verify it belongs to user
    if (category) {
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
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      params.id,
      {
        ...(amount && { amount: parseFloat(amount) }),
        ...(description && { description }),
        ...(category && { category }),
        ...(place && { place }),
        ...(date && { date: new Date(date) }),
      },
      { new: true }
    ).populate('category', 'name color icon');

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const expense = await Expense.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
