import { createClient } from "@supabase/supabase-js";

/** cookies() 없이 공개 데이터 조회 — unstable_cache 내부에서 사용 */
export const createStaticClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  );
