'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';
import InstructorDashboard from '@/components/InstructorDashboard';

export default function InstructorProfilePage() {
  return (
    <ProtectedRoute requiredRoles={['INSTRUCTOR']}>
      <Dashboard>
        <InstructorDashboard activeTab="profile" />
      </Dashboard>
    </ProtectedRoute>
  );
} 