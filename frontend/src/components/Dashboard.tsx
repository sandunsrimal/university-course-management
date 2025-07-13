'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { 
  BookOpenIcon, 
  UsersIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon, 
  UserCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  children?: React.ReactNode;
}

type NavItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
} & (
  | { onClick: () => void; href?: never }
  | { href: string; onClick?: never }
);

export default function Dashboard({ children }: DashboardProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'instructors' | 'students' | 'courses' | 'reports' | 'settings'>('overview');

  const handleLogout = async () => {
    await logout();
  };

  const getNavItems = (): NavItem[] => {
    const baseItems = [
      { icon: ChartBarIcon, label: 'Dashboard', onClick: () => setActiveTab('overview') },
    ];

    switch (user?.role) {
      case 'ADMIN':
        return [
          ...baseItems,
          { icon: UsersIcon, label: 'Instructor Management', onClick: () => setActiveTab('instructors') },
          { icon: AcademicCapIcon, label: 'Student Management', onClick: () => setActiveTab('students') },
          { icon: BookOpenIcon, label: 'Course Management', onClick: () => setActiveTab('courses') },
          { icon: DocumentTextIcon, label: 'Reports', onClick: () => setActiveTab('reports') },
          { icon: CogIcon, label: 'Settings', onClick: () => setActiveTab('settings') },
        ];
      case 'INSTRUCTOR':
        return [
          { icon: ChartBarIcon, label: 'Dashboard', href: '/instructor/dashboard' },
          { icon: BookOpenIcon, label: 'My Courses', href: '/instructor/courses' },
          { icon: DocumentTextIcon, label: 'Result Management', href: '/instructor/results' },
          { icon: UserCircleIcon, label: 'Profile', href: '/instructor/profile' },
        ];
      case 'STUDENT':
        return [
          { icon: ChartBarIcon, label: 'Dashboard', href: '/student/dashboard' },
          { icon: BookOpenIcon, label: 'My Courses', href: '/student/courses' },
          { icon: AcademicCapIcon, label: 'Course Catalog', href: '/student/catalog' },
          { icon: DocumentTextIcon, label: 'My Results', href: '/student/results' },
          { icon: UserCircleIcon, label: 'Profile', href: '/student/profile' },
        ];
      default:
        return baseItems;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">UniCourse</span>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-600">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleColor()}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              item.onClick ? (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 text-left"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </a>
              )
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 hover:text-red-900 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <div className="flex-1">
          {/* Pass activeTab to children if it's AdminDashboard */}
          {user?.role === 'ADMIN' && children && React.isValidElement(children) 
            ? React.cloneElement(children, { activeTab, setActiveTab } as any)
            : children
          }
        </div>
      </div>
    </div>
  );
} 