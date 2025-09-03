'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus, FaChartLine, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';

interface DashboardData {
  totalExpenses: number;
  totalAmount: number;
  recentExpenses: any[];
  topCategories: any[];
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalExpenses: 0,
    totalAmount: 0,
    recentExpenses: [],
    topCategories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent expenses
        const expensesResponse = await fetch('/api/expenses?limit=5');
        const expensesData = await expensesResponse.json();

        // Fetch analytics
        const analyticsResponse = await fetch('/api/analytics');
        const analyticsData = await analyticsResponse.json();

        setDashboardData({
          totalExpenses: analyticsData.summary?.count || 0,
          totalAmount: analyticsData.summary?.total || 0,
          recentExpenses: expensesData.expenses || [],
          topCategories: analyticsData.categoryBreakdown?.slice(0, 3) || [],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Here's an overview of your expense tracking activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FaCreditCard className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.totalExpenses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${dashboardData.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaChartLine className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg per Expense</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {dashboardData.totalExpenses > 0
                  ? (dashboardData.totalAmount / dashboardData.totalExpenses).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Link
            href="/expenses/new"
            className="flex items-center justify-center h-full text-primary-600 hover:text-primary-700 transition-colors"
          >
            <FaPlus className="h-8 w-8 mr-2" />
            <span className="font-medium">Add Expense</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Expenses */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            <Link
              href="/expenses"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {dashboardData.recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentExpenses.map((expense: any) => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{expense.category?.icon || '💰'}</span>
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{expense.category?.name}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                          {expense.place}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No expenses yet</p>
              <Link href="/expenses/new" className="btn-primary">
                Add Your First Expense
              </Link>
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
            <Link
              href="/analytics"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View analytics
            </Link>
          </div>

          {dashboardData.topCategories.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.topCategories.map((category: any) => (
                <div key={category._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${category.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{category.count} expenses</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No categories yet</p>
              <Link href="/categories" className="btn-primary">
                Create Categories
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/expenses/new"
            className="flex flex-col items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <FaPlus className="h-6 w-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-primary-700">Add Expense</span>
          </Link>

          <Link
            href="/categories"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-2xl mb-2">🏷️</span>
            <span className="text-sm font-medium text-green-700">Manage Categories</span>
          </Link>

          <Link
            href="/analytics"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaChartLine className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">View Analytics</span>
          </Link>

          <Link
            href="/expenses"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FaCreditCard className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">All Expenses</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
