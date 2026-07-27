import { Database, Layers, HelpCircle, ArrowRight, Trash2, RefreshCw, Calendar, BookOpen } from 'lucide-react';
import { useStudy } from '../hooks/useStudy';

export default function HistoryPage() {
  const {
    historyList,
    isHistoryLoading,
    refreshHistory,
    loadSetFromHistory,
    deleteSetFromHistory,
    setActiveTab,
  } = useStudy();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative min-h-[85vh] overflow-hidden">
      {/* Background Orbs */}
      <div className="orb orb-1" style={{ opacity: 0.08 }} />
      <div className="orb orb-2" style={{ opacity: 0.06 }} />
      <div className="dot-grid absolute inset-0 z-0 opacity-20" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-down">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                MongoDB Atlas Cloud
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              Study History &amp; Saved Sets
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              All generated flashcard and quiz sets are stored automatically in MongoDB Atlas.
            </p>
          </div>

          <button
            onClick={refreshHistory}
            disabled={isHistoryLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700/60 transition-all disabled:opacity-50 active:scale-95 shadow-md"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isHistoryLoading ? 'animate-spin' : ''}`} />
            <span>{isHistoryLoading ? 'Refreshing...' : 'Refresh History'}</span>
          </button>
        </div>

        {/* Loading State */}
        {isHistoryLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/40 skeleton-shimmer">
                <div className="h-5 bg-slate-700/60 rounded-full w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-700/60 rounded-full w-full mb-2"></div>
                <div className="h-4 bg-slate-700/60 rounded-full w-2/3 mb-6"></div>
                <div className="h-8 bg-slate-700/60 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isHistoryLoading && historyList.length === 0 && (
          <div className="max-w-md mx-auto text-center py-16 px-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl animate-fade-scale">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center shadow-glow-emerald">
              <Database className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-100 mb-2">
              No Saved History Yet
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Once you generate a study set on the Home page, it will automatically save to MongoDB Atlas and appear here.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-glow-sm transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Generate First Study Set</span>
            </button>
          </div>
        )}

        {/* History Grid */}
        {!isHistoryLoading && historyList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-up">
            {historyList.map((item) => (
              <div
                key={item._id}
                className="card-3d group relative p-[1px] rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
                }}
              >
                <div className="h-full p-6 rounded-3xl bg-slate-900/90 backdrop-blur-xl flex flex-col justify-between">
                  
                  {/* Card Header */}
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className="font-extrabold text-slate-100 text-base leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => deleteSetFromHistory(item._id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0 active:scale-90"
                        title="Delete from MongoDB Atlas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold truncate max-w-[200px]">
                        {item.topic}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-indigo-400" />
                            {item.flashcardCount} Cards
                          </span>
                          <span className="flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                            {item.quizCount} Questions
                          </span>
                        </div>
                        {item.createdAt && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {formatDate(item.createdAt)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => loadSetFromHistory(item._id)}
                        className="btn-shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-glow-sm active:scale-95"
                      >
                        <span>Load Set</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Database Status Indicator */}
        <div className="mt-12 flex justify-center animate-fade-up anim-delay-300">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold shadow-glow-emerald backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>MongoDB Atlas Synced — Real-time persistence active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
