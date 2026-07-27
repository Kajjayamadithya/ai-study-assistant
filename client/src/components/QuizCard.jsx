import { CheckCircle, XCircle, Info, HelpCircle } from 'lucide-react';
import { useStudy } from '../hooks/useStudy';

export default function QuizCard({ question, index, total }) {
  const { userAnswers, selectQuizAnswer, isQuizSubmitted } = useStudy();
  const selectedOptionIndex = userAnswers[question.id];
  const isCorrect = selectedOptionIndex === question.correctAnswer;

  const getOptionStyle = (optIdx) => {
    const isSelected = selectedOptionIndex === optIdx;
    const isThisCorrect = optIdx === question.correctAnswer;

    if (isQuizSubmitted) {
      if (isThisCorrect) return 'correct';
      if (isSelected && !isThisCorrect) return 'wrong';
      return 'muted';
    }
    if (isSelected) return 'selected';
    return 'default';
  };

  const styleMap = {
    default: {
      container: 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-indigo-500/40 text-slate-200 cursor-pointer',
      letter: 'bg-slate-700 border-slate-600 text-slate-300',
    },
    selected: {
      container: 'bg-indigo-500/15 border-indigo-500 text-slate-100 ring-1 ring-indigo-500/40 shadow-glow-sm quiz-option-selected cursor-pointer',
      letter: 'bg-indigo-600 border-indigo-500 text-white',
    },
    correct: {
      container: 'bg-emerald-500/12 border-emerald-500 text-emerald-100 shadow-glow-emerald cursor-default',
      letter: 'bg-emerald-600 border-emerald-500 text-white',
    },
    wrong: {
      container: 'bg-rose-500/12 border-rose-500 text-rose-200 shadow-glow-rose cursor-default',
      letter: 'bg-rose-600 border-rose-500 text-white',
    },
    muted: {
      container: 'opacity-35 bg-slate-800/30 border-slate-800 cursor-default',
      letter: 'bg-slate-800 border-slate-700 text-slate-500',
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4 animate-fade-scale">
      {/* Card Shell */}
      <div className="relative p-[1px] rounded-3xl"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.12), rgba(99,102,241,0.08))' }}
      >
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/12 text-purple-300 border border-purple-500/20 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              Q {index + 1} / {total}
            </span>
            {isQuizSubmitted && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                isCorrect
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 badge-glow-green'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 badge-glow-rose'
              }`}>
                {isCorrect ? <><CheckCircle className="w-3.5 h-3.5" /> Correct!</> : <><XCircle className="w-3.5 h-3.5" /> Incorrect</>}
              </span>
            )}
          </div>

          {/* Question Text */}
          <h3 className="text-xl font-bold text-slate-100 light:text-slate-900 mb-7 leading-snug">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, optIdx) => {
              const style = styleMap[getOptionStyle(optIdx)];
              const isThisCorrect = optIdx === question.correctAnswer;
              const isThisSelected = selectedOptionIndex === optIdx;

              return (
                <div
                  key={optIdx}
                  onClick={() => selectQuizAnswer(question.id, optIdx)}
                  className={`quiz-option flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${style.container}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 border transition-all ${style.letter}`}>
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-sm sm:text-base leading-relaxed flex-1">{option}</span>
                  {isQuizSubmitted && isThisCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isQuizSubmitted && isThisSelected && !isThisCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {isQuizSubmitted && question.explanation && (
            <div className="animate-fade-up p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 flex items-start gap-3 backdrop-blur-sm">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-indigo-300 mb-1 uppercase tracking-wide">Explanation</p>
                <p className="text-sm text-indigo-200/90 leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
