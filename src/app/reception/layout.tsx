'use client';

import SidebarLayout from '@/components/SidebarLayout';
import { ReactNode } from 'react';

export default function ReceptionLayout({ children }: { children: ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
