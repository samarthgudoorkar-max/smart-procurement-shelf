import React from 'react';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Boxes,
  Eye,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GuidedDemoModal: React.FC = () => {
  const {
    isDemoModalOpen,
    closeDemoModal,
    demoStep,
    setDemoStep,
    advanceDemoStep,
    resetDemoScenario,
    products,
    alerts,
    procurementRequests,
    setActiveTab
  } = useApp();

  if (!isDemoModalOpen) return null;

  const dht22 = products.find(p => p.id === 'SKU-DHT22-01') || products[0];
  const dhtAlert = alerts.find(a => a.productId === 'SKU-DHT22-01' && a.status === 'ACTIVE');
  const dhtPR = procurementRequests.find(pr => pr.productId === 'SKU-DHT22-01');

  const steps = [
    {
      step: 1,
      title: 'Baseline State: 12 Sensor Modules in Zone A1',
      description: 'The smart shelf is initialized with 12 units of DHT22 Temperature & Humidity Sensors. Minimum safety threshold is set to 6 units. All stock levels are confirmed and healthy.',
      targetView: 'monitoring',
      badgeText: 'Initial State',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      actionLabel: 'Simulate Removal of 8 Modules',
      details: `Current Confirmed Stock: ${dht22.confirmedStock} Units • Threshold: ${dht22.minThreshold} Units`,
    },
    {
      step: 2,
      title: 'Simulate Physical Removal of 8 Items',
      description: 'A lab researcher or automated cart removes 8 physical sensor modules from Shelf Zone A1. The camera observes an instantaneous drop in occupied shelf slots.',
      targetView: 'monitoring',
      badgeText: 'Action Triggered',
      badgeColor: 'bg-amber-100 text-amber-800',
      actionLabel: 'Observe Raw Optical Detection',
      details: '8 items visually removed from shelf slot grid.',
    },
    {
      step: 3,
      title: 'Edge AI Observes Potential Decrease to 4 Units',
      description: 'The on-device YOLOv8s neural network detects 4 visible bounding boxes on Shelf A1 with 96.4% confidence. However, the system does not prematurely change inventory.',
      targetView: 'monitoring',
      badgeText: 'Raw Inferences',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      actionLabel: 'Run Multi-Frame Validation',
      details: 'Observed Count: 4 • Status: Unconfirmed Candidate Change',
    },
    {
      step: 4,
      title: 'Multi-Frame Consensus Confirms 4 Units',
      description: 'The temporal validator tracks the count across 5 consecutive invariant frames (Frame 1/5 -> 5/5). Once temporal stability is guaranteed, confirmed stock is safely locked to 4 units.',
      targetView: 'monitoring',
      badgeText: 'Temporal Lock',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      actionLabel: 'Trigger Threshold Evaluation',
      details: 'Confirmed Stock Updated: 12 -> 4 Units (5/5 Consensus)',
    },
    {
      step: 5,
      title: 'Safety Buffer Breached: Low-Stock Alert Created',
      description: 'Confirmed count (4 units) is strictly lower than the minimum buffer threshold (6 units). The alert engine immediately creates a high-priority low-stock notification.',
      targetView: 'alerts',
      badgeText: 'Rule Engine',
      badgeColor: 'bg-rose-100 text-rose-800',
      actionLabel: 'Inspect Auto-Drafted PR',
      details: dhtAlert ? `Alert ${dhtAlert.id} Active • Severity: CRITICAL` : 'Threshold Alert Generated',
    },
    {
      step: 6,
      title: 'Autonomous Draft Procurement Generated (10 Units)',
      description: 'The system automatically drafts purchase request PR-2024-xxx for 10 units ($45.00 total) to replenish buffer stock back to the target allocation of 20 units.',
      targetView: 'procurement',
      badgeText: 'Auto-Procure',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      actionLabel: 'Review & Approve Request as Manager',
      details: dhtPR ? `${dhtPR.id} • ${dhtPR.reorderQuantity} Units • Total: $${dhtPR.totalCost.toFixed(2)}` : 'Draft PR Generated',
    },
    {
      step: 7,
      title: 'Managerial Human-in-the-Loop Approval',
      description: 'Lab Manager or Procurement Officer reviews the auto-drafted order, validates distributor terms, and signs off. A formal Purchase Order (PO) number is minted.',
      targetView: 'procurement',
      badgeText: 'Governance Sign-Off',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      actionLabel: 'View Dashboard & Audit Ledger',
      details: dhtPR?.status === 'APPROVED' ? `Purchase Order Dispatched: ${dhtPR.poNumber}` : 'Pending 1-Click Approval',
    },
    {
      step: 8,
      title: 'End-to-End Loop Closed: Audit Dossier Verified',
      description: 'The operations dashboard reflects the approved procurement pipeline and the tamper-evident audit ledger contains a permanent record of every frame validation and sign-off.',
      targetView: 'dashboard',
      badgeText: 'Complete',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      actionLabel: 'Restart Demonstration',
      details: 'Audit trail verified • Full intelligence-to-procurement journey validated for judges.',
    },
  ];

  const currentStepData = steps[demoStep - 1] || steps[0];

  const handleExecuteStep = () => {
    setActiveTab(currentStepData.targetView);
    if (demoStep === 8) {
      resetDemoScenario();
    } else {
      advanceDemoStep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">MakeInSilicon Live Presentation Demo</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                  Step {demoStep} of 8
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous Edge-AI to Accountable Procurement Pipeline</p>
            </div>
          </div>
          <button onClick={closeDemoModal} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between">
            {steps.map(s => (
              <div
                key={s.step}
                onClick={() => {
                  setDemoStep(s.step);
                  setActiveTab(s.targetView);
                }}
                className={`flex flex-col items-center cursor-pointer group`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s.step < demoStep
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : s.step === demoStep
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-sm'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}
                >
                  {s.step < demoStep ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1 hidden sm:block">
                  S{s.step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Step Content */}
        <div className="p-6 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded ${currentStepData.badgeColor}`}
            >
              {currentStepData.badgeText}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Auto-navigates to: <strong className="text-slate-700 capitalize">{currentStepData.targetView}</strong>
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 leading-snug">
            {currentStepData.title}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {currentStepData.description}
          </p>

          <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs font-mono text-indigo-900 flex items-center justify-between">
            <span className="text-slate-500">Live State Context:</span>
            <strong className="text-indigo-900">{currentStepData.details}</strong>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={resetDemoScenario}
            className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 text-xs font-medium transition-colors flex items-center space-x-1.5"
            title="Reset to 12 items baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scenario</span>
          </button>

          <div className="flex items-center space-x-2">
            {demoStep > 1 && (
              <button
                onClick={() => setDemoStep(demoStep - 1)}
                className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 text-xs font-medium transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleExecuteStep}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-2"
            >
              <span>{currentStepData.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
