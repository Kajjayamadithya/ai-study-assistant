import { Sparkles, Brain, BookOpen, Zap } from 'lucide-react';

export default function SkeletonLoader({ topic = 'your study topic' }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="dot-grid absolute inset-0 opacity-20" />

      <div className="relative z-10 w-full max-w-xl mx-auto px-4 text-center animate-fade-scale">
        {/* Central Pulsing Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-glow-lg animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          {/* Ripple rings */}
          <div className="absolute inset-0 rounded-3xl border-2 border-indigo-500/30 animate-ping" style={{ animationDuration: '1.8s' }} />
          <div className="absolute -inset-3 rounded-[2rem] border border-indigo-500/15 animate-ping" style={{ animationDuration: '2.4s', animationDelay: '0.3s' }} />
        </div>

        <h3 className="text-3xl font-extrabold text-slate-100 mb-3">
          Generating Study Materials<span className="animate-pulse">...</span>
        </h3>
        <p className="text-slate-400 text-sm mb-2 max-w-sm mx-auto">
          Groq AI is crafting flashcards &amp; quiz questions for
        </p>
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-sm font-bold mb-10">
          &quot;{topic.slice(0, 40)}{topic.length > 40 ? '...' : ''}&quot;
        </span>

        {/* Skeleton Cards */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
          {[
            { Icon: Brain, label: 'Flashcards', color: 'text-indigo-400', border: 'border-indigo-500/20' },
            { Icon: BookOpen, label: 'Quiz Qs', color: 'text-purple-400', border: 'border-purple-500/20' },
          ].map(({ Icon, label, color, border }) => (
            <div key={label} className={`p-5 rounded-2xl bg-slate-800/60 border ${border} text-left skeleton-shimmer`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className={`text-xs font-bold ${color}`}>{label}</span>
              </div>
              {[100, 80, 60].map((w, i) => (
                <div key={i} className="h-2 bg-slate-700/80 rounded-full mb-2" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ))}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center items-center gap-2.5">
          {['bg-indigo-500', 'bg-violet-500', 'bg-purple-500'].map((color, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${color} animate-bounce`}
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
            />
          ))}
        </div>

        <p className="text-xs text-slate-600 mt-5 flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-yellow-500" />
          Powered by llama-3.3-70b-versatile via Groq
        </p>
      </div>
    </div>
  );
}
