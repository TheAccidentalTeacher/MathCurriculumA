'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SessionData {
  session_number: number;
  session_type: 'Explore' | 'Develop' | 'Refine';
  title: string;
  start_page: number;
  end_page: number;
  page_span: number;
  content_focus: string;
  activities: string[];
  inferred_type: boolean;
  estimated_duration: string;
}

interface SessionResult {
  grade: number;
  volume: string;
  unit: string;
  lesson: string;
  lesson_number: number;
  session: SessionData;
  context: {
    unit_number: number;
    standards_focus: string[];
    key_concepts: string[];
  };
}

export default function SessionExplorer() {
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    grade: '',
    sessionType: '',
    search: ''
  });

  useEffect(() => {
    fetchAllSessions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sessions, filters]);

  const fetchAllSessions = async () => {
    try {
      const response = await fetch('/api/curriculum/sessions');
      if (response.ok) {
        const sessionData = await response.json();
        setSessions(sessionData);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sessions];

    if (filters.grade) {
      filtered = filtered.filter(session => session.grade.toString() === filters.grade);
    }

    if (filters.sessionType) {
      filtered = filtered.filter(session => session.session.session_type === filters.sessionType);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(session => 
        session.session.title.toLowerCase().includes(searchLower) ||
        session.lesson.toLowerCase().includes(searchLower) ||
        session.unit.toLowerCase().includes(searchLower) ||
        session.session.content_focus.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSessions(filtered);
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'Explore': return 'bg-blue-100 text-blue-800';
      case 'Develop': return 'bg-green-100 text-green-800';
      case 'Refine': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: number) => {
    switch (grade) {
      case 6: return 'bg-blue-500';
      case 7: return 'bg-green-500';
      case 8: return 'bg-purple-500';
      case 9: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/curriculum" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Curriculum
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Session Explorer
          </h1>
          <p className="text-gray-600">
            Browse and search through all extracted curriculum sessions with detailed metadata
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search sessions, lessons, units..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level
              </label>
              <select
                value={filters.grade}
                onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Grades</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Algebra 1</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <select
                value={filters.sessionType}
                onChange={(e) => setFilters(prev => ({ ...prev, sessionType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Explore">Explore</option>
                <option value="Develop">Develop</option>
                <option value="Refine">Refine</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ grade: '', sessionType: '', search: '' })}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-gray-800">
                {loading ? 'Loading...' : `${filteredSessions.length} sessions found`}
              </span>
              {!loading && sessions.length > 0 && (
                <span className="text-gray-600 ml-2">
                  (of {sessions.length} total)
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                Explore: {filteredSessions.filter(s => s.session.session_type === 'Explore').length}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                Develop: {filteredSessions.filter(s => s.session.session_type === 'Develop').length}
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                Refine: {filteredSessions.filter(s => s.session.session_type === 'Refine').length}
              </span>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading sessions...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredSessions.map((sessionResult, index) => (
              <div key={`${sessionResult.grade}-${sessionResult.lesson_number}-${sessionResult.session.session_number}`} 
                   className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${getGradeColor(sessionResult.grade)} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                        {sessionResult.grade}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {sessionResult.session.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {sessionResult.lesson} • Session {sessionResult.session.session_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionTypeColor(sessionResult.session.session_type)}`}>
                        {sessionResult.session.session_type}
                      </span>
                      {sessionResult.session.inferred_type && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Inferred
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pages:</span>
                          <span className="font-medium text-gray-900">{sessionResult.session.start_page}-{sessionResult.session.end_page} ({sessionResult.session.page_span} pages)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium text-gray-900">{sessionResult.session.estimated_duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Focus:</span>
                          <span className="font-medium text-gray-900">{sessionResult.session.content_focus}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Curriculum Context</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Unit:</span>
                          <span className="font-medium ml-2 text-gray-900">{sessionResult.unit}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Standards:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {sessionResult.context.standards_focus.map((standard, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {standard}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Key Concepts:</span>
                          <div className="mt-1 text-gray-900">
                            {sessionResult.context.key_concepts.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  {sessionResult.session.activities.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Activities</h4>
                      <div className="flex flex-wrap gap-2">
                        {sessionResult.session.activities.map((activity, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {!loading && filteredSessions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No sessions found matching your criteria.</p>
                <button
                  onClick={() => setFilters({ grade: '', sessionType: '', search: '' })}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Clear filters to see all sessions
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
