import { CheckCircle, XCircle, RotateCcw, RefreshCw, Download, Sparkles } from 'lucide-react';
import { useStudy } from '../hooks/useStudy';
import { exportAsMarkdown } from '../utils/exportUtils';

export default function QuizSummary() {
  const { studyData, userAnswers, resetQuiz, retryIncorrectQuiz } = useStudy();
  const quizList = studyData?.quiz || [];

  let correctCount = 0;
  quizList.forEach((q) => { if (userAnswers[q.id] === q.correctAnswer) correctCount++; });
  const total = quizList.length;
  const incorrectCount = total - correctCount;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const grade = (() => {
    if (percentage >= 90) return { label: 'Outstanding! 🎉', color: 'text-emerald-400', ringColor: '#10b981' };
    if (percentage >= 70) return { label: 'Great Job! 🚀', color: 'text-indigo-400', ringColor: '#6366f1' };
    if (percentage >= 50) return { label: 'Good Effort 💪', color: 'text-amber-400', ringColor: '#f59e0b' };
    return { label: 'Keep Studying 📚', color: 'text-rose-400', ringColor: '#f43f5e' };
  })();

  // SVG ring calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative overflow-hidden">
      <div className="orb orb-1" style={{ opacity: 0.07 }} />
      <div className="orb orb-2" style={{ opacity: 0.06 }} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">

        {/* ── Score Hero ── */}
        <div className="animate-fade-scale text-center p-8 sm:p-10 rounded-3xl mb-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(30,27,75,0.95) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 30px 80px rgba(99,102,241,0.15), 0 0 0 1px rgba(99,102,241,0.1)',
          }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-purple-600/8 blur-2xl pointer-events-none" />

          <div className="relative">
            {/* SVG Progress Ring */}
            <div className="flex justify-center mb-4">
              <div className="relative w-36 h-36">
                <svg className="result-ring w-full h-full -rotate-90" viewBox="0 0 128 128"
                  style={{ '--target-offset': offset }}
                >
                  <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="64" cy="64" r={radius} fill="none"
                    stroke={grade.ringColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                      filter: `drop-shadow(0 0 6px ${grade.ringColor})`,
                      transition: 'stroke-dashoffset 1.4s cubic-bezier(0.23,1,0.32,1)',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-extrabold ${grade.color}`}>{percentage}%</span>
                  <span className="text-xs text-slate-500 font-semibold">Score</span>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-100 mb-1">Quiz Complete!</h2>
            <p className={`text-lg font-bold mb-7 ${grade.color}`}>{grade.label}</p>

            {/* Stat Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { value: total, label: 'Total', color: 'indigo' },
                { value: correctCount, label: 'Correct', color: 'emerald' },
                { value: incorrectCount, label: 'Wrong', color: 'rose' },
              ].map(({ value, label, color }) => (
                <div key={label} className={`score-reveal px-6 py-4 rounded-2xl bg-${color}-500/10 border border-${color}-500/25 text-center min-w-[90px]`}>
                  <div className={`text-3xl font-extrabold text-${color}-400`}>{value}</div>
                  <div className={`text-xs text-${color}-400/70 font-semibold mt-0.5`}>{label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={resetQuiz}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700/60 hover:border-slate-600 transition-all active:scale-95">
                <RotateCcw className="w-4 h-4 text-indigo-400" /> Restart Quiz
              </button>
              {incorrectCount > 0 && (
                <button onClick={retryIncorrectQuiz}
                  className="btn-shimmer flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-glow-rose transition-all active:scale-95">
                  <RefreshCw className="w-4 h-4" /> Retry Wrong ({incorrectCount})
                </button>
              )}
              <button onClick={() => exportAsMarkdown(studyData)}
                className="btn-shimmer flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-glow-sm transition-all active:scale-95">
                <Download className="w-4 h-4" /> Export Notes
              </button>
            </div>
          </div>
        </div>

        {/* ── Question Breakdown ── */}
        <div className="animate-fade-up anim-delay-300">
          <h3 className="text-xl font-bold text-slate-100 mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Detailed Breakdown
          </h3>

          <div className="space-y-4">
            {quizList.map((q, idx) => {
              const selected = userAnswers[q.id];
              const isCorrect = selected === q.correctAnswer;

              return (
                <div key={q.id || idx}
                  className={`card-3d p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-rose-500/5 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-bold text-slate-100 text-sm leading-snug flex-1">
                      <span className="text-slate-500 mr-2">{idx + 1}.</span>{q.question}
                    </h4>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                    }`}>
                      {isCorrect ? <><CheckCircle className="w-3 h-3" /> Correct</> : <><XCircle className="w-3 h-3" /> Wrong</>}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 mb-3">
                    <p className="text-slate-400">
                      <span className="font-semibold text-slate-300">Your answer: </span>
                      {selected !== undefined ? q.options[selected] : <em className="text-slate-500">Not answered</em>}
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-400">
                        <span className="font-semibold">Correct: </span>
                        {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>

                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-indigo-400">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
