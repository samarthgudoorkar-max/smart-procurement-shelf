import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Edit2,
  SlidersHorizontal,
  X,
  Clock,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductItem, ProductCategory, StockStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const InventoryManagement: React.FC = () => {
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    addProduct,
    editProduct,
    manualStockAdjustment,
    setActiveTab
  } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof ProductItem>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<ProductItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sensors' as ProductCategory,
    shelfZone: 'Zone A1',
    confirmedStock: 10,
    minThreshold: 5,
    targetStock: 20,
    unitCost: 5.00,
    description: '',
    manufacturer: '',
    leadTimeDays: 3,
  });

  const [adjustData, setAdjustData] = useState({
    newStock: 0,
    reason: 'Routine physical cycle count inspection',
  });

  // Unique categories
  const categories = ['ALL', 'Sensors', 'Microcontrollers', 'Development Boards', 'Cables & Adapters', 'Displays', 'Power & Relays', 'Storage'];

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.shelfZone.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
        const matchesStatus =
          selectedStatusFilter === 'ALL' ||
          (selectedStatusFilter === 'LOW_STOCK' && (p.status === 'LOW_STOCK' || p.status === 'CRITICAL')) ||
          p.status === selectedStatusFilter;
        return matchesSearch && matchesCat && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [products, searchTerm, selectedCategory, selectedStatusFilter, sortField, sortOrder]);

  const handleSort = (field: keyof ProductItem) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Shelf Zone', 'Confirmed Stock', 'Min Threshold', 'Target Stock', 'Unit Cost', 'Status', 'Last Verified'];
    const rows = filteredProducts.map(p => [
      p.id,
      `"${p.name}"`,
      p.category,
      p.shelfZone,
      p.confirmedStock,
      p.minThreshold,
      p.targetStock,
      p.unitCost,
      p.status,
      p.lastVerified,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Smart_Shelf_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Add Product
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: formData.name,
      category: formData.category,
      shelfZone: formData.shelfZone,
      confirmedStock: Number(formData.confirmedStock),
      minThreshold: Number(formData.minThreshold),
      targetStock: Number(formData.targetStock),
      unitCost: Number(formData.unitCost),
      confidenceScore: 0.95,
      verificationSource: 'MANUAL_AUDIT',
      description: formData.description || 'Custom catalog registered component.',
      manufacturer: formData.manufacturer || 'General Supplier',
      leadTimeDays: Number(formData.leadTimeDays),
    });
    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const openEditModal = (item: ProductItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      shelfZone: item.shelfZone,
      confirmedStock: item.confirmedStock,
      minThreshold: item.minThreshold,
      targetStock: item.targetStock,
      unitCost: item.unitCost,
      description: item.description,
      manufacturer: item.manufacturer || '',
      leadTimeDays: item.leadTimeDays,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    editProduct({
      ...editingItem,
      name: formData.name,
      category: formData.category,
      shelfZone: formData.shelfZone,
      minThreshold: Number(formData.minThreshold),
      targetStock: Number(formData.targetStock),
      unitCost: Number(formData.unitCost),
      description: formData.description,
      manufacturer: formData.manufacturer,
      leadTimeDays: Number(formData.leadTimeDays),
    });
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Open Adjust Modal
  const openAdjustModal = (item: ProductItem) => {
    setAdjustingItem(item);
    setAdjustData({
      newStock: item.confirmedStock,
      reason: 'Physical count discrepancy identified in periodic inspection',
    });
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    manualStockAdjustment(adjustingItem.id, Number(adjustData.newStock), adjustData.reason);
    setIsAdjustModalOpen(false);
    setAdjustingItem(null);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header with Search, Filters, and Add CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-card">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by SKU, product name, or shelf zone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_STOCK">In Stock Only</option>
            <option value="LOW_STOCK">Low Stock / Shortage</option>
            <option value="CRITICAL">Critical Only</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors flex items-center space-x-1.5"
            title="Export filtered table to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add Product Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider select-none">
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>SKU / Product</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Shelf Zone</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('confirmedStock')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Confirmed Stock</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Min / Target</th>
                <th className="py-3.5 px-4">Unit Cost</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4">Last Verified</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span>No inventory items match your search or filter criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const stockRatio = Math.min(100, Math.round((p.confirmedStock / p.targetStock) * 100));
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-default"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {p.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">{p.id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {p.shelfZone}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-baseline space-x-2">
                          <span className={`font-mono text-sm font-bold ${
                            p.confirmedStock < p.minThreshold ? 'text-rose-600 font-extrabold' : 'text-slate-900'
                          }`}>
                            {p.confirmedStock}
                          </span>
                          <span className="text-[10px] text-slate-400">units</span>
                        </div>
                        {/* Visual stock buffer bar */}
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              p.status === 'CRITICAL'
                                ? 'bg-rose-500'
                                : p.status === 'LOW_STOCK'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${stockRatio}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        Min: <strong className="text-slate-700">{p.minThreshold}</strong> / Target: {p.targetStock}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-800 font-medium">
                        ${p.unitCost.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        <div className="flex items-center space-x-1">
                          <span className="font-mono text-slate-700">
                            {p.verificationSource === 'EDGE_AI' ? 'Edge-AI (Optical)' : 'Manual Audit'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {(p.confidenceScore * 100).toFixed(1)}% conf
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="p-1.5 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openAdjustModal(p)}
                            className="p-1.5 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Manual Stock Override"
                          >
                            <SlidersHorizontal className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Edit Parameters"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with count */}
        <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Showing {filteredProducts.length} of {products.length} registered SKUs</span>
          <span>Edge synchronization: Live</span>
        </div>
      </div>

      {/* Product Detail Drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative w-full max-w-md bg-white shadow-2xl z-10 flex flex-col h-full border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider">
                  Product Specifications
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedProduct.name}</h3>
                <span className="font-mono text-xs text-slate-500">{selectedProduct.id}</span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Quick Status Pill */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Condition</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedProduct.status} />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Verified Stock</span>
                  <div className="text-lg font-bold font-mono text-slate-900">
                    {selectedProduct.confirmedStock} <span className="text-xs text-slate-400 font-normal">units</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-800">Description & Use Case</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Technical Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Shelf Allocation</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedProduct.shelfZone}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Category</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedProduct.category}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Safety Buffer (Min)</span>
                  <p className="font-bold text-rose-600 mt-0.5 font-mono">{selectedProduct.minThreshold} units</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Target Restock Level</span>
                  <p className="font-bold text-slate-800 mt-0.5 font-mono">{selectedProduct.targetStock} units</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Unit Purchase Price</span>
                  <p className="font-bold text-slate-800 mt-0.5 font-mono">${selectedProduct.unitCost.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Vendor Lead Time</span>
                  <p className="font-bold text-slate-800 mt-0.5 font-mono">{selectedProduct.leadTimeDays} business days</p>
                </div>
              </div>

              {/* Edge AI Telemetry */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Edge Optical Verification
                </span>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Inference Source:</span>
                    <strong className="text-slate-800 font-mono">{selectedProduct.verificationSource}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Confidence:</span>
                    <strong className="text-emerald-600 font-mono">{(selectedProduct.confidenceScore * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Invariant Check:</span>
                    <span className="font-mono text-slate-500">{new Date(selectedProduct.lastVerified).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center space-x-2">
              <button
                onClick={() => {
                  const p = selectedProduct;
                  setSelectedProduct(null);
                  openAdjustModal(p);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
              >
                Manual Stock Override
              </button>
              <button
                onClick={() => {
                  const p = selectedProduct;
                  setSelectedProduct(null);
                  openEditModal(p);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors"
              >
                Edit Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Adjust Modal */}
      {isAdjustModalOpen && adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manual Stock Count Override</h3>
                <p className="text-xs text-slate-500 mt-0.5">{adjustingItem.name}</p>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 space-y-1">
                <span className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Audit Trail Requirement
                </span>
                <p className="text-[11px]">
                  Manual count adjustments bypass Edge-AI validation and are logged directly to the system audit ledger.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Current Confirmed Count
                </label>
                <input
                  type="text"
                  disabled
                  value={`${adjustingItem.confirmedStock} units`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  New Physical Audit Count *
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  required
                  value={adjustData.newStock}
                  onChange={e => setAdjustData({ ...adjustData, newStock: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Reason for Discrepancy Adjustment *
                </label>
                <textarea
                  required
                  rows={3}
                  value={adjustData.reason}
                  onChange={e => setAdjustData({ ...adjustData, reason: e.target.value })}
                  placeholder="e.g. Physical inventory discrepancy discovered during weekly lab audit."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isEditModalOpen ? 'Edit Item Parameters' : 'Register New Inventory Component'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEditModalOpen ? editingItem?.id : 'Add a new hardware SKU to the Edge monitoring shelf'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit}
              className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto"
            >
              <div>
                <label className="block text-slate-700 font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Raspberry Pi Pico W"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Shelf Zone Allocation *</label>
                  <select
                    value={formData.shelfZone}
                    onChange={e => setFormData({ ...formData, shelfZone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  >
                    <option value="Zone A1">Zone A1 (Shelf Alpha)</option>
                    <option value="Zone A2">Zone A2 (Shelf Alpha)</option>
                    <option value="Zone A3">Zone A3 (Shelf Alpha)</option>
                    <option value="Zone A4">Zone A4 (Shelf Alpha)</option>
                    <option value="Zone B1">Zone B1 (Shelf Beta)</option>
                    <option value="Zone B2">Zone B2 (Shelf Beta)</option>
                    <option value="Zone B3">Zone B3 (Shelf Beta)</option>
                    <option value="Zone C1">Zone C1 (Shelf Gamma)</option>
                    <option value="Zone C2">Zone C2 (Shelf Gamma)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {!isEditModalOpen && (
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Initial Stock *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.confirmedStock}
                      onChange={e => setFormData({ ...formData, confirmedStock: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Min Threshold *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minThreshold}
                    onChange={e => setFormData({ ...formData, minThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Target Buffer *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.targetStock}
                    onChange={e => setFormData({ ...formData, targetStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Unit Cost ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={formData.unitCost}
                    onChange={e => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.leadTimeDays}
                    onChange={e => setFormData({ ...formData, leadTimeDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Component technical details, specifications, and pinout."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {isEditModalOpen ? 'Save Changes' : 'Register SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
