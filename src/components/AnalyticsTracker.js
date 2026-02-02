'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisit } from '@/services/analyticsService';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Chỉ track khi pathname có giá trị và không phải là trang admin
    if (pathname && !pathname.startsWith('/admin')) {
      trackVisit({ path: pathname });
    }
  }, [pathname]);

  return null; // Component này không render gì cả
}



