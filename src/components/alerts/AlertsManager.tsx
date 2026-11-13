import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Filter,
  Check,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { AlertSeverity, AlertStatus } from '../../types';

export const AlertsManager: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    setActiveTab,
    setSelectedRequest,
    procurementRequests
  } = useApp();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');

  // Filtered alerts
  const filteredAlerts = alerts.filter(a => {
    const matchesSev = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesStat = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSev && matchesStat;
  });

  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING' && a.status === 'ACTIVE').length;

  const handleOpenProcurement = (linkedId?: string) => {
    if (linkedId) {
      const pr = procurementRequests.find(r => r.id === linkedId);
      if (pr) setSelectedRequest(pr);
    }
    setActiveTab('procurement');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Active Alerts
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{activeCount}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Threshold breaches detected by AI</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Critical Shortages
            </span>
            <div className="text-2xl font-bold font-mono text-rose-600 mt-1">{criticalCount}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Stock &le; 50% safety buffer</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Warning Level
            </span>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{warningCount}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Stock below threshold &gt; 50%</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-card">
        {/* Status Tabs */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all ${
              statusFilter === 'ACTIVE'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('RESOLVED')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all ${
              statusFilter === 'RESOLVED'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resolved ({alerts.filter(a => a.status === 'RESOLVED').length})
          </button>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Severity:</span>
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="WARNING">Warning Only</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-card">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900">No matching inventory alerts</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All physical stock counts verified by Edge-AI are within safe operational thresholds.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-5 shadow-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                alert.status === 'ACTIVE'
                  ? alert.severity === 'CRITICAL'
                    ? 'border-rose-300 ring-1 ring-rose-200/50'
                    : 'border-amber-300'
                  : 'border-slate-200 opacity-75'
              }`}
            >
              {/* Alert Content */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold text-slate-700">{alert.id}</span>
                  <StatusBadge status={alert.severity} size="sm" />
                  <StatusBadge status={alert.status} size="sm" />
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{alert.productName}</span>
                    <span className="text-xs font-mono font-normal text-slate-500">
                      ({alert.shelfZone})
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">{alert.reason}</p>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono pt-1">
                  <span className="text-slate-500">
                    Confirmed Stock: <strong className="text-rose-600 font-bold">{alert.currentStock}</strong> units
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">
                    Required Minimum: <strong className="text-slate-800">{alert.minThreshold}</strong> units
                  </span>
                  {alert.linkedRequestId && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="text-indigo-600 font-semibold">
                        Linked PR: {alert.linkedRequestId}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 self-end md:self-center">
                {alert.linkedRequestId && (
                  <button
                    onClick={() => handleOpenProcurement(alert.linkedRequestId)}
                    className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
                  >
                    <span>Procurement Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {alert.status === 'ACTIVE' && (
                  <>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium transition-colors flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
