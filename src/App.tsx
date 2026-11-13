import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { LiveShelfMonitoring } from './components/monitoring/LiveShelfMonitoring';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { AlertsManager } from './components/alerts/AlertsManager';
import { ProcurementWorkspace } from './components/procurement/ProcurementWorkspace';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { EdgeDeviceMonitoring } from './components/edge/EdgeDeviceMonitoring';
import { AboutSection } from './components/about/AboutSection';
import { GuidedDemoModal } from './components/demo/GuidedDemoModal';

export const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'monitoring':
        return <LiveShelfMonitoring />;
      case 'inventory':
        return <InventoryManagement />;
      case 'alerts':
        return <AlertsManager />;
      case 'procurement':
        return <ProcurementWorkspace />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'edge':
        return <EdgeDeviceMonitoring />;
      case 'about':
        return <AboutSection />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Fixed Dark Slate Sidebar */}
      <Sidebar />

      {/* Main Workspace Area (offset by 64 = 16rem = 256px for sidebar) */}
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <Header />
        <main className="flex-1 pb-16">
          {renderActiveView()}
        </main>
      </div>

      {/* 8-Step Interactive Guided Presentation Demo Modal */}
      <GuidedDemoModal />
    </div>
  );
};

export default AppContent;
