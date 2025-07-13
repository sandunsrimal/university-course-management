'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';
import StudentDashboard from '@/components/StudentDashboard';

export default function StudentProfilePage() {
  return (
    <ProtectedRoute requiredRoles={['STUDENT']}>
      <Dashboard>
        <StudentDashboard activeTab="profile" />
      </Dashboard>
    </ProtectedRoute>
  );
} 