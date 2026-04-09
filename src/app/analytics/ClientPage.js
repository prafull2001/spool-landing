"use client";
import dynamic from 'next/dynamic';

const AnalyticsPage = dynamic(() => import('@/views/AnalyticsPage'), { ssr: false });

export default function ClientAnalytics() {
  return <AnalyticsPage />;
}
