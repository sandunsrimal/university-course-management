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
  DocumentTextIcon,
  BookOpenIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  PresentationChartBarIcon,
  QuestionMarkCircleIcon,
  MegaphoneIcon,
  LinkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface CourseContent {
  id: number;
  title: string;
  description: string;
  contentType: string;
  contentTypeDisplayName: string;
  content: string;
  sortOrder: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  createdByName: string;
  isFileContent: boolean;
  isTextContent: boolean;
}

const contentTypeIcons = {
  LECTURE_NOTES: DocumentTextIcon,
  ASSIGNMENT: AcademicCapIcon,
  READING_MATERIAL: BookOpenIcon,
  VIDEO: VideoCameraIcon,
  DOCUMENT: DocumentTextIcon,
  PRESENTATION: PresentationChartBarIcon,
  QUIZ: QuestionMarkCircleIcon,
  ANNOUNCEMENT: MegaphoneIcon,
  RESOURCE_LINK: LinkIcon,
  OTHER: ExclamationTriangleIcon
};

const contentTypeColors = {
  LECTURE_NOTES: 'bg-blue-100 text-blue-800',
  ASSIGNMENT: 'bg-red-100 text-red-800',
  READING_MATERIAL: 'bg-green-100 text-green-800',
  VIDEO: 'bg-purple-100 text-purple-800',
  DOCUMENT: 'bg-gray-100 text-gray-800',
  PRESENTATION: 'bg-orange-100 text-orange-800',
  QUIZ: 'bg-yellow-100 text-yellow-800',
  ANNOUNCEMENT: 'bg-pink-100 text-pink-800',
  RESOURCE_LINK: 'bg-indigo-100 text-indigo-800',
  OTHER: 'bg-gray-100 text-gray-800'
};

export default function CourseContentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState<CourseContent | null>(null);
  const [courseInfo, setCourseInfo] = useState<{code: string, name: string} | null>(null);

  useEffect(() => {
    fetchContents();
  }, [courseId]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/course-content/instructor/course/${courseId}`);
      setContents(response.data);
      
      // Set course info from first content item
      if (response.data.length > 0) {
        setCourseInfo({
          code: response.data[0].courseCode,
          name: response.data[0].courseName
        });
      }
    } catch (err) {
      setError('Failed to fetch course contents');
      console.error('Error fetching contents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (contentId: number, isPublished: boolean) => {
    try {
      const endpoint = isPublished ? 'unpublish' : 'publish';
      await api.put(`/api/course-content/instructor/${contentId}/${endpoint}`);
      fetchContents();
    } catch (err) {
      setError('Failed to update publish status');
      console.error('Error updating publish status:', err);
    }
  };

  const handleDelete = async (contentId: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await api.delete(`/api/course-content/instructor/${contentId}`);
        fetchContents();
      } catch (err) {
        setError('Failed to delete content');
        console.error('Error deleting content:', err);
      }
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    const IconComponent = contentTypeIcons[contentType as keyof typeof contentTypeIcons] || ExclamationTriangleIcon;
    return <IconComponent className="h-5 w-5" />;
  };

  const getContentTypeColor = (contentType: string) => {
    return contentTypeColors[contentType as keyof typeof contentTypeColors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="space-y-6 mx-4 sm:mx-6 lg:mx-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Content</h1>
              {courseInfo && (
                <p className="text-gray-600 mt-1">
                  {courseInfo.code} - {courseInfo.name}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={`/instructor/courses/${courseId}/results`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                Manage Results
              </a>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Content
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Content List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {contents.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No content added yet</p>
              <p className="text-gray-400 mt-2">Start by adding your first course content</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contents.map((content) => (
                <div key={content.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(content.contentType)}`}>
                          {getContentTypeIcon(content.contentType)}
                          <span className="ml-1">{content.contentTypeDisplayName}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          content.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {content.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {content.title}
                      </h3>
                      
                      {content.description && (
                        <p className="text-gray-600 mb-3">{content.description}</p>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        Created: {new Date(content.createdAt).toLocaleDateString()}
                        {content.updatedAt !== content.createdAt && (
                          <span className="ml-4">
                            Updated: {new Date(content.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handlePublishToggle(content.id, content.isPublished)}
                        className={`p-2 rounded-lg transition-colors ${
                          content.isPublished
                            ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                        title={content.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {content.isPublished ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => setEditingContent(content)}
                        className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Content Modal */}
        {(showAddModal || editingContent) && (
          <ContentModal
            content={editingContent}
            courseId={courseId}
            onClose={() => {
              setShowAddModal(false);
              setEditingContent(null);
            }}
            onSave={() => {
              fetchContents();
              setShowAddModal(false);
              setEditingContent(null);
            }}
          />
        )}
      </div>
    </Dashboard>
  );
}

// Content Modal Component
function ContentModal({ 
  content, 
  courseId, 
  onClose, 
  onSave 
}: {
  content: CourseContent | null;
  courseId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'LECTURE_NOTES',
    content: '',
    isPublished: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        description: content.description || '',
        contentType: content.contentType,
        content: content.content || '',
        isPublished: content.isPublished
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (content) {
        // Update existing content
        await api.put(`/api/course-content/instructor/${content.id}`, formData);
      } else {
        // Create new content
        await api.post(`/api/course-content/instructor/course/${courseId}`, formData);
      }
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save content');
      console.error('Error saving content:', err);
    } finally {
      setLoading(false);
    }
  };

  const contentTypeOptions = [
    { value: 'LECTURE_NOTES', label: 'Lecture Notes' },
    { value: 'ASSIGNMENT', label: 'Assignment' },
    { value: 'READING_MATERIAL', label: 'Reading Material' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'DOCUMENT', label: 'Document' },
    { value: 'PRESENTATION', label: 'Presentation' },
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'ANNOUNCEMENT', label: 'Announcement' },
    { value: 'RESOURCE_LINK', label: 'Resource Link' },
    { value: 'OTHER', label: 'Other' }
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {content ? 'Edit Content' : 'Add New Content'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type *
              </label>
              <select
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {contentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your content here..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (content ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 