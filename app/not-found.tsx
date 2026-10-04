import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-ink">
      <div className="editorial-label text-gold mb-4">Error 404 — Void</div>
      <h1 className="font-serif text-8xl md:text-9xl font-light text-ivory tracking-tight">
        404
      </h1>
      <p className="mt-6 text-stone text-base max-w-md leading-relaxed font-light">
        The archive or plate you are looking for has been relocated or does not exist.
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center px-8 py-3.5 border border-line text-xs uppercase tracking-widest text-ivory hover:border-gold hover:text-gold transition-colors duration-300"
        >
          Return to Foundation &rarr;
        </Link>
      </div>
    </div>
  );
}
