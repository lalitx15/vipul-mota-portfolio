export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-ink flex flex-col items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center space-y-6">
        {/* Monogram VM with pulsing shimmer */}
        <div className="relative flex items-center justify-center w-20 h-20 border border-line-gold/50 bg-charcoal/50 animate-pulse">
          <span className="font-serif text-3xl font-light tracking-widest text-gold">
            VM
          </span>
          <div className="absolute inset-0 border border-gold/20 scale-110 pointer-events-none" />
        </div>

        {/* Status label */}
        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-stone animate-pulse">
          Loading Portfolio Architecture...
        </div>
      </div>
    </div>
  );
}
