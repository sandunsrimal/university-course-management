'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import api from '@/lib/api';
import { 
  DocumentTextIcon,
  BookOpenIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  PresentationChartBarIcon,
  QuestionMarkCircleIcon,
  MegaphoneIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon
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

export default function StudentCourseContentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [announcements, setAnnouncements] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<CourseContent | null>(null);
  const [courseInfo, setCourseInfo] = useState<{code: string, name: string} | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchContents();
    fetchAnnouncements();
  }, [courseId]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/course-content/student/course/${courseId}`);
      setContents(response.data);
      
      // Set course info from first content item
      if (response.data.length > 0) {
        setCourseInfo({
          code: response.data[0].courseCode,
          name: response.data[0].courseName
        });
      }
      
      // Get available content types
      const types = [...new Set(response.data.map((content: CourseContent) => content.contentType))] as string[];
      setAvailableTypes(types);
    } catch (err) {
      setError('Failed to fetch course contents');
      console.error('Error fetching contents:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get(`/api/course-content/student/course/${courseId}/announcements`);
      setAnnouncements(response.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    const IconComponent = contentTypeIcons[contentType as keyof typeof contentTypeIcons] || ExclamationTriangleIcon;
    return <IconComponent className="h-5 w-5" />;
  };

  const getContentTypeColor = (contentType: string) => {
    return contentTypeColors[contentType as keyof typeof contentTypeColors] || 'bg-gray-100 text-gray-800';
  };

  const filteredContents = filterType === 'ALL' 
    ? contents 
    : contents.filter(content => content.contentType === filterType);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="mx-4 sm:mx-6 lg:mx-8 space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Materials</h1>
              {courseInfo && (
                <p className="text-gray-600 mt-1">
                  {courseInfo.code} - {courseInfo.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MegaphoneIcon className="h-5 w-5 mr-2 text-pink-600" />
              Recent Announcements
            </h2>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-pink-400 pl-4 py-2">
                  <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                  {announcement.description && (
                    <p className="text-gray-600 text-sm mt-1">{announcement.description}</p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {formatDate(announcement.createdAt)} at {formatTime(announcement.createdAt)}
                    <UserIcon className="h-4 w-4 ml-4 mr-1" />
                    {announcement.createdByName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Filter */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by type:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'ALL'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({contents.length})
              </button>
              {availableTypes.map((type) => {
                const count = contents.filter(content => content.contentType === type).length;
                const displayName = contents.find(content => content.contentType === type)?.contentTypeDisplayName || type;
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterType === type
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {displayName} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {filteredContents.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No content available</p>
              <p className="text-gray-400 mt-2">
                {filterType === 'ALL' 
                  ? 'Your instructor hasn\'t published any content yet'
                  : `No ${filteredContents.find(c => c.contentType === filterType)?.contentTypeDisplayName || filterType.toLowerCase()} content available`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredContents.map((content) => (
                <div key={content.id} className="p-6 hover:bg-gray-50 cursor-pointer"
                     onClick={() => setSelectedContent(content)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(content.contentType)}`}>
                          {getContentTypeIcon(content.contentType)}
                          <span className="ml-1">{content.contentTypeDisplayName}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {content.title}
                      </h3>
                      
                      {content.description && (
                        <p className="text-gray-600 mb-3">{content.description}</p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatDate(content.createdAt)}
                        <UserIcon className="h-4 w-4 ml-4 mr-1" />
                        {content.createdByName}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Detail Modal */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getContentTypeColor(selectedContent.contentType)}`}>
                      {getContentTypeIcon(selectedContent.contentType)}
                      <span className="ml-1">{selectedContent.contentTypeDisplayName}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedContent.title}
                    </h2>
                    {selectedContent.description && (
                      <p className="text-gray-600 mt-2">{selectedContent.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 mt-3">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatDate(selectedContent.createdAt)} at {formatTime(selectedContent.createdAt)}
                      <UserIcon className="h-4 w-4 ml-4 mr-1" />
                      {selectedContent.createdByName}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedContent(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="border-t pt-6">
                  {selectedContent.content ? (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {selectedContent.content}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No content provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
} 