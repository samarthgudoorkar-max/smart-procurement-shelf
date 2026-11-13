import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Play,
  Pause,
  MinusCircle,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Video,
  Monitor,
  Crosshair,
  Sliders,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const LiveShelfMonitoring: React.FC = () => {
  const {
    products,
    isMonitoringActive,
    toggleMonitoring,
    monitoringMode,
    setMonitoringMode,
    currentObservedCount,
    stabilityFramesCount,
    maxStabilityFrames,
    isCountValidating,
    validationStatusText,
    currentFps,
    simulatedItemRemoval,
    simulatedItemRestock,
    detectionEvents,
    setActiveTab,
    alerts
  } = useApp();

  const dht22 = products.find(p => p.id === 'SKU-DHT22-01') || products[0];
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  // Active alert for DHT22
  const dhtAlert = alerts.find(a => a.productId === 'SKU-DHT22-01' && a.status === 'ACTIVE');

  // Handle webcam toggle
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (monitoringMode === 'CAMERA') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 1280, height: 720 } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
          setWebcamActive(true);
          setCameraError(null);
        })
        .catch(err => {
          console.warn('Webcam access error:', err);
          setCameraError('Camera access denied or unavailable. Fallback to Simulated Feed.');
          setWebcamActive(false);
          setMonitoringMode('DEMO');
        });
    } else {
      setWebcamActive(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [monitoringMode, setMonitoringMode]);

  // Compute stability percentage
  const stabilityPercent = Math.round((stabilityFramesCount / maxStabilityFrames) * 100);

  // Generate bounding box items for Zone A1 (DHT22 modules)
  // Max capacity 12 items on shelf A1
  const shelfSlots = Array.from({ length: 12 }).map((_, i) => {
    const isPresent = i < currentObservedCount;
    // Shelf row 0 or 1
    const row = Math.floor(i / 6);
    const col = i % 6;
    const x = 12 + col * 14.5; // percentage
    const y = 24 + row * 34; // percentage
    return {
      index: i + 1,
      isPresent,
      x,
      y,
      conf: (0.95 + (i % 5) * 0.009).toFixed(3),
    };
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Controls & Status Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-card">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-indigo-400 flex items-center justify-center border border-slate-800">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">Edge Optical Inspection Stream</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE (EDGE-NODE-01)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Zone A1: Sensor Module Rack • YOLOv8s INT8 TensorRT Engine
            </p>
          </div>
        </div>

        {/* Mode & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Feed Mode Switcher */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setMonitoringMode('DEMO')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center space-x-1.5 ${
                monitoringMode === 'DEMO'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Simulated Feed</span>
            </button>
            <button
              onClick={() => setMonitoringMode('CAMERA')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center space-x-1.5 ${
                monitoringMode === 'CAMERA'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Preview</span>
            </button>
          </div>

          {/* Pause / Resume button */}
          <button
            onClick={toggleMonitoring}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              isMonitoringActive
                ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                : 'border-amber-300 bg-amber-50 text-amber-800'
            }`}
          >
            {isMonitoringActive ? (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-500" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-600 fill-current" />
                <span>Resume Feed</span>
              </>
            )}
          </button>

          {/* Toggle Overlays */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              showOverlays
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Overlays</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{cameraError}</span>
          </div>
          <button
            onClick={() => setCameraError(null)}
            className="text-amber-900 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Monitoring Workspace: Video Viewport (Left) + Validation Pipeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Viewport (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-[#0F172A] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-4 select-none">
            {/* Background Grid Pattern (Industrial Optical Sensor HUD) */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Video Element for Webcam Mode */}
            {monitoringMode === 'CAMERA' && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            )}

            {/* Simulated Shelf Rack Surface in Demo Mode */}
            {monitoringMode === 'DEMO' && (
              <div className="absolute inset-0 flex flex-col justify-around p-6 pointer-events-none">
                {/* Shelf Tier 1 */}
                <div className="w-full h-32 border-b-2 border-slate-700/60 relative flex items-end pb-3">
                  <span className="absolute left-2 top-1 text-[9px] font-mono text-slate-500 tracking-wider">
                    SHELF A1 — UPPER TIER (SLOTS 1-6)
                  </span>
                </div>
                {/* Shelf Tier 2 */}
                <div className="w-full h-32 border-b-2 border-slate-700/60 relative flex items-end pb-3">
                  <span className="absolute left-2 top-1 text-[9px] font-mono text-slate-500 tracking-wider">
                    SHELF A1 — LOWER TIER (SLOTS 7-12)
                  </span>
                </div>
              </div>
            )}

            {/* HUD Header Bar */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 font-mono">
              <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 px-2.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-white font-semibold">REC // LIVE FEED</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">1920x1080@30</span>
              </div>

              <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 px-2.5 py-1 rounded-md">
                <span>FPS: <strong className="text-emerald-400">{currentFps}</strong></span>
                <span className="text-slate-500">|</span>
                <span>LATENCY: <strong className="text-indigo-300">18.4ms</strong></span>
                <span className="text-slate-500">|</span>
                <span>TEMP: <strong className="text-slate-300">44.2°C</strong></span>
              </div>
            </div>

            {/* Bounding Boxes Overlays (Interactive Objects on Shelf) */}
            {showOverlays && (
              <div className="absolute inset-0 pointer-events-none">
                {shelfSlots.map(slot => {
                  if (!slot.isPresent) {
                    // Render Empty Slot Indicator
                    return (
                      <div
                        key={slot.index}
                        className="absolute border border-dashed border-slate-700/60 rounded bg-slate-900/20 flex flex-col items-center justify-center transition-all duration-500"
                        style={{
                          left: `${slot.x}%`,
                          top: `${slot.y}%`,
                          width: '11%',
                          height: '24%',
                        }}
                      >
                        <span className="text-[9px] font-mono text-slate-600">Empty</span>
                        <span className="text-[8px] font-mono text-slate-700">#{slot.index}</span>
                      </div>
                    );
                  }

                  // Render Detected Item with Bounding Box
                  return (
                    <div
                      key={slot.index}
                      className="absolute border border-indigo-400/90 bg-indigo-500/10 rounded transition-all duration-300 flex flex-col justify-between p-1 shadow-sm"
                      style={{
                        left: `${slot.x}%`,
                        top: `${slot.y}%`,
                        width: '11%',
                        height: '24%',
                      }}
                    >
                      {/* Corner Accents */}
                      <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-cyan-400"></span>
                      <span className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-400"></span>
                      <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-cyan-400"></span>
                      <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-cyan-400"></span>

                      {/* Header Tag with Confidence */}
                      <div className="bg-indigo-600/90 text-white font-mono text-[8px] px-1 py-0.5 rounded -mt-2.5 -ml-1 w-max shadow flex items-center gap-1">
                        <span>DHT22</span>
                        <span className="text-cyan-200">{Math.round(Number(slot.conf) * 100)}%</span>
                      </div>

                      {/* Micro Visual representation of sensor */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-8 h-8 rounded border border-cyan-500/40 bg-slate-900/70 flex flex-col items-center justify-center text-[7px] font-mono text-cyan-300">
                          <span>SNS</span>
                          <span className="text-[6px] text-slate-400">#{slot.index}</span>
                        </div>
                      </div>

                      <div className="text-[7px] font-mono text-slate-400 text-right">
                        Z-A1
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Optical Camera Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <Crosshair className="w-16 h-16 text-indigo-400 stroke-1" />
            </div>

            {/* Bottom HUD Bar */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-300 font-mono bg-slate-900/90 backdrop-blur-sm border border-slate-700/80 p-2.5 rounded-lg gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-slate-400">TARGET:</span>
                <span className="text-white font-bold">{dht22.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">CONFIRMED:</span>
                <span className="text-emerald-400 font-bold text-sm">{dht22.confirmedStock}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-400">FRAME DETECTIONS:</span>
                <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                  currentObservedCount < dht22.minThreshold ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {currentObservedCount} Units Observed
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls Bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Physical Interaction Simulator
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate physical inventory changes to test real-time multi-frame validation and auto-procurement triggers
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={simulatedItemRemoval}
                disabled={isCountValidating || currentObservedCount < 8}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm ${
                  isCountValidating || currentObservedCount < 8
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                <MinusCircle className="w-4 h-4" />
                <span>Simulate Item Removal (-8 DHT22)</span>
              </button>

              <button
                onClick={simulatedItemRestock}
                disabled={isCountValidating || currentObservedCount > 10}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all border shadow-sm ${
                  isCountValidating || currentObservedCount > 10
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simulate Restock (+8 DHT22)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Validation Pipeline & Detection Log Panel (1 Col) */}
        <div className="space-y-4">
          {/* Frame Validation Stability Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Multi-Frame Temporal Consensus
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                N = {maxStabilityFrames} Frames
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              To prevent false alarms caused by transient occlusion or hand motion, Edge-AI mandates{' '}
              <strong className="text-slate-800 font-medium">5 consecutive invariant frame observations</strong> before updating confirmed inventory.
            </p>

            {/* Validation Meter */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 font-medium">{validationStatusText}</span>
                <span className="font-bold text-indigo-700">{stabilityFramesCount}/{maxStabilityFrames}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    stabilityPercent === 100
                      ? 'bg-emerald-500'
                      : 'bg-indigo-600 animate-pulse'
                  }`}
                  style={{ width: `${stabilityPercent}%` }}
                />
              </div>
            </div>

            {/* Status Feedback Box */}
            <div className={`p-3 rounded-lg border text-xs space-y-1 ${
              dht22.confirmedStock < dht22.minThreshold
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  {dht22.confirmedStock < dht22.minThreshold ? (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {dht22.confirmedStock < dht22.minThreshold ? 'Low-Stock Condition Active' : 'Nominal Stock Level'}
                </span>
                <span className="font-mono text-xs">{dht22.confirmedStock} / Min: {dht22.minThreshold}</span>
              </div>
              <p className="text-[11px] opacity-90">
                {dht22.confirmedStock < dht22.minThreshold
                  ? 'Confirmed count breached safety threshold. Automated draft purchase request initiated.'
                  : 'Sufficient buffer margin. No reorder required.'}
              </p>
            </div>

            {dhtAlert && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Alert: {dhtAlert.id}</span>
                <button
                  onClick={() => setActiveTab('procurement')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Review Procurement Draft →
                </button>
              </div>
            )}
          </div>

          {/* Real-Time Detection Log Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card flex flex-col h-[340px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Inference Telemetry Stream
                </span>
              </div>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {showRawJson ? 'Standard View' : 'JSON Feed'}
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-2 bg-slate-900 text-slate-300 rounded-b-xl">
              {detectionEvents.map((evt, idx) => (
                <div
                  key={evt.id + idx}
                  className="p-2 rounded bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-indigo-300 font-semibold">{evt.shelfZone}</span>
                    <span>{new Date(evt.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>

                  {showRawJson ? (
                    <pre className="text-[9px] text-slate-300 mt-1 overflow-x-auto">
                      {JSON.stringify({
                        id: evt.id,
                        detected: evt.detectedCount,
                        confirmed: evt.confirmedCount,
                        conf: evt.confidence,
                        status: evt.validationStatus,
                      }, null, 2)}
                    </pre>
                  ) : (
                    <div className="mt-1 space-y-0.5 text-slate-300 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium truncate max-w-[170px]">{evt.productName}</span>
                        <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                          evt.validationStatus === 'CONFIRMED' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'
                        }`}>
                          {evt.validationStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Count: <strong className="text-white">{evt.detectedCount}</strong> units</span>
                        <span>{(evt.confidence * 100).toFixed(1)}% conf</span>
                        <span className="text-slate-500">{evt.latencyMs}ms</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
