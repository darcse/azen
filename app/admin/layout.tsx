import { AdminFooter } from "@/components/layout/AdminFooter";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminLightModeGuard } from "@/components/layout/AdminLightModeGuard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <AdminLightModeGuard />
      <AdminHeader />
      <div className="flex-1">{children}</div>
      <AdminFooter />
    </div>
  );
}
