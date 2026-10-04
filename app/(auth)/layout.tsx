import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Authentication | Vipul Mota",
  description: "Access the member area, inner circle archives, and private enquiries.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-ink text-ivory flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column: Cinematic Editorial Brand Panel (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-charcoal border-r border-line flex-col justify-between p-12 xl:p-16">
        {/* Background Image with Duotone & Grain */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1800&auto=format&fit=crop"
            alt="Editorial Portrait"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        </div>

        {/* Brand Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center space-x-3 text-ivory hover:text-gold transition-colors"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold/40 shadow-md group-hover:scale-105 transition-transform bg-black shrink-0">
              <Image
                src="/logo.png"
                alt="Vipul Mota Logo"
                fill
                sizes="32px"
                className="object-cover"
                priority
              />
            </div>
            <span className="editorial-label text-stone group-hover:text-gold transition-colors">
              / Return Home
            </span>
          </Link>
          <span className="editorial-label text-gold">Exclusive Access</span>
        </div>

        {/* Editorial Statement Bottom */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <p className="editorial-label text-stone tracking-[0.2em]">
            The Personal Brand Archive
          </p>
          <blockquote className="font-serif text-3xl xl:text-4xl text-ivory font-light leading-tight">
            &ldquo;Live king size — style, wealth, and undeniable presence.&rdquo;
          </blockquote>
          <p className="text-stone text-xs tracking-wider uppercase pt-2">
            Vipul Mota · Founder of Javi Groups
          </p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-between min-h-screen p-6 sm:p-10 lg:p-16 xl:p-24 overflow-y-auto">
        {/* Mobile Top Bar */}
        <div className="flex lg:hidden items-center justify-between pb-8 border-b border-line">
          <Link href="/" className="font-serif text-2xl tracking-widest text-ivory">
            VM
          </Link>
          <Link
            href="/"
            className="editorial-label text-stone hover:text-gold transition-colors"
          >
            &larr; Return Home
          </Link>
        </div>

        {/* Form Center */}
        <div className="my-auto py-8 max-w-md w-full mx-auto">
          {children}
        </div>

        {/* Subtle Footer Disclaimer */}
        <div className="pt-8 border-t border-line text-stone text-[11px] leading-relaxed text-center sm:text-left flex flex-col sm:flex-row justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Vipul Mota</span>
          <span className="text-stone/70">
            Content is for inspiration and information only.
          </span>
        </div>
      </div>
    </div>
  );
}
