'use client'

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  XMarkIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

interface Instructor {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  specialization: string;
  qualification: string;
  hireDate: string;
  salary: number;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  major: string;
  year: number;
  enrollmentDate: string;
  graduationDate: string;
  gpa: number;
  status: string;
  address: string;
  parentGuardianName: string;
  parentGuardianPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  department: string;
  semester: number;
  startDate: string;
  endDate: string;
  schedule: string;
  location: string;
  maxCapacity: number;
  currentEnrollment: number;
  availableSpots: number;
  isActive: boolean;
  enrollmentOpen: boolean;
  createdAt: string;
  updatedAt: string;
  instructorId: number;
  instructorName: string;
  instructorEmail: string;
  instructorDepartment: string;
  enrolledStudents: Array<{
    studentId: number;
    studentNumber: string;
    studentName: string;
    studentEmail: string;
    major: string;
    year: number;
  }>;
  isFull: boolean;
  canEnroll: boolean;
}

interface Statistics {
  totalInstructors: number;
  totalStudents: number;
  totalCourses: number;
  averageGpa: number;
  totalEnrollment: number;
  totalCapacity: number;
  utilizationRate: number;
}

interface AdminDashboardProps {
  activeTab?: 'overview' | 'instructors' | 'students' | 'courses' | 'reports' | 'settings';
  setActiveTab?: (tab: 'overview' | 'instructors' | 'students' | 'courses' | 'reports' | 'settings') => void;
}

