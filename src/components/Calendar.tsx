import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  date: Date;
  type: 'meeting' | 'reminder' | 'task';
  title: string;
  time?: string;
}

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Calendar({ isOpen, onClose }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events] = useState<Event[]>([
    { date: new Date(2024, 2, 15), type: 'meeting', title: 'Client Meeting', time: '10:00 AM' },
    { date: new Date(2024, 2, 18), type: 'reminder', title: 'Follow up', time: '2:00 PM' },
    { date: new Date(2024, 2, 20), type: 'task', title: 'Deadline', time: '5:00 PM' },
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const getEventForDate = (date: Date) => {
    return events.find(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-indigo-500';
      case 'reminder': return 'bg-amber-500';
      case 'task': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCalendarDays = () => {
    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-14"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const event = getEventForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-14 relative cursor-pointer group transition-all duration-200
            ${isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 flex items-center justify-center rounded-full
            ${isToday ? 'bg-indigo-600 text-white' : ''}`}>
            {day}
          </span>
          {event && (
            <div className={`absolute bottom-1 left-1 right-1 px-2 py-1 rounded text-xs text-white
              ${getEventTypeColor(event.type)}`}>
              {event.title}
            </div>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white shadow-lg rounded-lg p-3 z-10 transition-opacity">
            <p className="font-medium">{event?.title || 'No events'}</p>
            {event?.time && <p className="text-sm text-gray-600">{event.time}</p>}
          </div>
        </div>
      );
    }

    return days;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {renderCalendarDays()}
          </div>

          {selectedDate && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">
                {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-md transition-shadow">
                  + Add Meeting
                </button>
                <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-md transition-shadow">
                  + Add Reminder
                </button>
                <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-md transition-shadow">
                  + Add Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}