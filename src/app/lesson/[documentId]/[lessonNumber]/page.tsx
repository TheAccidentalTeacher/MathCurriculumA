import { Suspense } from 'react';
import LessonViewer from '../../../../components/LessonViewer';
import Link from 'next/link';

interface LessonPageProps {
  params: Promise<{
    documentId: string;
    lessonNumber: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { documentId, lessonNumber } = await params;
  const lessonNum = parseInt(lessonNumber);

  if (isNaN(lessonNum)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Invalid Lesson Number</h1>
          <p className="text-gray-600 mb-4">
            The lesson number &quot;{lessonNumber}&quot; is not valid.
          </p>
          <Link
            href={`/viewer/${documentId === 'RCM07_NA_SW_V1' ? 'volume1' : 'volume2'}`}
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Return to Viewer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <div className="text-lg font-medium">Loading Lesson {lessonNum}...</div>
            </div>
          </div>
        </div>
      }
    >
      <LessonViewer 
        documentId={documentId}
        lessonNumber={lessonNum}
      />
    </Suspense>
  );
}