export default function AdminDashboard({ activeTab = 'overview', setActiveTab }: AdminDashboardProps) {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [instructorFilter, setInstructorFilter] = useState<'active' | 'inactive' | 'all'>('active');
  const [studentFilter, setStudentFilter] = useState<'active' | 'inactive' | 'all'>('active');
  const [courseFilter, setCourseFilter] = useState<'active' | 'inactive' | 'all'>('active');
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, allInstructorsResponse, allStudentsResponse, allCoursesResponse] = await Promise.all([
        api.get('/api/admin/statistics'),
        api.get('/api/admin/instructors'),
        api.get('/api/admin/students'),
        api.get('/api/admin/courses')
      ]);

      setStatistics(statsResponse.data);
      setAllInstructors(allInstructorsResponse.data);
      setAllStudents(allStudentsResponse.data);
      setAllCourses(allCoursesResponse.data);
      
      // Filter active records for default display
      setInstructors(allInstructorsResponse.data.filter((i: Instructor) => i.isActive));
      setStudents(allStudentsResponse.data.filter((s: Student) => s.isActive));
      setCourses(allCoursesResponse.data.filter((c: Course) => c.isActive));
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstructor = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this instructor?')) {
      try {
        await api.delete(`/api/admin/instructors/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete instructor');
        console.error('Error deleting instructor:', err);
      }
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this student?')) {
      try {
        await api.delete(`/api/admin/students/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete student');
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleReactivateInstructor = async (id: number) => {
    if (window.confirm('Are you sure you want to reactivate this instructor?')) {
      try {
        await api.put(`/api/admin/instructors/${id}/activate`);
        fetchData();
        setSuccessMessage('Instructor reactivated successfully!');
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setError('Failed to reactivate instructor');
        console.error('Error reactivating instructor:', err);
      }
    }
  };

  const handleReactivateStudent = async (id: number) => {
    if (window.confirm('Are you sure you want to reactivate this student?')) {
      try {
        await api.put(`/api/admin/students/${id}/activate`);
        fetchData();
        setSuccessMessage('Student reactivated successfully!');
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setError('Failed to reactivate student');
        console.error('Error reactivating student:', err);
      }
    }
  };

  const handlePermanentDeleteInstructor = async (id: number) => {
    if (window.confirm('⚠️ WARNING: This will PERMANENTLY delete the instructor and ALL associated data. This action CANNOT be undone!\n\nAre you absolutely sure?')) {
      try {
        await api.delete(`/api/admin/instructors/${id}/permanent`);
        fetchData();
        setSuccessMessage('Instructor permanently deleted.');
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setError('Failed to permanently delete instructor');
        console.error('Error permanently deleting instructor:', err);
      }
    }
  };

  const handlePermanentDeleteStudent = async (id: number) => {
    if (window.confirm('⚠️ WARNING: This will PERMANENTLY delete the student and ALL associated data. This action CANNOT be undone!\n\nAre you absolutely sure?')) {
      try {
        await api.delete(`/api/admin/students/${id}/permanent`);
        fetchData();
        setSuccessMessage('Student permanently deleted.');
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setError('Failed to permanently delete student');
        console.error('Error permanently deleting student:', err);
      }
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this course?')) {
      try {
        await api.delete(`/api/admin/courses/${id}`);
        fetchData();
        setSuccessMessage('Course deactivated successfully');
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setError('Failed to deactivate course');
        console.error('Error deactivating course:', err);
      }
    }
  };

  const handleReactivateCourse = async (id: number) => {
    if (window.confirm('Are you sure you want to reactivate this course?')) {
      try {
        await api.put(`/api/admin/courses/${id}/activate`);
        fetchData();
        setSuccessMessage('Course reactivated successfully');
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setError('Failed to reactivate course');
        console.error('Error reactivating course:', err);
      }
    }
  };

  const handlePermanentDeleteCourse = async (id: number) => {
    if (window.confirm('⚠️ WARNING: This will PERMANENTLY delete the course and ALL associated data. This action CANNOT be undone!\n\nAre you absolutely sure?')) {
      try {
        await api.delete(`/api/admin/courses/${id}/permanent`);
        fetchData();
        setSuccessMessage('Course permanently deleted.');
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setError('Failed to permanently delete course');
        console.error('Error permanently deleting course:', err);
      }
    }
  };

  // Filter functions
  const getFilteredInstructors = () => {
    switch (instructorFilter) {
      case 'active':
        return allInstructors.filter(i => i.isActive);
      case 'inactive':
        return allInstructors.filter(i => !i.isActive);
      case 'all':
        return allInstructors;
      default:
        return allInstructors.filter(i => i.isActive);
    }
  };

  const getFilteredStudents = () => {
    switch (studentFilter) {
      case 'active':
        return allStudents.filter(s => s.isActive);
      case 'inactive':
        return allStudents.filter(s => !s.isActive);
      case 'all':
        return allStudents;
      default:
        return allStudents.filter(s => s.isActive);
    }
  };

  const getFilteredCourses = () => {
    switch (courseFilter) {
      case 'active':
        return allCourses.filter(c => c.isActive);
      case 'inactive':
        return allCourses.filter(c => !c.isActive);
      case 'all':
        return allCourses;
      default:
        return allCourses.filter(c => c.isActive);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <ExclamationCircleIcon className="h-5 w-5 inline mr-2" />
            {error}
          </div>
          <button
            onClick={fetchData}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="py-8">
        {successMessage && (
          <div className="mb-6 mx-4 sm:mx-6 lg:mx-8 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">Success!</span>
            </div>
            <p className="mt-1 text-sm">{successMessage}</p>
          </div>
        )}
        
        {activeTab === 'overview' && (
          <div className="space-y-6 mx-4 sm:mx-6 lg:mx-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Instructors</h3>
                    <p className="text-2xl font-bold text-gray-900">{statistics?.totalInstructors || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                    <p className="text-2xl font-bold text-gray-900">{statistics?.totalStudents || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Average GPA</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {statistics?.averageGpa ? statistics.averageGpa.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
                    <p className="text-2xl font-bold text-gray-900">{statistics?.totalCourses || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2a6 6 0 0112 0v2m-3-6a6 6 0 11-12 0 6 6 0 0112 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Enrollment</h3>
                    <p className="text-2xl font-bold text-gray-900">{statistics?.totalEnrollment || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Capacity</h3>
                    <p className="text-2xl font-bold text-gray-900">{statistics?.totalCapacity || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-rose-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Utilization Rate</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {statistics?.utilizationRate ? `${statistics.utilizationRate.toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'instructors' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4 sm:mx-6 lg:mx-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Instructors</h2>
                <button
                  onClick={() => setShowAddInstructor(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Instructor
                </button>
              </div>
              
              {/* Filter Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setInstructorFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    instructorFilter === 'active'
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  Active ({allInstructors.filter(i => i.isActive).length})
                </button>
                <button
                  onClick={() => setInstructorFilter('inactive')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    instructorFilter === 'inactive'
                      ? 'bg-red-100 text-red-700 border-2 border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  Inactive ({allInstructors.filter(i => !i.isActive).length})
                </button>
                <button
                  onClick={() => setInstructorFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    instructorFilter === 'all'
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  All ({allInstructors.length})
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredInstructors().map((instructor) => (
                    <tr key={instructor.id} className={`hover:bg-gray-50 ${!instructor.isActive ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {instructor.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {instructor.firstName} {instructor.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {instructor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {instructor.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {instructor.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          instructor.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {instructor.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {instructor.isActive ? (
                          <>
                            <button
                              onClick={() => setEditingInstructor(instructor)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                              title="Edit Instructor"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInstructor(instructor.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Deactivate Instructor"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleReactivateInstructor(instructor.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Reactivate Instructor"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handlePermanentDeleteInstructor(instructor.id)}
                              className="text-red-700 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Permanently Delete (⚠️ Cannot be undone)"
                            >
                              <ExclamationCircleIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getFilteredInstructors().length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No {instructorFilter === 'active' ? 'active' : instructorFilter === 'inactive' ? 'inactive' : ''} instructors found.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4 sm:mx-6 lg:mx-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Students</h2>
                <button
                  onClick={() => setShowAddStudent(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Student
                </button>
              </div>
              
              {/* Filter Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setStudentFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    studentFilter === 'active'
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  Active ({allStudents.filter(s => s.isActive).length})
                </button>
                <button
                  onClick={() => setStudentFilter('inactive')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    studentFilter === 'inactive'
                      ? 'bg-red-100 text-red-700 border-2 border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  Inactive ({allStudents.filter(s => !s.isActive).length})
                </button>
                <button
                  onClick={() => setStudentFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    studentFilter === 'all'
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  All ({allStudents.length})
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Major
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredStudents().map((student) => (
                    <tr key={student.id} className={`hover:bg-gray-50 ${!student.isActive ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.major}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Year {student.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.gpa ? student.gpa.toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {student.isActive ? (
                          <>
                            <button
                              onClick={() => setEditingStudent(student)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                              title="Edit Student"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Deactivate Student"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleReactivateStudent(student.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Reactivate Student"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handlePermanentDeleteStudent(student.id)}
                              className="text-red-700 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Permanently Delete (⚠️ Cannot be undone)"
                            >
                              <ExclamationCircleIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getFilteredStudents().length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No {studentFilter === 'active' ? 'active' : studentFilter === 'inactive' ? 'inactive' : ''} students found.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Instructor Modal */}
      {(showAddInstructor || editingInstructor) && (
        <InstructorModal
          instructor={editingInstructor}
          onClose={() => {
            setShowAddInstructor(false);
            setEditingInstructor(null);
          }}
          onSave={(message?: string) => {
            fetchData();
            setShowAddInstructor(false);
            setEditingInstructor(null);
            if (message) {
              setSuccessMessage(message);
              setTimeout(() => setSuccessMessage(null), 8000);
            }
          }}
        />
      )}

      {/* Add/Edit Student Modal */}
      {(showAddStudent || editingStudent) && (
        <StudentModal
          student={editingStudent}
          onClose={() => {
            setShowAddStudent(false);
            setEditingStudent(null);
          }}
          onSave={(message?: string) => {
            fetchData();
            setShowAddStudent(false);
            setEditingStudent(null);
            if (message) {
              setSuccessMessage(message);
              setTimeout(() => setSuccessMessage(null), 8000);
            }
          }}
        />
      )}

              {activeTab === 'courses' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4 sm:mx-6 lg:mx-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
              <button
                onClick={() => setShowAddCourse(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Course
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setCourseFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  courseFilter === 'active'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                Active ({allCourses.filter(c => c.isActive).length})
              </button>
              <button
                onClick={() => setCourseFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  courseFilter === 'inactive'
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                Inactive ({allCourses.filter(c => !c.isActive).length})
              </button>
              <button
                onClick={() => setCourseFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  courseFilter === 'all'
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                All ({allCourses.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredCourses().map((course) => (
                  <tr key={course.id} className={`hover:bg-gray-50 ${!course.isActive ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.courseCode}</div>
                        <div className="text-sm text-gray-500">{course.courseName}</div>
                        <div className="text-xs text-gray-400">{course.credits} credits • Semester {course.semester}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.instructorName}</div>
                      <div className="text-sm text-gray-500">{course.instructorEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.currentEnrollment}/{course.maxCapacity}
                      </div>
                      <div className={`text-xs ${course.isFull ? 'text-red-500' : 'text-green-500'}`}>
                        {course.availableSpots} spots available
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.schedule}</div>
                      <div className="text-sm text-gray-500">{course.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {course.isActive && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            course.enrollmentOpen ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {course.enrollmentOpen ? 'Open' : 'Closed'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {course.isActive ? (
                        <>
                          <button
                            onClick={() => setEditingCourse(course)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="Edit Course"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Deactivate Course"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleReactivateCourse(course.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Reactivate Course"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePermanentDeleteCourse(course.id)}
                            className="text-red-700 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Permanently Delete (⚠️ Cannot be undone)"
                          >
                            <ExclamationCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {getFilteredCourses().length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No {courseFilter === 'active' ? 'active' : courseFilter === 'inactive' ? 'inactive' : ''} courses found.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && statistics && (
        <div className="space-y-6 mx-4 sm:mx-6 lg:mx-8">
          {/* System Reports */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">System Reports</h3>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900">Total Users</h4>
                  <p className="text-2xl font-bold text-blue-600">{statistics.totalInstructors + statistics.totalStudents}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-900">Active Courses</h4>
                  <p className="text-2xl font-bold text-green-600">{statistics.totalCourses}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-900">Total Enrollment</h4>
                  <p className="text-2xl font-bold text-purple-600">{statistics.totalEnrollment}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-orange-900">Capacity Utilization</h4>
                  <p className="text-2xl font-bold text-orange-600">{statistics.utilizationRate.toFixed(1)}%</p>
                </div>
              </div>

              {/* Detailed Reports */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Instructor Report */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Instructor Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Instructors:</span>
                      <span className="text-sm font-medium">{statistics.totalInstructors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Instructors:</span>
                      <span className="text-sm font-medium">{allInstructors.filter(i => i.isActive).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Inactive Instructors:</span>
                      <span className="text-sm font-medium">{allInstructors.filter(i => !i.isActive).length}</span>
                    </div>
                  </div>
                </div>

                {/* Student Report */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Student Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Students:</span>
                      <span className="text-sm font-medium">{statistics.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Students:</span>
                      <span className="text-sm font-medium">{allStudents.filter(s => s.isActive).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average GPA:</span>
                      <span className="text-sm font-medium">{statistics.averageGpa.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Course Report */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Course Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Courses:</span>
                      <span className="text-sm font-medium">{statistics.totalCourses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Courses:</span>
                      <span className="text-sm font-medium">{allCourses.filter(c => c.isActive).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Capacity:</span>
                      <span className="text-sm font-medium">{statistics.totalCapacity}</span>
                    </div>
                  </div>
                </div>

                {/* Enrollment Report */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Enrollment Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Enrollments:</span>
                      <span className="text-sm font-medium">{statistics.totalEnrollment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Available Spots:</span>
                      <span className="text-sm font-medium">{statistics.totalCapacity - statistics.totalEnrollment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Utilization Rate:</span>
                      <span className="text-sm font-medium">{statistics.utilizationRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6 mx-4 sm:mx-6 lg:mx-8">
          {/* System Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">System Settings</h3>
              
              {/* General Settings */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">General Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                      <input 
                        type="text" 
                        defaultValue="UniCourse Management System"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                      <input 
                        type="text" 
                        defaultValue="2024-2025"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Semester</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Summer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Course Capacity</label>
                      <input 
                        type="number" 
                        defaultValue="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Enrollment Settings */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Enrollment Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="autoEnrollment" 
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoEnrollment" className="ml-2 text-sm text-gray-700">
                        Allow automatic enrollment
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="waitlist" 
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="waitlist" className="ml-2 text-sm text-gray-700">
                        Enable waitlist for full courses
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="emailNotifications" 
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                        Send email notifications for enrollment changes
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Security Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                      <input 
                        type="number" 
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password Min Length</label>
                      <input 
                        type="number" 
                        defaultValue="8"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="requireStrongPassword" 
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="requireStrongPassword" className="ml-2 text-sm text-gray-700">
                        Require strong passwords
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="twoFactorAuth" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700">
                        Enable two-factor authentication
                      </label>
                    </div>
                  </div>
                </div>

                {/* Backup Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Backup & Maintenance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Last Backup:</span>
                      <span className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Backup Frequency:</span>
                      <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                        Create Backup Now
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700">
                        System Maintenance
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Settings */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Reset to Defaults
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {(showAddCourse || editingCourse) && (
        <CourseModal
          course={editingCourse}
          instructors={allInstructors.filter(i => i.isActive)}
          onClose={() => {
            setShowAddCourse(false);
            setEditingCourse(null);
          }}
          onSave={(message?: string) => {
            fetchData();
            setShowAddCourse(false);
            setEditingCourse(null);
            if (message) {
              setSuccessMessage(message);
              setTimeout(() => setSuccessMessage(null), 8000);
            }
          }}
        />
      )}
    </div>
  );
}

// Enhanced Instructor Modal Component
function InstructorModal({ instructor, onClose, onSave }: {
  instructor: Instructor | null;
  onClose: () => void;
  onSave: (message?: string) => void;
}) {
  const [formData, setFormData] = useState({
    employeeId: instructor?.employeeId || '',
    firstName: instructor?.firstName || '',
    lastName: instructor?.lastName || '',
    email: instructor?.email || '',
    phoneNumber: instructor?.phoneNumber || '',
    department: instructor?.department || '',
    specialization: instructor?.specialization || '',
    qualification: instructor?.qualification || '',
    hireDate: instructor?.hireDate || '',
    salary: instructor?.salary || '',
    address: instructor?.address || '',
    isActive: instructor?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fillTestData = () => {
    setFormData({
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@university.edu',
      phoneNumber: '+1-555-0123',
      department: 'Computer Science',
      specialization: 'Machine Learning',
      qualification: 'Ph.D. in Computer Science',
      hireDate: '2023-01-15',
      salary: '85000',
      address: '123 University Ave, Academic City, AC 12345',
      isActive: true,
    });
    setErrors({}); // Clear any existing errors
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    
    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (instructor) {
        await api.put(`/api/admin/instructors/${instructor.id}`, formData);
        onSave();
      } else {
        await api.post('/api/admin/instructors', formData);
        const username = formData.employeeId.toLowerCase();
        const message = `Instructor created successfully! Login credentials: Username: ${username}, Password: instructor123`;
        onSave(message);
      }
    } catch (error) {
      console.error('Error saving instructor:', error);
      setErrors({ submit: 'Failed to save instructor. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {instructor ? 'Edit Instructor' : 'Add New Instructor'}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={fillTestData}
              className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Fill Test Data
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}
          
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.employeeId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter employee ID"
                />
                {errors.employeeId && (
                  <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter department"
                />
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter specialization"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter qualification"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hire Date
                </label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter salary"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {instructor ? 'Update Instructor' : 'Add Instructor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Enhanced Student Modal Component
function StudentModal({ student, onClose, onSave }: {
  student: Student | null;
  onClose: () => void;
  onSave: (message?: string) => void;
}) {
  const [formData, setFormData] = useState({
    studentId: student?.studentId || '',
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    phoneNumber: student?.phoneNumber || '',
    dateOfBirth: student?.dateOfBirth || '',
    gender: student?.gender || '',
    major: student?.major || '',
    year: student?.year || 1,
    enrollmentDate: student?.enrollmentDate || '',
    graduationDate: student?.graduationDate || '',
    gpa: student?.gpa || '',
    status: student?.status || 'ACTIVE',
    address: student?.address || '',
    parentGuardianName: student?.parentGuardianName || '',
    parentGuardianPhone: student?.parentGuardianPhone || '',
    emergencyContact: student?.emergencyContact || '',
    emergencyPhone: student?.emergencyPhone || '',
    isActive: student?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fillTestData = () => {
    setFormData({
      studentId: 'STU001',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@student.university.edu',
      phoneNumber: '+1-555-0456',
      dateOfBirth: '2002-05-15',
      gender: 'Female',
      major: 'Computer Science',
      year: student ? 3 : 1, // Year 1 for new students, Year 3 for existing students
      enrollmentDate: '2022-09-01',
      graduationDate: '2025-05-31',
      gpa: student ? '3.75' : '', // Only fill GPA for existing students
      status: 'ACTIVE',
      address: '456 Student Dormitory, University Campus, UC 54321',
      parentGuardianName: 'Robert Doe',
      parentGuardianPhone: '+1-555-0789',
      emergencyContact: 'Mary Doe',
      emergencyPhone: '+1-555-0987',
      isActive: true,
    });
    setErrors({}); // Clear any existing errors
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.major.trim()) newErrors.major = 'Major is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.gpa && (parseFloat(formData.gpa.toString()) < 0 || parseFloat(formData.gpa.toString()) > 4)) {
      newErrors.gpa = 'GPA must be between 0 and 4';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (student) {
        await api.put(`/api/admin/students/${student.id}`, formData);
        onSave();
      } else {
        await api.post('/api/admin/students', formData);
        const username = formData.studentId.toLowerCase();
        const message = `Student created successfully! Login credentials: Username: ${username}, Password: student123`;
        onSave(message);
      }
    } catch (error) {
      console.error('Error saving student:', error);
      setErrors({ submit: 'Failed to save student. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={fillTestData}
              className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Fill Test Data
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}
          
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID *
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.studentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter student ID"
                />
                {errors.studentId && (
                  <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major *
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.major ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter major"
                />
                {errors.major && (
                  <p className="text-red-500 text-sm mt-1">{errors.major}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(year => (
                    <option key={year} value={year}>Year {year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA {!student && <span className="text-xs text-gray-500">(optional - for transfer students)</span>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.gpa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={student ? "Enter current GPA" : "Enter GPA (if transfer student)"}
                />
                {!student && (
                  <p className="text-xs text-gray-500 mt-1">Leave empty for new students - GPA will be calculated as they complete courses</p>
                )}
                {errors.gpa && (
                  <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="GRADUATED">Graduated</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment Date
                </label>
                <input
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Date
                </label>
                <input
                  type="date"
                  value={formData.graduationDate}
                  onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Emergency Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  value={formData.parentGuardianName}
                  onChange={(e) => setFormData({ ...formData, parentGuardianName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter parent/guardian name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent/Guardian Phone
                </label>
                <input
                  type="tel"
                  value={formData.parentGuardianPhone}
                  onChange={(e) => setFormData({ ...formData, parentGuardianPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter parent/guardian phone"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter emergency contact name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter emergency contact phone"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {student ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Enhanced Course Modal Component
function CourseModal({ course, instructors, onClose, onSave }: {
  course: Course | null;
  instructors: Instructor[];
  onClose: () => void;
  onSave: (message?: string) => void;
}) {
  const [formData, setFormData] = useState({
    courseCode: course?.courseCode || '',
    courseName: course?.courseName || '',
    description: course?.description || '',
    credits: course?.credits || 3,
    department: course?.department || '',
    semester: course?.semester || 1,
    startDate: course?.startDate || '',
    endDate: course?.endDate || '',
    schedule: course?.schedule || '',
    location: course?.location || '',
    maxCapacity: course?.maxCapacity || 30,
    instructorId: course?.instructorId || '',
    enrollmentOpen: course?.enrollmentOpen !== undefined ? course.enrollmentOpen : true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fillTestData = () => {
    const testData = {
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      description: 'An introductory course covering fundamental concepts of computer science including programming, algorithms, and data structures.',
      credits: 3,
      department: 'Computer Science',
      semester: 1,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      schedule: 'MWF 10:00-11:00',
      location: 'Room 101',
      maxCapacity: 30,
      instructorId: instructors.length > 0 ? instructors[0].id : '',
      enrollmentOpen: true,
    };
    setFormData(testData);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (!formData.courseName.trim()) newErrors.courseName = 'Course name is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.instructorId) newErrors.instructorId = 'Instructor is required';
    if (formData.credits < 1 || formData.credits > 6) newErrors.credits = 'Credits must be between 1 and 6';
    if (formData.semester < 1 || formData.semester > 6) newErrors.semester = 'Semester must be between 1 and 6';
    if (formData.maxCapacity < 1 || formData.maxCapacity > 500) newErrors.maxCapacity = 'Capacity must be between 1 and 500';

    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = course ? `/api/admin/courses/${course.id}` : '/api/admin/courses';
      const method = course ? 'PUT' : 'POST';
      
      await api({
        url: endpoint,
        method,
        data: formData
      });

      onSave(course ? 'Course updated successfully!' : 'Course created successfully!');
    } catch (err: any) {
      console.error('Error saving course:', err);
      setErrors({ submit: err.response?.data?.message || 'Failed to save course' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {course ? 'Edit Course' : 'Add New Course'}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={fillTestData}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Fill Test Data
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Basic Course Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Course Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.courseCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., CS101"
                />
                {errors.courseCode && <p className="mt-1 text-sm text-red-600">{errors.courseCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.courseName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Introduction to Computer Science"
                />
                {errors.courseName && <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.department ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Computer Science"
                />
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.instructorId}
                  onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.instructorId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select an instructor</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.firstName} {instructor.lastName} - {instructor.department}
                    </option>
                  ))}
                </select>
                {errors.instructorId && <p className="mt-1 text-sm text-red-600">{errors.instructorId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.credits ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.credits && <p className="mt-1 text-sm text-red-600">{errors.credits}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.semester ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.semester && <p className="mt-1 text-sm text-red-600">{errors.semester}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Course description..."
              />
            </div>
          </div>

          {/* Schedule and Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Schedule and Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., MWF 10:00-11:00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Room 101"
                />
              </div>
            </div>
          </div>

          {/* Enrollment Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Enrollment Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.maxCapacity ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.maxCapacity && <p className="mt-1 text-sm text-red-600">{errors.maxCapacity}</p>}
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="enrollmentOpen"
                  checked={formData.enrollmentOpen}
                  onChange={(e) => setFormData({ ...formData, enrollmentOpen: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="enrollmentOpen" className="ml-2 block text-sm text-gray-700">
                  Enrollment Open
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {course ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 