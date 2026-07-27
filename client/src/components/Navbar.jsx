import { Sparkles, Layers, HelpCircle, Award, Home as HomeIcon, Trash2, History } from 'lucide-react';
import { useStudy } from '../hooks/useStudy';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { studyData, activeTab, setActiveTab, clearSession, historyList } = useStudy();
  const isGenerated = !!studyData;

  const tabs = [
    { id: 'home', icon: HomeIcon, label: 'Home', always: true },
    { id: 'flashcards', icon: Layers, label: 'Cards', badge: studyData?.flashcards?.length, requiresData: true },
    { id: 'quiz', icon: HelpCircle, label: 'Quiz', badge: studyData?.quiz?.length, requiresData: true },
    { id: 'results', icon: Award, label: 'Results', requiresData: true },
    { id: 'history', icon: History, label: 'History', badge: historyList.length || null, always: true, badgeColor: 'emerald' },
  ];

  const visibleTabs = tabs.filter((t) => t.always || (t.requiresData && isGenerated));

  return (
    <header className="sticky top-0 z-50 transition-all">
      {/* Glassy bar */}
      <div className="bg-slate-950/70 backdrop-blur-2xl border-b border-slate-800/50 light:bg-white/80 light:border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-purple-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-4.5 h-4.5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-extrabold text-sm text-slate-100 light:text-slate-900 leading-none">AI Study Assistant</p>
              <p className="text-[10px] text-indigo-400 font-semibold leading-none mt-0.5">Groq · MongoDB Atlas</p>
            </div>
          </button>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 bg-slate-900/60 light:bg-slate-100/80 p-1.5 rounded-2xl border border-slate-800/60 light:border-slate-200 backdrop-blur-md overflow-x-auto">
            {visibleTabs.map(({ id, icon: Icon, label, badge, badgeColor = 'indigo' }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
                {badge > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    activeTab === id
                      ? 'bg-white/20 text-white'
                      : badgeColor === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isGenerated && (
              <button
                onClick={clearSession}
                className="tooltip p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                data-tip="Clear session"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            )}
            <ThemeToggle />
          </div>

        </div>
      </div>

      {/* Neon bottom line */}
      <div className="neon-divider" />
    </header>
  );
}
