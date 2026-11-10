'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginView from '@/components/auth/LoginView';
import { UserRole } from '@/types/reefsight';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = (role: UserRole) => {
    // If admin, go to home with admin or research
    router.push('/');
  };

  const handleBackToPublic = () => {
    router.push('/');
  };

  return (
    <LoginView
      onSuccess={handleSuccess}
      onBackToPublic={handleBackToPublic}
      currentRole="admin"
    />
  );
}
