export function VectorBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main geometric vectors */}
      <svg
        className="absolute top-20 left-10 w-32 h-32 text-primary/8 transform -rotate-12"
        viewBox="0 0 128 128"
        fill="none"
      >
        <path
          d="M20 64L64 20L108 64L64 108L20 64Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <circle cx="64" cy="64" r="4" fill="currentColor" />
        <circle cx="32" cy="64" r="2" fill="currentColor" />
        <circle cx="96" cy="64" r="2" fill="currentColor" />
        <circle cx="64" cy="32" r="2" fill="currentColor" />
        <circle cx="64" cy="96" r="2" fill="currentColor" />
      </svg>

      {/* Vector arrows constellation */}
      <svg
        className="absolute top-40 right-20 w-24 h-24 text-accent-warm/12 transform rotate-45"
        viewBox="0 0 96 96"
        fill="none"
      >
        <path d="M48 8L48 88M8 48L88 48" stroke="currentColor" strokeWidth="1" />
        <path d="M20 20L76 76M76 20L20 76" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <circle cx="48" cy="48" r="3" fill="currentColor" />
        <circle cx="24" cy="24" r="1.5" fill="currentColor" />
        <circle cx="72" cy="72" r="1.5" fill="currentColor" />
        <circle cx="72" cy="24" r="1.5" fill="currentColor" />
        <circle cx="24" cy="72" r="1.5" fill="currentColor" />
      </svg>

      {/* Mathematical grid pattern */}
      <svg
        className="absolute bottom-32 left-1/4 w-40 h-40 text-primary/6"
        viewBox="0 0 160 160"
        fill="none"
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="160" height="160" fill="url(#grid)" />
        <path
          d="M20 80Q40 40 80 80T140 80"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
      </svg>

      {/* Abstract vector representation */}
      <svg
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-56 h-32 text-primary/5"
        viewBox="0 0 224 128"
        fill="none"
      >
        <g opacity="0.8">
          {/* Vector lines radiating from center */}
          <path d="M112 64L112 20M112 64L150 35M112 64L150 93M112 64L112 108M112 64L74 93M112 64L74 35" 
                stroke="currentColor" strokeWidth="1" />
          {/* Similarity circles */}
          <circle cx="112" cy="64" r="25" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" />
          <circle cx="112" cy="64" r="40" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
          <circle cx="112" cy="64" r="55" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.2" />
          {/* Vector endpoints */}
          <circle cx="112" cy="20" r="2" fill="currentColor" />
          <circle cx="150" cy="35" r="2" fill="currentColor" />
          <circle cx="150" cy="93" r="2" fill="currentColor" />
          <circle cx="112" cy="108" r="2" fill="currentColor" />
          <circle cx="74" cy="93" r="2" fill="currentColor" />
          <circle cx="74" cy="35" r="2" fill="currentColor" />
          <circle cx="112" cy="64" r="3" fill="currentColor" />
        </g>
      </svg>

      {/* Floating geometric shapes */}
      <svg
        className="absolute bottom-20 right-10 w-28 h-28 text-accent-warm/10 transform rotate-12"
        viewBox="0 0 112 112"
        fill="none"
      >
        <polygon
          points="56,10 85,42 85,70 56,102 27,70 27,42"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <circle cx="56" cy="56" r="8" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="56" cy="26" r="2" fill="currentColor" />
        <circle cx="70" cy="42" r="2" fill="currentColor" />
        <circle cx="70" cy="70" r="2" fill="currentColor" />
        <circle cx="56" cy="86" r="2" fill="currentColor" />
        <circle cx="42" cy="70" r="2" fill="currentColor" />
        <circle cx="42" cy="42" r="2" fill="currentColor" />
      </svg>

      {/* Data points scatter */}
      <div className="absolute top-1/4 right-1/3 text-primary/8">
        <div className="relative w-32 h-32">
          <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-current rounded-full"></div>
          <div className="absolute top-8 left-16 w-1 h-1 bg-current rounded-full"></div>
          <div className="absolute top-12 left-24 w-1.5 h-1.5 bg-current rounded-full"></div>
          <div className="absolute top-16 left-8 w-1 h-1 bg-current rounded-full"></div>
          <div className="absolute top-20 left-20 w-2 h-2 bg-current rounded-full"></div>
          <div className="absolute top-24 left-12 w-1 h-1 bg-current rounded-full"></div>
          <div className="absolute top-28 left-28 w-1.5 h-1.5 bg-current rounded-full"></div>
          <div className="absolute top-6 left-28 w-1 h-1 bg-current rounded-full"></div>
          <div className="absolute top-14 left-4 w-1 h-1 bg-current rounded-full"></div>
          <div className="absolute top-26 left-6 w-1 h-1 bg-current rounded-full"></div>
        </div>
      </div>

      {/* Similarity waves */}
      <svg
        className="absolute bottom-40 left-16 w-36 h-20 text-primary/6"
        viewBox="0 0 144 80"
        fill="none"
      >
        <path
          d="M0 40Q36 20 72 40T144 40"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M0 40Q36 60 72 40T144 40"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M0 40Q24 30 48 40Q72 50 96 40Q120 30 144 40"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}