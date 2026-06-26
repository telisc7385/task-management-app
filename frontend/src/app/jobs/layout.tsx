'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export default function JobsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  return <>{children}</>;
}
