"use client";
import dynamic from 'next/dynamic';

const UnifiedAnalyticsPage = dynamic(() => import('@/views/UnifiedAnalyticsPage'), { ssr: false });

export default function ClientAnalytics() {
  return <UnifiedAnalyticsPage />;
}
