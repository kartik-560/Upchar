'use client';

import SidebarLayout from '@/components/SidebarLayout';
import { ReactNode } from 'react';

export default function PatientLayout({ children }: { children: ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
