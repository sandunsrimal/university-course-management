'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import api from '@/lib/api';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon
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
  instructorEmail: string;
  resultColor: string;
}

interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  major: string;
  year: number;
}

interface CourseInfo {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
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

export default function InstructorGradesPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStudent, setFilterStudent] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('studentName');

  const [gradeForm, setGradeForm] = useState({
    gradeValue: '',
    gradeType: 'ASSIGNMENT',
    title: '',
    description: '',
    studentId: '',
    isReleased: false
  });

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gradesRes, studentsRes, courseRes] = await Promise.all([
        api.get(`/api/instructor/courses/${courseId}/results`),
        api.get(`/api/instructor/courses/${courseId}/students`),
        api.get(`/api/instructor/courses/${courseId}`)
      ]);

      setGrades(gradesRes.data);
      setStudents(studentsRes.data);
      setCourseInfo(courseRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!gradeForm.gradeValue || gradeForm.gradeValue.trim() === '') {
      alert('Please enter a grade value');
      return;
    }
    if (!gradeForm.title || gradeForm.title.trim() === '') {
      alert('Please enter a title');
      return;
    }
    if (!gradeForm.studentId) {
      alert('Please select a student');
      return;
    }
    
    const gradeValue = parseFloat(gradeForm.gradeValue);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      alert('Please enter a valid grade value between 0 and 100');
      return;
    }
    
    try {
      const gradeData = {
        resultValue: gradeValue,
        resultType: gradeForm.gradeType,
        title: gradeForm.title,
        description: gradeForm.description || '',
        studentId: parseInt(gradeForm.studentId),
        courseId: parseInt(courseId),
        isReleased: gradeForm.isReleased
      };

      console.log('Sending grade data:', gradeData);
      await api.post('/api/instructor/results', gradeData);
      await fetchData();
      setShowAddModal(false);
      resetForm();
      alert('Grade added successfully!');
    } catch (err: any) {
      console.error('Error adding grade:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add grade';
      alert(errorMessage);
    }
  };

  const handleEditGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;

    // Validation
    if (!gradeForm.gradeValue || gradeForm.gradeValue.trim() === '') {
      alert('Please enter a grade value');
      return;
    }
    if (!gradeForm.title || gradeForm.title.trim() === '') {
      alert('Please enter a title');
      return;
    }
    if (!gradeForm.studentId) {
      alert('Please select a student');
      return;
    }
    
    const gradeValue = parseFloat(gradeForm.gradeValue);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      alert('Please enter a valid grade value between 0 and 100');
      return;
    }

    try {
      const gradeData = {
        resultValue: gradeValue,
        resultType: gradeForm.gradeType,
        title: gradeForm.title,
        description: gradeForm.description || '',
        studentId: parseInt(gradeForm.studentId),
        courseId: parseInt(courseId),
        isReleased: gradeForm.isReleased
      };

      console.log('Updating grade data:', gradeData);
      await api.put(`/api/instructor/results/${editingGrade.id}`, gradeData);
      await fetchData();
      setEditingGrade(null);
      resetForm();
      alert('Grade updated successfully!');
    } catch (err: any) {
      console.error('Error updating grade:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update grade';
      alert(errorMessage);
    }
  };

  const handleDeleteGrade = async (gradeId: number) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await api.delete(`/api/instructor/results/${gradeId}`);
        await fetchData();
      } catch (err) {
        console.error('Error deleting grade:', err);
        alert('Failed to delete grade');
      }
    }
  };

  const handleToggleRelease = async (gradeId: number, isReleased: boolean) => {
    try {
      const endpoint = isReleased ? 'unrelease' : 'release';
      await api.put(`/api/instructor/results/${gradeId}/${endpoint}`);
      await fetchData();
    } catch (err) {
      console.error('Error toggling release:', err);
      alert('Failed to toggle release status');
    }
  };

  const handleReleaseAllGrades = async () => {
    if (window.confirm('Are you sure you want to release all unreleased grades for this course?')) {
      try {
        await api.put(`/api/instructor/courses/${courseId}/results/release`);
        await fetchData();
      } catch (err) {
        console.error('Error releasing all grades:', err);
        alert('Failed to release all grades');
      }
    }
  };

  const resetForm = () => {
    setGradeForm({
      gradeValue: '',
      gradeType: 'ASSIGNMENT',
      title: '',
      description: '',
      studentId: '',
      isReleased: false
    });
  };

  const openEditModal = (grade: Grade) => {
    setEditingGrade(grade);
    setGradeForm({
      gradeValue: grade.resultValue.toString(),
      gradeType: grade.resultType,
      title: grade.title,
      description: grade.description || '',
      studentId: grade.studentId.toString(),
      isReleased: grade.isReleased
    });
  };

  const filteredGrades = grades.filter(grade => {
    const typeMatch = filterType === 'ALL' || grade.resultType === filterType;
    const studentMatch = filterStudent === 'ALL' || grade.studentId.toString() === filterStudent;
    return typeMatch && studentMatch;
  });

  const sortedGrades = [...filteredGrades].sort((a, b) => {
    switch (sortBy) {
      case 'studentName':
        return a.studentName.localeCompare(b.studentName);
      case 'gradeValue':
        return b.resultValue - a.resultValue;
      case 'gradeType':
        return a.resultType.localeCompare(b.resultType);
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const getGradeColor = (gradeValue: number) => {
    if (gradeValue >= 90) return 'text-green-600';
    if (gradeValue >= 80) return 'text-blue-600';
    if (gradeValue >= 70) return 'text-yellow-600';
    if (gradeValue >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (gradeValue: number) => {
    if (gradeValue >= 90) return 'bg-green-100';
    if (gradeValue >= 80) return 'bg-blue-100';
    if (gradeValue >= 70) return 'bg-yellow-100';
    if (gradeValue >= 60) return 'bg-orange-100';
    return 'bg-red-100';
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
              {courseInfo && (
                <p className="text-gray-600 mt-1">
                  {courseInfo.courseCode} - {courseInfo.courseName}
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Grade
              </button>
              <button
                onClick={handleReleaseAllGrades}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Release All
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters and Statistics */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Student</label>
              <select
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="ALL">All Students</option>
                {students.map(student => (
                  <option key={student.id} value={student.id.toString()}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="studentName">Student Name</option>
                <option value="gradeValue">Grade Value</option>
                <option value="gradeType">Grade Type</option>
                <option value="createdAt">Date Created</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <p>Total Grades: {filteredGrades.length}</p>
                <p>Released: {filteredGrades.filter(g => g.isReleased).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {sortedGrades.length === 0 ? (
            <div className="text-center py-12">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No grades found</p>
              <p className="text-gray-400 mt-2">
                {filterType !== 'ALL' || filterStudent !== 'ALL' 
                  ? 'Try adjusting your filters' 
                  : 'Start by adding grades for your students'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedGrades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{grade.studentName}</div>
                            <div className="text-sm text-gray-500">{grade.studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{grade.title}</div>
                          <div className="text-sm text-gray-500">{grade.resultTypeDisplay}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeBgColor(grade.resultValue)} ${getGradeColor(grade.resultValue)}`}>
                            {grade.resultValue}% ({grade.letterResult})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          grade.isReleased ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {grade.isReleased ? 'Released' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(grade.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(grade)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleRelease(grade.id, grade.isReleased)}
                            className={`${grade.isReleased ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                            title={grade.isReleased ? 'Unrelease' : 'Release'}
                          >
                            {grade.isReleased ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteGrade(grade.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Grade Modal */}
        {(showAddModal || editingGrade) && (
          <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border border-gray-200 w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingGrade ? 'Edit Grade' : 'Add Grade'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingGrade(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={editingGrade ? handleEditGrade : handleAddGrade} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student</label>
                    <select
                      value={gradeForm.studentId}
                      onChange={(e) => setGradeForm({...gradeForm, studentId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                      disabled={!!editingGrade}
                    >
                      <option value="">Select Student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id.toString()}>
                          {student.firstName} {student.lastName} ({student.studentId})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade Type</label>
                    <select
                      value={gradeForm.gradeType}
                      onChange={(e) => setGradeForm({...gradeForm, gradeType: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      {gradeTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade Value (0-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={gradeForm.gradeValue}
                      onChange={(e) => setGradeForm({...gradeForm, gradeValue: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={gradeForm.title}
                      onChange={(e) => setGradeForm({...gradeForm, title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., Midterm Exam, Assignment 1"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                  <textarea
                    value={gradeForm.description}
                    onChange={(e) => setGradeForm({...gradeForm, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Additional details about this assessment..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isReleased"
                    checked={gradeForm.isReleased}
                    onChange={(e) => setGradeForm({...gradeForm, isReleased: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isReleased" className="ml-2 block text-sm text-gray-900">
                    Release grade to student immediately
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingGrade(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {editingGrade ? 'Update Grade' : 'Add Grade'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
} 