import React from 'react';
import {
  Boxes,
  MapPin,
  AlertTriangle,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Cpu,
  ArrowRight,
  CheckCircle,
  ScanEye,
  ShieldCheck,
  Sparkles,
  ExternalLink
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
import { StatusBadge } from '../common/StatusBadge';

export const DashboardView: React.FC = () => {
  const {
    products,
    alerts,
    procurementRequests,
    edgeDevices,
    detectionEvents,
    setActiveTab,
    openDemoModal,
    approveProcurementRequest
  } = useApp();

  // Metrics derivation
  const totalUnits = products.reduce((acc, p) => acc + p.confirmedStock, 0);
  const activeZones = Array.from(new Set(products.map(p => p.shelfZone))).length;
  const lowStockCount = products.filter(p => p.status === 'LOW_STOCK' || p.status === 'CRITICAL').length;
  const pendingRequests = procurementRequests.filter(
    pr => pr.status === 'DRAFT' || pr.status === 'UNDER_REVIEW'
  );
  const pendingRequestsTotalValue = pendingRequests.reduce((acc, pr) => acc + pr.totalCost, 0);

  // Category distribution data
  const categoryMap: Record<string, number> = {};
  products.forEach(p => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + p.confirmedStock;
  });
  const categoryData = Object.keys(categoryMap).map(category => ({
    name: category,
    units: categoryMap[category],
  }));

  // Historical 7-day movement trend data (realistic seed)
  const movementTrendData = [
    { day: 'Mon', consumption: 18, restock: 0, verifiedStock: 182 },
    { day: 'Tue', consumption: 24, restock: 15, verifiedStock: 173 },
    { day: 'Wed', consumption: 14, restock: 0, verifiedStock: 159 },
    { day: 'Thu', consumption: 31, restock: 25, verifiedStock: 153 },
    { day: 'Fri', consumption: 20, restock: 0, verifiedStock: 133 },
    { day: 'Sat', consumption: 8, restock: 10, verifiedStock: 135 },
    { day: 'Today', consumption: 12, restock: 0, verifiedStock: totalUnits },
  ];

  // Distinct Shelf Zones for health overview
  const shelfZones = [
    { zone: 'Zone A1', label: 'Sensors Bay', node: 'EDGE-NODE-01', item: 'DHT22 Sensors', status: products.find(p => p.shelfZone === 'Zone A1')?.status || 'IN_STOCK' },
    { zone: 'Zone A2', label: 'MCU Main', node: 'EDGE-NODE-01', item: 'Arduino UNO Rev3', status: products.find(p => p.shelfZone === 'Zone A2')?.status || 'IN_STOCK' },
    { zone: 'Zone A3', label: 'Wireless MCU', node: 'EDGE-NODE-01', item: 'ESP32 Modules', status: products.find(p => p.shelfZone === 'Zone A3')?.status || 'IN_STOCK' },
    { zone: 'Zone A4', label: 'Optics & OLED', node: 'EDGE-NODE-01', item: 'I2C OLED Displays', status: products.find(p => p.shelfZone === 'Zone A4')?.status || 'IN_STOCK' },
    { zone: 'Zone B1', label: 'SBC Compute', node: 'EDGE-NODE-02', item: 'Raspberry Pi 4', status: products.find(p => p.shelfZone === 'Zone B1')?.status || 'IN_STOCK' },
    { zone: 'Zone B2', label: 'Acoustics', node: 'EDGE-NODE-02', item: 'HC-SR04 Ultrasonic', status: products.find(p => p.shelfZone === 'Zone B2')?.status || 'LOW_STOCK' },
    { zone: 'Zone B3', label: 'Cabling Bay', node: 'EDGE-NODE-02', item: 'Braided USB-C Cables', status: products.find(p => p.shelfZone === 'Zone B3')?.status || 'IN_STOCK' },
    { zone: 'Zone C1', label: 'High-Value Flash', node: 'EDGE-NODE-03', item: 'MicroSD 32GB', status: products.find(p => p.shelfZone === 'Zone C1')?.status || 'CRITICAL' },
  ];

  const COLORS = ['#4F46E5', '#06B6D4', '#6366F1', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Presentation Demo Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 border border-slate-700/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>MakeInSilicon '26 Symposium Demonstration</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Smart Procurement Shelf — Research Prototype
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            Experience the automated pipeline: camera-based edge observation, multi-frame count validation, threshold checking, and draft procurement generation without human intervention.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('monitoring')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-600 transition-colors flex items-center justify-center space-x-2"
          >
            <ScanEye className="w-4 h-4 text-indigo-400" />
            <span>Open AI Camera View</span>
          </button>
          <button
            onClick={openDemoModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <span>Launch 8-Step Walkthrough</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {/* Subtle decorative background accent */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Inventory Units */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Confirmed Units
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">{totalUnits}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              100% verified
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 10 registered catalog SKUs</p>
        </div>

        {/* Active Shelf Zones */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Active Shelf Zones
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">{activeZones} / 10</span>
            <span className="text-xs font-medium text-slate-600">80% Occupancy</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Monitored by 3 local Edge Nodes</p>
        </div>

        {/* Low-Stock Products */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Low-Stock SKUs
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono ${lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {lowStockCount}
            </span>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
            >
              <span>View Alerts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {lowStockCount > 0 ? 'Breached minimum safety thresholds' : 'All buffer stocks optimal'}
          </p>
        </div>

        {/* Pending Procurement Requests */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {pendingRequests.length}
            </span>
            <span className="text-xs font-medium text-slate-700 font-mono">
              ${pendingRequestsTotalValue.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Auto-drafted purchase orders awaiting sign-off</p>
        </div>
      </div>

      {/* Analytics & Distribution Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Movement Over Time (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Stock Velocity & Movement History</h3>
              <p className="text-xs text-slate-500">7-day verified inventory levels and physical consumption</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Confirmed Stock
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Consumption
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={movementTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="verifiedStock"
                  name="Verified Stock"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorStock)"
                />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  name="Items Consumed"
                  stroke="#EF4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorCons)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (1 Column) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Inventory by Category</h3>
            <p className="text-xs text-slate-500 mb-4">Stock proportion across lab components</p>
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="units"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5 pt-3 border-t border-slate-100 max-h-32 overflow-y-auto">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 truncate max-w-[130px]">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></span>
                  {cat.name}
                </span>
                <span className="font-mono font-medium text-slate-800">{cat.units} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shelf Health & Zone Status Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>Physical Shelf Zone Health Matrix</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                8 Zones Monitored
              </span>
            </h3>
            <p className="text-xs text-slate-500">Live optical inspection status and stock condition across racks</p>
          </div>
          <button
            onClick={() => setActiveTab('monitoring')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Live Camera Feed</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {shelfZones.map(sz => (
            <div
              key={sz.zone}
              onClick={() => setActiveTab('monitoring')}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-800">{sz.zone}</span>
                <span className={`w-2 h-2 rounded-full ${
                  sz.status === 'CRITICAL' ? 'bg-rose-500 animate-ping' :
                  sz.status === 'LOW_STOCK' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
              </div>
              <div className="text-xs font-medium text-slate-700 truncate">{sz.item}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                <span>{sz.node.split('-')[2]}</span>
                <span className="text-slate-500 group-hover:text-indigo-600 transition-colors">
                  {sz.status === 'CRITICAL' ? 'Critical' : sz.status === 'LOW_STOCK' ? 'Low Stock' : 'Nominal'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Row: Recent Detection Events & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Detection Events */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span>Recent Detection Events</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h3>
              <p className="text-xs text-slate-500">Streamed frame-by-frame edge inferences</p>
            </div>
            <button
              onClick={() => setActiveTab('monitoring')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View Feed
            </button>
          </div>

          <div className="space-y-3">
            {detectionEvents.slice(0, 4).map(evt => (
              <div
                key={evt.id}
                className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5 max-w-[260px]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-800">{evt.shelfZone}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-700 truncate">{evt.productName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                    <span>Count: <strong className="text-slate-700 font-mono">{evt.detectedCount}</strong> units</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-600">{(evt.confidence * 100).toFixed(1)}% conf</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{evt.latencyMs}ms</span>
                  </div>
                </div>
                <div>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      evt.validationStatus === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {evt.validationStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Purchase Approvals (Actionable) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Pending Purchase Approvals</h3>
              <p className="text-xs text-slate-500">Autonomous draft requests requiring human sign-off</p>
            </div>
            <button
              onClick={() => setActiveTab('procurement')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Full Workspace
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>All procurement orders are reviewed and approved.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map(req => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-indigo-700">{req.id}</span>
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-[10px] font-bold text-rose-600 uppercase">
                        {req.priority}
                      </span>
                    </div>
                    <div className="font-medium text-slate-800">{req.productName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Order: <strong className="text-slate-800">{req.reorderQuantity}</strong> units • Total: <strong>${req.totalCost.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() => approveProcurementRequest(req.id, '1-Click approved via Operations Dashboard.')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setActiveTab('procurement')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
