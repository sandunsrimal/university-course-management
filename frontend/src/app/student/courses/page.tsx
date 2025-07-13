'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';
import StudentDashboard from '@/components/StudentDashboard';

export default function StudentCoursesPage() {
  return (
    <ProtectedRoute requiredRoles={['STUDENT']}>
      <Dashboard>
        <StudentDashboard activeTab="courses" />
      </Dashboard>
    </ProtectedRoute>
  );
} 