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
  ChartBarIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon
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
  isFull: boolean;
  canEnroll: boolean;
}

interface StudentProfile {
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

interface Statistics {
  totalEnrolledCourses: number;
  totalAvailableCourses: number;
  totalCreditsEnrolled: number;
  currentGPA: number;
  academicYear: number;
  major: string;
  status: string;
  coursesByDepartment: { [key: string]: number };
}

interface StudentDashboardProps {
  activeTab?: 'overview' | 'courses' | 'catalog' | 'profile';
  setActiveTab?: (tab: 'overview' | 'courses' | 'catalog' | 'profile') => void;
}

export default function StudentDashboard({ activeTab = 'overview', setActiveTab }: StudentDashboardProps) {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statisticsRes, coursesRes, availableRes, profileRes] = await Promise.all([
        api.get('/api/student/statistics'),
        api.get('/api/student/courses'),
        api.get('/api/student/courses/available'),
        api.get('/api/student/profile')
      ]);

      setStatistics(statisticsRes.data);
      setEnrolledCourses(coursesRes.data);
      setAvailableCourses(availableRes.data);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollInCourse = async (courseId: number) => {
    try {
      await api.post(`/api/student/courses/${courseId}/enroll`);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  const handleUnenrollFromCourse = async (courseId: number) => {
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      try {
        await api.delete(`/api/student/courses/${courseId}/enroll`);
        await fetchData(); // Refresh data
      } catch (error) {
        console.error('Error unenrolling from course:', error);
        alert('Failed to unenroll from course');
      }
    }
  };

  const handleUpdateProfile = async (profileData: StudentProfile) => {
    try {
      const response = await api.put('/api/student/profile', profileData);
      setProfile(response.data);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleViewCourseDetails = (course: Course) => {
    setSelectedCourse(course);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {profile?.firstName} {profile?.lastName}
        </p>
      </div>



      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpenIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Enrolled Courses
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics?.totalEnrolledCourses || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AcademicCapIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Credits
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics?.totalCreditsEnrolled || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Current GPA
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics?.currentGPA?.toFixed(2) || 'N/A'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Academic Year
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Year {statistics?.academicYear || 'N/A'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Major</p>
                  <p className="text-sm text-gray-900">{statistics?.major || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    statistics?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {statistics?.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Courses */}
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Courses
              </h3>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-3">
                  {enrolledCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.courseName}</p>
                        <p className="text-sm text-gray-500">{course.courseCode} • {course.credits} credits</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{course.instructorName}</p>
                        <p className="text-sm text-gray-500">{course.schedule}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No enrolled courses yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* My Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                My Enrolled Courses
              </h3>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      {/* Course Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{course.courseName}</h4>
                          <p className="text-sm text-gray-600">{course.courseCode}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {course.credits} Credits
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {course.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <p className="font-medium">{course.instructorName}</p>
                            <p className="text-xs text-gray-500">{course.instructorDepartment}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <p className="font-medium">{course.schedule}</p>
                            <p className="text-xs text-gray-500">Schedule</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <p className="font-medium">{course.location}</p>
                            <p className="text-xs text-gray-500">Location</p>
                          </div>
                        </div>
                      </div>

                      {/* Course Description */}
                      {course.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 line-clamp-2">{course.description}</p>
                        </div>
                      )}

                      {/* Enrollment Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{course.currentEnrollment}/{course.maxCapacity} students enrolled</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Semester {course.semester}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewCourseDetails(course)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => window.location.href = `/student/courses/${course.id}/content`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          View Content
                        </button>
                        <button
                          onClick={() => handleUnenrollFromCourse(course.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Unenroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No enrolled courses</h3>
                  <p className="mt-1 text-sm text-gray-500">You are not enrolled in any courses yet.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab && setActiveTab('catalog')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Browse Course Catalog
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Course Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Available Courses</h3>
              {availableCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableCourses.map((course) => (
                    <div key={course.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{course.courseName}</h4>
                        <span className="text-sm text-gray-500">{course.credits} credits</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{course.courseCode}</p>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <UserIcon className="h-4 w-4 mr-2" />
                          {course.instructorName}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {course.schedule}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {course.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          {course.currentEnrollment}/{course.maxCapacity} enrolled
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.enrollmentOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {course.enrollmentOpen ? 'Open' : 'Closed'}
                        </span>
                        <button
                          onClick={() => handleEnrollInCourse(course.id)}
                          disabled={!course.canEnroll}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            course.canEnroll
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {course.isFull ? 'Full' : 'Enroll'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No available courses at the moment.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && profile && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Student Profile</h3>
              
              {/* Personal Information */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.studentId}</div>
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
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.dateOfBirth}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.gender}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.address}</div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Major</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.major}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.year}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">GPA</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.gpa?.toFixed(2) || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1 text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        profile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {profile.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Enrollment Date</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.enrollmentDate}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Graduation</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.graduationDate}</div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Emergency & Guardian Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.parentGuardianName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent/Guardian Phone</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.parentGuardianPhone}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.emergencyContact}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Phone</label>
                    <div className="mt-1 text-sm text-gray-900">{profile.emergencyPhone}</div>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">System Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Status</label>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Course Details</h3>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{selectedCourse.courseName}</h4>
                <p className="text-sm text-gray-600">{selectedCourse.courseCode}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-sm text-gray-900">{selectedCourse.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Instructor</p>
                  <p className="text-sm text-gray-900">{selectedCourse.instructorName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-sm text-gray-900">{selectedCourse.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Credits</p>
                  <p className="text-sm text-gray-900">{selectedCourse.credits}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Schedule</p>
                  <p className="text-sm text-gray-900">{selectedCourse.schedule}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm text-gray-900">{selectedCourse.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Enrollment</p>
                  <p className="text-sm text-gray-900">{selectedCourse.currentEnrollment}/{selectedCourse.maxCapacity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isEditingProfile && profile && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setIsEditingProfile(false)}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
}

function ProfileEditModal({ profile, onClose, onSave }: {
  profile: StudentProfile;
  onClose: () => void;
  onSave: (profile: StudentProfile) => void;
}) {
  const [editedProfile, setEditedProfile] = useState<StudentProfile>({ ...profile });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!editedProfile.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!editedProfile.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!editedProfile.email.trim()) newErrors.email = 'Email is required';
    if (!editedProfile.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!editedProfile.major.trim()) newErrors.major = 'Major is required';
    if (!editedProfile.year || editedProfile.year < 1 || editedProfile.year > 6) {
      newErrors.year = 'Year must be between 1 and 6';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(editedProfile);
    }
  };

  const handleInputChange = (field: keyof StudentProfile, value: string | number) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-gray-200 w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
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
                value={editedProfile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={editedProfile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={editedProfile.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Major</label>
              <input
                type="text"
                value={editedProfile.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.major ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.major && <p className="text-red-500 text-sm">{errors.major}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                value={editedProfile.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Year</option>
                {[1, 2, 3, 4, 5, 6].map(year => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
              {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={editedProfile.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
              <input
                type="text"
                value={editedProfile.parentGuardianName}
                onChange={(e) => handleInputChange('parentGuardianName', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent/Guardian Phone</label>
              <input
                type="tel"
                value={editedProfile.parentGuardianPhone}
                onChange={(e) => handleInputChange('parentGuardianPhone', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
              <input
                type="text"
                value={editedProfile.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Phone</label>
              <input
                type="tel"
                value={editedProfile.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 