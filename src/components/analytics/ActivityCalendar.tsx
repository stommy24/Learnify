'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ActivityCalendarProps {
  activities: {
    date: Date;
    type: 'LESSON' | 'PRACTICE' | 'ASSESSMENT';
    timeSpent: number;
  }[];
}

export default function ActivityCalendar({ activities }: ActivityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const weeks = generateCalendarData(activities);

  const getIntensity = (minutes: number): string => {
    if (minutes === 0) return 'bg-gray-100';
    if (minutes < 15) return 'bg-green-100';
    if (minutes < 30) return 'bg-green-300';
    if (minutes < 60) return 'bg-green-500';
    return 'bg-green-700';
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Activity Calendar</h3>
      
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm text-gray-500">
            {day}
          </div>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <motion.div
              key={`${weekIndex}-${dayIndex}`}
              whileHover={{ scale: 1.2 }}
              className={`
                aspect-square rounded-lg cursor-pointer
                ${getIntensity(day.timeSpent)}
                ${selectedDate?.getTime() === day.date.getTime()
                  ? 'ring-2 ring-blue-500'
                  : ''
                }
              `}
              onClick={() => setSelectedDate(day.date)}
            />
          ))
        )}
      </div>

      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h4>
          <div className="mt-2 text-sm text-gray-600">
            {activities
              .filter(a => 
                a.date.toDateString() === selectedDate.toDateString()
              )
              .map((activity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{activity.type}</span>
                  <span>{activity.timeSpent} minutes</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end space-x-2 text-sm">
        <span className="text-gray-600">Activity Level:</span>
        <div className="flex space-x-1">
          {['0', '1-15', '16-30', '31-60', '60+'].map((label, index) => (
            <div key={label} className="flex items-center space-x-1">
              <div
                className={`w-4 h-4 rounded ${
                  index === 0
                    ? 'bg-gray-100'
                    : index === 1
                    ? 'bg-green-100'
                    : index === 2
                    ? 'bg-green-300'
                    : index === 3
                    ? 'bg-green-500'
                    : 'bg-green-700'
                }`}
              />
              <span className="text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generateCalendarData(activities: ActivityCalendarProps['activities']) {
  const weeks: any[][] = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 27); // 4 weeks ago

  let currentWeek: any[] = [];
  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const dayActivities = activities.filter(
      a => a.date.toDateString() === d.toDateString()
    );
    
    const timeSpent = dayActivities.reduce(
      (sum, activity) => sum + activity.timeSpent,
      0
    );

    currentWeek.push({
      date: new Date(d),
      timeSpent
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
} 