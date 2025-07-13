'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';
import StudentDashboard from '@/components/StudentDashboard';

export default function StudentCatalogPage() {
  return (
    <ProtectedRoute requiredRoles={['STUDENT']}>
      <Dashboard>
        <StudentDashboard activeTab="catalog" />
      </Dashboard>
    </ProtectedRoute>
  );
} 