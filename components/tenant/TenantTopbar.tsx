'use client';

import { useParams } from 'next/navigation';

export default function TenantTopbar() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">لوحة التحكم</h2>
      </div>
      <div className="text-sm text-gray-600">
        {slug}
      </div>
    </header>
  );
}
