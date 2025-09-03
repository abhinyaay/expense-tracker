import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Expense from '@/models/Expense';

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
    const { name, color, icon } = body;

    await connectDB();

    // Verify category belongs to user
    const category = await Category.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if new name conflicts with existing category
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        userId: session.user.id,
        _id: { $ne: params.id },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Category name already exists' },
          { status: 409 }
        );
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      {
        ...(name && { name: name.trim() }),
        ...(color && { color }),
        ...(icon && { icon }),
      },
      { new: true }
    );

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
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

    const category = await Category.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category is being used by any expenses
    const expenseCount = await Expense.countDocuments({
      category: params.id,
      userId: session.user.id,
    });

    if (expenseCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It is used by ${expenseCount} expense(s).` },
        { status: 409 }
      );
    }

    await Category.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
