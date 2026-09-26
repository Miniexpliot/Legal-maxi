import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  GitCompare, 
  ShieldAlert, 
  MessageSquare, 
  ListCheck, 
  BookOpen, 
  Scale, 
  FileCode2, 
  CheckCircle2, 
  Settings, 
  Moon, 
  Sun, 
  Key, 
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/simplify', label: 'Document Simplifier', icon: FileText },
  { path: '/compare', label: 'Contract Comparator', icon: GitCompare },
  { path: '/scan', label: 'Clause Scanner', icon: ShieldAlert },
  { path: '/qa', label: 'Legal Q&A Chat', icon: MessageSquare },
  { path: '/summary', label: 'Summary & Checklist', icon: ListCheck },
  { path: '/glossary', label: 'Legal Glossary', icon: BookOpen },
  { path: '/rights', label: 'Rights & Options', icon: Scale },
  { path: '/templates', label: 'Template Library', icon: FileCode2 },
  { path: '/compliance', label: 'Compliance Audit', icon: CheckCircle2 },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { theme, toggleTheme, apiKey, backendStatus } = useApp();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          aria-label="Close mobile navigation backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        style={{ width: '270px', minWidth: '270px' }} 
        className={`glass-panel h-screen flex flex-col justify-between p-4 border-r border-slate-800 bg-slate-950/80 fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-3 mb-4 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/20">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  Legal<span className="gradient-text">-Max</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">GenAI Legal Assistant</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* API Key & Backend Status Indicators */}
          <div className="space-y-1.5 mb-3 shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-400">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                Gemini API
              </span>
              {apiKey ? (
                <span className="badge badge-emerald py-0.5 px-2 text-[10px]">Connected</span>
              ) : (
                <span className="badge badge-amber py-0.5 px-2 text-[10px]">Demo Mode</span>
              )}
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-400">
                <span className={`w-2 h-2 rounded-full ${backendStatus?.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                FastAPI Server
              </span>
              <span className={`text-[10px] font-mono ${backendStatus?.online ? 'text-emerald-400' : 'text-slate-400'}`}>
                {backendStatus?.online ? 'Online' : 'Offline'}
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
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
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

        {/* Footer / Settings & Theme Toggle */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2 shrink-0">
          <NavLink
            to="/settings"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all border border-transparent hover:border-slate-800"
          >
            <span className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <span className="text-[10px] font-mono uppercase text-slate-500 px-1.5 py-0.5 rounded bg-slate-800/50">{theme}</span>
          </button>

          <div className="px-3 pt-1 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Client-Side Confidential
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
