import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, LogOut, 
  Settings, Plug, BarChart3, PieChart, Inbox, User
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import clsx from 'clsx';
import SettingsModal from './SettingsModal';

export default function Navbar() {
  const location = useLocation();
  const { signOut } = useAuthStore();
  const { currentUser } = useUserStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const mainNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Inbox, label: 'Leads', path: '/leads' },
    { icon: PieChart, label: 'Deals', path: '/deals' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: Building2, label: 'Companies', path: '/companies' },
  ];

  const bottomNavItems = [
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Plug, label: 'Integrations', path: '/integrations' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 bottom-0 w-20 bg-dark-800/95 backdrop-blur-md border-r border-dark-700 flex flex-col items-center py-6 z-40">
        <div className="flex flex-col items-center gap-2">
          {mainNavItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-colors",
                "hover:bg-dark-700",
                "text-gray-400 hover:text-white",
                location.pathname === path && "bg-dark-700 text-white"
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={2} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          ))}
        </div>
        
        <div className="mt-auto">
          {bottomNavItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-colors",
                "hover:bg-dark-700",
                "text-gray-400 hover:text-white",
                location.pathname === path && "bg-dark-700 text-white"
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={2} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          ))}
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <Settings className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs mt-1 font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Profile Menu */}
      <div className="fixed top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-10 h-10 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center text-white hover:bg-dark-600 transition-colors"
          >
            <User className="w-5 h-5" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-dark-800 border border-dark-700 shadow-lg py-1">
              <div className="px-4 py-2 border-b border-dark-700">
                <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                <p className="text-xs text-gray-400">{currentUser?.email}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-dark-700"
              >
                <LogOut className="w-4 h-4 inline-block mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}