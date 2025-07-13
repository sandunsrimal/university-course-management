'use client'

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import api from '@/lib/api';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  BookOpenIcon,
  UserGroupIcon,
  ArrowRightIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  department: string;
  semester: number;
  currentEnrollment: number;
  maxCapacity: number;
  isActive: boolean;
  instructorName: string;
}

interface GradeStatistics {
  courseId: number;
  totalGrades: number;
  releasedGrades: number;
  averageGrade: number;
  studentsWithGrades: number;
  totalStudents: number;
}

export default function InstructorGradesOverviewPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [gradeStats, setGradeStats] = useState<{ [key: number]: GradeStatistics }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const coursesResponse = await api.get('/api/instructor/courses');
      setCourses(coursesResponse.data);

      // Fetch grade statistics for each course
      const statsPromises = coursesResponse.data.map(async (course: Course) => {
        try {
          const [gradesRes, avgRes] = await Promise.all([
            api.get(`/api/instructor/courses/${course.id}/grades`),
            api.get(`/api/instructor/courses/${course.id}/grades/average`)
          ]);
          
          const grades = gradesRes.data;
          const releasedGrades = grades.filter((g: any) => g.isReleased).length;
          const studentsWithGrades = new Set(grades.map((g: any) => g.studentId)).size;
          
          return {
            courseId: course.id,
            totalGrades: grades.length,
            releasedGrades,
            averageGrade: avgRes.data.averageGrade || 0,
            studentsWithGrades,
            totalStudents: course.currentEnrollment
          };
        } catch (err) {
          return {
            courseId: course.id,
            totalGrades: 0,
            releasedGrades: 0,
            averageGrade: 0,
            studentsWithGrades: 0,
            totalStudents: course.currentEnrollment
          };
        }
      });

      const statsResults = await Promise.all(statsPromises);
      const statsMap = statsResults.reduce((acc, stat) => {
        acc[stat.courseId] = stat;
        return acc;
      }, {} as { [key: number]: GradeStatistics });

      setGradeStats(statsMap);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (average: number) => {
    if (average >= 90) return 'text-green-600';
    if (average >= 80) return 'text-blue-600';
    if (average >= 70) return 'text-yellow-600';
    if (average >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Dashboard>
        <div className="mx-4 sm:mx-6 lg:mx-8 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="mx-4 sm:mx-6 lg:mx-8 space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grade Management</h1>
              <p className="text-gray-600 mt-1">Manage grades for all your courses</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {courses.length}
                </div>
                <div className="text-sm text-gray-500">Total Courses</div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpenIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Courses</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {courses.filter(c => c.isActive).length}
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
                  <UserGroupIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {courses.reduce((sum, course) => sum + course.currentEnrollment, 0)}
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
                  <AcademicCapIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Grades</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Object.values(gradeStats).reduce((sum, stat) => sum + stat.totalGrades, 0)}
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
                  <CheckCircleIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Released Grades</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Object.values(gradeStats).reduce((sum, stat) => sum + stat.releasedGrades, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No courses found</p>
              <p className="text-gray-400 mt-2">You don't have any courses assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {courses.map((course) => {
                const stats = gradeStats[course.id] || {
                  totalGrades: 0,
                  releasedGrades: 0,
                  averageGrade: 0,
                  studentsWithGrades: 0,
                  totalStudents: course.currentEnrollment
                };

                const gradeProgress = stats.totalStudents > 0 ? (stats.studentsWithGrades / stats.totalStudents) * 100 : 0;
                const releaseProgress = stats.totalGrades > 0 ? (stats.releasedGrades / stats.totalGrades) * 100 : 0;

                return (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {course.courseCode} - {course.courseName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {course.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{course.currentEnrollment} students enrolled</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{stats.totalGrades} total grades</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{stats.releasedGrades} released grades</span>
                          </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Students with Grades</span>
                              <span>{stats.studentsWithGrades}/{stats.totalStudents}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getProgressColor(gradeProgress)}`}
                                style={{ width: `${gradeProgress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Released Grades</span>
                              <span>{stats.releasedGrades}/{stats.totalGrades}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getProgressColor(releaseProgress)}`}
                                style={{ width: `${releaseProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 ml-6">
                        {stats.averageGrade > 0 && (
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getGradeColor(stats.averageGrade)}`}>
                              {stats.averageGrade.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-500">Class Average</div>
                          </div>
                        )}
                        
                        <a
                          href={`/instructor/courses/${course.id}/grades`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Manage Grades
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
} 