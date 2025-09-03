'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AnalyticsData {
  summary: {
    total: number;
    count: number;
    average: number;
  };
  categoryBreakdown: Array<{
    _id: string;
    name: string;
    color: string;
    icon: string;
    total: number;
    count: number;
  }>;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    total: number;
    count: number;
  }>;
  topPlaces: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      let url = '/api/analytics';
      const params = new URLSearchParams();
      
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
  };

  // Prepare data for charts
  const categoryChartData = analyticsData?.categoryBreakdown.map(cat => ({
    name: cat.name,
    value: cat.total,
    color: cat.color,
    icon: cat.icon,
  })) || [];

  const monthlyChartData = analyticsData?.monthlyTrend.map(month => ({
    name: `${month._id.month}/${month._id.year}`,
    amount: month.total,
    expenses: month.count,
  })) || [];

  const topPlacesData = analyticsData?.topPlaces.slice(0, 10).map(place => ({
    name: place._id,
    amount: place.total,
    count: place.count,
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 lg:mb-0">Analytics</h1>
        
        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input-field text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input-field text-sm"
            />
          </div>
          {(dateRange.start || dateRange.end) && (
            <button
              onClick={clearDateRange}
              className="btn-secondary text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${analyticsData?.summary.total.toFixed(2) || '0.00'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-gray-900">
            {analyticsData?.summary.count || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Average per Expense</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${analyticsData?.summary.average.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {analyticsData?.summary.count === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📊</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data to analyze</h3>
          <p className="text-gray-500 mb-6">
            {dateRange.start || dateRange.end
              ? 'No expenses found in the selected date range. Try adjusting your filters.'
              : 'Add some expenses to see your analytics.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h2>
            {categoryChartData.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2">
                  {categoryChartData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm">{category.icon} {category.name}</span>
                      </div>
                      <span className="text-sm font-medium">${category.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No category data available</p>
            )}
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h2>
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No monthly data available</p>
            )}
          </div>

          {/* Top Places */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Places</h2>
            {topPlacesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPlacesData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No place data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
