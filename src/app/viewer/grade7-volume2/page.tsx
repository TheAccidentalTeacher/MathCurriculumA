import { Suspense } from 'react';
import PageViewer from '../../../components/PageViewer';
import Script from 'next/script';

interface PageProps {
  searchParams?: Promise<{ 
    page?: string;
    navigationId?: string;
    searchPattern?: string;
    lessonNumber?: string;
    fallbackPattern?: string;
    estimatedPage?: string;
  }>;
}

export default async function Grade7Volume2Viewer({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  
  // Handle both old page-based and new search-based navigation
  const initialPage = params.page ? parseInt(params.page, 10) : 1;
  
  // Extract search-based navigation parameters
  const navigationParams = {
    navigationId: params.navigationId,
    searchPattern: params.searchPattern,
    lessonNumber: params.lessonNumber ? parseInt(params.lessonNumber, 10) : undefined,
    fallbackPattern: params.fallbackPattern,
    estimatedPage: params.estimatedPage ? parseInt(params.estimatedPage, 10) : undefined,
  };
  
  return (
    <>
      {/* Load PDF.js for text search functionality */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="beforeInteractive"
      />
      <Script id="pdfjsWorker" strategy="beforeInteractive">
        {`if (typeof window !== 'undefined' && window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          }`}
      </Script>
      
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900">
            Grade 7 Mathematics - Volume 2
          </h1>
        </div>
        
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <PageViewer 
            documentId="RCM07_NA_SW_V2"
            totalPages={350}
            volumeName="Grade 7 - Volume 2"
            volume="grade7-volume2"
            navigationParams={navigationParams}
          />
        </Suspense>
      </div>
    </>
  );
}
