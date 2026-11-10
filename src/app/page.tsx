'use client';

import React, { useState } from 'react';
import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import LoginModal from '@/components/auth/LoginModal';
import PublicView from '@/components/views/PublicView';
import ResearchWorkspaceView from '@/components/views/ResearchWorkspaceView';
import AdminWorkspaceView from '@/components/views/AdminWorkspaceView';
import { WorkspaceMode, UserRole } from '@/types/reefsight';

export default function Home() {
  const [workspace, setWorkspace] = useState<WorkspaceMode>('public');
  const [activeRole, setActiveRole] = useState<UserRole>('public');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Handle Workspace Switching with RBAC Auto-routing
  const handleSelectWorkspace = (ws: WorkspaceMode) => {
    if (ws === 'admin' && activeRole !== 'admin') {
      setIsLoginModalOpen(true);
      return;
    }
    if (ws === 'research' && activeRole === 'public') {
      setIsLoginModalOpen(true);
      return;
    }
    setWorkspace(ws);
    // Set appropriate initial tab per workspace
    if (ws === 'public') {
      setActiveTab('home');
    } else if (ws === 'research') {
      setActiveTab('dashboard');
    } else if (ws === 'admin') {
      setActiveTab('dashboard');
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'admin') {
      setWorkspace('admin');
      setActiveTab('dashboard');
    } else if (['operator_lapangan', 'peneliti_ekologi', 'validator_data'].includes(role)) {
      setWorkspace('research');
      setActiveTab('dashboard');
    } else {
      setWorkspace('public');
      setActiveTab('home');
    }
  };

  const handleLogout = () => {
    setActiveRole('public');
    setWorkspace('public');
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-orange-500 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden animate-fadeIn"
        />
      )}

      {/* Main Application Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:z-30 transition-transform duration-300 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AppSidebar
          workspace={workspace}
          activeRole={activeRole}
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            setIsMobileSidebarOpen(false);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header Bar */}
        <AppHeader
          workspace={workspace}
          onSelectWorkspace={handleSelectWorkspace}
          activeRole={activeRole}
          activeTab={activeTab}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Dynamic Workspace Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {workspace === 'public' && (
            <PublicView
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onOpenLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {workspace === 'research' && (
            <ResearchWorkspaceView
              activeRole={activeRole}
              onSwitchRole={handleRoleSelection}
            />
          )}

          {workspace === 'admin' && (
            <AdminWorkspaceView
              activeRole={activeRole}
            />
          )}
        </main>

        {/* Global Footer with Official Brand Identity */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-xs py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
              <img
                src="/brand/reefsight-icon.svg"
                alt="REEFSIGHT"
                className="w-6 h-6 object-contain"
              />
              <span className="font-extrabold text-slate-800 tracking-tight text-sm">
                REEF<span className="text-[#F05A28]">SIGHT</span>
              </span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Platform Kecerdasan Ekologis Terumbu Karang Pulau Tunda</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>Kabupaten Serang, Banten</span>
              <span>•</span>
              <span>EchoVision IoT & WebGIS</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Interactive RBAC Login Modal matching image1.jpeg */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        activeRole={activeRole}
        onSelectRole={handleRoleSelection}
      />
    </div>
  );
}
