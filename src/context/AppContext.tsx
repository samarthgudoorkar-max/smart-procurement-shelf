import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  ProductItem,
  StockAlert,
  ProcurementRequest,
  EdgeDevice,
  AuditLogEntry,
  DetectionEvent,
  ProductCategory,
  StockStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ALERTS,
  INITIAL_PROCUREMENT_REQUESTS,
  INITIAL_EDGE_DEVICES,
  INITIAL_AUDIT_LOGS
} from '../data/seedData';

interface AppContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Products
  products: ProductItem[];
  selectedProduct: ProductItem | null;
  setSelectedProduct: (p: ProductItem | null) => void;
  updateProductStock: (id: string, newStock: number, source: 'EDGE_AI' | 'MANUAL_AUDIT', conf?: number) => void;
  addProduct: (product: Omit<ProductItem, 'id' | 'lastVerified' | 'status' | 'observedStock'>) => void;
  editProduct: (product: ProductItem) => void;
  manualStockAdjustment: (id: string, newStock: number, reason: string) => void;

  // AI Monitoring
  isMonitoringActive: boolean;
  toggleMonitoring: () => void;
  monitoringMode: 'DEMO' | 'CAMERA';
  setMonitoringMode: (mode: 'DEMO' | 'CAMERA') => void;
  currentObservedCount: number;
  stabilityFramesCount: number;
  maxStabilityFrames: number;
  isCountValidating: boolean;
  validationStatusText: string;
  currentFps: number;
  simulatedItemRemoval: () => void;
  simulatedItemRestock: () => void;
  detectionEvents: DetectionEvent[];

  // Alerts
  alerts: StockAlert[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;

  // Procurement
  procurementRequests: ProcurementRequest[];
  selectedRequest: ProcurementRequest | null;
  setSelectedRequest: (r: ProcurementRequest | null) => void;
  approveProcurementRequest: (id: string, notes?: string, poNumber?: string) => void;
  rejectProcurementRequest: (id: string, notes?: string) => void;
  modifyReorderQuantity: (id: string, newQty: number) => void;
  markGoodsReceived: (id: string, receivedQty?: number, notes?: string) => void;

  // Edge Devices
  edgeDevices: EdgeDevice[];
  toggleDeviceOnline: (id: string) => void;
  simulateNetworkDrop: (id: string) => void;
  simulateReconnectAndSync: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  // Guided Demo
  isDemoModalOpen: boolean;
  openDemoModal: () => void;
  closeDemoModal: () => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  advanceDemoStep: () => void;
  resetDemoScenario: () => void;
  resetAllDataToDefaults: () => void;
}

