import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  region: string;
  lastActive: string;
  createdBy: number;
}

interface UsersState {
  users: User[];
  deletedCount: number;
}

const loadInitialState = (): UsersState => {
  const savedState = localStorage.getItem('usersState');
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'active',
        region: 'North America',
        lastActive: new Date().toISOString(),
        createdBy: 1
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'User',
        status: 'active',
        region: 'Europe',
        lastActive: new Date().toISOString(),
        createdBy: 1
      }
    ],
    deletedCount: 0
  };
};

const initialState: UsersState = loadInitialState();

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<User, 'id' | 'lastActive' | 'createdBy'> & { adminId: number }>) => {
      const newUser = {
        ...action.payload,
        id: Math.max(0, ...state.users.map(u => u.id)) + 1,
        lastActive: new Date().toISOString(),
        createdBy: action.payload.adminId
      };
      state.users.push(newUser);
      localStorage.setItem('usersState', JSON.stringify(state));
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = {
          ...action.payload,
          lastActive: new Date().toISOString()
        };
        localStorage.setItem('usersState', JSON.stringify(state));
      }
    },
    deleteUser: (state, action: PayloadAction<{ userId: number, adminId: number }>) => {
      state.users = state.users.filter(user => 
        !(user.id === action.payload.userId && user.createdBy === action.payload.adminId)
      );
      state.deletedCount += 1;
      localStorage.setItem('usersState', JSON.stringify(state));
    }
  }
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer; 