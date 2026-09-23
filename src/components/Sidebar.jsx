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
  ShieldCheck
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

const Sidebar = () => {
  const { theme, toggleTheme, apiKey, backendStatus } = useApp();

  return (
    <aside style={{ width: '270px', minWidth: '270px' }} className="glass-panel h-screen flex flex-col justify-between p-4 border-r border-slate-800 bg-slate-950/80">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-800/80">
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

        {/* API Key & Backend Status Indicators */}
        <div className="space-y-1.5 mb-4">
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

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Settings & Theme Toggle */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`
          }
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all"
        >
          <span className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="text-xs text-slate-500">{theme.toUpperCase()}</span>
        </button>

        <div className="px-3 pt-2 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Client-Side Confidential
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
