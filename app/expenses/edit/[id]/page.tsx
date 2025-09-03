'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  color: string;
  icon: string;
}

interface Expense {
  _id: string;
  amount: number;
  description: string;
  category: string;
  place: string;
  date: string;
}

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    place: '',
    date: '',
  });

  useEffect(() => {
    if (expenseId) {
      fetchExpense();
      fetchCategories();
    }
  }, [expenseId]);

  const fetchExpense = async () => {
    try {
      const response = await fetch(`/api/expenses?limit=1000`);
      const data = await response.json();
      const expense = data.expenses.find((e: any) => e._id === expenseId);
      
      if (expense) {
        setFormData({
          amount: expense.amount.toString(),
          description: expense.description,
          category: expense.category._id,
          place: expense.place,
          date: new Date(expense.date).toISOString().split('T')[0],
        });
      } else {
        alert('Expense not found');
        router.push('/expenses');
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      alert('Failed to load expense');
      router.push('/expenses');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/expenses');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
          <Link href="/expenses" className="text-gray-500 hover:text-gray-700">
            ← Back to Expenses
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={handleInputChange}
                className="input-field pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              placeholder="What did you spend on?"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-2">
              Place *
            </label>
            <input
              type="text"
              id="place"
              name="place"
              required
              value={formData.place}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Where did you spend?"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Link href="/expenses" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
