import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { AdminHeaderNav } from "@/components/layout/AdminHeaderNav";
import { createClient } from "@/lib/supabase/server";

export const AdminHeader = () => {
  const signOutAction = async () => {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <header className="glass-header border-b border-border bg-background">
      <div className="mx-auto flex h-[83px] w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/admin/list" aria-label="관리자 홈으로 이동" className="text-foreground">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="AZEN" className="h-16 w-auto" />
          </Link>

          <AdminHeaderNav />
        </div>

        <div className="flex items-center gap-2">
          <form action={signOutAction}>
            <button
              type="submit"
              aria-label="로그아웃"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-muted"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};
