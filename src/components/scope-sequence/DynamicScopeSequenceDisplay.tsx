'use client';

import React, { useState, useEffect } from 'react';

interface ScopeSequenceData {
  grade: string;
  displayName: string;
  totalLessons: number;
  totalUnits: number;
  estimatedDays: number;
  documents: {
    id: string;
    title: string;
    volume: string;
    lessons: number;
  }[];
  units: {
    unitNumber: number;
    unitTitle: string;
    lessonCount: number;
    estimatedDays: number;
    topics: string[];
  }[];
}

interface DynamicPacingConfig {
  grade: string;
  totalLessons: number;
  averageSessionsPerLesson: number;
  totalSessions: number;
  estimatedDays: number;
  pacing: {
    standard: number;
    accelerated: number;
    intensive: number;
  };
}

interface AcceleratedPathway {
  pathway: string;
  grades: string[];
  totalLessons: number;
  estimatedDays: number;
  description: string;
}

export function DynamicScopeSequenceDisplay() {
  const [scopeData, setScopeData] = useState<ScopeSequenceData[]>([]);
  const [acceleratedPathways, setAcceleratedPathways] = useState<AcceleratedPathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScopeData = async () => {
      try {
        const response = await fetch('/api/scope-sequence');
        const result = await response.json();
        
        if (result.success) {
          setScopeData(result.data.allGrades);
          setAcceleratedPathways(result.data.acceleratedPathways);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to load scope and sequence data');
        console.error('Error fetching scope data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScopeData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading scope and sequence data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Curriculum Scope & Sequence</h1>
        <p className="text-gray-600">Dynamic curriculum data generated from actual lesson boundaries and structure</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="pathways">Accelerated Pathways</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {scopeData.map((grade) => (
              <Card key={grade.grade} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{grade.displayName}</CardTitle>
                    <Badge variant="secondary">{grade.totalLessons} lessons</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Units:</span>
                      <span className="font-medium">{grade.totalUnits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Est. Days:</span>
                      <span className="font-medium">{grade.estimatedDays}</span>
                    </div>
                    <div className="mt-3">
                      <Progress 
                        value={(grade.totalLessons / Math.max(...scopeData.map(g => g.totalLessons))) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="mt-6">
          <div className="space-y-6">
            {scopeData.map((grade) => (
              <Card key={grade.grade}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {grade.displayName}
                    <div className="flex gap-2">
                      <Badge variant="outline">{grade.totalLessons} lessons</Badge>
                      <Badge variant="outline">{grade.estimatedDays} days</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Documents</h4>
                      <div className="space-y-2">
                        {grade.documents.map((doc) => (
                          <div key={doc.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{doc.title}</span>
                            <Badge variant="secondary">{doc.lessons} lessons</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Units</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {grade.units.map((unit) => (
                          <div key={unit.unitNumber} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-sm">{unit.unitTitle}</h5>
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs">{unit.lessonCount}L</Badge>
                                <Badge variant="outline" className="text-xs">{unit.estimatedDays}D</Badge>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              {unit.topics.slice(0, 3).join(', ')}
                              {unit.topics.length > 3 && `... +${unit.topics.length - 3} more`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pathways" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Accelerated Pathways</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {acceleratedPathways.map((pathway) => (
                <Card key={pathway.pathway}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {pathway.pathway.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Grades:</span>
                        <div className="flex gap-1 mt-1">
                          {pathway.grades.map((grade) => (
                            <Badge key={grade} variant="secondary">{grade}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Lessons:</span>
                        <span className="font-medium">{pathway.totalLessons}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Est. Days:</span>
                        <span className="font-medium">{pathway.estimatedDays}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{pathway.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
