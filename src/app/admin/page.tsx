import type { Metadata } from "next";
import { Suspense } from 'react';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Admin — FAQ Management | Disconnect Agencies',
  description: 'Manage frequently asked questions for the Disconnect Agencies website',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#0a0a12', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#7c3aed', fontFamily: 'inherit' }}>Loading…</div>
      </div>
    }>
      <AdminClient />
    </Suspense>
  );
}
