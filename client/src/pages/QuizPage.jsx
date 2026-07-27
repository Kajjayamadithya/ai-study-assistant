import { ChevronLeft, ChevronRight, CheckCircle, Sparkles, ArrowLeft, HelpCircle } from 'lucide-react';
import { useStudy } from '../hooks/useStudy';
import QuizCard from '../components/QuizCard';
import QuizSummary from '../components/QuizSummary';
import ProgressBar from '../components/ProgressBar';

export default function QuizPage() {
  const {
    studyData,
    userAnswers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    isQuizSubmitted,
    setIsQuizSubmitted,
    setActiveTab,
  } = useStudy();

  const quizList = studyData?.quiz || [];

  if (!studyData || quizList.length === 0) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center p-4 overflow-hidden">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="relative z-10 w-full max-w-md text-center animate-fade-scale">
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-glow-purple">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-100 mb-2">
              No Quiz Available
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Please enter a study topic or paste notes on the Home page to generate your interactive AI quiz.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-glow-sm transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If quiz is submitted, render full animated summary
  if (isQuizSubmitted) {
    return <QuizSummary />;
  }

  const currentQuestion = quizList[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const isLastQuestion = currentQuestionIndex === quizList.length - 1;

  const handleNext = () => {
    if (currentQuestionIndex < quizList.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsQuizSubmitted(true);
  };

  return (
    <div className="relative overflow-hidden min-h-[85vh]">
      {/* Background Orbs */}
      <div className="orb orb-1" style={{ opacity: 0.08 }} />
      <div className="orb orb-2" style={{ opacity: 0.06 }} />
      <div className="dot-grid absolute inset-0 z-0 opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 animate-fade-down">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
                Interactive Assessment
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-purple-400" />
              {studyData.title || 'Knowledge Assessment'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select the single best answer for each question.
            </p>
          </div>

          {/* Top Quick Submit Button */}
          <button
            onClick={handleSubmitQuiz}
            disabled={answeredCount === 0}
            className="btn-shimmer flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-glow-emerald transition-all active:scale-95 shrink-0"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Submit Quiz ({answeredCount}/{quizList.length})</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 max-w-2xl mx-auto animate-fade-up">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={quizList.length}
            label="Quiz Question Progress"
          />
        </div>

        {/* Active Question Card */}
        <QuizCard
          key={currentQuestion?.id || currentQuestionIndex}
          question={currentQuestion}
          index={currentQuestionIndex}
          total={quizList.length}
        />

        {/* Question Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-8 animate-fade-up anim-delay-200">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 font-bold text-sm transition-all border border-slate-700/60 active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {/* Question Index Pills */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            {quizList.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const isAnswered = userAnswers[q.id] !== undefined;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-7 h-7 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'bg-purple-600 text-white shadow-glow-purple scale-110'
                      : isAnswered
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitQuiz}
              className="btn-shimmer flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-glow-emerald transition-all active:scale-95"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Finish &amp; Submit</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-shimmer flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-glow-purple active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
