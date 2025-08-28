import PageViewer from '@/components/PageViewer';

export default function Volume2ViewerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Ready Classroom Mathematics - Grade 7 • Volume 2
        </h1>
        
        <PageViewer 
          documentId="RCM07_NA_SW_V2"
          totalPages={440}
          initialPage={1}
        />
      </div>
    </div>
  );
}
