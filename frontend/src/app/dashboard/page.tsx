'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Redirect users to their specific dashboards
      switch (user.role) {
        case 'INSTRUCTOR':
          router.push('/instructor/dashboard');
          break;
        case 'STUDENT':
          router.push('/student/dashboard');
          break;
        // ADMIN stays on this page
      }
    }
  }, [user, router]);

  return (
    <ProtectedRoute>
      <Dashboard>
        {user?.role === 'ADMIN' && <AdminDashboard />}
      </Dashboard>
    </ProtectedRoute>
  );
} 