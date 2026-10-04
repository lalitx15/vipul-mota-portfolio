import type { Metadata, Viewport } from "next";
import { inter, cormorant, manrope } from "@/lib/fonts";
import SmoothScroll from "@/components/site/SmoothScroll";
import MotionProvider from "@/components/site/MotionProvider";
import CustomCursor from "@/components/site/CustomCursor";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0A0C10",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Vipul Mota",
    default: "Vipul Mota | Actor, Fashion Model & Founder of Javi Groups",
  },
  description:
    "Official personal brand home of Vipul Mota — Mumbai-based actor, fashion model, financier, and founder of Javi Groups. Style, wealth, and presence.",
  keywords: [
    "Vipul Mota",
    "Javi Groups",
    "Mumbai Actor",
    "Fashion Model Mumbai",
    "Financier",
    "Crime World",
  ],
  authors: [{ name: "Vipul Mota" }],
  creator: "Vipul Mota",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Vipul Mota",
    title: "Vipul Mota | Actor, Fashion Model & Founder of Javi Groups",
    description:
      "Mumbai-based actor, fashion model, financier, and founder of Javi Groups. Style. Wealth. Presence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${cormorant.variable} ${manrope.variable} antialiased selection:bg-gold selection:text-ink`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash inline theme script: Always Luxury Dark Space Black */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('theme-preference', 'dark');
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* Suppress third-party Chrome extension script crashes from popping Next.js dev overlay */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                var file = String(e.filename || '');
                var msg = String(e.message || '');
                if (file.indexOf('chrome-extension://') !== -1 || file.indexOf('200.js') !== -1 || msg.indexOf('M_ID') !== -1) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  return true;
                }
              }, true);
              window.addEventListener('unhandledrejection', function(e) {
                var reason = String(e.reason || '');
                if (reason.indexOf('chrome-extension://') !== -1 || reason.indexOf('M_ID') !== -1) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              }, true);
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-ink text-ivory font-sans overflow-x-hidden transition-colors duration-300">
        <ThemeProvider>
          {/* Subtle cinematic grain texture overlay */}
          <div className="noise-overlay" aria-hidden="true" />

          <MotionProvider>
            <ToastProvider>
              <SmoothScroll>
                <CustomCursor />
                {children}
              </SmoothScroll>
            </ToastProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
