import PageViewer from '@/components/PageViewer';

export default function ViewerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Ready Classroom Mathematics - Grade 7
        </h1>
        
        <PageViewer 
          documentId="rcm07-na-sw-v1"
          totalPages={504}
          initialPage={1}
        />
      </div>
    </div>
  );
}
