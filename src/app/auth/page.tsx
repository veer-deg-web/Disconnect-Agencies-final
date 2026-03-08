import type { Metadata } from "next";
import { Suspense } from 'react';
import AuthClient from './AuthClient';

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Disconnect account.",
  alternates: { canonical: "/auth" },
  robots: {
    index: false,
    follow: false,
  },
};

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
