import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, GradeLevel } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    studentId: string;
    schoolName: string;
    grade: GradeLevel;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const DEFAULT_STUDENT: UserProfile = {
  id: 'usr_student_01',
  email: 'student@icthemantha.lk',
  fullName: 'Kavindu Bandara',
  role: 'student',
  phone: '0712345678',
  studentId: 'STU-2026-1102',
  schoolName: 'Maliyadeva College, Kurunegala',
  grade: 11,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  createdAt: '2026-01-10T08:00:00Z',
  bio: 'Aiming for an A in G.C.E. O/L ICT 2026.'
};

const DEFAULT_ADMIN: UserProfile = {
  id: 'usr_admin_01',
  email: 'admin@icthemantha.lk',
  fullName: 'Hemantha Wanninayake B.Sc',
  role: 'admin',
  phone: '0772735518',
  studentId: 'ADM-001',
  schoolName: 'ICT Academy',
  grade: 11,
  avatarUrl: '/src/assets/images/instructor_hemantha_1794084339711.jpg',
  createdAt: '2025-01-01T00:00:00Z',
  bio: 'Academy Director & Senior ICT Educator.'
};

const DEFAULT_TEACHER: UserProfile = {
  id: 'usr_teacher_01',
  email: 'teacher@icthemantha.lk',
  fullName: 'Anura Senanayake B.Sc',
  role: 'teacher',
  phone: '0778899001',
  studentId: 'TCH-04',
  schoolName: 'ICT Academy Staff',
  grade: 10,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  createdAt: '2025-06-15T00:00:00Z',
  bio: 'Assistant ICT Lecturer.'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ict_hemantha_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_STUDENT;
      }
    }
    // Default to student logged in for easy test driving of protected LMS features
    return DEFAULT_STUDENT;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ict_hemantha_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ict_hemantha_user');
    }
  }, [currentUser]);

  const login = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Real Supabase Auth attempt
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: _password || 'Password123!',
        });
        if (error) {
          // Fall back gracefully to local test user
          console.warn('Supabase auth notice, using local credentials fallback:', error.message);
        } else if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            role: (data.user.user_metadata?.role as UserRole) || 'student',
            grade: (data.user.user_metadata?.grade as GradeLevel) || 11,
            studentId: data.user.user_metadata?.student_id || 'STU-' + Math.floor(1000 + Math.random() * 9000),
            createdAt: new Date().toISOString()
          };
          setCurrentUser(profile);
          setIsLoading(false);
          return { success: true };
        }
      }

      // Local interactive login
      if (email.toLowerCase().includes('admin')) {
        setCurrentUser(DEFAULT_ADMIN);
      } else if (email.toLowerCase().includes('teacher')) {
        setCurrentUser(DEFAULT_TEACHER);
      } else {
        const studentUser: UserProfile = {
          ...DEFAULT_STUDENT,
          email,
          fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase())
        };
        setCurrentUser(studentUser);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    studentId: string;
    schoolName: string;
    grade: GradeLevel;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password || 'StudentPass123!',
          options: {
            data: {
              full_name: data.fullName,
              phone: data.phone,
              student_id: data.studentId,
              school_name: data.schoolName,
              grade: data.grade,
              role: 'student'
            }
          }
        });
        if (error) {
          console.warn('Supabase register notice, completing local profile:', error.message);
        }
      }

      const newStudent: UserProfile = {
        id: 'usr_' + Date.now(),
        email: data.email,
        fullName: data.fullName,
        role: 'student',
        phone: data.phone,
        studentId: data.studentId,
        schoolName: data.schoolName,
        grade: data.grade,
        createdAt: new Date().toISOString(),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`
      };

      setCurrentUser(newStudent);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(DEFAULT_ADMIN);
    } else if (role === 'teacher') {
      setCurrentUser(DEFAULT_TEACHER);
    } else {
      setCurrentUser(DEFAULT_STUDENT);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout, switchRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
