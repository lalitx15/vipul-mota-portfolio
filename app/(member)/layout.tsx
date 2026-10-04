import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/user";
import { logoutAction } from "@/lib/supabase/actions";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isAdmin } = await getCurrentProfile();

  if (!user) {
    redirect("/login?next=/member");
  }

  return (
    <div className="min-h-screen bg-ink text-ivory flex flex-col">
      {/* Editorial Member Header */}
      <header className="border-b border-line bg-charcoal/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-site mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="font-serif text-2xl tracking-widest text-ivory hover:text-gold transition-colors"
            >
              VM
            </Link>
            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="editorial-label text-stone">Archive Access</span>
              <span className="text-stone">/</span>
              <span className="editorial-label text-gold">
                {isAdmin ? "Owner / Administrator" : "Inner Circle Member"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="editorial-label text-stone hover:text-ivory transition-colors text-xs"
            >
              &larr; Public Site
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="py-1.5 px-3 border border-gold/40 text-gold hover:bg-gold hover:text-ink text-[11px] uppercase tracking-[0.18em] transition-all"
              >
                Admin Panel
              </Link>
            )}

            <form action={logoutAction}>
              <button
                type="submit"
                className="editorial-label text-stone hover:text-red-400 transition-colors text-xs"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Member Viewport */}
      <main className="flex-1 max-w-site mx-auto w-full px-6 py-12 md:py-16">
        {children}
      </main>

      {/* Member Area Footer */}
      <footer className="border-t border-line py-6 text-center text-xs text-stone">
        <p>
          Inner Circle Member Session &middot; {profile?.email || user.email}
        </p>
      </footer>
    </div>
  );
}
