import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ConferenceSchedulerProps {
  onThreadCreate: (thread: { id: string; messages: any[] }) => void;
}

export const ConferenceScheduler: React.FC<ConferenceSchedulerProps> = ({
  onThreadCreate,
}) => {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date) {
      onThreadCreate({
        id: Date.now().toString(),
        messages: [],
      });
      setTitle('');
      setDate('');
    }
  };

  return (
    <form onSubmit={handleSchedule} className="space-y-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Conference Title"
      />
      <Input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button type="submit">Schedule Conference</Button>
    </form>
  );
}; 
