import { useStudy } from '../hooks/useStudy';
import FlashcardList from '../components/FlashcardList';
import { ArrowLeft, Layers } from 'lucide-react';

export default function FlashcardsPage() {
  const { studyData, setActiveTab } = useStudy();

  if (!studyData || !studyData.flashcards) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center p-4 overflow-hidden">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="relative z-10 w-full max-w-md text-center animate-fade-scale">
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-glow-sm">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-100 mb-2">
              No Flashcards Loaded
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Please enter a study topic or paste notes on the Home page to generate your 3D flashcard deck.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-glow-sm transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <FlashcardList />;
}