const STORAGE_KEY = 'smart_shelf_state_v1';
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Persistence Load
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          products: parsed.products || INITIAL_PRODUCTS,
          alerts: parsed.alerts || INITIAL_ALERTS,
          procurementRequests: parsed.procurementRequests || INITIAL_PROCUREMENT_REQUESTS,
          edgeDevices: parsed.edgeDevices || INITIAL_EDGE_DEVICES,
          auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
        };
      }
    } catch (e) {
      console.error('Failed to load from LocalStorage', e);
    }
    return {
      products: INITIAL_PRODUCTS,
      alerts: INITIAL_ALERTS,
      procurementRequests: INITIAL_PROCUREMENT_REQUESTS,
      edgeDevices: INITIAL_EDGE_DEVICES,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
  };

  const initial = loadSavedState();

  const [products, setProducts] = useState<ProductItem[]>(initial.products);
  const [alerts, setAlerts] = useState<StockAlert[]>(initial.alerts);
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>(initial.procurementRequests);
  const [edgeDevices, setEdgeDevices] = useState<EdgeDevice[]>(initial.edgeDevices);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initial.auditLogs);

  // Selected drawers
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ProcurementRequest | null>(null);

  // AI Monitoring State
  const [isMonitoringActive, setIsMonitoringActive] = useState<boolean>(true);
  const [monitoringMode, setMonitoringMode] = useState<'DEMO' | 'CAMERA'>('DEMO');
  
  // Specific monitoring state for target demo product (DHT22)
  const dht22 = products.find(p => p.id === 'SKU-DHT22-01') || products[0];
  const [currentObservedCount, setCurrentObservedCount] = useState<number>(dht22.confirmedStock);
  const [stabilityFramesCount, setStabilityFramesCount] = useState<number>(5);
  const maxStabilityFrames = 5;
  const [isCountValidating, setIsCountValidating] = useState<boolean>(false);
  const [validationStatusText, setValidationStatusText] = useState<string>('Stable Count Verified');
  const [currentFps, setCurrentFps] = useState<number>(29.7);
  
  // Detection Events stream
  const [detectionEvents, setDetectionEvents] = useState<DetectionEvent[]>([
    {
      id: 'EVT-001',
      timestamp: new Date(Date.now() - 4000).toISOString(),
      shelfZone: 'Zone A1',
      productId: 'SKU-DHT22-01',
      productName: 'DHT22 Temperature & Humidity Sensor',
      previousCount: 12,
      detectedCount: 12,
      confirmedCount: 12,
      confidence: 0.968,
      validationStatus: 'CONFIRMED',
      stabilityFrames: 5,
      latencyMs: 18.2,
    },
    {
      id: 'EVT-002',
      timestamp: new Date(Date.now() - 15000).toISOString(),
      shelfZone: 'Zone A2',
      productId: 'SKU-ARD-UNO-02',
      productName: 'Arduino UNO Rev3',
      previousCount: 15,
      detectedCount: 15,
      confirmedCount: 15,
      confidence: 0.984,
      validationStatus: 'CONFIRMED',
      stabilityFrames: 5,
      latencyMs: 19.1,
    }
  ]);

  // Guided Demo Modal State
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Validation timer ref
  const validationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          products,
          alerts,
          procurementRequests,
          edgeDevices,
          auditLogs,
        })
      );
    } catch (e) {
      console.error('Failed to save to LocalStorage', e);
    }
  }, [products, alerts, procurementRequests, edgeDevices, auditLogs]);

  // Add audit log helper
  const addAuditLog = useCallback(
    (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
      const newEntry: AuditLogEntry = {
        id: `LOG-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        ...entry,
      };
      setAuditLogs(prev => [newEntry, ...prev.slice(0, 99)]);
    },
    []
  );

  // Low-Stock Alert Engine logic
  // Evaluates product stock and triggers alert & procurement draft if needed
  const evaluateStockThresholds = useCallback(
    (updatedProduct: ProductItem) => {
      const { id, name, shelfZone, confirmedStock, minThreshold, targetStock, unitCost, category } = updatedProduct;

      if (confirmedStock < minThreshold) {
        const severity = confirmedStock <= Math.floor(minThreshold / 2) ? 'CRITICAL' : 'WARNING';

        setAlerts(prevAlerts => {
          const existingAlertIndex = prevAlerts.findIndex(
            a => a.productId === id && a.status !== 'RESOLVED'
          );

          if (existingAlertIndex >= 0) {
            // Update existing alert with new count
            const updated = [...prevAlerts];
            updated[existingAlertIndex] = {
              ...updated[existingAlertIndex],
              currentStock: confirmedStock,
              severity,
            };
            return updated;
          } else {
            // Create new Alert
            const alertId = `ALT-${Date.now().toString().slice(-4)}`;
            const newAlert: StockAlert = {
              id: alertId,
              productId: id,
              productName: name,
              shelfZone,
              currentStock: confirmedStock,
              minThreshold,
              severity,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
              reason: `Confirmed count (${confirmedStock}) breached minimum threshold (${minThreshold}).`,
            };

            // Check if draft procurement request already exists
            setProcurementRequests(prevPRs => {
              const hasUnresolvedPR = prevPRs.some(
                pr => pr.productId === id && pr.status !== 'RECEIVED' && pr.status !== 'REJECTED'
              );

              if (!hasUnresolvedPR) {
                // Auto-generate Draft Purchase Request
                const reorderQuantity = Math.max(targetStock - confirmedStock, 10);
                const prId = `PR-${new Date().getFullYear()}-${(prevPRs.length + 1).toString().padStart(3, '0')}`;
                const newPR: ProcurementRequest = {
                  id: prId,
                  productId: id,
                  productName: name,
                  category,
                  currentStock: confirmedStock,
                  reorderQuantity,
                  unitCost,
                  totalCost: Number((reorderQuantity * unitCost).toFixed(2)),
                  priority: severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
                  status: 'DRAFT',
                  createdAt: new Date().toISOString(),
                  supplier: 'Authorized Electronic Distributor',
                  approvalHistory: [
                    {
                      timestamp: new Date().toISOString(),
                      action: 'AUTO_DRAFT_CREATED',
                      actor: 'Edge-AI Auto-Procure Engine',
                      notes: `Auto-drafted upon stock threshold breach (${confirmedStock} < ${minThreshold}).`,
                    }
                  ],
                  alertId,
                };

                newAlert.linkedRequestId = prId;

                addAuditLog({
                  category: 'PROCUREMENT',
                  action: 'DRAFT_PO_GENERATED',
                  details: `Auto-drafted purchase request ${prId} for ${reorderQuantity} units of ${name}.`,
                  actor: 'Auto-Procure Engine',
                });

                return [newPR, ...prevPRs];
              }
              return prevPRs;
            });

            addAuditLog({
              category: 'ALERT',
              action: 'LOW_STOCK_TRIGGERED',
              details: `${severity} alert triggered for ${name} (${confirmedStock}/${minThreshold} units).`,
              actor: 'Stock Alert Engine',
            });

            return [newAlert, ...prevAlerts];
          }
        });
      } else {
        // Stock is healthy, resolve any active alert
        setAlerts(prevAlerts =>
          prevAlerts.map(a =>
            a.productId === id && a.status !== 'RESOLVED'
              ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() }
              : a
          )
        );
      }
    },
    [addAuditLog]
  );

  // Update product stock with status calculation
  const updateProductStock = useCallback(
    (id: string, newStock: number, source: 'EDGE_AI' | 'MANUAL_AUDIT', conf: number = 0.96) => {
      setProducts(prev =>
        prev.map(p => {
          if (p.id === id) {
            let status: StockStatus = 'IN_STOCK';
            if (newStock <= Math.floor(p.minThreshold / 2)) {
              status = 'CRITICAL';
            } else if (newStock < p.minThreshold) {
              status = 'LOW_STOCK';
            }

            const updated: ProductItem = {
              ...p,
              confirmedStock: newStock,
              observedStock: newStock,
              status,
              confidenceScore: conf,
              verificationSource: source,
              lastVerified: new Date().toISOString(),
            };

            // Evaluate thresholds
            evaluateStockThresholds(updated);

            return updated;
          }
          return p;
        })
      );
    },
    [evaluateStockThresholds]
  );

  // Manual stock adjustment
  const manualStockAdjustment = useCallback(
    (id: string, newStock: number, reason: string) => {
      const prod = products.find(p => p.id === id);
      if (!prod) return;

      const delta = newStock - prod.confirmedStock;
      updateProductStock(id, newStock, 'MANUAL_AUDIT', 1.0);

      addAuditLog({
        category: 'STOCK_ADJUSTMENT',
        action: 'MANUAL_OVERRIDE',
        details: `Manual adjustment on ${prod.name}: ${prod.confirmedStock} -> ${newStock} (${delta >= 0 ? '+' : ''}${delta}). Reason: ${reason}`,
        actor: 'Lab Manager (Manual Audit)',
      });
    },
    [products, updateProductStock, addAuditLog]
  );

  // Add new product
  const addProduct = useCallback(
    (item: Omit<ProductItem, 'id' | 'lastVerified' | 'status' | 'observedStock'>) => {
      const id = `SKU-CUST-${Date.now().toString().slice(-4)}`;
      let status: StockStatus = 'IN_STOCK';
      if (item.confirmedStock <= Math.floor(item.minThreshold / 2)) {
        status = 'CRITICAL';
      } else if (item.confirmedStock < item.minThreshold) {
        status = 'LOW_STOCK';
      }

      const newProd: ProductItem = {
        ...item,
        id,
        observedStock: item.confirmedStock,
        status,
        lastVerified: new Date().toISOString(),
      };

      setProducts(prev => [newProd, ...prev]);

      addAuditLog({
        category: 'SYSTEM',
        action: 'ITEM_REGISTERED',
        details: `New item registered: ${newProd.name} (${newProd.id}) assigned to ${newProd.shelfZone}.`,
        actor: 'User Admin',
      });
    },
    [addAuditLog]
  );

  // Edit existing product
  const editProduct = useCallback(
    (updated: ProductItem) => {
      setProducts(prev =>
        prev.map(p => (p.id === updated.id ? updated : p))
      );
      evaluateStockThresholds(updated);

      addAuditLog({
        category: 'SYSTEM',
        action: 'ITEM_UPDATED',
        details: `Updated parameters for ${updated.name} (Threshold: ${updated.minThreshold}).`,
        actor: 'User Admin',
      });
    },
    [evaluateStockThresholds, addAuditLog]
  );

  // Simulate Item Removal (-8 DHT22 modules)
  const simulatedItemRemoval = useCallback(() => {
    if (isCountValidating) return;

    if (validationTimerRef.current) {
      clearInterval(validationTimerRef.current);
    }

    const currentProd = products.find(p => p.id === 'SKU-DHT22-01') || products[0];
    const targetCount = Math.max(0, currentProd.confirmedStock - 8);

    setIsCountValidating(true);
    setCurrentObservedCount(targetCount);
    setStabilityFramesCount(1);
    setValidationStatusText(`Frame 1/${maxStabilityFrames} Validating decrease...`);

    // Stream initial detection event
    setDetectionEvents(prev => [
      {
        id: `EVT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        shelfZone: currentProd.shelfZone,
        productId: currentProd.id,
        productName: currentProd.name,
        previousCount: currentProd.confirmedStock,
        detectedCount: targetCount,
        confirmedCount: currentProd.confirmedStock,
        confidence: 0.941,
        validationStatus: 'VALIDATING',
        stabilityFrames: 1,
        latencyMs: 18.6,
      },
      ...prev.slice(0, 49)
    ]);

    let frame = 1;
    validationTimerRef.current = setInterval(() => {
      frame += 1;
      setStabilityFramesCount(frame);
      setValidationStatusText(`Frame ${frame}/${maxStabilityFrames} Validating temporal stability...`);

      if (frame >= maxStabilityFrames) {
        if (validationTimerRef.current) clearInterval(validationTimerRef.current);
        setIsCountValidating(false);
        setValidationStatusText(`Confirmed: ${targetCount} Units Verified (5/5 Frames)`);

        // Lock confirmed count in inventory!
        updateProductStock(currentProd.id, targetCount, 'EDGE_AI', 0.978);

        // Record confirmed detection event
        setDetectionEvents(prev => [
          {
            id: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            shelfZone: currentProd.shelfZone,
            productId: currentProd.id,
            productName: currentProd.name,
            previousCount: currentProd.confirmedStock,
            detectedCount: targetCount,
            confirmedCount: targetCount,
            confidence: 0.978,
            validationStatus: 'CONFIRMED',
            stabilityFrames: 5,
            latencyMs: 18.4,
          },
          ...prev.slice(0, 49)
        ]);

        addAuditLog({
          category: 'EDGE_AI',
          action: 'STOCK_COUNT_CONFIRMED',
          details: `Edge AI locked count for ${currentProd.name} from ${currentProd.confirmedStock} to ${targetCount} after 5-frame stability consensus.`,
          actor: 'EDGE-NODE-01 (YOLOv8s-INT8)',
        });
      }
    }, 700);
  }, [isCountValidating, products, maxStabilityFrames, updateProductStock, addAuditLog]);

  // Simulate Item Restock (+8 DHT22 modules)
  const simulatedItemRestock = useCallback(() => {
    if (isCountValidating) return;

    if (validationTimerRef.current) {
      clearInterval(validationTimerRef.current);
    }

    const currentProd = products.find(p => p.id === 'SKU-DHT22-01') || products[0];
    const targetCount = currentProd.confirmedStock + 8;

    setIsCountValidating(true);
    setCurrentObservedCount(targetCount);
    setStabilityFramesCount(1);
    setValidationStatusText(`Frame 1/${maxStabilityFrames} Validating restocking...`);

    let frame = 1;
    validationTimerRef.current = setInterval(() => {
      frame += 1;
      setStabilityFramesCount(frame);
      setValidationStatusText(`Frame ${frame}/${maxStabilityFrames} Validating restock stability...`);

      if (frame >= maxStabilityFrames) {
        if (validationTimerRef.current) clearInterval(validationTimerRef.current);
        setIsCountValidating(false);
        setValidationStatusText(`Confirmed: ${targetCount} Units Restocked`);

        updateProductStock(currentProd.id, targetCount, 'EDGE_AI', 0.985);

        setDetectionEvents(prev => [
          {
            id: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            shelfZone: currentProd.shelfZone,
            productId: currentProd.id,
            productName: currentProd.name,
            previousCount: currentProd.confirmedStock,
            detectedCount: targetCount,
            confirmedCount: targetCount,
            confidence: 0.985,
            validationStatus: 'CONFIRMED',
            stabilityFrames: 5,
            latencyMs: 18.1,
          },
          ...prev.slice(0, 49)
        ]);

        addAuditLog({
          category: 'EDGE_AI',
          action: 'RESTOCK_CONFIRMED',
          details: `Edge AI verified physical replenishment for ${currentProd.name}: count increased to ${targetCount}.`,
          actor: 'EDGE-NODE-01 (YOLOv8s-INT8)',
        });
      }
    }, 600);
  }, [isCountValidating, products, maxStabilityFrames, updateProductStock, addAuditLog]);

  // Alert handlers
  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
    addAuditLog({
      category: 'ALERT',
      action: 'ALERT_ACKNOWLEDGED',
      details: `Alert ${id} acknowledged by operator.`,
      actor: 'Lab Manager',
    });
  }, [addAuditLog]);

  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a
      )
    );
    addAuditLog({
      category: 'ALERT',
      action: 'ALERT_RESOLVED',
      details: `Alert ${id} manually marked as resolved.`,
      actor: 'Lab Manager',
    });
  }, [addAuditLog]);

  // Procurement actions
  const approveProcurementRequest = useCallback(
    (id: string, notes?: string, poNumber?: string) => {
      const generatedPO = poNumber || `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      setProcurementRequests(prev =>
        prev.map(pr => {
          if (pr.id === id) {
            return {
              ...pr,
              status: 'APPROVED',
              poNumber: generatedPO,
              approvalHistory: [
                ...pr.approvalHistory,
                {
                  timestamp: new Date().toISOString(),
                  action: 'APPROVED',
                  actor: 'Samarth Gudoorkar (Procurement Lead)',
                  notes: notes || `Approved restock order under purchase order ${generatedPO}.`,
                },
              ],
            };
          }
          return pr;
        })
      );

      addAuditLog({
        category: 'PROCUREMENT',
        action: 'REQUEST_APPROVED',
        details: `Procurement request ${id} approved with purchase order ${generatedPO}. Ready for vendor dispatch.`,
        actor: 'Samarth Gudoorkar (Lead)',
      });
    },
    [addAuditLog]
  );

  const rejectProcurementRequest = useCallback(
    (id: string, notes?: string) => {
      setProcurementRequests(prev =>
        prev.map(pr => {
          if (pr.id === id) {
            return {
              ...pr,
              status: 'REJECTED',
              approvalHistory: [
                ...pr.approvalHistory,
                {
                  timestamp: new Date().toISOString(),
                  action: 'REJECTED',
                  actor: 'Samarth Gudoorkar (Procurement Lead)',
                  notes: notes || 'Rejected by management due to budget/allocation review.',
                },
              ],
            };
          }
          return pr;
        })
      );

      addAuditLog({
        category: 'PROCUREMENT',
        action: 'REQUEST_REJECTED',
        details: `Procurement request ${id} rejected: ${notes || 'No rationale specified'}.`,
        actor: 'Samarth Gudoorkar (Lead)',
      });
    },
    [addAuditLog]
  );

  const modifyReorderQuantity = useCallback(
    (id: string, newQty: number) => {
      setProcurementRequests(prev =>
        prev.map(pr => {
          if (pr.id === id) {
            const total = Number((newQty * pr.unitCost).toFixed(2));
            return {
              ...pr,
              reorderQuantity: newQty,
              totalCost: total,
              approvalHistory: [
                ...pr.approvalHistory,
                {
                  timestamp: new Date().toISOString(),
                  action: 'QUANTITY_MODIFIED',
                  actor: 'Procurement Officer',
                  notes: `Reorder quantity revised from ${pr.reorderQuantity} to ${newQty}.`,
                },
              ],
            };
          }
          return pr;
        })
      );

      addAuditLog({
        category: 'PROCUREMENT',
        action: 'QUANTITY_REVISED',
        details: `Revised quantity for PR ${id} to ${newQty} units.`,
        actor: 'Procurement Officer',
      });
    },
    [addAuditLog]
  );

  // Mark Goods Received - ONLY THIS INCREASES INVENTORY
  const markGoodsReceived = useCallback(
    (id: string, receivedQty?: number, notes?: string) => {
      const pr = procurementRequests.find(r => r.id === id);
      if (!pr) return;

      const qtyToAdd = receivedQty !== undefined ? receivedQty : pr.reorderQuantity;

      // Update PR status
      setProcurementRequests(prev =>
        prev.map(r => {
          if (r.id === id) {
            return {
              ...r,
              status: 'RECEIVED',
              approvalHistory: [
                ...r.approvalHistory,
                {
                  timestamp: new Date().toISOString(),
                  action: 'GOODS_RECEIVED',
                  actor: 'KSK Sasank (Inventory Officer)',
                  notes: notes || `Shipment arrived. Physically verified ${qtyToAdd} units and stocked to shelf.`,
                },
              ],
            };
          }
          return r;
        })
      );

      // Increase confirmed stock
      const prod = products.find(p => p.id === pr.productId);
      if (prod) {
        const newStock = prod.confirmedStock + qtyToAdd;
        updateProductStock(prod.id, newStock, 'MANUAL_AUDIT', 1.0);
      }

      addAuditLog({
        category: 'STOCK_ADJUSTMENT',
        action: 'GOODS_RECEIPT_STOCKED',
        details: `Received ${qtyToAdd} units for ${pr.productName} (PO: ${pr.poNumber || pr.id}). Confirmed stock incremented.`,
        actor: 'KSK Sasank (Inventory Officer)',
      });
    },
    [procurementRequests, products, updateProductStock, addAuditLog]
  );

  // Edge Device controls
  const toggleDeviceOnline = useCallback(
    (id: string) => {
      setEdgeDevices(prev =>
        prev.map(d => {
          if (d.id === id) {
            const nextStatus = d.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
            addAuditLog({
              category: 'EDGE_AI',
              action: nextStatus === 'ONLINE' ? 'DEVICE_ONLINE' : 'DEVICE_OFFLINE',
              details: `${d.name} (${d.id}) transitioned to ${nextStatus}.`,
              actor: 'Edge Supervisor Daemon',
            });
            return { ...d, status: nextStatus };
          }
          return d;
        })
      );
    },
    [addAuditLog]
  );

  const simulateNetworkDrop = useCallback(
    (id: string) => {
      setEdgeDevices(prev =>
        prev.map(d => {
          if (d.id === id) {
            addAuditLog({
              category: 'EDGE_AI',
              action: 'NETWORK_SEVERED_BUFFERING_ACTIVE',
              details: `${d.name} upstream link dropped. Autonomous local edge processing active; buffering detections locally.`,
              actor: 'Network Watchdog',
            });
            return {
              ...d,
              status: 'OFFLINE',
              bufferedEventsCount: 14,
            };
          }
          return d;
        })
      );
    },
    [addAuditLog]
  );

  const simulateReconnectAndSync = useCallback(
    (id: string) => {
      setEdgeDevices(prev =>
        prev.map(d => {
          if (d.id === id) {
            addAuditLog({
              category: 'EDGE_AI',
              action: 'NETWORK_RECONNECTED_SYNCED',
              details: `${d.name} reconnected. Flushed 14 buffered edge detection frames upstream. Stock state synchronized.`,
              actor: 'Edge Sync Gateway',
            });
            return {
              ...d,
              status: 'ONLINE',
              bufferedEventsCount: 0,
              lastSync: 'Just now',
            };
          }
          return d;
        })
      );
    },
    [addAuditLog]
  );

  // Guided Demo Walkthrough
  const openDemoModal = useCallback(() => {
    setIsDemoModalOpen(true);
    setDemoStep(1);
  }, []);

  const closeDemoModal = useCallback(() => {
    setIsDemoModalOpen(false);
  }, []);

  const resetDemoScenario = useCallback(() => {
    // Reset DHT22 to 12 items
    updateProductStock('SKU-DHT22-01', 12, 'EDGE_AI', 0.964);
    setCurrentObservedCount(12);
    setStabilityFramesCount(5);
    setValidationStatusText('Stable Count Verified (12 Units)');

    // Clean up demo alerts and requests for DHT22
    setAlerts(prev => prev.filter(a => a.productId !== 'SKU-DHT22-01'));
    setProcurementRequests(prev => prev.filter(pr => pr.productId !== 'SKU-DHT22-01'));

    setDemoStep(1);

    addAuditLog({
      category: 'SYSTEM',
      action: 'DEMO_RESET',
      details: 'Guided demonstration scenario reset to baseline (Shelf A1: 12 sensor modules).',
      actor: 'Presentation Controller',
    });
  }, [updateProductStock, addAuditLog]);

  const advanceDemoStep = useCallback(() => {
    setDemoStep(prev => {
      const next = prev + 1;
      if (next === 2) {
        // Step 2: Trigger removal of 8 modules
        simulatedItemRemoval();
      } else if (next === 7) {
        // Step 7: Auto-find draft PR for DHT22 and approve it
        const dhtPR = procurementRequests.find(pr => pr.productId === 'SKU-DHT22-01' && pr.status === 'DRAFT');
        if (dhtPR) {
          approveProcurementRequest(dhtPR.id, 'Approved by judges during live presentation demonstration.', 'PO-2024-LIVE-01');
        }
      }
      return next;
    });
  }, [simulatedItemRemoval, procurementRequests, approveProcurementRequest]);

  const resetAllDataToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(INITIAL_PRODUCTS);
    setAlerts(INITIAL_ALERTS);
    setProcurementRequests(INITIAL_PROCUREMENT_REQUESTS);
    setEdgeDevices(INITIAL_EDGE_DEVICES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSelectedProduct(null);
    setSelectedRequest(null);
    setCurrentObservedCount(12);
    setStabilityFramesCount(5);
    setValidationStatusText('Stable Count Verified');
    setDemoStep(0);
    setIsDemoModalOpen(false);
  }, []);

  // Periodic subtle jitter on Edge FPS and latency to look authentic
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMonitoringActive) {
        setCurrentFps(Number((29.4 + (Math.random() * 0.8 - 0.4)).toFixed(1)));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isMonitoringActive]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        products,
        selectedProduct,
        setSelectedProduct,
        updateProductStock,
        addProduct,
        editProduct,
        manualStockAdjustment,
        isMonitoringActive,
        toggleMonitoring: () => setIsMonitoringActive(prev => !prev),
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
        alerts,
        acknowledgeAlert,
        resolveAlert,
        procurementRequests,
        selectedRequest,
        setSelectedRequest,
        approveProcurementRequest,
        rejectProcurementRequest,
        modifyReorderQuantity,
        markGoodsReceived,
        edgeDevices,
        toggleDeviceOnline,
        simulateNetworkDrop,
        simulateReconnectAndSync,
        auditLogs,
        addAuditLog,
        isDemoModalOpen,
        openDemoModal,
        closeDemoModal,
        demoStep,
        setDemoStep,
        advanceDemoStep,
        resetDemoScenario,
        resetAllDataToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
