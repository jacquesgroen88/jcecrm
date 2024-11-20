import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UserStore {
  users: User[];
  currentUser: User | null;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
}

const sampleUsers: User[] = [
  {
    id: uuidv4(),
    name: 'John Smith',
    email: 'john@example.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: sampleUsers,
      currentUser: sampleUsers[0],
      
      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              id: uuidv4(),
              createdAt: new Date().toISOString(),
              ...user
            }
          ]
        })),
      
      updateUser: (id, updatedUser) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updatedUser } : user
          )
        })),
      
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id)
        })),
      
      setCurrentUser: (user) =>
        set({ currentUser: user })
    }),
    {
      name: 'user-store',
      version: 1
    }
  )
);