import { User } from '../types';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    // In a real app, this would be an API call
    const savedState = localStorage.getItem('usersState');
    if (savedState) {
      return JSON.parse(savedState).users;
    }
    return [];
  },

  updateUser: async (user: User): Promise<User> => {
    // Update localStorage in this example
    const savedState = localStorage.getItem('usersState');
    if (savedState) {
      const state = JSON.parse(savedState);
      const index = state.users.findIndex((u: User) => u.id === user.id);
      if (index !== -1) {
        state.users[index] = user;
        localStorage.setItem('usersState', JSON.stringify(state));
      }
    }
    return user;
  },

  // Add other API methods
}; 