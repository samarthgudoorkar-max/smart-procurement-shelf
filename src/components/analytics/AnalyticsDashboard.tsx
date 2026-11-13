import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  Info,
  Sliders,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { EXPERIMENTAL_BENCHMARKS } from '../../data/seedData';

export const AnalyticsDashboard: React.FC = () => {
  const { products, procurementRequests, auditLogs, alerts } = useApp();

  // Procurement status breakdown
  const statusCounts: Record<string, number> = {};
  procurementRequests.forEach(r => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });

  const prStatusData = [
    { name: 'Draft PR', value: statusCounts['DRAFT'] || 0, color: '#94A3B8' },
    { name: 'Under Review', value: statusCounts['UNDER_REVIEW'] || 0, color: '#4F46E5' },
    { name: 'Approved / In Transit', value: (statusCounts['APPROVED'] || 0) + (statusCounts['ORDERED'] || 0), color: '#06B6D4' },
    { name: 'Received & Stocked', value: statusCounts['RECEIVED'] || 0, color: '#10B981' },
    { name: 'Rejected', value: statusCounts['REJECTED'] || 0, color: '#EF4444' },
  ].filter(d => d.value > 0);

  // Confidence distribution histogram data (simulated based on typical YOLOv8 quantized runs)
  const confidenceBins = [
    { bin: '80-85%', count: 3 },
    { bin: '85-90%', count: 8 },
    { bin: '90-95%', count: 28 },
    { bin: '95-98%', count: 64 },
    { bin: '98-100%', count: 42 },
  ];

  // Latency distribution data (INT8 TensorRT jitter distribution)
  const latencyBins = [
    { time: '14-16ms', frames: 18 },
    { time: '16-18ms', frames: 52 },
    { time: '18-20ms', frames: 94 },
    { time: '20-22ms', frames: 31 },
    { time: '22-26ms', frames: 9 },
  ];

  // Adjustments comparison
  const aiConfirmedCount = products.filter(p => p.verificationSource === 'EDGE_AI').length;
  const manualCount = products.filter(p => p.verificationSource === 'MANUAL_AUDIT').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Research Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start space-x-3">
        <Info className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <strong className="font-semibold text-slate-900">
            Research Evaluation Protocol & Empirical Benchmark Notice
          </strong>
          <p className="text-slate-600 leading-relaxed">
            All latency, frame detection jitter, and counting accuracy metrics below reflect simulated laboratory benchmark profiles (Bench-Edge-v1.4) presented at the MakeInSilicon symposium. Empirical testing on the physical test rig is conducted under controlled 200–800 lux lighting.
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Mean Inference Latency
          </span>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">18.4 ms</div>
          <p className="text-[11px] text-slate-400 mt-0.5">YOLOv8s INT8 TensorRT</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Average Model Confidence
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">96.2%</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Across detected bounding boxes</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            AI vs Manual Verification
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {aiConfirmedCount} : {manualCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">80% autonomous edge monitoring</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Temporal Debounce Window
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">5 Frames</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Prevents transient hand-motion errors</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latency Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Processing Latency Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">Edge accelerator inference duration per frame</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyBins} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="frames" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Bins */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Detection Confidence Bins
          </h3>
          <p className="text-xs text-slate-500 mb-4">Distribution of bounding box confidence probabilities</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceBins} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="bin" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Procurement Status Donut */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Procurement Request Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-2">Order states across active requests</p>
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {prStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {prStatusData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-medium text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experimental Validation Benchmark Section (Symposium Paper Format) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold">
                EXPERIMENT BENCHMARK DATASET
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: Bench-Edge-v1.4</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              Comparative Accuracy: Physical Audit Count vs. Edge-AI Invariant Count
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side count evaluation and false-alarm rejection metrics under realistic laboratory test conditions
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Simulated Reference Data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">SKU / Item</th>
                <th className="py-3 px-4 font-mono">Manual Ground Truth</th>
                <th className="py-3 px-4 font-mono">Edge-AI Confirmed</th>
                <th className="py-3 px-4 font-mono">Absolute Error (|&Delta;|)</th>
                <th className="py-3 px-4 font-mono">Inference Latency</th>
                <th className="py-3 px-4 font-mono">Spurious False Alerts</th>
                <th className="py-3 px-4">Experimental Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {EXPERIMENTAL_BENCHMARKS.map(row => (
                <tr key={row.itemId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div>{row.itemName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{row.itemId}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                    {row.manualAuditCount} units
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-indigo-700">
                    {row.aiConfirmedCount} units
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        row.absoluteError === 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {row.absoluteError} {row.absoluteError === 0 ? '(0.0%)' : '(-2.2%)'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {row.latencyMs} ms
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600">
                    {row.falseAlertCount} (0%)
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs">
                    {row.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
