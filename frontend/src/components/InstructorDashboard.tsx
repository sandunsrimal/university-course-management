'use client'

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  XMarkIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

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
    id: number;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    major: string;
    year: number;
  }>;
  isFull: boolean;
  canEnroll: boolean;
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

interface InstructorProfile {
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

interface Statistics {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  averageEnrollment: number;
  department: string;
}

interface InstructorDashboardProps {
  activeTab?: 'overview' | 'courses' | 'profile';
  setActiveTab?: (tab: 'overview' | 'courses' | 'profile') => void;
}

export default function InstructorDashboard({ activeTab = 'overview', setActiveTab }: InstructorDashboardProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    averageEnrollment: 0,
    department: ''
  });
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, coursesResponse, profileResponse] = await Promise.all([
        api.get('/api/instructor/statistics'),
        api.get('/api/instructor/courses'),
        api.get('/api/instructor/profile')
      ]);

      setStatistics(statsResponse.data);
      setCourses(coursesResponse.data);
      setProfile(profileResponse.data);
      
      // Collect all students from all courses
      const allStudentsSet = new Set();
      coursesResponse.data.forEach((course: Course) => {
        course.enrolledStudents.forEach((student: any) => {
          allStudentsSet.add(JSON.stringify(student));
        });
      });
      const uniqueStudents = Array.from(allStudentsSet).map(s => JSON.parse(s as string));
      setAllStudents(uniqueStudents);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnrollment = async (courseId: number, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus ? 'close' : 'open';
      await api.put(`/api/instructor/courses/${courseId}/enrollment/${endpoint}`);
      setMessage(`Enrollment ${currentStatus ? 'closed' : 'opened'} successfully`);
      fetchData();
    } catch (err) {
      setError('Failed to update enrollment status');
      console.error('Error updating enrollment:', err);
    }
  };

  const handleViewStudents = async (course: Course) => {
    try {
      const response = await api.get(`/api/instructor/courses/${course.id}/students`);
      setSelectedCourse({ ...course, enrolledStudents: response.data });
      setShowStudentsModal(true);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
    }
  };

  const handleRemoveStudent = async (courseId: number, studentId: number) => {
    if (window.confirm('Are you sure you want to remove this student from the course?')) {
      try {
        await api.delete(`/api/instructor/courses/${courseId}/students/${studentId}`);
        setMessage('Student removed successfully');
        fetchData();
        if (selectedCourse) {
          handleViewStudents(selectedCourse);
        }
      } catch (err) {
        setError('Failed to remove student');
        console.error('Error removing student:', err);
      }
    }
  };

  const handleUpdateProfile = async (profileData: InstructorProfile) => {
    try {
      await api.put('/api/instructor/profile', profileData);
      setMessage('Profile updated successfully');
      setShowEditProfile(false);
      fetchData();
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {profile?.firstName} {profile?.lastName}
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
          <button onClick={() => setMessage(null)} className="ml-2 font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
        </div>
      )}



      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpenIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.totalCourses}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Courses</dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.activeCourses}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.totalStudents}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg. Enrollment</dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.averageEnrollment.toFixed(1)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Department</h4>
                <p className="text-lg text-gray-900">{statistics.department}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Course Load</h4>
                <div className="flex items-center">
                  <span className="text-lg text-gray-900">{statistics.activeCourses} active courses</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({statistics.totalStudents} students total)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Courses Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">My Courses</h3>
            <div className="text-sm text-gray-500">
              {courses.length} course{courses.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Courses Cards List */}
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                {/* Card Content - Horizontal Layout */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{course.courseName}</h4>
                      <p className="text-sm text-gray-500 mb-2">{course.courseCode}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-4 w-4 mr-1" />
                          {course.department}
                        </div>
                        <div className="flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-1" />
                          {course.credits} credits
                        </div>
                        <span className="text-gray-400">•</span>
                        <span>Semester {course.semester}</span>
                        <span className="text-gray-400">•</span>
                        <span>{course.schedule}</span>
                        <span className="text-gray-400">•</span>
                        <span>{course.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        course.enrollmentOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.enrollmentOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>

                  {/* Course Description */}
                  {course.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  )}

                  {/* Enrollment Info and Progress */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-6">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Enrollment: </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {course.currentEnrollment}/{course.maxCapacity}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({course.availableSpots} spots available)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">
                          {Math.round((course.currentEnrollment / course.maxCapacity) * 100)}%
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              course.currentEnrollment / course.maxCapacity > 0.8 
                                ? 'bg-red-500' 
                                : course.currentEnrollment / course.maxCapacity > 0.6 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${(course.currentEnrollment / course.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <a
                      href={`/instructor/courses/${course.id}/content`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Manage Content
                    </a>
                    <button
                      onClick={() => handleViewStudents(course)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      View Students
                    </button>
                    <button
                      onClick={() => handleToggleEnrollment(course.id, course.enrollmentOpen)}
                      className={`text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
                        course.enrollmentOpen 
                          ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {course.enrollmentOpen ? 'Close Enrollment' : 'Open Enrollment'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses assigned</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any courses assigned to you yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && profile && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <div className="mt-1 text-sm text-gray-900">{profile.employeeId}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <div className="mt-1 text-sm text-gray-900">{profile.firstName} {profile.lastName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 text-sm text-gray-900">{profile.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 text-sm text-gray-900">{profile.phoneNumber}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <div className="mt-1 text-sm text-gray-900">{profile.department}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <div className="mt-1 text-sm text-gray-900">{profile.specialization}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <div className="mt-1 text-sm text-gray-900">{profile.qualification}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                  <div className="mt-1 text-sm text-gray-900">{new Date(profile.hireDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salary</label>
                  <div className="mt-1 text-sm text-gray-900">${profile.salary.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <div className="mt-1 text-sm text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <div className="mt-1 text-sm text-gray-900">{new Date(profile.updatedAt).toLocaleDateString()}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1 text-sm text-gray-900">{profile.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Modal */}
      {showStudentsModal && selectedCourse && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Students in {selectedCourse.courseName} ({selectedCourse.courseCode})
              </h3>
              <button
                onClick={() => setShowStudentsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Major</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedCourse.enrolledStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.major}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveStudent(selectedCourse.id, student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && profile && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
}

// Profile Edit Modal Component
function ProfileEditModal({ profile, onClose, onSave }: {
  profile: InstructorProfile;
  onClose: () => void;
  onSave: (profile: InstructorProfile) => void;
}) {
  const [formData, setFormData] = useState<InstructorProfile>(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof InstructorProfile, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.specialization ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.qualification ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 