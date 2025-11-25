import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin · Libby's Aroid Apothecary",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/login?next=${encodeURIComponent("/admin")}`);
  }

  return <AdminShell userEmail={session.user.email ?? ""}>{children}</AdminShell>;
}


