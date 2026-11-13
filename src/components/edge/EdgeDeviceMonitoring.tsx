import React from 'react';
import {
  Cpu,
  Wifi,
  WifiOff,
  Video,
  Activity,
  HardDrive,
  RefreshCw,
  Power,
  ShieldCheck,
  AlertTriangle,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const EdgeDeviceMonitoring: React.FC = () => {
  const {
    edgeDevices,
    toggleDeviceOnline,
    simulateNetworkDrop,
    simulateReconnectAndSync,
    currentFps
  } = useApp();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Edge Compute Architectural Overview Callout */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card space-y-3">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold">
            DISTRIBUTED EDGE ARCHITECTURE
          </span>
          <span className="text-xs text-slate-400 font-mono">Zero-Cloud Computer Vision</span>
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Autonomous On-Device Inference with Upstream State Synchronization
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          High-frequency raw camera frames (1080p @ 30 FPS) are processed entirely within the local Edge hardware accelerator (NVIDIA Jetson / Hailo-8 NPU). No video feeds or uncompressed image data are transmitted across external networks. The dashboard server receives only verified discrete inventory state transitions and signed cryptographic telemetry.
        </p>
      </div>

      {/* Edge Device Node Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {edgeDevices.map(device => {
          const isOnline = device.status === 'ONLINE';
          const isDisconnected = device.bufferedEventsCount > 0;

          return (
            <div
              key={device.id}
              className={`bg-white rounded-xl border shadow-card transition-all flex flex-col justify-between overflow-hidden ${
                isOnline ? 'border-slate-200' : 'border-rose-300 ring-1 ring-rose-200/50'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{device.id}</span>
                    <StatusBadge status={device.status} size="sm" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{device.ipAddress}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mt-2">{device.name}</h4>
                <p className="text-xs text-slate-500 font-mono">{device.shelfZone}</p>
              </div>

              {/* Hardware Telemetry Specs */}
              <div className="p-5 space-y-3.5 text-xs">
                {/* Accelerator Chip */}
                <div className="flex items-start justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    Accelerator:
                  </span>
                  <span className="font-medium text-slate-800 text-right max-w-[170px]">
                    {device.accelerator}
                  </span>
                </div>

                {/* Model */}
                <div className="flex items-start justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    Model:
                  </span>
                  <span className="font-mono text-[11px] text-slate-700 font-semibold text-right">
                    {device.modelName}
                  </span>
                </div>

                {/* Camera Sensor */}
                <div className="flex items-start justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    Camera:
                  </span>
                  <span className="text-slate-700 text-right">{device.cameraModel}</span>
                </div>

                {/* Real-time Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">FPS</span>
                    <span className="font-mono font-bold text-slate-800">
                      {isOnline ? currentFps : 0} FPS
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Latency</span>
                    <span className="font-mono font-bold text-slate-800">
                      {isOnline ? `${device.latencyMs} ms` : '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Core Temp</span>
                    <span className="font-mono font-bold text-slate-800">
                      {isOnline ? `${device.cpuTemp} °C` : '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Memory</span>
                    <span className="font-mono font-bold text-slate-800">
                      {isOnline ? `${device.memoryUsageMb} MB` : '—'}
                    </span>
                  </div>
                </div>

                {/* Buffer State notice */}
                {isDisconnected && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-0.5">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Local Edge Buffering Active
                    </span>
                    <p>
                      {device.bufferedEventsCount} detection frames held in local NVMe ring buffer. Detections will flush upon reconnection.
                    </p>
                  </div>
                )}
              </div>

              {/* Interactive Resiliency Controls */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
                {isDisconnected ? (
                  <button
                    onClick={() => simulateReconnectAndSync(device.id)}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reconnect & Flush Buffer</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => simulateNetworkDrop(device.id)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors flex items-center justify-center space-x-1"
                      title="Simulate upstream network partition"
                    >
                      <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sever Link</span>
                    </button>
                    <button
                      onClick={() => toggleDeviceOnline(device.id)}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium text-xs transition-colors flex items-center justify-center space-x-1 ${
                        isOnline
                          ? 'border border-rose-200 hover:bg-rose-50 text-rose-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isOnline ? 'Shut Down' : 'Boot Node'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
