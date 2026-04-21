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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 36" className="h-7 w-auto fill-current">
              <path d="m139 4v-0.1-3.1h-7.2v2.1c-2.4 0.1-5.3 1.1-7.7 2.9l2 2.6c1.8-1.4 4.4-2.4 7.5-2.4 4.5 0 11.8 3.7 11.8 12.6 0 4.8-2.5 9.3-6.4 11.3v-20.5c-1.7-1.1-3.9-1.8-7.1-1.4l0.1 15.2-14.7-22.4h-8.7v34.1h7.6v-22.7l15.1 22.7h7.7v-1.7c4.2-1.6 9.1-6 9.2-14.3 0-6.6-4.1-12.8-9.2-14.9z" />
              <path d="m26.5 0.8h-9l-12.6 34.1h7.4l2.5-6.9h14.4l2.4 6.9h8.3l-13.4-34.1zm-9.2 20.9 4.7-13.4 4.7 13.4h-9.4z" />
              <path d="m14.7 2.9c-2.3 0.2-4.6 1.1-6.1 2.3-2.2 1.6-4.5 3.9-5.7 7-0.8 1.8-1 3.1-1 4.6-0.3 4.7 1.1 8.5 3.3 12l1.3-3.2c-1.2-1.8-1.7-4.3-1.7-7 0-5.5 4.4-11.1 8.8-12.4l0.4-0.1 0.6-1.6v-0.1-0.1l0.4-1-0.3-0.4z" />
              <path d="m43.6 0.8v6.6h16.9l-17.7 22.3v5.2h27.7v-6.3h-17.5l17.2-22.4v-5.4h-26.6z" />
              <path d="m76.7 0.8v34.1h25.4c0.1 0 0-6.4 0-6.4h-17.8c-0.1 0 0-7.5 0-7.5h15.8v-6.5h-15.8v-7.1h17.2v-6.6h-24.8z" />
            </svg>
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
