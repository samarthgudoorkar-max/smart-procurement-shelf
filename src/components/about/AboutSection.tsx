import React from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  ShoppingCart,
  Award,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Code2,
  Terminal,
  Activity
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const contributions = [
    {
      id: '01',
      title: 'Local Edge Intelligence',
      badge: 'Edge Neural Inference',
      icon: Cpu,
      description:
        'Executing quantized computer vision models (YOLOv8s INT8 / MobileNetV4) directly on low-power edge compute modules (NVIDIA Jetson / Hailo-8 NPU) at 30 FPS. Raw optical camera frames are processed locally without cloud video transmission, ensuring enterprise privacy, zero recurring bandwidth fees, and sub-20ms inference latency.',
    },
    {
      id: '02',
      title: 'Inventory-to-Action Integration',
      badge: 'Autonomous Pipeline',
      icon: ShoppingCart,
      description:
        'Bridging the critical gap between visual stock observation and business procurement workflows. When confirmed inventory breaches safety thresholds, the system autonomously calculates supplier pack sizes, formulates draft purchase requests, and routes them to designated approvers rather than passively displaying alerts.',
    },
    {
      id: '03',
      title: 'Confidence-Aware Stock Validation',
      badge: 'Temporal Consensus Filter',
      icon: ShieldCheck,
      description:
        'Eliminating transient false alarms caused by hand motions, partial shadows, or worker re-arrangement. A deterministic N-frame temporal consensus engine mandates repeated, invariant spatial count agreement across consecutive frames before any inventory stock level is officially altered.',
    },
    {
      id: '04',
      title: 'Controlled & Traceable Procurement',
      badge: 'Human Governance & Audit',
      icon: Layers,
      description:
        'Strict human-in-the-loop managerial governance. Approval of a purchase request commits the order but strictly does not increase inventory counts. Confirmed stock increments occur exclusively upon recorded receipt and physical verification of goods, backed by a cryptographic audit trail.',
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Project Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span>MakeInSilicon Symposium — IIIT Naya Raipur</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Smart Procurement Shelf
          </h2>
          <p className="text-sm font-medium text-slate-600">
            An Edge-AI Based Smart Inventory and Procurement System
          </p>

          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            Research prototype engineered to demonstrate how local computer vision inference, multi-frame count stabilization, and automated procurement governance unite into a production-grade industrial inventory platform.
          </p>
        </div>

        {/* Project Metadata Card */}
        <div className="w-full md:w-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2 min-w-[260px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Registration ID:</span>
            <strong className="text-slate-800 font-bold">27325</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Event:</span>
            <span className="text-slate-700">MakeInSilicon '26</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Host Campus:</span>
            <span className="text-slate-700">IIIT Naya Raipur</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex flex-col gap-0.5">
            <span className="text-slate-400 text-[10px]">Authors:</span>
            <strong className="text-indigo-700 font-bold">Samarth Gudoorkar</strong>
            <strong className="text-indigo-700 font-bold">KSK Sasank</strong>
            <span className="text-slate-500 text-[10px]">Institute of Aeronautical Engineering</span>
          </div>
        </div>
      </div>

      {/* Four Core Research Contributions */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Four Core Proposed Research Contributions
          </h3>
          <p className="text-xs text-slate-500">
            Architectural tenets designed for real-world industrial and laboratory stockrooms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contributions.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-card flex flex-col justify-between hover:border-indigo-200 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono text-xs">
                        {item.id}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Status: Proposed System Architecture</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Pipeline Architecture Visual */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Complete Edge-to-Enterprise Pipeline Diagram
        </h3>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] text-center space-x-2">
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex-1">
              <span className="text-indigo-400 font-bold block">1. Optical Sensor</span>
              <span className="text-[10px] text-slate-400">1080p CSI-2 Camera</span>
            </div>
            <span className="text-slate-500">&rarr;</span>
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex-1">
              <span className="text-indigo-400 font-bold block">2. INT8 Inference</span>
              <span className="text-[10px] text-slate-400">YOLOv8s on Jetson Orin</span>
            </div>
            <span className="text-slate-500">&rarr;</span>
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex-1">
              <span className="text-indigo-400 font-bold block">3. Temporal Consensus</span>
              <span className="text-[10px] text-slate-400">5-Frame Invariance Lock</span>
            </div>
            <span className="text-slate-500">&rarr;</span>
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex-1">
              <span className="text-rose-400 font-bold block">4. Alert Engine</span>
              <span className="text-[10px] text-slate-400">Threshold Comparison</span>
            </div>
            <span className="text-slate-500">&rarr;</span>
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex-1">
              <span className="text-emerald-400 font-bold block">5. Auto-Draft PR</span>
              <span className="text-[10px] text-slate-400">Human Approval Gate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
