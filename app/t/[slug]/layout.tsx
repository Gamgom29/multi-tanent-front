import TenantSidebar from '@/components/tenant/TenantSidebar';
import TenantTopbar from '@/components/tenant/TenantTopbar';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <TenantTopbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
