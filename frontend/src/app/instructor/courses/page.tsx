'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';
import InstructorDashboard from '@/components/InstructorDashboard';

export default function InstructorCoursesPage() {
  return (
    <ProtectedRoute requiredRoles={['INSTRUCTOR']}>
      <Dashboard>
        <InstructorDashboard activeTab="courses" />
      </Dashboard>
    </ProtectedRoute>
  );
} 