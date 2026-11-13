import React, { useState } from 'react';
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  Edit3,
  PackageCheck,
  Clock,
  User,
  FileText,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Truck,
  History,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProcurementRequest, ProcurementStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const ProcurementWorkspace: React.FC = () => {
  const {
    procurementRequests,
    selectedRequest,
    setSelectedRequest,
    approveProcurementRequest,
    rejectProcurementRequest,
    modifyReorderQuantity,
    markGoodsReceived,
    auditLogs
  } = useApp();

  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'AUDIT'>('REQUESTS');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  // Form fields
  const [approvalNotes, setApprovalNotes] = useState('Approved by Lab In-Charge for batch replenishment.');
  const [customPO, setCustomPO] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('Duplicate order or budget constraints.');
  const [modifyQty, setModifyQty] = useState(10);
  const [receivedQty, setReceivedQty] = useState(10);
  const [receiveNotes, setReceiveNotes] = useState('Physical shipment inspected and verified against PO.');

  // Filter requests
  const filteredRequests = procurementRequests.filter(r => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return r.status === 'DRAFT' || r.status === 'UNDER_REVIEW';
    return r.status === statusFilter;
  });

  const pendingCount = procurementRequests.filter(
    r => r.status === 'DRAFT' || r.status === 'UNDER_REVIEW'
  ).length;

  const approvedCount = procurementRequests.filter(r => r.status === 'APPROVED' || r.status === 'ORDERED').length;
  const receivedCount = procurementRequests.filter(r => r.status === 'RECEIVED').length;

  // Handlers
  const handleOpenApprove = (req: ProcurementRequest) => {
    setSelectedRequest(req);
    setCustomPO(`PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setApprovalNotes('Approved for standard automated warehouse restock.');
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    approveProcurementRequest(selectedRequest.id, approvalNotes, customPO);
    setIsApproveModalOpen(false);
  };

  const handleOpenReject = (req: ProcurementRequest) => {
    setSelectedRequest(req);
    setRejectionNotes('Order postponed pending lab budget review.');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    rejectProcurementRequest(selectedRequest.id, rejectionNotes);
    setIsRejectModalOpen(false);
  };

  const handleOpenModify = (req: ProcurementRequest) => {
    setSelectedRequest(req);
    setModifyQty(req.reorderQuantity);
    setIsModifyModalOpen(true);
  };

  const handleConfirmModify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    modifyReorderQuantity(selectedRequest.id, Number(modifyQty));
    setIsModifyModalOpen(false);
  };

  const handleOpenReceive = (req: ProcurementRequest) => {
    setSelectedRequest(req);
    setReceivedQty(req.reorderQuantity);
    setReceiveNotes('Physical package unboxed, component counts verified against packing slip.');
    setIsReceiveModalOpen(true);
  };

  const handleConfirmReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    markGoodsReceived(selectedRequest.id, Number(receivedQty), receiveNotes);
    setIsReceiveModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Visual Procurement Pipeline Stepper */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Autonomous Procurement Workflow Pipeline</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
            Human-in-the-Loop Governance
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 01</span>
            <span className="font-bold text-slate-800 mt-1">Low-Stock Detected</span>
            <p className="text-[10px] text-slate-500 mt-0.5">5-frame verified breach</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-indigo-600 font-bold">STAGE 02</span>
            <span className="font-bold text-indigo-900 mt-1">Draft PR Generated</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Auto-calculated pack qty</p>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-indigo-700 font-bold">STAGE 03</span>
            <span className="font-bold text-indigo-950 mt-1">Managerial Sign-Off</span>
            <p className="text-[10px] text-indigo-700 mt-0.5">Approval gate with notes</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 04</span>
            <span className="font-bold text-slate-800 mt-1">PO Dispatched</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Vendor order in transit</p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-emerald-700 font-bold">STAGE 05</span>
            <span className="font-bold text-emerald-950 mt-1">Physical Receipt</span>
            <p className="text-[10px] text-emerald-700 mt-0.5">Confirmed stock increments</p>
          </div>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-card">
        {/* Workspace Views */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`px-4 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'REQUESTS'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Purchase Requests ({procurementRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-1.5 rounded-md font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'AUDIT'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Complete Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* Requests Sub-Filters */}
        {activeTab === 'REQUESTS' && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Requests ({procurementRequests.length})</option>
              <option value="PENDING">Pending Review ({pendingCount})</option>
              <option value="APPROVED">Approved / In Transit ({approvedCount})</option>
              <option value="RECEIVED">Received & Stocked ({receivedCount})</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Main View: Requests Table OR Audit Trail */}
      {activeTab === 'REQUESTS' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider select-none">
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Product / SKU</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Reorder Qty</th>
                  <th className="py-3.5 px-4">Unit / Total Cost</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status / PO</th>
                  <th className="py-3.5 px-4">Created Time</th>
                  <th className="py-3.5 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <span>No purchase requests in this status view.</span>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map(req => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-default"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                        {req.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {req.productName}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">{req.productId}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-rose-600">{req.currentStock}</span> units
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                        {req.reorderQuantity} units
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        <div>${req.totalCost.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400">(${req.unitCost.toFixed(2)}/u)</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            req.priority === 'HIGH'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={req.status} size="sm" />
                        {req.poNumber && (
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                            {req.poNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Pending Review Actions */}
                          {(req.status === 'DRAFT' || req.status === 'UNDER_REVIEW') && (
                            <>
                              <button
                                onClick={() => handleOpenApprove(req)}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors shadow-sm"
                                title="Approve Request"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleOpenModify(req)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                                title="Modify Quantity"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenReject(req)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-400 transition-colors"
                                title="Reject Request"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {/* Approved / In Transit Actions */}
                          {(req.status === 'APPROVED' || req.status === 'ORDERED') && (
                            <button
                              onClick={() => handleOpenReceive(req)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm flex items-center space-x-1"
                              title="Record Physical Receipt of Goods (Updates Stock!)"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                              <span>Record Received</span>
                            </button>
                          )}

                          {/* Completed Actions */}
                          {req.status === 'RECEIVED' && (
                            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Stock Restocked
                            </span>
                          )}

                          {req.status === 'REJECTED' && (
                            <span className="text-[11px] text-rose-500 font-medium">
                              Archived
                            </span>
                          )}

                          {/* Inspect History */}
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Inspect Audit History"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Complete System Audit Trail Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Cryptographic / Traceable Audit Ledger
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Append-only log of every Edge-AI detection, stock adjustment, threshold breach, and procurement sign-off
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">{auditLogs.length} Events Recorded</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs max-h-[550px] overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-slate-400">{log.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {log.category}
                    </span>
                    <span className="font-semibold text-slate-900">{log.action}</span>
                  </div>
                  <p className="text-slate-700">{log.details}</p>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-2 font-mono">
                    <span>Actor: <strong className="text-slate-600">{log.actor}</strong></span>
                    <span>•</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Audit History Drawer */}
      {selectedRequest && !isApproveModalOpen && !isRejectModalOpen && !isModifyModalOpen && !isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={() => setSelectedRequest(null)}
          />
          <div className="relative w-full max-w-md bg-white shadow-2xl z-10 flex flex-col h-full border-l border-slate-200">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                  Procurement Audit Dossier
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedRequest.id}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedRequest.productName}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <StatusBadge status={selectedRequest.status} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reorder Batch:</span>
                  <strong className="font-mono text-slate-800">{selectedRequest.reorderQuantity} units</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Cost:</span>
                  <strong className="font-mono text-slate-800">${selectedRequest.totalCost.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Supplier:</span>
                  <span className="text-slate-700">{selectedRequest.supplier}</span>
                </div>
                {selectedRequest.poNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Purchase Order:</span>
                    <strong className="font-mono text-indigo-700">{selectedRequest.poNumber}</strong>
                  </div>
                )}
              </div>

              {/* History Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Lifecycle Event Ledger
                </h4>
                <div className="space-y-3 border-l-2 border-slate-200 pl-4 ml-2">
                  {selectedRequest.approvalHistory.map((step, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-800 font-mono text-[11px]">{step.action}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs">{step.notes || 'Automated system checkpoint.'}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">Actor: {step.actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-xs transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {isApproveModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sign & Approve Purchase Request</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedRequest.id}</p>
              </div>
              <button onClick={() => setIsApproveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApprove} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 space-y-1">
                <span className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Accountability Notice
                </span>
                <p className="text-[11px]">
                  Approving dispatches purchase order {customPO}. Note: Inventory stock does not increase until physical goods receipt is recorded.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Generated PO Number</label>
                <input
                  type="text"
                  required
                  value={customPO}
                  onChange={e => setCustomPO(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Approval Comments & Authorization Notes</label>
                <textarea
                  rows={3}
                  value={approvalNotes}
                  onChange={e => setApprovalNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsApproveModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Authorize Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reject Purchase Request</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedRequest.id}</p>
              </div>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Rejection Rationale *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectionNotes}
                  onChange={e => setRejectionNotes(e.target.value)}
                  placeholder="Explain why this auto-drafted reorder is rejected..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modify Quantity Modal */}
      {isModifyModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Revise Reorder Batch Size</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedRequest.id}</p>
              </div>
              <button onClick={() => setIsModifyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmModify} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">New Order Quantity *</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={modifyQty}
                  onChange={e => setModifyQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 flex justify-between font-mono">
                <span>Revised Total Cost:</span>
                <strong className="text-slate-900 font-bold">
                  ${(modifyQty * selectedRequest.unitCost).toFixed(2)}
                </strong>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModifyModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Save Batch Size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Goods Received Modal */}
      {isReceiveModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Record Physical Goods Receipt</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedRequest.id}</p>
              </div>
              <button onClick={() => setIsReceiveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReceive} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <span className="font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Stock Increment Trigger
                </span>
                <p className="text-[11px]">
                  Submitting this physical verification will increment the confirmed inventory stock count for{' '}
                  <strong>{selectedRequest.productName}</strong> by +{receivedQty} units.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Physically Verified Received Count *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={receivedQty}
                  onChange={e => setReceivedQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Receiving Inspection Notes</label>
                <textarea
                  rows={2}
                  value={receiveNotes}
                  onChange={e => setReceiveNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Commit Restock to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
