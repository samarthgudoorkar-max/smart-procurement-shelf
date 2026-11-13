import React from 'react';
import { StockStatus, AlertSeverity, AlertStatus, ProcurementStatus } from '../../types';

interface StatusBadgeProps {
  status: StockStatus | AlertSeverity | AlertStatus | ProcurementStatus | 'ONLINE' | 'OFFLINE' | 'SYNCING';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    // Stock Status
    case 'IN_STOCK':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
          In Stock
        </span>
      );
    case 'LOW_STOCK':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
          Low Stock
        </span>
      );
    case 'CRITICAL':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          Critical Shortage
        </span>
      );

    // Alert Severity
    case 'WARNING':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          Warning
        </span>
      );
    case 'INFO':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          Notice
        </span>
      );

    // Alert Status
    case 'ACTIVE':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
          Active
        </span>
      );
    case 'ACKNOWLEDGED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClasses}`}>
          Acknowledged
        </span>
      );
    case 'RESOLVED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
          Resolved
        </span>
      );

    // Procurement Status
    case 'DRAFT':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          Draft PR
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClasses}`}>
          Under Review
        </span>
      );
    case 'APPROVED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          Approved (PO Sent)
        </span>
      );
    case 'ORDERED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          In Transit
        </span>
      );
    case 'RECEIVED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          Received & Stocked
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          Rejected
        </span>
      );

    // Edge Device Status
    case 'ONLINE':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Online
        </span>
      );
    case 'OFFLINE':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
          Offline
        </span>
      );
    case 'SYNCING':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500 animate-spin"></span>
          Syncing
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 ${sizeClasses}`}>
          {String(status)}
        </span>
      );
  }
};
