'use client';

import React from 'react';
import { useTeacherMode } from '@/contexts/TeacherModeContext';

export function TeacherModeToggle() {
  const { isTeacherMode, toggleTeacherMode } = useTeacherMode();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTeacherMode}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full 
          transition-colors duration-200 ease-in-out focus:outline-none 
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isTeacherMode 
            ? 'bg-blue-600' 
            : 'bg-gray-600'
          }
        `}
        aria-label="Toggle teacher mode"
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white 
            transition-transform duration-200 ease-in-out
            ${isTeacherMode ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      <span className="text-sm text-gray-400 font-medium">
        {isTeacherMode ? '👩‍🏫 Teacher' : '👤 Student'}
      </span>
    </div>
  );
}