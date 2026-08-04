function SkeletonCard() {
  return (
    <div className="bg-bg-card rounded-2xl overflow-hidden shadow-sm animate-pulse border border-border/30">
      <div className="w-full aspect-[4/3] bg-bg-alt flex items-center justify-center">
        <svg className="w-12 h-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="p-6 space-y-4">
        <div className="h-3 bg-border/40 w-1/4 rounded-full"></div>
        <div className="h-5 bg-border/40 w-3/4 rounded-full mt-2"></div>
        <div className="space-y-2 mt-4">
          <div className="h-3 bg-border/40 w-full rounded-full"></div>
          <div className="h-3 bg-border/40 w-5/6 rounded-full"></div>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="h-5 w-14 bg-border/40 rounded-full"></div>
          <div className="h-5 w-16 bg-border/40 rounded-full"></div>
        </div>
        <div className="h-12 bg-border/40 w-full rounded-full mt-6"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
