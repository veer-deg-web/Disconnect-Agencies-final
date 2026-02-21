import { Suspense } from 'react';
import AuthClient from './AuthClient';

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a12' }} />
      }
    >
      <AuthClient />
    </Suspense>
  );
}
