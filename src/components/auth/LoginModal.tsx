'use client';

import React from 'react';
import { UserRole } from '@/types/reefsight';
import LoginView from './LoginView';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  activeRole,
  onSelectRole
}: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <LoginView
      currentRole={activeRole}
      onSuccess={(role) => {
        onSelectRole(role);
        onClose();
      }}
      onClose={onClose}
      onBackToPublic={() => {
        onSelectRole('public');
        onClose();
      }}
    />
  );
}
