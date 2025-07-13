'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';

export default function InstructorSchedulePage() {
  return (
    <ProtectedRoute requiredRoles={['INSTRUCTOR']}>
      <Dashboard>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-600 mt-2">Manage your teaching schedule and appointments</p>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              Schedule management feature is under development. Please check back later.
            </p>
          </div>
        </div>
      </Dashboard>
    </ProtectedRoute>
  );
} 