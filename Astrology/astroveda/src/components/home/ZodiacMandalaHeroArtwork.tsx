'use client';

export default function ZodiacMandalaHeroArtwork() {
  // 12 Zodiac signs with classical astrological glyph paths and names
  const zodiacSigns = [
    {
      name: 'Aries',
      sanskrit: 'मेष',
      angle: 0,
      // Ram horns glyph
      path: 'M -7,-3 C -10,-10 -3,-14 0,-7 C 3,-14 10,-10 7,-3 C 5,2 0,9 0,14 M 0, -7 L 0, 14',
    },
    {
      name: 'Taurus',
      sanskrit: 'वृषभ',
      angle: 30,
      // Bull head with horns
      path: 'M -9,-6 C -7,-12 7,-12 9,-6 C 7,-3 -7,-3 -9,-6 Z M 0,0 C -6,0 -9,4 -9,9 C -9,14 -4,18 0,18 C 4,18 9,14 9,9 C 9,4 6,0 0,0 Z',
    },
    {
      name: 'Gemini',
      sanskrit: 'मिथुन',
      angle: 60,
      // Twins roman II with top/bottom arcs
      path: 'M -10,-10 C -4,-7 4,-7 10,-10 M -10,10 C -4,7 4,7 10,10 M -4,-7 L -4,7 M 4,-7 L 4,7',
    },
    {
      name: 'Cancer',
      sanskrit: 'कर्क',
      angle: 90,
      // Crab claws 69 horizontal
      path: 'M -7,-5 A 4,4 0 1 0 -3,-1 C 2,-1 8,-5 10,-9 M 7,5 A 4,4 0 1 0 3,1 C -2,1 -8,5 -10,9',
    },
    {
      name: 'Leo',
      sanskrit: 'सिंह',
      angle: 120,
      // Lion mane & tail
      path: 'M -10,3 A 4,4 0 1 1 -5,-2 C -3,-6 3,-9 7,-6 C 11,-2 8,6 10,10 C 11,12 14,11 15,9',
    },
    {
      name: 'Virgo',
      sanskrit: 'कन्या',
      angle: 150,
      // Maiden M with loop & tail
      path: 'M -10,8 L -10,-6 C -10,-10 -6,-10 -6,-6 L -6,6 C -6,-10 -2,-10 -2,-6 L -2,6 C -2,-10 2,-10 2,-6 L 2,8 C 2,13 7,13 8,10 L 10,6 M 4,4 L 11,11',
    },
    {
      name: 'Libra',
      sanskrit: 'तुला',
      angle: 180,
      // Scales with upper dome and base line
      path: 'M -10,8 L 10,8 M -10,2 L -4,2 A 5,5 0 0 1 4,2 L 10,2',
    },
    {
      name: 'Scorpio',
      sanskrit: 'वृश्चिक',
      angle: 210,
      // Scorpion M with arrow stinger
      path: 'M -10,8 L -10,-6 C -10,-10 -6,-10 -6,-6 L -6,6 C -6,-10 -2,-10 -2,-6 L -2,6 C -2,-10 2,-10 2,-6 L 2,8 C 2,10 6,10 8,8 L 10,6 M 7,3 L 11,6 L 7,9',
    },
    {
      name: 'Sagittarius',
      sanskrit: 'धनु',
      angle: 240,
      // Archer arrow with cross
      path: 'M -8,8 L 9,-9 M 2,-9 L 9,-9 L 9,-2 M -3,0 L 3,6',
    },
    {
      name: 'Capricorn',
      sanskrit: 'मकर',
      angle: 270,
      // Goat horn and fish tail
      path: 'M -10,-7 L -6,3 C -4,7 0,7 2,3 L 6,-7 C 9,-7 12,-3 9,4 C 6,11 0,11 -1,7 C -2,4 0,0 4,0',
    },
    {
      name: 'Aquarius',
      sanskrit: 'कुंभ',
      angle: 300,
      // Two undulating water waves
      path: 'M -10,-4 L -6,-8 L -2,-4 L 2,-8 L 6,-4 L 10,-8 M -10,4 L -6,0 L -2,4 L 2,0 L 6,4 L 10,0',
    },
    {
      name: 'Pisces',
      sanskrit: 'मीन',
      angle: 330,
      // Two opposing crescents tied by horizontal chord
      path: 'M -8,-10 C -4,-3 -4,3 -8,10 M 8,-10 C 4,-3 4,3 8,10 M -9,0 L 9,0',
    },
  ];

  // 72 minute tick coordinates (every 5 degrees)
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const deg = i * 5;
    const isMajor = deg % 30 === 0;
    const isMid = deg % 15 === 0;
    const r1 = isMajor ? 262 : isMid ? 264 : 266;
    const r2 = 270;
    return { deg, r1, r2, isMajor };
  });

  // Twinkling background stars coordinates
  const stars = [
    { x: 45, y: 55, r: 1.5, delay: '0s', dur: '3.2s' },
    { x: 120, y: 80, r: 1.8, delay: '1.2s', dur: '4s' },
    { x: 520, y: 90, r: 1.6, delay: '0.5s', dur: '3.6s' },
    { x: 555, y: 160, r: 1.4, delay: '2.1s', dur: '4.5s' },
    { x: 75, y: 220, r: 1.2, delay: '1.8s', dur: '3.8s' },
    { x: 540, y: 440, r: 1.7, delay: '0.8s', dur: '3.4s' },
    { x: 60, y: 470, r: 1.3, delay: '2.5s', dur: '4.2s' },
    { x: 140, y: 540, r: 1.5, delay: '1.5s', dur: '3.5s' },
    { x: 490, y: 530, r: 1.4, delay: '2.8s', dur: '3.9s' },
    { x: 280, y: 40, r: 2.2, delay: '0.2s', dur: '4.8s', spike: true },
    { x: 510, y: 280, r: 2.0, delay: '1.9s', dur: '5.1s', spike: true },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto flex items-center justify-center select-none">
      
      {/* 1. Deep Atmospheric Cosmic Nebula Underlay */}
      <div 
        className="absolute inset-4 rounded-full bg-radial from-[#F6D186]/18 via-[#27304A]/40 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true" 
      />
      <div 
        className="absolute -top-6 -right-6 w-56 h-56 rounded-full bg-[#D8B56D]/15 blur-2xl pointer-events-none"
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-8 -left-8 w-64 h-64 rounded-full bg-[#EF3340]/12 blur-3xl pointer-events-none"
        aria-hidden="true" 
      />

      {/* 2. Main High-Fidelity SVG Zodiac Mandala */}
      <svg
        className="w-full h-full filter drop-shadow-[0_0_35px_rgba(216,181,109,0.28)]"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Golden Gradient Shaders */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D6" />
            <stop offset="35%" stopColor="#F6D186" />
            <stop offset="70%" stopColor="#D8B56D" />
            <stop offset="100%" stopColor="#A47B2C" />
          </linearGradient>

          <linearGradient id="goldStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D8B56D" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFF0CA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D8B56D" stopOpacity="0.4" />
          </linearGradient>

          <radialGradient id="sunCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7E0" stopOpacity="1" />
            <stop offset="25%" stopColor="#F6D186" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#D8B56D" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#B38022" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10172B" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="omDiscGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2A1B04" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#181308" stopOpacity="0.9" />
            <stop offset="90%" stopColor="#D8B56D" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F6D186" stopOpacity="1" />
          </radialGradient>

          {/* SVG Glow Filter for Radiant Centers & Spikes */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Scoped CSS Animation Keyframes */}
          <style>{`
            @keyframes spinClockwise {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes spinCounterClockwise {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            @keyframes pulseBreath {
              0%, 100% {
                transform: scale(1);
                opacity: 0.92;
              }
              50% {
                transform: scale(1.035);
                opacity: 1;
              }
            }
            @keyframes twinkleFade {
              0%, 100% {
                opacity: 0.25;
                transform: scale(0.85);
              }
              50% {
                opacity: 1;
                transform: scale(1.2);
              }
            }
            @keyframes shimmerGlow {
              0%, 100% {
                filter: drop-shadow(0 0 2px rgba(216,181,109,0.5));
                opacity: 0.85;
              }
              50% {
                filter: drop-shadow(0 0 8px rgba(255,223,159,1));
                opacity: 1;
              }
            }
            .anim-spin-wheel {
              transform-origin: 300px 300px;
              animation: spinClockwise 120s linear infinite;
            }
            .anim-spin-middle {
              transform-origin: 300px 300px;
              animation: spinCounterClockwise 85s linear infinite;
            }
            .anim-spin-inner {
              transform-origin: 300px 300px;
              animation: spinClockwise 65s linear infinite;
            }
            .anim-pulse-core {
              transform-origin: 300px 300px;
              animation: pulseBreath 4.5s ease-in-out infinite;
            }
            .anim-shimmer {
              animation: shimmerGlow 3s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* 3. Static Cosmic Background: Twinkling Constellation Stars & Distant Orbs */}
        <g id="cosmic-stars">
          {stars.map((st, i) => (
            <g key={i}>
              <circle
                cx={st.x}
                cy={st.y}
                r={st.r}
                fill="#FFF4D0"
                style={{
                  animation: `twinkleFade ${st.dur} ease-in-out infinite`,
                  animationDelay: st.delay,
                  transformOrigin: `${st.x}px ${st.y}px`,
                }}
              />
              {st.spike && (
                <path
                  d={`M ${st.x - 7} ${st.y} L ${st.x + 7} ${st.y} M ${st.x} ${st.y - 7} L ${st.x} ${st.y + 7}`}
                  stroke="#F6D186"
                  strokeWidth="0.8"
                  opacity="0.7"
                  style={{
                    animation: `twinkleFade ${st.dur} ease-in-out infinite`,
                    animationDelay: st.delay,
                    transformOrigin: `${st.x}px ${st.y}px`,
                  }}
                />
              )}
            </g>
          ))}

          {/* Distant Planet Orb (Upper Left) */}
          <circle cx="105" cy="140" r="11" fill="#1C2744" stroke="#D8B56D" strokeWidth="0.8" opacity="0.8" />
          <ellipse cx="105" cy="140" rx="19" ry="4" stroke="#F6D186" strokeWidth="0.75" opacity="0.6" transform="rotate(-25 105 140)" />
          
          {/* Subtle Golden Constellation Tracer Lines */}
          <path
            d="M 60,80 L 105,140 L 170,110 L 220,130 M 440,90 L 510,75 L 535,130 L 490,170"
            stroke="#D8B56D"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.35"
          />
        </g>

        {/* 4. Outer Rotating Wheel: Zodiac Glyphs, Ray Dividers & Degree Ticks (120s Clockwise) */}
        <g className="anim-spin-wheel" id="zodiac-wheel">
          
          {/* Outermost Beaded Golden Ring */}
          <circle cx="300" cy="300" r="286" stroke="url(#goldGradient)" strokeWidth="1.2" opacity="0.7" />
          <circle cx="300" cy="300" r="282" stroke="#D8B56D" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.5" />
          
          {/* Main Zodiac Track Ring */}
          <circle cx="300" cy="300" r="270" stroke="url(#goldGradient)" strokeWidth="1.6" />
          <circle cx="300" cy="300" r="214" stroke="url(#goldGradient)" strokeWidth="1.4" />

          {/* Minute & Degree Ticks */}
          {ticks.map((t, idx) => {
            const rad = (t.deg * Math.PI) / 180;
            const x1 = 300 + t.r1 * Math.cos(rad);
            const y1 = 300 + t.r1 * Math.sin(rad);
            const x2 = 300 + t.r2 * Math.cos(rad);
            const y2 = 300 + t.r2 * Math.sin(rad);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#F6D186"
                strokeWidth={t.isMajor ? 1.4 : 0.75}
                opacity={t.isMajor ? 0.9 : 0.45}
              />
            );
          })}

          {/* 12 Divisional Rays Separating the 12 Bhavas / Signs */}
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            const x1 = 300 + 214 * Math.cos(rad);
            const y1 = 300 + 214 * Math.sin(rad);
            const x2 = 300 + 270 * Math.cos(rad);
            const y2 = 300 + 270 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FFDF9F"
                strokeWidth="1.6"
                opacity="0.85"
              />
            );
          })}

          {/* 12 Distinct Zodiac Glyphs Positioned at r = 242 */}
          {zodiacSigns.map((z, idx) => {
            // Offset by 15 deg so glyph sits in middle of 30 deg sector
            const signAngle = z.angle + 15;
            const rad = (signAngle * Math.PI) / 180;
            const cx = 300 + 242 * Math.cos(rad);
            const cy = 300 + 242 * Math.sin(rad);
            return (
              <g
                key={z.name}
                transform={`translate(${cx}, ${cy}) rotate(${signAngle + 90})`}
                className={idx % 3 === 0 ? 'anim-shimmer' : ''}
              >
                {/* Subtle Circular Highlight Aura for Each Sign */}
                <circle cx="0" cy="0" r="14" fill="#D8B56D" fillOpacity="0.08" />
                {/* Zodiac Glyph Stroke */}
                <path
                  d={z.path}
                  stroke="url(#goldGradient)"
                  strokeWidth="2.0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#goldGlow)"
                />
              </g>
            );
          })}
        </g>

        {/* 5. Middle Ornamental Ring: 24 Nakshatra Petals & Geometry (85s Counter-Clockwise) */}
        <g className="anim-spin-middle" id="middle-ornamental-ring">
          
          <circle cx="300" cy="300" r="202" stroke="#D8B56D" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.6" />
          <circle cx="300" cy="300" r="172" stroke="url(#goldGradient)" strokeWidth="1.2" opacity="0.85" />

          {/* 24 Auspicious Vedic Lotus Petals */}
          {Array.from({ length: 24 }).map((_, i) => {
            const rot = i * 15;
            return (
              <path
                key={i}
                d="M 300,128 C 304,136 308,144 300,154 C 292,144 296,136 300,128 Z"
                fill="none"
                stroke="#F6D186"
                strokeWidth="0.9"
                opacity="0.75"
                transform={`rotate(${rot} 300 300)`}
              />
            );
          })}

          {/* Sacred Dodecagram / Interlocking 12-Point Star */}
          <polygon
            points="300,132 376,188 388,276 344,354 256,354 212,276 224,188"
            fill="none"
            stroke="#D8B56D"
            strokeWidth="0.7"
            opacity="0.35"
          />
          <polygon
            points="300,468 224,412 212,324 256,246 344,246 388,324 376,412"
            fill="none"
            stroke="#D8B56D"
            strokeWidth="0.7"
            opacity="0.35"
          />

          {/* Nakshatra Star Dots on Inner Perimeter */}
          {Array.from({ length: 28 }).map((_, i) => {
            const rad = (i * (360 / 28) * Math.PI) / 180;
            const px = 300 + 172 * Math.cos(rad);
            const py = 300 + 172 * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r="1.75"
                fill="#FFF4D0"
                opacity="0.8"
              />
            );
          })}
        </g>

        {/* 6. Inner Geometric Chakra: 12 Solar Rays (65s Clockwise) */}
        <g className="anim-spin-inner" id="inner-solar-chakra">
          <circle cx="300" cy="300" r="142" stroke="url(#goldGradient)" strokeWidth="1.2" />
          <circle cx="300" cy="300" r="118" stroke="#D8B56D" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 12 Flaming Sun Spokes / Rays */}
          {Array.from({ length: 12 }).map((_, i) => {
            const rot = i * 30;
            return (
              <g key={i} transform={`rotate(${rot} 300 300)`}>
                <line x1="300" y1="142" x2="300" y2="118" stroke="#F6D186" strokeWidth="1.5" opacity="0.9" />
                <circle cx="300" cy="116" r="2.2" fill="#FFDF9F" />
              </g>
            );
          })}
        </g>

        {/* 7. Central Radiant Sun / Luminous Om Disc (Gentle 4.5s Breathing Pulse) */}
        <g className="anim-pulse-core" id="central-om-core">
          
          {/* Soft Expanding Golden Aura */}
          <circle cx="300" cy="300" r="105" fill="url(#sunCoreGlow)" filter="url(#intenseGlow)" opacity="0.85" />
          
          {/* Intricate Sun Ray Flare Petals */}
          {Array.from({ length: 16 }).map((_, i) => {
            const rot = i * 22.5;
            return (
              <path
                key={i}
                d="M 300,205 L 304,222 L 300,230 L 296,222 Z"
                fill="url(#goldGradient)"
                opacity="0.8"
                transform={`rotate(${rot} 300 300)`}
              />
            );
          })}

          {/* Central Sacred Om Shield Disc */}
          <circle
            cx="300"
            cy="300"
            r="68"
            fill="url(#omDiscGlow)"
            stroke="url(#goldGradient)"
            strokeWidth="2.2"
            filter="url(#goldGlow)"
          />
          <circle
            cx="300"
            cy="300"
            r="61"
            stroke="#D8B56D"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            opacity="0.75"
          />

          {/* Golden Sacred Om Symbol (ॐ) */}
          <text
            x="300"
            y="316"
            textAnchor="middle"
            fill="url(#goldGradient)"
            fontSize="54"
            fontWeight="bold"
            fontFamily="var(--font-heading), 'EB Garamond', serif"
            filter="url(#goldGlow)"
            className="select-none"
          >
            ॐ
          </text>
        </g>

        {/* 8. Meditating Yogi Silhouette & Sacred Blooming Lotus at Lower Center */}
        <g id="meditating-sage-sanctum" transform="translate(0, 30)">
          
          {/* Subtle Ambient Lotus Water Mist / Glow */}
          <ellipse cx="300" cy="460" rx="90" ry="16" fill="#F6D186" fillOpacity="0.08" filter="url(#intenseGlow)" />
          
          {/* Sacred Multi-Layered Blooming Lotus Petals */}
          <g id="blooming-lotus" opacity="0.95">
            {/* Outer Pink/Gold Petals */}
            <path d="M 300,448 C 275,448 245,462 230,472 C 260,474 285,466 300,458 C 315,466 340,474 370,472 C 355,462 325,448 300,448 Z" fill="#D8B56D" opacity="0.8" />
            <path d="M 300,442 C 280,442 255,456 242,466 C 270,468 288,460 300,452 C 312,460 330,468 358,466 C 345,456 320,442 300,442 Z" fill="#EF3340" opacity="0.65" />
            {/* Core Upright Petals */}
            <path d="M 300,432 C 288,438 274,452 270,462 C 285,462 295,454 300,446 C 305,454 315,462 330,462 C 326,452 312,438 300,432 Z" fill="#F6D186" opacity="0.9" />
          </g>

          {/* Meditating Silhouette (Yogi in Deep Dhyana) */}
          <g id="yogi-silhouette">
            {/* Soft Ambient Rim Light Behind Meditator Head */}
            <circle cx="300" cy="380" r="22" fill="#F6D186" fillOpacity="0.2" filter="url(#goldGlow)" />

            {/* Dark Midnight Body Silhouette */}
            {/* Head */}
            <circle cx="300" cy="378" r="14" fill="#0B1326" stroke="#D8B56D" strokeWidth="0.8" />
            
            {/* Third Eye / Ajna Chakra Point */}
            <circle cx="300" cy="376" r="2" fill="#EF3340" filter="url(#goldGlow)" />

            {/* Torso & Arms in Dhyana Mudra */}
            <path
              d="M 300,394 
                 C 285,394 276,404 274,418 
                 L 270,434 
                 C 270,440 276,442 282,439 
                 L 290,434 L 290,446 L 310,446 L 310,434 
                 L 318,439 
                 C 324,442 330,440 330,434 
                 L 326,418 
                 C 324,404 315,394 300,394 Z"
              fill="#0B1326"
              stroke="#D8B56D"
              strokeWidth="0.75"
            />

            {/* Folded Crossed Legs (Padmasana Base) */}
            <path
              d="M 260,442 
                 C 260,436 272,431 285,434 
                 L 300,436 
                 L 315,434 
                 C 328,431 340,436 340,442 
                 C 340,451 325,453 300,453 
                 C 275,453 260,451 260,442 Z"
              fill="#0B1326"
              stroke="#D8B56D"
              strokeWidth="0.75"
            />
          </g>

          {/* Floating Sacred Sanskrit Script Badge Below Yogi */}
          <g transform="translate(300, 480)">
            <rect x="-95" y="-12" width="190" height="24" rx="12" fill="#10172B" fillOpacity="0.9" stroke="#D8B56D" strokeWidth="0.8" />
            <text x="0" y="4" textAnchor="middle" fill="#F6D186" fontSize="10" fontWeight="bold" letterSpacing="0.12em" fontFamily="var(--font-body), sans-serif">
              ॥ यद् पिण्डे तद् ब्रह्माण्डे ॥
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}

