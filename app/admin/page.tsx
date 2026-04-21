import { LogoutButton } from "@/components/features/LogoutButton";

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">관리자 대시보드</h1>
        <LogoutButton />
      </div>
      <p className="text-sm text-muted-foreground">로그인된 관리자만 접근 가능합니다.</p>
    </main>
  );
}
