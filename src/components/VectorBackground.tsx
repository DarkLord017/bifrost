export function VectorBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main geometric vectors - animated rotation */}
      <svg
        className="absolute top-20 left-10 w-32 h-32 text-primary/8 animate-rotate-slow"
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

      {/* Vector arrows constellation - floating animation */}
      <svg
        className="absolute top-40 right-20 w-24 h-24 text-accent-warm/12 animate-float"
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

      {/* Mathematical grid pattern - subtle drift */}
      <svg
        className="absolute bottom-32 left-1/4 w-40 h-40 text-primary/6 animate-drift"
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

      {/* Abstract vector representation - pulsing */}
      <svg
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-56 h-32 text-primary/5 animate-pulse-slow"
        viewBox="0 0 224 128"
        fill="none"
      >
        <g opacity="0.8">
          <path d="M112 64L112 20M112 64L150 35M112 64L150 93M112 64L112 108M112 64L74 93M112 64L74 35" 
                stroke="currentColor" strokeWidth="1" />
          <circle cx="112" cy="64" r="25" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" />
          <circle cx="112" cy="64" r="40" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
          <circle cx="112" cy="64" r="55" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.2" />
          <circle cx="112" cy="20" r="2" fill="currentColor" />
          <circle cx="150" cy="35" r="2" fill="currentColor" />
          <circle cx="150" cy="93" r="2" fill="currentColor" />
          <circle cx="112" cy="108" r="2" fill="currentColor" />
          <circle cx="74" cy="93" r="2" fill="currentColor" />
          <circle cx="74" cy="35" r="2" fill="currentColor" />
          <circle cx="112" cy="64" r="3" fill="currentColor" />
        </g>
      </svg>

      {/* Floating geometric shapes - reverse rotation */}
      <svg
        className="absolute bottom-20 right-10 w-28 h-28 text-accent-warm/10 animate-rotate-reverse"
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

      {/* Data points scatter - floating delayed */}
      <div className="absolute top-1/4 right-1/3 text-primary/8 animate-float-delayed">
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

      {/* Similarity waves - subtle animation */}
      <svg
        className="absolute bottom-40 left-16 w-36 h-20 text-primary/6 animate-pulse-slow"
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

      {/* NEW: Network connections - top right */}
      <svg
        className="absolute top-16 right-1/4 w-48 h-32 text-primary/7 animate-float"
        viewBox="0 0 192 128"
        fill="none"
      >
        <g opacity="0.6">
          <line x1="20" y1="30" x2="60" y2="20" stroke="currentColor" strokeWidth="0.8" />
          <line x1="60" y1="20" x2="100" y2="40" stroke="currentColor" strokeWidth="0.8" />
          <line x1="100" y1="40" x2="140" y2="25" stroke="currentColor" strokeWidth="0.8" />
          <line x1="140" y1="25" x2="170" y2="35" stroke="currentColor" strokeWidth="0.8" />
          <line x1="20" y1="30" x2="35" y2="70" stroke="currentColor" strokeWidth="0.6" />
          <line x1="35" y1="70" x2="80" y2="85" stroke="currentColor" strokeWidth="0.6" />
          <line x1="80" y1="85" x2="120" y2="75" stroke="currentColor" strokeWidth="0.6" />
          <line x1="120" y1="75" x2="170" y2="90" stroke="currentColor" strokeWidth="0.6" />
          
          <circle cx="20" cy="30" r="3" fill="currentColor" />
          <circle cx="60" cy="20" r="2.5" fill="currentColor" />
          <circle cx="100" cy="40" r="2.5" fill="currentColor" />
          <circle cx="140" cy="25" r="2" fill="currentColor" />
          <circle cx="170" cy="35" r="2" fill="currentColor" />
          <circle cx="35" cy="70" r="2" fill="currentColor" />
          <circle cx="80" cy="85" r="2.5" fill="currentColor" />
          <circle cx="120" cy="75" r="2" fill="currentColor" />
          <circle cx="170" cy="90" r="2" fill="currentColor" />
        </g>
      </svg>

      {/* NEW: Vector field visualization - left side */}
      <svg
        className="absolute top-1/2 left-8 w-20 h-40 text-accent-warm/8 animate-drift"
        viewBox="0 0 80 160"
        fill="none"
      >
        <g opacity="0.7">
          <path d="M10 20L18 16L14 20L18 24L10 20Z" fill="currentColor" />
          <path d="M30 35L38 31L34 35L38 39L30 35Z" fill="currentColor" />
          <path d="M50 50L58 46L54 50L58 54L50 50Z" fill="currentColor" />
          <path d="M70 65L78 61L74 65L78 69L70 65Z" fill="currentColor" />
          <path d="M15 80L23 76L19 80L23 84L15 80Z" fill="currentColor" />
          <path d="M35 95L43 91L39 95L43 99L35 95Z" fill="currentColor" />
          <path d="M55 110L63 106L59 110L63 114L55 110Z" fill="currentColor" />
          <path d="M25 125L33 121L29 125L33 129L25 125Z" fill="currentColor" />
          <path d="M45 140L53 136L49 140L53 144L45 140Z" fill="currentColor" />
        </g>
      </svg>

      {/* NEW: Concentric data rings - bottom center */}
      <svg
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-44 h-44 text-primary/5 animate-rotate-slow"
        viewBox="0 0 176 176"
        fill="none"
      >
        <circle cx="88" cy="88" r="70" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.8" />
        <circle cx="88" cy="88" r="50" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" />
        <circle cx="88" cy="88" r="30" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
        <circle cx="88" cy="88" r="15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.8" />
        
        {/* Data points on rings */}
        <circle cx="88" cy="18" r="2" fill="currentColor" />
        <circle cx="158" cy="88" r="2" fill="currentColor" />
        <circle cx="88" cy="158" r="2" fill="currentColor" />
        <circle cx="18" cy="88" r="2" fill="currentColor" />
        <circle cx="126" cy="50" r="1.5" fill="currentColor" />
        <circle cx="126" cy="126" r="1.5" fill="currentColor" />
        <circle cx="50" cy="126" r="1.5" fill="currentColor" />
        <circle cx="50" cy="50" r="1.5" fill="currentColor" />
        <circle cx="109" cy="67" r="1" fill="currentColor" />
        <circle cx="109" cy="109" r="1" fill="currentColor" />
        <circle cx="67" cy="109" r="1" fill="currentColor" />
        <circle cx="67" cy="67" r="1" fill="currentColor" />
      </svg>

      {/* NEW: Abstract mathematical curves - top left */}
      <svg
        className="absolute top-32 left-1/3 w-32 h-24 text-accent-warm/6 animate-pulse-slow"
        viewBox="0 0 128 96"
        fill="none"
      >
        <path
          d="M10 48Q32 20 64 48T118 48"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M10 48Q32 76 64 48T118 48"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M20 48Q40 30 60 48Q80 66 100 48Q110 42 118 48"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          opacity="0.4"
        />
        <circle cx="32" cy="34" r="1.5" fill="currentColor" />
        <circle cx="64" cy="48" r="2" fill="currentColor" />
        <circle cx="96" cy="62" r="1.5" fill="currentColor" />
      </svg>

      {/* NEW: Dimensional projection - right side middle */}
      <svg
        className="absolute top-1/2 right-16 w-28 h-36 text-primary/6 animate-float-delayed"
        viewBox="0 0 112 144"
        fill="none"
      >
        <g opacity="0.7">
          <path d="M20 30L30 20L40 30L30 40Z" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M30 40L40 30L50 40L40 50Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <path d="M40 50L50 40L60 50L50 60Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <path d="M50 60L60 50L70 60L60 70Z" stroke="currentColor" strokeWidth="0.6" fill="none" />
          <path d="M60 70L70 60L80 70L70 80Z" stroke="currentColor" strokeWidth="0.6" fill="none" />
          <path d="M70 80L80 70L90 80L80 90Z" stroke="currentColor" strokeWidth="0.4" fill="none" />
          
          <circle cx="30" cy="25" r="1.5" fill="currentColor" />
          <circle cx="45" cy="35" r="1.5" fill="currentColor" />
          <circle cx="55" cy="45" r="1.5" fill="currentColor" />
          <circle cx="65" cy="55" r="1.5" fill="currentColor" />
          <circle cx="75" cy="65" r="1.5" fill="currentColor" />
          <circle cx="85" cy="75" r="1.5" fill="currentColor" />
        </g>
      </svg>

      {/* NEW: Scattered vector endpoints - bottom right */}
      <div className="absolute bottom-16 right-1/4 text-accent-warm/10 animate-drift">
        <div className="relative w-40 h-28">
          <div className="absolute top-2 left-8 w-2 h-2 bg-current rounded-full animate-pulse-slow"></div>
          <div className="absolute top-6 left-20 w-1.5 h-1.5 bg-current rounded-full"></div>
          <div className="absolute top-10 left-32 w-1 h-1 bg-current rounded-full animate-pulse-slow"></div>
          <div className="absolute top-14 left-4 w-1.5 h-1.5 bg-current rounded-full"></div>
          <div className="absolute top-18 left-16 w-2.5 h-2.5 bg-current rounded-full"></div>
          <div className="absolute top-22 left-28 w-1 h-1 bg-current rounded-full animate-pulse-slow"></div>
          <div className="absolute top-26 left-36 w-1.5 h-1.5 bg-current rounded-full"></div>
          <div className="absolute top-4 left-36 w-1 h-1 bg-current rounded-full"></div>
          <div className="absolute top-12 left-12 w-1 h-1 bg-current rounded-full"></div>
          <div className="absolute top-20 left-24 w-1.5 h-1.5 bg-current rounded-full animate-pulse-slow"></div>
          <div className="absolute top-8 left-8 w-1 h-1 bg-current rounded-full"></div>
          <div className="absolute top-16 left-20 w-1 h-1 bg-current rounded-full"></div>
        </div>
      </div>

      {/* NEW: Similarity gradient visualization - top center */}
      <svg
        className="absolute top-8 left-1/2 transform -translate-x-1/2 w-60 h-16 text-primary/4 animate-float"
        viewBox="0 0 240 64"
        fill="none"
      >
        <defs>
          <linearGradient id="similarityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect x="0" y="20" width="240" height="24" fill="url(#similarityGrad)" rx="12" />
        <circle cx="40" cy="32" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="120" cy="32" r="4" fill="currentColor" />
        <circle cx="200" cy="32" r="3" fill="currentColor" opacity="0.8" />
      </svg>
    </div>
  );
}