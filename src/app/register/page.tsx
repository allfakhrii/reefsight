'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginView from '@/components/auth/LoginView';
import { UserRole } from '@/types/reefsight';

export default function RegisterPage() {
  const router = useRouter();

  const handleSuccess = (role: UserRole) => {
    // If registered, route to appropriate workspace or home
    router.push('/');
  };

  const handleBackToPublic = () => {
    router.push('/');
  };

  return (
    <LoginView
      initialMode="register"
      onSuccess={handleSuccess}
      onBackToPublic={handleBackToPublic}
      currentRole="peneliti_ekologi"
    />
  );
}
