const ShimmerCard = ({ type }) => {
  if (type === 'chart') {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
        animate-pulse overflow-hidden relative">
        <div className="h-4 w-24 bg-white/10 rounded mb-4" /> {/* Title */}
        <div className="w-48 h-48 bg-white/10 rounded-full mx-auto mb-2" /> {/* Chart area */}
        <div className="h-3 w-20 bg-white/10 rounded mx-auto" /> {/* Subtitle */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]
          bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>
    );
  }

  if (type === 'data') {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
        animate-pulse overflow-hidden relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-white/10 rounded-lg" /> {/* Icon */}
          <div className="h-4 w-24 bg-white/10 rounded" /> {/* Title */}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center mb-3">
            <div className="space-y-2">
              <div className="h-3 w-32 bg-white/10 rounded" />
              <div className="h-2 w-24 bg-white/10 rounded" />
            </div>
            <div className="h-5 w-16 bg-white/10 rounded-full" />
          </div>
        ))}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]
          bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>
    );
  }

  if (type === "profile") {
    return (
      <div className="space-y-6 animate-pulse">
        {/* High Risk Alert Shimmer */}
        <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-red-500/20" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-red-500/20 rounded" />
            <div className="h-3 w-48 bg-red-500/10 rounded" />
          </div>
        </div>

        {/* Profile Header Shimmer */}
        <div className="flex gap-4">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-xl bg-white/5" />
          
          <div className="flex-1 space-y-4">
            {/* Name and Threat Level */}
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-6 w-40 bg-white/5 rounded" />
                <div className="h-4 w-32 bg-white/5 rounded" />
              </div>
              <div className="h-6 w-24 bg-white/5 rounded-full" />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-white/5 rounded" />
              ))}
              <div className="col-span-2 h-4 bg-white/5 rounded" />
            </div>

            {/* Crime Tags */}
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-20 bg-white/5 rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Sightings Grid Shimmer */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-white/5 rounded" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null; // Add a default return
};

export default ShimmerCard; // Add the export 