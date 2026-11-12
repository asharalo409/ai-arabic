import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { DashboardView } from './components/views/DashboardView';
import { AiTeacherView } from './components/views/AiTeacherView';
import { CoursesView } from './components/views/CoursesView';
import { LessonDetailView } from './components/views/LessonDetailView';
import { ListeningView } from './components/views/ListeningView';
import { SpeakingView } from './components/views/SpeakingView';
import { GrammarView } from './components/views/GrammarView';
import { QuranicArabicView } from './components/views/QuranicArabicView';
import { VocabularyView } from './components/views/VocabularyView';
import { QuizView } from './components/views/QuizView';
import { PracticeView } from './components/views/PracticeView';
import { DailyChallengeView } from './components/views/DailyChallengeView';
import { LeaderboardView } from './components/views/LeaderboardView';
import { CertificatesView } from './components/views/CertificatesView';
import { ProfileView } from './components/views/ProfileView';
import { AdminView } from './components/views/AdminView';

const MainRouter: React.FC = () => {
  const { currentRoute } = useApp();

  const renderView = () => {
    switch (currentRoute) {
      case '/':
        return <HomeView />;
      case '/dashboard':
        return <DashboardView />;
      case '/ai-teacher':
        return <AiTeacherView />;
      case '/courses':
      case '/courses/beginners':
        return <CoursesView />;
      case '/courses/lesson':
        return <LessonDetailView />;
      case '/listening':
        return <ListeningView />;
      case '/speaking':
        return <SpeakingView />;
      case '/grammar':
        return <GrammarView />;
      case '/quranic-arabic':
        return <QuranicArabicView />;
      case '/vocabulary':
        return <VocabularyView />;
      case '/quiz':
        return <QuizView />;
      case '/practice':
        return <PracticeView />;
      case '/daily-challenge':
        return <DailyChallengeView />;
      case '/leaderboard':
        return <LeaderboardView />;
      case '/certificates':
        return <CertificatesView />;
      case '/profile':
        return <ProfileView />;
      case '/admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-bengali">
      <Navbar />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
