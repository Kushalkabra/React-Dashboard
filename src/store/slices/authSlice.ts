import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  registeredUsers: User[];
  error: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  registeredUsers: [],
  error: null,
  isLoading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<Omit<User, 'id'>>) => {
      const newUser = {
        ...action.payload,
        id: state.registeredUsers.length + 1
      };
      state.registeredUsers.push(newUser);
      state.user = newUser;
      state.error = null;
    },
    loginUser: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const user = state.registeredUsers.find(
        u => u.email === action.payload.email && u.password === action.payload.password
      );
      if (user) {
        state.user = user;
        state.error = null;
      } else {
        state.error = 'Invalid email or password';
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload
        };
        // Update the user in registeredUsers array as well
        const index = state.registeredUsers.findIndex(u => u.id === state.user?.id);
        if (index !== -1) {
          state.registeredUsers[index] = state.user;
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { registerUser, loginUser, updateUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer; 