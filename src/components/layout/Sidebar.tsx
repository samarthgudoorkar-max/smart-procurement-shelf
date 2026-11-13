import React from 'react';
import {
  LayoutDashboard,
  ScanEye,
  Boxes,
  BellRing,
  ShoppingCart,
  BarChart3,
  Cpu,
  Info,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, procurementRequests, openDemoModal } = useApp();

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const pendingRequestsCount = procurementRequests.filter(
    pr => pr.status === 'DRAFT' || pr.status === 'UNDER_REVIEW'
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'monitoring',
      label: 'AI Shelf Monitoring',
      icon: ScanEye,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'inventory',
      label: 'Inventory Management',
      icon: Boxes,
      badge: null,
    },
    {
      id: 'alerts',
      label: 'Low-Stock Alerts',
      icon: BellRing,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'procurement',
      label: 'Procurement Workspace',
      icon: ShoppingCart,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      id: 'analytics',
      label: 'Analytics & Validation',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'edge',
      label: 'Edge Devices',
      icon: Cpu,
      badge: '3 Nodes',
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
    },
    {
      id: 'about',
      label: 'Project & Research',
      icon: Info,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              Smart Shelf
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                Edge-AI
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-normal">Autonomous Procurement</p>
          </div>
        </div>
      </div>

      {/* Quick Launch Demo CTA inside Sidebar */}
      <div className="px-3 pt-3">
        <button
          onClick={openDemoModal}
          className="w-full group flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600/90 to-indigo-700 hover:from-indigo-600 hover:to-indigo-600 text-white text-xs font-medium shadow-sm transition-all duration-150 border border-indigo-500/40"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200 group-hover:rotate-12 transition-transform" />
            <span>Guided Judge Demo</span>
          </div>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">
            8 Steps
          </span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Core Workflows
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Academic & Symposium Accreditation Footer */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-indigo-400 tracking-wide uppercase">
            MakeInSilicon '26
          </span>
          <span className="text-[10px] font-mono text-slate-400">Reg: 27325</span>
        </div>
        <p className="text-[11px] font-medium text-slate-200">IIIT Naya Raipur</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Inst. of Aeronautical Eng.</p>
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>S. Gudoorkar & KSK Sasank</span>
          <button
            onClick={() => setActiveTab('about')}
            className="hover:text-indigo-400 flex items-center gap-0.5 transition-colors"
          >
            <span>Docs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
