"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
    >
      로그아웃
    </button>
  );
};
