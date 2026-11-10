'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/auth/LoginModal';
import PublicView from '@/components/views/PublicView';
import ResearchWorkspaceView from '@/components/views/ResearchWorkspaceView';
import AdminWorkspaceView from '@/components/views/AdminWorkspaceView';
import { WorkspaceMode, UserRole } from '@/types/reefsight';

export default function Home() {
  const [workspace, setWorkspace] = useState<WorkspaceMode>('public');
  const [activeRole, setActiveRole] = useState<UserRole>('public');
  const [publicTab, setPublicTab] = useState<string>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Handle Workspace Switching with RBAC Auto-routing
  const handleSelectWorkspace = (ws: WorkspaceMode) => {
    if (ws === 'admin' && activeRole !== 'admin') {
      // If user isn't admin yet, open login modal with hint
      setIsLoginModalOpen(true);
      return;
    }
    if (ws === 'research' && activeRole === 'public') {
      // If user is public, prompt login to choose research role
      setIsLoginModalOpen(true);
      return;
    }
    setWorkspace(ws);
  };

  const handleRoleSelection = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'admin') {
      setWorkspace('admin');
    } else if (['operator_lapangan', 'peneliti_ekologi', 'validator_data'].includes(role)) {
      setWorkspace('research');
    } else {
      setWorkspace('public');
    }
  };

  const handleLogout = () => {
    setActiveRole('public');
    setWorkspace('public');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Global Navbar */}
      <Navbar
        currentWorkspace={workspace}
        onSelectWorkspace={handleSelectWorkspace}
        activeRole={activeRole}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        activePublicTab={publicTab}
        onSelectPublicTab={setPublicTab}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {workspace === 'public' && (
          <PublicView
            activeTab={publicTab}
            onSelectTab={setPublicTab}
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

      {/* Global Footer */}
      <Footer />

      {/* Interactive RBAC Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        activeRole={activeRole}
        onSelectRole={handleRoleSelection}
      />
    </div>
  );
}
