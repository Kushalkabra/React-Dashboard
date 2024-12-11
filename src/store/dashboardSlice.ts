import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DashboardState } from '../types';

const initialState: DashboardState = {
  users: [],
  analytics: {
    activeUsers: 0,
    totalRevenue: 0,
    conversionRate: 0,
    averageSessionDuration: 0,
  },
  loading: false,
  error: null,
};

// Simulated API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUsers = createAsyncThunk(
  'dashboard/fetchUsers',
  async () => {
    await delay(1000);
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', lastActive: '2024-03-15', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', lastActive: '2024-03-14', status: 'active' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', lastActive: '2024-03-13', status: 'inactive' },
    ];
  }
);

export const fetchAnalytics = createAsyncThunk(
  'dashboard/fetchAnalytics',
  async () => {
    await delay(1000);
    return {
      activeUsers: 1234,
      totalRevenue: 50000,
      conversionRate: 3.5,
      averageSessionDuration: 300,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      });
  },
});

export default dashboardSlice.reducer;