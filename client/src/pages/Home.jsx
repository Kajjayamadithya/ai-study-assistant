import { useState } from 'react';
import {
  Sparkles, ArrowRight, BookOpen, AlertCircle, RefreshCw,
  Layers, HelpCircle, CheckCircle2, Database, Trash2, History,
  Zap, Brain, Star
} from 'lucide-react';
import { useStudy } from '../hooks/useStudy';
import SkeletonLoader from '../components/SkeletonLoader';

const PRESET_TOPICS = [
  { label: 'Operating Systems', icon: '💻' },
  { label: 'Computer Networks', icon: '🌐' },
  { label: 'DBMS', icon: '🗄️' },
  { label: 'React', icon: '⚛️' },
  { label: 'Machine Learning', icon: '🤖' },
];

export default function Home() {
  const [inputText, setInputText] = useState('');
  const {
    generateMaterial, isLoading, error, retryGeneration,
    studyData, setActiveTab, historyList, loadSetFromHistory, deleteSetFromHistory,
  } = useStudy();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) generateMaterial(inputText.trim());
  };

  const handleChipClick = (topic) => {
    setInputText(topic);
    generateMaterial(topic);
  };

  if (isLoading) return <SkeletonLoader topic={inputText} />;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="dot-grid absolute inset-0 z-0 opacity-30" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-10 sm:py-16">

        {/* ── Hero Section ── */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 text-xs font-semibold mb-7 shadow-glow-sm backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            Powered by Groq AI + MongoDB Atlas
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block ml-1" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-5 leading-[1.05]">
            <span className="text-slate-100 light:text-slate-900">AI </span>
            <span className="gradient-text">Study</span>
            <br />
            <span className="text-slate-100 light:text-slate-900">Assistant</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 light:text-slate-600 font-medium leading-relaxed max-w-xl mx-auto animate-fade-up anim-delay-200">
            Turn any topic or notes into interactive flashcards &amp; quizzes with AI — in seconds.
          </p>

          {/* Stat Chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-7 animate-fade-up anim-delay-300">
            {[
              { icon: Brain, label: 'AI-Powered', color: 'text-indigo-400' },
              { icon: Layers, label: 'Flashcards', color: 'text-purple-400' },
              { icon: Star, label: 'Quizzes', color: 'text-amber-400' },
              { icon: Database, label: 'Cloud Saved', color: 'text-emerald-400' },
            ].map(({ icon: Icon, label, color }) => (
              <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-xs font-semibold ${color} backdrop-blur-md`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 animate-fade-scale backdrop-blur-md">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-bold mb-0.5">Generation Failed</p>
              <p className="opacity-85">{error}</p>
            </div>
            <button onClick={retryGeneration} className="btn-shimmer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shrink-0">
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* ── Input Card ── */}
        <div className="max-w-2xl mx-auto mb-10 animate-fade-up anim-delay-200">
          <div className="relative p-[1px] rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.3), rgba(99,102,241,0.2))' }}>
            <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 light:bg-white/90 backdrop-blur-2xl">
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="notes-input" className="text-sm font-bold text-slate-200 light:text-slate-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Study Topic or Notes
                  </label>
                  <span className={`text-xs font-mono transition-colors ${inputText.length > 12000 ? 'text-rose-400' : 'text-slate-500'}`}>
                    {inputText.length}/15000
                  </span>
                </div>

                <textarea
                  id="notes-input"
                  rows={5}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste notes or type any study topic... (e.g. Operating Systems, TCP/IP, React Virtual DOM)"
                  className="w-full p-4 rounded-2xl bg-slate-950/70 light:bg-slate-50 border border-slate-800/80 light:border-slate-300 text-slate-100 light:text-slate-900 placeholder:text-slate-500 light:placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all resize-none mb-5"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="btn-shimmer w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-base shadow-glow-md flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Study Set
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-800/60 light:border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Quick topics:</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TOPICS.map(({ label, icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleChipClick(label)}
                      className="topic-chip px-3.5 py-1.5 rounded-xl bg-slate-800/80 text-slate-300 text-xs font-semibold border border-slate-700/50 light:bg-slate-100 light:text-slate-700 light:border-slate-300 backdrop-blur-md"
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Active Session Resume Banner ── */}
        {studyData && (
          <div className="max-w-2xl mx-auto mb-12 animate-fade-scale">
            <div className="relative p-[1px] rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(99,102,241,0.3))' }}>
              <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shrink-0 shadow-glow-emerald">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-100 truncate">{studyData.title}</p>
                  <p className="text-xs text-slate-400">{studyData.flashcards?.length} Flashcards · {studyData.quiz?.length} Quiz Questions</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setActiveTab('flashcards')} className="btn-shimmer flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-glow-sm">
                    <Layers className="w-3.5 h-3.5" /> Cards
                  </button>
                  <button onClick={() => setActiveTab('quiz')} className="btn-shimmer flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors">
                    <HelpCircle className="w-3.5 h-3.5" /> Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MongoDB History ── */}
        {historyList.length > 0 && (
          <div className="max-w-4xl mx-auto animate-fade-up anim-delay-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <History className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 light:text-slate-900">
                  Recent Sessions
                </h3>
                <p className="text-xs text-slate-500">Saved to MongoDB Atlas · {historyList.length} sets</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyList.slice(0, 4).map((item, i) => (
                <div
                  key={item._id}
                  className={`card-3d group p-5 rounded-2xl bg-slate-800/50 light:bg-white border border-slate-700/50 light:border-slate-200 hover:border-indigo-500/40 transition-all animate-fade-up anim-delay-${(i+1)*100} backdrop-blur-sm`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-100 light:text-slate-900 text-sm leading-snug line-clamp-1">{item.title}</h4>
                    <button onClick={() => deleteSetFromHistory(item._id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-indigo-400" />{item.flashcardCount}</span>
                      <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3 text-purple-400" />{item.quizCount}</span>
                    </div>
                    <button onClick={() => loadSetFromHistory(item._id)} className="btn-shimmer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-bold transition-colors border border-indigo-500/20 hover:border-indigo-500">
                      Load <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {historyList.length > 4 && (
              <div className="mt-4 text-center">
                <button onClick={() => setActiveTab('history')} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors">
                  View all {historyList.length} saved sets →
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
