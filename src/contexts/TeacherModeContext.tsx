'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TeacherModeContextType {
  isTeacherMode: boolean;
  toggleTeacherMode: () => void;
}

const TeacherModeContext = createContext<TeacherModeContextType | undefined>(undefined);

export function TeacherModeProvider({ children }: { children: React.ReactNode }) {
  const [isTeacherMode, setIsTeacherMode] = useState(false);

  // Load teacher mode state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('teacherMode');
    if (saved === 'true') {
      setIsTeacherMode(true);
    }
  }, []);

  // Save teacher mode state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('teacherMode', isTeacherMode.toString());
  }, [isTeacherMode]);

  const toggleTeacherMode = () => {
    setIsTeacherMode(prev => !prev);
  };

  return (
    <TeacherModeContext.Provider value={{ isTeacherMode, toggleTeacherMode }}>
      {children}
    </TeacherModeContext.Provider>
  );
}

export function useTeacherMode() {
  const context = useContext(TeacherModeContext);
  if (context === undefined) {
    throw new Error('useTeacherMode must be used within a TeacherModeProvider');
  }
  return context;
}