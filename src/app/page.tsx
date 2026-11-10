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
