"use client";
import dynamic from 'next/dynamic';

const ExcuseDataPage = dynamic(() => import('@/views/ExcuseDataPage'), { ssr: false });

export default function ClientExcuseData() {
  return <ExcuseDataPage />;
}
