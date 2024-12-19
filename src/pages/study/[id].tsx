import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import { Timer } from '@/components/study/Timer';
import { ContentViewer } from '@/components/study/ContentViewer';
import { NoteTaking } from '@/components/study/NoteTaking';
import { ResourcePanel } from '@/components/study/ResourcePanel';

export default function StudySession() {
  const router = useRouter();
  const { id } = router.query;
  const [sessionData, setSessionData] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      fetchSessionData();
    }
  }, [id]);

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/study-sessions/${id}`);
      const data = await response.json();
      setSessionData(data);
    } catch (error) {
      console.error('Error fetching study session:', error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{sessionData?.title}</h1>
          <Timer 
            duration={sessionData?.duration}
            onComplete={() => {
              // Handle session completion
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContentViewer content={sessionData?.content} />
            <NoteTaking
              value={notes}
              onChange={setNotes}
              onSave={async () => {
                await fetch(`/api/study-sessions/${id}/notes`, {
                  method: 'POST',
                  body: JSON.stringify({ notes })
                });
              }}
            />
          </div>
          <ResourcePanel resources={sessionData?.resources} />
        </div>
      </div>
    </MainLayout>
  );
} 