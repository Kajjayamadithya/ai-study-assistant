import { useState } from 'react';
import { Bookmark, HelpCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { useStudy } from '../hooks/useStudy';

export default function Flashcard({ card, index, total }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { bookmarkedCardIds, toggleBookmark } = useStudy();
  const isBookmarked = bookmarkedCardIds.includes(card.id);

  return (
    <div className="w-full max-w-2xl mx-auto perspective-2000 my-6">
      {/* Card Count Indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {Array.from({ length: Math.min(total, 7) }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === index % 7
                ? 'w-6 h-2.5 bg-indigo-500 shadow-glow-sm'
                : 'w-2 h-2 bg-slate-700 light:bg-slate-300'
            }`}
          />
        ))}
        {total > 7 && <span className="text-xs text-slate-500 font-mono ml-1">{index + 1}/{total}</span>}
      </div>

      {/* Flip Card Container */}
      <div
        onClick={() => setIsFlipped((p) => !p)}
        className={`relative w-full cursor-pointer transform-style-3d transition-all duration-[600ms] ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ minHeight: '340px' }}
      >
        {/* ── FRONT: Question ── */}
        <div className="absolute inset-0 rounded-3xl backface-hidden flashcard-glow overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(30,27,75,0.95) 0%, rgba(15,23,42,0.98) 60%, rgba(29,22,72,0.95) 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}
        >
          {/* Top decorative bar */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600" />

          {/* Corner glow decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-purple-600/10 blur-2xl pointer-events-none" />

          <div className="relative flex flex-col justify-between h-full p-7 sm:p-9">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/12 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
                <HelpCircle className="w-3.5 h-3.5" />
                QUESTION {index + 1}/{total}
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleBookmark(card.id); }}
                className={`p-2 rounded-xl transition-all duration-200 active:scale-90 ${
                  isBookmarked
                    ? 'text-amber-400 bg-amber-400/12 border border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Bookmark className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            </div>

            {/* Question */}
            <div className="flex-1 flex items-center justify-center py-8 text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-100 leading-relaxed">
                {card.question}
              </p>
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <RotateCw className="w-3.5 h-3.5 text-indigo-400" style={{ animation: 'spin 8s linear infinite' }} />
              <span>Click or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px] mx-0.5">Space</kbd> to reveal answer</span>
            </div>
          </div>
        </div>

        {/* ── BACK: Answer ── */}
        <div className="absolute inset-0 rounded-3xl backface-hidden rotate-y-180 flashcard-answer-glow overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(5,46,37,0.95) 0%, rgba(15,23,42,0.98) 50%, rgba(10,38,71,0.95) 100%)',
            border: '1px solid rgba(16,185,129,0.3)',
          }}
        >
          {/* Top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          {/* Corner glow */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-teal-600/8 blur-2xl pointer-events-none" />

          <div className="relative flex flex-col justify-between h-full p-7 sm:p-9">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ANSWER
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleBookmark(card.id); }}
                className={`p-2 rounded-xl transition-all duration-200 active:scale-90 ${
                  isBookmarked
                    ? 'text-amber-400 bg-amber-400/12 border border-amber-400/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Bookmark className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center py-8 text-center">
              <p className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed">
                {card.answer}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-500/70">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
