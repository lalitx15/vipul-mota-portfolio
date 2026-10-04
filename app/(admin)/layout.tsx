import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/user";
import { AdminSidebar, AdminTopNav } from "@/components/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const hasAdminCookie =
    cookieStore.get("vm_admin_session")?.value === "authenticated";

  let profile = null;
  let isAdmin = hasAdminCookie;

  if (!hasAdminCookie) {
    try {
      const res = await Promise.race([
        getCurrentProfile(),
        new Promise<{ user: null; profile: null; isAdmin: false }>((resolve) =>
          setTimeout(() => resolve({ user: null, profile: null, isAdmin: false }), 1500)
        ),
      ]);
      profile = res.profile;
      isAdmin = res.isAdmin;
    } catch {
      isAdmin = false;
    }
  }

  // Authenticated session check
  if (!hasAdminCookie && !isAdmin) {
    redirect("/admin/login");
  }

  const effectiveProfile = profile || {
    id: "admin-master",
    full_name: "Vipul Mota",
    email: "connect@javigroups.com",
    role: "admin",
    status: "active",
  };

  return (
    <div className="min-h-screen bg-ink text-ivory flex">
      {/* 01. Owner Ink Navigation Sidebar */}
      <AdminSidebar />

      {/* 02. Executive Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <AdminTopNav profile={effectiveProfile as any} />

        <main className="flex-1 p-6 md:p-10 space-y-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
