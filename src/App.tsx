import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { GradeCoursePage } from './pages/GradeCoursePage';
import { QuestionPapersPage } from './pages/QuestionPapersPage';
import { RegistrationRequestPage } from './pages/RegistrationRequestPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { GradeLevel } from './types';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Grade course pages: /grade/:id
    const gradeMatch = currentPath.match(/^\/grade\/([6-9]|10|11)$/);
    if (gradeMatch) {
      const grade = parseInt(gradeMatch[1], 10) as GradeLevel;
      return <GradeCoursePage grade={grade} navigate={navigate} />;
    }

    // 2. Auth Routes
    if (currentPath === '/login') {
      return <LoginPage navigate={navigate} />;
    }
    if (currentPath === '/register') {
      return <RegisterPage navigate={navigate} />;
    }
    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage navigate={navigate} />;
    }

    // 3. Public Features
    if (currentPath === '/papers') {
      return <QuestionPapersPage navigate={navigate} />;
    }
    if (currentPath === '/registration-request') {
      return <RegistrationRequestPage navigate={navigate} />;
    }

    // 4. Student Dashboard Sub-routes
    if (currentPath.startsWith('/dashboard')) {
      const tab = currentPath === '/dashboard/courses' ? 'courses' :
                  currentPath === '/dashboard/lessons' ? 'lessons' :
                  currentPath === '/dashboard/exams' ? 'exams' :
                  currentPath === '/dashboard/results' ? 'results' :
                  currentPath === '/dashboard/attendance' ? 'attendance' :
                  currentPath === '/dashboard/progress' ? 'progress' :
                  currentPath === '/dashboard/payments' ? 'payments' :
                  currentPath === '/dashboard/profile' ? 'profile' : 'overview';
      return <StudentDashboard initialTab={tab} navigate={navigate} />;
    }

    // 5. Admin Dashboard
    if (currentPath.startsWith('/admin')) {
      return <AdminDashboard navigate={navigate} />;
    }

    // 6. Teacher Portal
    if (currentPath === '/teacher') {
      return <TeacherDashboard navigate={navigate} />;
    }

    // Default: Home Page
    return <HomePage navigate={navigate} />;
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#172033]">
            <Header currentPath={currentPath} navigate={navigate} />
            <main className="flex-1">
              {renderRoute()}
            </main>
            <Footer navigate={navigate} />
            <FloatingWhatsApp />
          </div>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
