'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  color: string;
  icon: string;
}

export default function NewExpensePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    place: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
      
      // Select first category by default if available
      if (data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/expenses');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create expense');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
          <Link href="/expenses" className="text-gray-500 hover:text-gray-700">
            ← Back to Expenses
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-6xl mb-4 block">🏷️</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-6">
              You need to create at least one category before adding expenses.
            </p>
            <Link href="/categories" className="btn-primary">
              Create Categories
            </Link>
          </div>
        ) : (
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
              <p className="mt-1 text-sm text-gray-500">
                Don't see your category?{' '}
                <Link href="/categories" className="text-primary-600 hover:text-primary-700">
                  Create one here
                </Link>
              </p>
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
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Expense'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
