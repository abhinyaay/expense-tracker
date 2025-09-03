'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';

interface Expense {
  _id: string;
  amount: number;
  description: string;
  place: string;
  date: string;
  category: {
    _id: string;
    name: string;
    color: string;
    icon: string;
  };
}

interface Category {
  _id: string;
  name: string;
  color: string;
  icon: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [selectedCategory, dateRange]);

  const fetchExpenses = async () => {
    try {
      let url = '/api/expenses?limit=50';
      
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      
      if (dateRange.start && dateRange.end) {
        url += `&startDate=${dateRange.start}&endDate=${dateRange.end}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExpenses(expenses.filter(expense => expense._id !== expenseId));
      } else {
        alert('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setDateRange({ start: '', end: '' });
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <FaFilter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <Link href="/expenses/new" className="btn-primary flex items-center">
            <FaPlus className="h-4 w-4 mr-2" />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Average Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              ${expenses.length > 0 ? (totalAmount / expenses.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {expense.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{expense.category.icon}</span>
                        <span className="text-sm text-gray-900">{expense.category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                        {expense.place}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/expenses/edit/${expense._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FaEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">💸</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-500 mb-6">
              {selectedCategory || dateRange.start || dateRange.end
                ? 'Try adjusting your filters or add a new expense.'
                : 'Get started by adding your first expense.'}
            </p>
            <Link href="/expenses/new" className="btn-primary">
              Add Expense
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
