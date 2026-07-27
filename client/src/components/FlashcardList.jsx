import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Bookmark, Sparkles } from 'lucide-react';
import { useStudy } from '../hooks/useStudy';
import Flashcard from './Flashcard';
import ProgressBar from './ProgressBar';

export default function FlashcardList() {
  const { studyData, currentCardIndex, setCurrentCardIndex, bookmarkedCardIds } = useStudy();
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const rawCards = studyData?.flashcards || [];
  const cardsToDisplay = showBookmarksOnly
    ? rawCards.filter((card) => bookmarkedCardIds.includes(card.id))
    : rawCards;

  const activeIndex = Math.min(currentCardIndex, Math.max(0, cardsToDisplay.length - 1));

  const handleNext = useCallback(() => {
    if (cardsToDisplay.length > 0) setCurrentCardIndex((prev) => (prev + 1) % cardsToDisplay.length);
  }, [cardsToDisplay.length, setCurrentCardIndex]);

  const handlePrev = useCallback(() => {
    if (cardsToDisplay.length > 0) setCurrentCardIndex((prev) => (prev - 1 + cardsToDisplay.length) % cardsToDisplay.length);
  }, [cardsToDisplay.length, setCurrentCardIndex]);

  const handleShuffle = () => {
    if (cardsToDisplay.length > 1) {
      let rand;
      do { rand = Math.floor(Math.random() * cardsToDisplay.length); } while (rand === activeIndex);
      setCurrentCardIndex(rand);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (rawCards.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">No flashcards available.</div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb orb-1" style={{ opacity: 0.08 }} />
      <div className="orb orb-2" style={{ opacity: 0.06 }} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-down">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
              {studyData.title || 'Flashcards'}
            </h2>
            <p className="text-sm text-slate-400 mt-1 light:text-slate-600">{studyData.description}</p>
          </div>

          <button
            onClick={() => { setShowBookmarksOnly((p) => !p); setCurrentCardIndex(0); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              showBookmarksOnly
                ? 'bg-amber-400/15 text-amber-400 border-amber-400/40 shadow-[0_0_16px_rgba(251,191,36,0.2)]'
                : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700 light:bg-slate-100 light:text-slate-700 light:border-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${showBookmarksOnly ? 'fill-amber-400' : ''}`} />
            {showBookmarksOnly ? 'Bookmarked' : `Bookmarks (${bookmarkedCardIds.length})`}
          </button>
        </div>

        {/* Progress */}
        {cardsToDisplay.length > 0 && (
          <div className="mb-2 max-w-2xl mx-auto animate-fade-up">
            <ProgressBar current={activeIndex + 1} total={cardsToDisplay.length} label="Flashcard Progress" />
          </div>
        )}

        {/* Card */}
        {cardsToDisplay.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl text-slate-400 max-w-md mx-auto border border-slate-800">
            <Bookmark className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="font-semibold mb-1">No bookmarked cards yet.</p>
            <p className="text-xs">Bookmark cards during your study session.</p>
          </div>
        ) : (
          <Flashcard
            key={`${cardsToDisplay[activeIndex]?.id}-${activeIndex}`}
            card={cardsToDisplay[activeIndex]}
            index={activeIndex}
            total={cardsToDisplay.length}
          />
        )}

        {/* Controls */}
        {cardsToDisplay.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 animate-fade-up anim-delay-200">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700/60 hover:border-slate-600 active:scale-95 backdrop-blur-md shadow-md"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>

            <button
              onClick={handleShuffle}
              className="tooltip p-2.5 rounded-2xl bg-slate-800/80 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 transition-all border border-slate-700/60 hover:border-purple-500/40 active:scale-95"
              data-tip="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentCardIndex(0)}
              className="tooltip p-2.5 rounded-2xl bg-slate-800/80 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 transition-all border border-slate-700/60 hover:border-indigo-500/40 active:scale-95"
              data-tip="Restart"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="btn-shimmer flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition-all shadow-glow-sm active:scale-95"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Keyboard Hints */}
        <div className="mt-8 text-center text-xs text-slate-600 flex items-center justify-center gap-5">
          {[['←', 'Prev'], ['Space', 'Flip'], ['→', 'Next']].map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono">{key}</kbd>
              <span className="text-slate-500">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
