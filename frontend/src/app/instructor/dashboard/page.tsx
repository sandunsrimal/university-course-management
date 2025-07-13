'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';
import InstructorDashboard from '@/components/InstructorDashboard';

export default function InstructorDashboardPage() {
  return (
    <ProtectedRoute requiredRoles={['INSTRUCTOR']}>
      <Dashboard>
        <InstructorDashboard activeTab="overview" />
      </Dashboard>
    </ProtectedRoute>
  );
} 