import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team, User, UserPermissions } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TeamStore {
  currentTeam: Team | null;
  teamMembers: User[];
  invitePending: { email: string; role: string }[];
  setCurrentTeam: (team: Team) => void;
  addTeamMember: (member: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTeamMember: (id: string, updates: Partial<User>) => void;
  removeTeamMember: (id: string) => void;
  updateMemberPermissions: (id: string, permissions: UserPermissions) => void;
  inviteMember: (email: string, role: string) => void;
  cancelInvite: (email: string) => void;
}

const defaultPermissions: UserPermissions = {
  deals: {
    view: 'own',
    create: true,
    edit: 'own',
    delete: 'own'
  },
  contacts: {
    view: 'team',
    create: true,
    edit: 'own',
    delete: 'own'
  },
  companies: {
    view: 'team',
    create: true,
    edit: 'own',
    delete: 'own'
  },
  analytics: {
    view: 'own'
  },
  team: {
    manage: false
  }
};

const adminPermissions: UserPermissions = {
  deals: {
    view: 'all',
    create: true,
    edit: 'all',
    delete: 'all'
  },
  contacts: {
    view: 'all',
    create: true,
    edit: 'all',
    delete: 'all'
  },
  companies: {
    view: 'all',
    create: true,
    edit: 'all',
    delete: 'all'
  },
  analytics: {
    view: 'all'
  },
  team: {
    manage: true
  }
};

export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      currentTeam: {
        id: '1',
        name: 'Default Team',
        ownerId: '1',
        members: ['1'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      teamMembers: [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          permissions: adminPermissions,
          teamId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      invitePending: [],

      setCurrentTeam: (team) => set({ currentTeam: team }),

      addTeamMember: (member) =>
        set((state) => ({
          teamMembers: [
            ...state.teamMembers,
            {
              ...member,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          currentTeam: state.currentTeam
            ? {
                ...state.currentTeam,
                members: [...state.currentTeam.members, member.id]
              }
            : null
        })),

      updateTeamMember: (id, updates) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((member) =>
            member.id === id
              ? {
                  ...member,
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : member
          )
        })),

      removeTeamMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((member) => member.id !== id),
          currentTeam: state.currentTeam
            ? {
                ...state.currentTeam,
                members: state.currentTeam.members.filter(
                  (memberId) => memberId !== id
                )
              }
            : null
        })),

      updateMemberPermissions: (id, permissions) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((member) =>
            member.id === id
              ? {
                  ...member,
                  permissions,
                  updatedAt: new Date().toISOString()
                }
              : member
          )
        })),

      inviteMember: (email, role) =>
        set((state) => ({
          invitePending: [...state.invitePending, { email, role }]
        })),

      cancelInvite: (email) =>
        set((state) => ({
          invitePending: state.invitePending.filter(
            (invite) => invite.email !== email
          )
        }))
    }),
    {
      name: 'team-store',
      version: 1
    }
  )
);