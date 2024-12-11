import React, { useState, useMemo } from 'react';
import { Users, UserCheck, UserMinus, Activity, Filter } from 'react-feather';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '../constants';

interface AnalyticCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color
}) => (
  <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="space-y-4">
        <div className={`${color} p-3 rounded-xl shadow-lg ${color.replace('bg-', 'shadow-')}/30 w-fit`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {value}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>
      </div>
      {trend && (
        <span className={`flex items-center text-sm font-medium ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}%
        </span>
      )}
    </div>
    <p className="text-sm text-gray-500 mt-4">{description}</p>
  </div>
);

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  deletedUsers: number;
  activePercentage: number;
}

// Mock data for charts
const registrationData = [
  { name: 'Jan', users: 120, activeUsers: 100 },
  { name: 'Feb', users: 145, activeUsers: 125 },
  { name: 'Mar', users: 190, activeUsers: 160 },
  { name: 'Apr', users: 220, activeUsers: 180 },
  { name: 'May', users: 250, activeUsers: 220 },
  { name: 'Jun', users: 280, activeUsers: 240 }
];

const regionData = [
  { region: 'North America', users: 450 },
  { region: 'Europe', users: 380 },
  { region: 'Asia', users: 320 },
  { region: 'South America', users: 180 },
  { region: 'Africa', users: 120 },
  { region: 'Oceania', users: 90 }
];

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

// Add filter types
interface DateRange {
  start: Date;
  end: Date;
}

interface DashboardFilters {
  dateRange: string;
  region: string;
  customDateRange: DateRange | null;
}

// Custom tooltip component for the bar chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-blue-600 font-semibold">
          {payload[0].value} Users
        </p>
      </div>
    );
  }
  return null;
};

// Custom bar label
const renderCustomBarLabel = ({ x, y, width, value }: any) => {
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#6B7280"
      textAnchor="middle"
      fontSize={12}
    >
      {value}
    </text>
  );
};

function AnalyticsDashboard() {
  const users = useSelector((state: RootState) => state.users.users);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const deletedUsersCount = useSelector((state: RootState) => state.users.deletedCount);

  // Filter users to only show those created by the current admin
  const adminUsers = useMemo(() => {
    return users.filter(user => user.createdBy === currentUser?.id);
  }, [users, currentUser?.id]);

  // Add filter state
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: '30d',
    region: 'all',
    customDateRange: null
  });

  const [showFilters, setShowFilters] = useState(false);

  // Available date ranges
  const dateRanges = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 6 months', value: '6m' },
    { label: 'Year to date', value: 'ytd' },
    { label: 'All time', value: 'all' }
  ];

  // Filter users based on selected filters
  const filteredUsers = useMemo(() => {
    return adminUsers.filter(user => {
      // Region filter
      if (filters.region !== 'all' && user.region !== filters.region) {
        return false;
      }

      // Date filter
      const userDate = new Date(user.lastActive);
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '6m':
          startDate.setMonth(now.getMonth() - 6);
          break;
        case 'ytd':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'all':
          return true;
        default:
          if (filters.customDateRange) {
            return userDate >= filters.customDateRange.start && 
                   userDate <= filters.customDateRange.end;
          }
          return true;
      }

      return userDate >= startDate;
    });
  }, [adminUsers, filters]);

  // Calculate statistics based on filtered users
  const stats = useMemo(() => ({
    totalUsers: filteredUsers.length,
    activeUsers: filteredUsers.filter(user => user.status === 'active').length,
    deletedUsers: deletedUsersCount,
    activePercentage: filteredUsers.length > 0 
      ? Math.round((filteredUsers.filter(user => user.status === 'active').length / filteredUsers.length) * 100)
      : 0
  }), [filteredUsers, deletedUsersCount]);

  // Generate chart data based on filtered users
  const chartData = useMemo(() => {
    const regionData = filteredUsers.reduce((acc, user) => {
      acc[user.region] = (acc[user.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(regionData).map(([region, count]) => ({
      region,
      users: count
    }));
  }, [filteredUsers]);

  // User status data for pie chart
  const userStatusData = useMemo(() => [
    { name: 'Active', value: stats.activeUsers },
    { name: 'Inactive', value: stats.totalUsers - stats.activeUsers }
  ], [stats]);

  // Generate registration trend data
  const registrationData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

    return months.map((month, index) => {
      const date = new Date(sixMonthsAgo);
      date.setMonth(sixMonthsAgo.getMonth() + index);
      
      const usersInMonth = adminUsers.filter(user => {
        const userDate = new Date(user.lastActive);
        return userDate.getMonth() === date.getMonth() && 
               userDate.getFullYear() === date.getFullYear();
      });

      const activeUsersInMonth = usersInMonth.filter(user => user.status === 'active');

      return {
        name: month,
        users: usersInMonth.length,
        activeUsers: activeUsersInMonth.length
      };
    });
  }, [adminUsers]);

  return (
    <div className="p-3 sm:p-6 space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Overview of user statistics and metrics
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all duration-200
            ${showFilters 
              ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-md' 
              : 'hover:bg-gray-50 hover:shadow-md'}`}
        >
          <Filter size={20} className={showFilters ? 'text-blue-500' : 'text-gray-500'} />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <select
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              >
                <option value="all">All Regions</option>
                {['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'].map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setFilters({
                dateRange: '30d',
                region: 'all',
                customDateRange: null
              })}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticCard
          title="Total Users"
          value={stats.totalUsers}
          description="Total number of registered users"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <AnalyticCard
          title="Active Users"
          value={stats.activeUsers}
          description="Currently active users"
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <AnalyticCard
          title="Deleted Users"
          value={stats.deletedUsers}
          description="Total deleted accounts"
          icon={UserMinus}
          trend={{ value: 3, isPositive: false }}
          color="bg-gradient-to-r from-red-500 to-red-600"
        />
        <AnalyticCard
          title="Activity Rate"
          value={`${stats.activePercentage}%`}
          description="Users active this month"
          icon={Activity}
          trend={{ value: 5, isPositive: true }}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* User Registration and Active Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Registration Trend
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={registrationData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#colorUsers)"
                    name="Total Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#colorActiveUsers)"
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Active vs Inactive Users
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={window.innerWidth < 640 ? 40 : 60}
                    outerRadius={window.innerWidth < 640 ? 60 : 80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => 
                      window.innerWidth < 640 
                        ? `${(percent * 100).toFixed(0)}%`
                        : `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {userStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Users by Region */}
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Users by Region
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                barSize={40}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis 
                  dataKey="region"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={8}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dx={-8}
                />
                <Tooltip 
                  content={CustomTooltip}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                />
                <Bar 
                  dataKey="users" 
                  label={renderCustomBarLabel}
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#colorGradient-${index})`}
                      className="hover:opacity-80 transition-opacity duration-300"
                    />
                  ))}
                </Bar>
                <defs>
                  {chartData.map((entry, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`colorGradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={COLORS[index % COLORS.length]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor={COLORS[index % COLORS.length]}
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {chartData.map((entry, index) => (
              <div 
                key={entry.region}
                className="flex items-center space-x-2"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">{entry.region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;