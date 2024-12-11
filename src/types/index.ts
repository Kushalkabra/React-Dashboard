export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  region: string;
  lastActive: string;
  createdBy: number;
}

export interface AuthState {
  user: User | null;
  registeredUsers: User[];
  error: string | null;
  isLoading: boolean;
}

export interface UsersState {
  users: User[];
  deletedCount: number;
}

export type Region = 'North America' | 'South America' | 'Europe' | 'Asia' | 'Africa' | 'Oceania';