import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const categories = await Category.find({ userId: session.user.id }).sort({
      name: 1,
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
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
    const { name, color, icon } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      name: name.trim(),
      userId: session.user.id,
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name: name.trim(),
      color: color || '#3b82f6',
      icon: icon || '💰',
      userId: session.user.id,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
