import { ThemeProvider } from './context/ThemeContext';
import { StudyProvider } from './context/StudyContext';
import { useStudy } from './hooks/useStudy';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';

function MainContent() {
  const { activeTab } = useStudy();

  return (
    <main className="pb-16">
      {activeTab === 'home' && <Home />}
      {activeTab === 'flashcards' && <FlashcardsPage />}
      {activeTab === 'quiz' && <QuizPage />}
      {activeTab === 'results' && <ResultsPage />}
      {activeTab === 'history' && <HistoryPage />}
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StudyProvider>
          <div className="min-h-screen bg-slate-900 text-slate-100 light:bg-slate-50 light:text-slate-900 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
            <Navbar />
            <MainContent />
          </div>
        </StudyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
