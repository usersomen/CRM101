import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ClipboardList, FolderOpen, FileText, Calendar } from 'lucide-react';
import CalendarModal from './Calendar';

export default function SideNav() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const isModalOpenRef = useRef(false);

  const navItems = [
    { 
      id: 'communication', 
      icon: MessageCircle, 
      label: 'Communication',
      gradient: 'from-pink-500 to-rose-500',
      hoverGradient: 'hover:from-pink-600 hover:to-rose-600'
    },
    { 
      id: 'tasks', 
      icon: ClipboardList, 
      label: 'Create Task',
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'hover:from-blue-600 hover:to-cyan-600'
    },
    { 
      id: 'documents', 
      icon: FolderOpen, 
      label: 'My Documents',
      gradient: 'from-amber-500 to-orange-500',
      hoverGradient: 'hover:from-amber-600 hover:to-orange-600'
    },
    { 
      id: 'notes', 
      icon: FileText, 
      label: 'Create Notes',
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'hover:from-emerald-600 hover:to-teal-600'
    },
    { 
      id: 'calendar', 
      icon: Calendar, 
      label: 'Calendar',
      gradient: 'from-violet-500 to-purple-500',
      hoverGradient: 'hover:from-violet-600 hover:to-purple-600'
    },
  ];

  useEffect(() => {
    isModalOpenRef.current = isCalendarOpen;
  }, [isCalendarOpen]);

  const startHideTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!isModalOpenRef.current) {
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 20000);
    }
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    startHideTimer();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 10) {
        handleMouseEnter();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Add effect to update document body class
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('sidenav-visible');
    } else {
      document.body.classList.remove('sidenav-visible');
    }
  }, [isVisible]);

  return (
    <>
      <div 
        className={`fixed left-0 top-32 bottom-0 w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-6 transform transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg z-40`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                if (item.id === 'calendar') {
                  setIsCalendarOpen(true);
                }
              }}
              className={`p-3 rounded-xl relative group transition-all duration-200 ${
                isActive 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-110` 
                  : `bg-gradient-to-r ${item.gradient} bg-opacity-10 text-white hover:scale-105 hover:shadow-md`
              }`}
            >
              <Icon className="h-6 w-6 text-white" />
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl">
                {item.label}
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
            </button>
          );
        })}
      </div>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => {
          setIsCalendarOpen(false);
          startHideTimer();
        }}
      />
    </>
  );
}