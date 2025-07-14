'use client'

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import api from '@/lib/api';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  BookOpenIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Grade {
  id: number;
  resultValue: number;
  letterResult: string;
  resultType: string;
  resultTypeDisplay: string;
  title: string;
  description: string;
  isReleased: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  releasedAt: string | null;
  studentId: number;
  studentName: string;
  studentEmail: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  instructorId: number;
  instructorName: string;
}

interface GradeStatistics {
  totalGrades: number;
  averageGrade: number;
  gradesByType: { [key: string]: number };
  gradesByCourse: { [key: string]: number };
  letterGradeDistribution: { [key: string]: number };
}

const gradeTypes = [
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'QUIZ', label: 'Quiz' },
  { value: 'MIDTERM', label: 'Midterm Exam' },
  { value: 'FINAL', label: 'Final Exam' },
  { value: 'PROJECT', label: 'Project' },
  { value: 'PARTICIPATION', label: 'Participation' },
  { value: 'PRESENTATION', label: 'Presentation' },
  { value: 'LAB', label: 'Lab Work' },
  { value: 'OTHER', label: 'Other' }
];

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterCourse, setFilterCourse] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [statistics, setStatistics] = useState<GradeStatistics | null>(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/student/results');
      setGrades(response.data);
      calculateStatistics(response.data);
    } catch (err) {
      setError('Failed to fetch grades');
      console.error('Error fetching grades:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (gradesData: Grade[]) => {
    if (gradesData.length === 0) {
      setStatistics(null);
      return;
    }

    const totalGrades = gradesData.length;
    const averageGrade = gradesData.reduce((sum, grade) => sum + grade.resultValue, 0) / totalGrades;
    
    const gradesByType: { [key: string]: number } = {};
    const gradesByCourse: { [key: string]: number } = {};
    const letterGradeDistribution: { [key: string]: number } = {};

    gradesData.forEach(grade => {
      // Count by type
      const typeLabel = grade.resultTypeDisplay;
      gradesByType[typeLabel] = (gradesByType[typeLabel] || 0) + 1;

      // Count by course
      const courseLabel = `${grade.courseCode} - ${grade.courseName}`;
      gradesByCourse[courseLabel] = (gradesByCourse[courseLabel] || 0) + 1;

      // Count by letter grade
      letterGradeDistribution[grade.letterResult] = (letterGradeDistribution[grade.letterResult] || 0) + 1;
    });

    setStatistics({
      totalGrades,
      averageGrade,
      gradesByType,
      gradesByCourse,
      letterGradeDistribution
    });
  };

  const filteredGrades = grades.filter(grade => {
    const typeMatch = filterType === 'ALL' || grade.resultType === filterType;
    const courseMatch = filterCourse === 'ALL' || grade.courseId.toString() === filterCourse;
    return typeMatch && courseMatch;
  });

  const sortedGrades = [...filteredGrades].sort((a, b) => {
    switch (sortBy) {
      case 'gradeValue':
        return b.resultValue - a.resultValue;
      case 'courseName':
        return a.courseName.localeCompare(b.courseName);
      case 'gradeType':
        return a.resultType.localeCompare(b.resultType);
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const getGradeColor = (resultValue: number) => {
    if (resultValue >= 90) return 'text-green-600';
    if (resultValue >= 80) return 'text-blue-600';
    if (resultValue >= 70) return 'text-yellow-600';
    if (resultValue >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (resultValue: number) => {
    if (resultValue >= 90) return 'bg-green-100';
    if (resultValue >= 80) return 'bg-blue-100';
    if (resultValue >= 70) return 'bg-yellow-100';
    if (resultValue >= 60) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getLetterGradeColor = (letterResult: string) => {
    switch (letterResult) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueCourses = Array.from(new Set(grades.map(grade => 
    `${grade.courseId}:${grade.courseCode} - ${grade.courseName}`
  )));

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
              <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
              <p className="text-gray-600 mt-1">View your released grades and academic performance</p>
            </div>
            <div className="flex items-center space-x-4">
              {statistics && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {statistics.averageGrade.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">Overall Average</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AcademicCapIcon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Grades
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.totalGrades}
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
                    <ChartBarIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Average Grade
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.averageGrade.toFixed(1)}%
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
                    <BookOpenIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Courses
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {Object.keys(statistics.gradesByCourse).length}
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Letter Grade
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.averageGrade >= 90 ? 'A' : 
                         statistics.averageGrade >= 80 ? 'B' : 
                         statistics.averageGrade >= 70 ? 'C' : 
                         statistics.averageGrade >= 60 ? 'D' : 'F'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="ALL">All Types</option>
                {gradeTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="ALL">All Courses</option>
                {uniqueCourses.map(course => {
                  const [courseId, courseName] = course.split(':');
                  return (
                    <option key={courseId} value={courseId}>{courseName}</option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="createdAt">Date Created</option>
                <option value="gradeValue">Grade Value</option>
                <option value="courseName">Course Name</option>
                <option value="gradeType">Grade Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grades List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {sortedGrades.length === 0 ? (
            <div className="text-center py-12">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No grades found</p>
              <p className="text-gray-400 mt-2">
                {filterType !== 'ALL' || filterCourse !== 'ALL' 
                  ? 'Try adjusting your filters' 
                  : 'Your instructors haven\'t released any grades yet'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {sortedGrades.map((grade) => (
                <div key={grade.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{grade.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {grade.resultTypeDisplay}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-1" />
                          {grade.courseCode} - {grade.courseName}
                        </div>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {grade.instructorName}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {new Date(grade.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {grade.description && (
                        <p className="text-gray-700 text-sm">{grade.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getGradeColor(grade.resultValue)}`}>
                          {grade.resultValue}%
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLetterGradeColor(grade.letterResult)}`}>
                          {grade.letterResult}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grade Distribution */}
        {statistics && Object.keys(statistics.letterGradeDistribution).length > 0 && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(statistics.letterGradeDistribution).map(([letter, count]) => (
                <div key={letter} className="text-center">
                  <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getLetterGradeColor(letter)}`}>
                    {letter}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-2">{count}</div>
                  <div className="text-sm text-gray-500">
                    {((count / statistics.totalGrades) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
} 