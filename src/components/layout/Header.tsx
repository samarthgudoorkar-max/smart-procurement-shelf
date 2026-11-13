import React, { useState } from 'react';
import {
  Bell,
  Play,
  RotateCcw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openDemoModal,
    resetAllDataToDefaults,
    alerts,
    edgeDevices,
    currentFps
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const onlineNodes = edgeDevices.filter(d => d.status === 'ONLINE').length;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Operations Dashboard',
      subtitle: 'Real-time Edge inventory telemetry, detection events, and procurement status',
    },
    monitoring: {
      title: 'Live AI Shelf Monitoring',
      subtitle: 'Real-time multi-frame validation viewport and simulated optical sensors',
    },
    inventory: {
      title: 'Inventory Master Catalog',
      subtitle: 'Searchable SKU catalog with verified stock counts and minimum buffer thresholds',
    },
    alerts: {
      title: 'Low-Stock Alert Center',
      subtitle: 'Rule-driven threshold alerts, discrepancy detection, and action triggers',
    },
    procurement: {
      title: 'Procurement Workflow & Audit',
      subtitle: 'Automated draft requests, managerial approval gates, and traceable purchase orders',
    },
    analytics: {
      title: 'Analytics & Experimental Validation',
      subtitle: 'System throughput, counting accuracy benchmarks, and latency evaluation',
    },
    edge: {
      title: 'Edge Compute Nodes',
      subtitle: 'Distributed shelf camera nodes, INT8 quantized models, and fault-tolerance',
    },
    about: {
      title: 'Project Overview & Research Contributions',
      subtitle: 'MakeInSilicon symposium presentation documentation and architecture',
    },
  };

  const currentMeta = tabTitles[activeTab] || {
    title: 'Smart Procurement Shelf',
    subtitle: 'Edge-AI Inventory System',
  };

  const handleReset = () => {
    if (resetConfirm) {
      resetAllDataToDefaults();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-6 select-none">
      {/* Breadcrumbs and Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
          <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            Smart Shelf
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">{currentMeta.title}</span>
        </div>
      </div>

      {/* Right Controls: Edge Status, Actions, Notifications */}
      <div className="flex items-center space-x-3">
        {/* Live Edge Telemetry Pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono font-medium text-slate-700">EDGE-NODE-01</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-slate-500">{currentFps} FPS</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {onlineNodes}/3 Online
          </span>
        </div>

        {/* Reset State button */}
        <button
          onClick={handleReset}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            resetConfirm
              ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          title="Reset all demo data to baseline seed state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetConfirm ? 'Confirm Reset?' : 'Reset Demo'}</span>
        </button>

        {/* Launch Demo Primary CTA */}
        <button
          onClick={openDemoModal}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Demo</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Active Alerts ({activeAlerts.length})</span>
                <button
                  onClick={() => {
                    setActiveTab('alerts');
                    setShowNotifications(false);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 text-[11px] font-medium"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-1">
                {activeAlerts.length === 0 ? (
                  <div className="py-4 text-center text-slate-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    <span>No unresolved inventory alerts</span>
                  </div>
                ) : (
                  activeAlerts.map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setActiveTab('alerts');
                        setShowNotifications(false);
                      }}
                      className="py-2.5 px-1 hover:bg-slate-50 cursor-pointer rounded transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 truncate pr-2">
                          {alert.productName}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Stock: <span className="font-bold text-rose-600">{alert.currentStock}</span> / Min: {alert.minThreshold} units
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{alert.shelfZone}</span>
                        <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
