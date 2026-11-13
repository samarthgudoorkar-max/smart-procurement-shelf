export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'CRITICAL';

export type ProductCategory = 
  | 'Sensors' 
  | 'Microcontrollers' 
  | 'Development Boards' 
  | 'Cables & Adapters' 
  | 'Displays' 
  | 'Power & Relays' 
  | 'Storage';

export interface ProductItem {
  id: string; // e.g. "SKU-DHT22-01"
  name: string; // e.g. "DHT22 Temperature & Humidity Sensor"
  category: ProductCategory;
  shelfZone: string; // e.g. "Zone A1"
  confirmedStock: number; // verified stable count
  observedStock: number; // raw current frame detection count
  minThreshold: number; // reorder trigger threshold
  targetStock: number; // desired stock after replenishment
  unitCost: number; // e.g. 4.50
  lastVerified: string; // ISO string
  verificationSource: 'EDGE_AI' | 'MANUAL_AUDIT';
  confidenceScore: number; // 0.0 - 1.0 (e.g. 0.96)
  status: StockStatus;
  description: string;
  manufacturer?: string;
  leadTimeDays: number;
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  shelfZone: string;
  currentStock: number;
  minThreshold: number;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  resolvedAt?: string;
  linkedRequestId?: string;
  reason: string;
}

export type ProcurementPriority = 'HIGH' | 'MEDIUM' | 'NORMAL';
export type ProcurementStatus = 
  | 'DRAFT' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'ORDERED' 
  | 'RECEIVED' 
  | 'REJECTED';

export interface ApprovalHistoryEntry {
  timestamp: string;
  action: string;
  actor: string;
  notes?: string;
}

export interface ProcurementRequest {
  id: string; // e.g. "PR-2024-001"
  productId: string;
  productName: string;
  category: ProductCategory;
  currentStock: number;
  reorderQuantity: number;
  unitCost: number;
  totalCost: number;
  priority: ProcurementPriority;
  status: ProcurementStatus;
  createdAt: string;
  supplier: string;
  poNumber?: string;
  approvalHistory: ApprovalHistoryEntry[];
  alertId?: string;
}

export interface DetectionEvent {
  id: string;
  timestamp: string;
  shelfZone: string;
  productId: string;
  productName: string;
  previousCount: number;
  detectedCount: number;
  confirmedCount: number;
  confidence: number;
  validationStatus: 'OBSERVED' | 'VALIDATING' | 'CONFIRMED' | 'FLAGGED';
  stabilityFrames: number; // e.g. 3/5
  latencyMs: number;
}

export interface EdgeDevice {
  id: string; // e.g. "EDGE-NODE-01"
  name: string;
  shelfZone: string;
  status: 'ONLINE' | 'OFFLINE' | 'SYNCING';
  ipAddress: string;
  accelerator: string; // "NVIDIA Jetson Orin Nano (40 TOPS)"
  cameraModel: string; // "Sony IMX477 12MP HDR"
  inferenceFps: number; // 29.4
  latencyMs: number; // 18.2 ms
  cpuTemp: number; // 43.8 C
  memoryUsageMb: number; // 2140 / 8192 MB
  lastSync: string;
  modelName: string; // "YOLOv8s-Quantized-INT8"
  bufferedEventsCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'EDGE_AI' | 'PROCUREMENT' | 'STOCK_ADJUSTMENT' | 'ALERT' | 'SYSTEM';
  action: string;
  details: string;
  actor: string;
  metadata?: Record<string, any>;
}

export interface ExperimentalBenchmark {
  itemId: string;
  itemName: string;
  manualAuditCount: number;
  aiConfirmedCount: number;
  absoluteError: number;
  latencyMs: number;
  falseAlertCount: number;
  notes: string;
}
