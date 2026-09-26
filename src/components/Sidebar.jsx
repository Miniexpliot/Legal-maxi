import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  GitCompare, 
  ShieldAlert, 
  MessageSquare, 
  BookOpen, 
  Scale, 
  FileCode2, 
  CheckCircle2, 
  Settings, 
  Moon, 
  Sun, 
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Focused, streamlined core Legal AI workflows
const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/simplify', label: 'Document Simplifier', icon: FileText },
  { path: '/compare', label: 'Contract Comparator', icon: GitCompare },
  { path: '/scan', label: 'Clause Scanner', icon: ShieldAlert },
  { path: '/qa', label: 'Legal Q&A Assistant', icon: MessageSquare },
  { path: '/compliance', label: 'Compliance Audit', icon: CheckCircle2 },
  { path: '/glossary', label: 'Legal Glossary', icon: BookOpen },
  { path: '/templates', label: 'Templates', icon: FileCode2 },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { theme, toggleTheme, apiKey, isLiveAi } = useApp();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          aria-label="Close mobile navigation backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        style={{ width: '270px', minWidth: '270px' }} 
        className={`glass-panel h-screen flex flex-col justify-between p-4 border-r border-slate-200/90 dark:border-slate-800/90 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-3 mb-3 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Legal<span className="gradient-text">-Max</span>
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">GenAI Legal Assistant</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy & AI Trust Badge */}
          <div className="mb-3 shrink-0 space-y-1.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/25 flex items-center gap-2.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="leading-tight">
                <p className="text-[11px] font-bold text-slate-800 dark:text-emerald-300">100% Client-Private</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Stored locally in your browser</p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Gemini AI
              </span>
              <span className={`badge-pill text-[10px] font-semibold ${
                isLiveAi
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800'
                  : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800'
              }`}>
                {isLiveAi ? 'Active (Live AI)' : 'Demo Mode'}
              </span>
            </div>
          </div>

          {/* Scrollable Nav Links */}
          <nav className="space-y-1 overflow-y-auto pr-1 flex-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/30 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: Settings & Theme Toggle */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shrink-0">
          <NavLink
            to="/settings"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Keys</span>
          </NavLink>

          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 transition-all border border-slate-200/70 dark:border-slate-800"
          >
            <span className="flex items-center gap-2.5">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            </span>
            <span className="badge-pill text-[10px] uppercase font-mono">{theme}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
