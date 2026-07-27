import { useStudy } from '../hooks/useStudy';
import QuizSummary from '../components/QuizSummary';
import { Award, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';

export default function ResultsPage() {
  const { studyData, isQuizSubmitted, setActiveTab } = useStudy();

  if (!studyData) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center p-4 overflow-hidden">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="relative z-10 w-full max-w-md text-center animate-fade-scale">
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-glow-sm">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-100 mb-2">
              No Active Session
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Generate a study set on the Home page first to complete a quiz and view your analytics.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-glow-sm transition-all active:scale-95"
            >
              <span>Go to Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isQuizSubmitted) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center p-4 overflow-hidden">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="relative z-10 w-full max-w-md text-center animate-fade-scale">
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-glow-purple animate-bounce-slow">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-100 mb-2">
              Quiz Not Submitted
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Complete and submit the quiz to unlock your complete score breakdown, detailed question analysis, and export options.
            </p>
            <button
              onClick={() => setActiveTab('quiz')}
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-glow-purple transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Take Quiz Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <QuizSummary />;
}
