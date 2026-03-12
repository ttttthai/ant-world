import { motion } from 'framer-motion';

const illustrationStyle = {
  width: '100%',
  height: '100%',
  display: 'block',
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1.2 },
};

/* 168 MYA — Hymenoptera Ancestors: ancient wasp in Jurassic ferns */
export function HymenopteraAncestors() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jurassicSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3a1a" />
          <stop offset="100%" stopColor="#1a140e" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="0.8" cy="0.2">
          <stop offset="0%" stopColor="#4a5a2a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="url(#jurassicSky)" />
      <rect width="400" height="240" fill="url(#moonGlow)" />
      {/* Fern fronds */}
      {[40, 120, 280, 340].map((x, i) => (
        <g key={i} transform={`translate(${x}, 240)`}>
          <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.15, duration: 0.8 }}>
            {[-30, -15, 0, 15, 30].map((angle, j) => (
              <g key={j} transform={`rotate(${angle})`}>
                <line x1="0" y1="0" x2="0" y2={-60 - i * 10} stroke="#3a5a20" strokeWidth="1.5" opacity="0.7" />
                {Array.from({ length: 6 }).map((_, k) => (
                  <ellipse key={k} cx={k % 2 === 0 ? -5 : 5} cy={-10 - k * 8} rx="6" ry="2.5" fill="#3a5a20" opacity={0.5 - k * 0.05} />
                ))}
              </g>
            ))}
          </motion.g>
        </g>
      ))}
      {/* Ancient wasp */}
      <motion.g transform="translate(200, 100)" {...fadeIn}>
        {/* Wings */}
        <ellipse cx="-12" cy="-12" rx="22" ry="10" fill="#5a6a3a" opacity="0.3" transform="rotate(-20)" />
        <ellipse cx="12" cy="-12" rx="22" ry="10" fill="#5a6a3a" opacity="0.3" transform="rotate(20)" />
        {/* Body segments */}
        <ellipse cx="0" cy="-8" rx="7" ry="6" fill="#6a5020" />
        <ellipse cx="0" cy="6" rx="5" ry="5" fill="#8a6a30" />
        <ellipse cx="0" cy="20" rx="8" ry="9" fill="#6a4a18" />
        {/* Petiole */}
        <ellipse cx="0" cy="12" rx="2" ry="3" fill="#5a4018" />
        {/* Head */}
        <circle cx="0" cy="-16" r="6" fill="#7a5a28" />
        <circle cx="-3" cy="-18" r="1.2" fill="#1a1a0a" />
        <circle cx="3" cy="-18" r="1.2" fill="#1a1a0a" />
        {/* Antennae */}
        <path d="M-3,-22 Q-8,-35 -15,-38" stroke="#7a5a28" strokeWidth="1" fill="none" />
        <path d="M3,-22 Q8,-35 15,-38" stroke="#7a5a28" strokeWidth="1" fill="none" />
        {/* Legs */}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path d={`M${side * 5},-5 Q${side * 18},-12 ${side * 22},-2`} stroke="#6a4a18" strokeWidth="1" fill="none" />
            <path d={`M${side * 4},5 Q${side * 16},2 ${side * 20},10`} stroke="#6a4a18" strokeWidth="1" fill="none" />
            <path d={`M${side * 5},18 Q${side * 15},22 ${side * 18},30`} stroke="#6a4a18" strokeWidth="1" fill="none" />
          </g>
        ))}
        {/* Stinger */}
        <line x1="0" y1="29" x2="0" y2="35" stroke="#5a3a10" strokeWidth="1.5" />
      </motion.g>
      {/* Atmosphere particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.circle
          key={i}
          cx={30 + Math.random() * 340}
          cy={20 + Math.random() * 200}
          r={0.5 + Math.random() * 1}
          fill="#6a8a3a"
          opacity={0.2 + Math.random() * 0.2}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </svg>
  );
}

/* 130 MYA — Proto-Ant Wasps: wasps nesting together in colony */
export function ProtoAntWasps() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nestBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2016" />
          <stop offset="100%" stopColor="#1a140e" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#nestBg)" />
      {/* Tree branch */}
      <motion.path d="M0,80 Q100,75 200,90 Q300,100 400,85" stroke="#5a4020" strokeWidth="8" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
      <motion.path d="M150,88 Q160,60 180,40" stroke="#5a4020" strokeWidth="4" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
      {/* Paper wasp nest */}
      <motion.g transform="translate(200, 130)" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
        <line x1="0" y1="-45" x2="0" y2="-30" stroke="#8a7050" strokeWidth="2" />
        {/* Hexagonal cells */}
        {[
          [0, 0], [-14, -8], [14, -8], [-14, 8], [14, 8], [0, 16], [0, -16],
          [-28, 0], [28, 0], [-14, 24], [14, 24],
        ].map(([cx, cy], i) => (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }}>
            <polygon
              points={Array.from({ length: 6 }).map((_, j) => {
                const a = (Math.PI / 3) * j - Math.PI / 6;
                return `${cx + 7 * Math.cos(a)},${cy + 7 * Math.sin(a)}`;
              }).join(' ')}
              fill={i < 4 ? '#4a3a20' : '#3a2a18'}
              stroke="#6a5530"
              strokeWidth="0.8"
            />
            {i < 3 && <circle cx={cx} cy={cy} r="2.5" fill="#d4c4a0" opacity="0.5" />}
          </motion.g>
        ))}
      </motion.g>
      {/* Wasps on nest */}
      {[[185, 115], [215, 120], [195, 145], [210, 140]].map(([x, y], i) => (
        <motion.g key={i} transform={`translate(${x},${y})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.15 }}>
          <ellipse cx="0" cy="0" rx="4" ry="3" fill="#8a6a30" />
          <ellipse cx="0" cy="-5" rx="3" ry="2.5" fill="#9a7a38" />
          <ellipse cx="0" cy="6" rx="5" ry="4" fill="#6a4a18" />
          <ellipse cx="-5" cy="-3" rx="8" ry="3" fill="#6a6a3a" opacity="0.2" transform={`rotate(${-30 + i * 15})`} />
        </motion.g>
      ))}
      {/* Flying wasps */}
      {[[80, 60], [320, 50], [60, 160], [340, 170]].map(([x, y], i) => (
        <motion.g
          key={`fly${i}`}
          animate={{ x: [0, (i % 2 ? 10 : -10)], y: [0, -5, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, repeatType: 'reverse' }}
        >
          <ellipse cx={x} cy={y} rx="3" ry="2" fill="#7a5a28" />
          <ellipse cx={x - 3} cy={y - 2} rx="5" ry="2" fill="#5a5a3a" opacity="0.2" />
          <ellipse cx={x + 3} cy={y - 2} rx="5" ry="2" fill="#5a5a3a" opacity="0.2" />
        </motion.g>
      ))}
    </svg>
  );
}

/* 100 MYA — Sphecomyrma: amber fossil */
export function Sphecomyrma() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="amberGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c8961e" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#a87a18" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1a140e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="amberInner" cx="0.45" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#e8b640" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#b8862a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8a6018" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#1a140e" />
      <ellipse cx="200" cy="120" rx="180" ry="120" fill="url(#amberGlow)" />
      {/* Amber drop shape */}
      <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
        <path d="M200,30 Q260,50 270,120 Q265,190 200,210 Q135,190 130,120 Q140,50 200,30Z" fill="url(#amberInner)" />
        <path d="M200,30 Q260,50 270,120 Q265,190 200,210 Q135,190 130,120 Q140,50 200,30Z" fill="none" stroke="#c8961e" strokeWidth="1.5" opacity="0.5" />
        {/* Light reflections */}
        <ellipse cx="165" cy="65" rx="20" ry="8" fill="#e8c860" opacity="0.25" transform="rotate(-20, 165, 65)" />
        <ellipse cx="155" cy="80" rx="10" ry="4" fill="#e8c860" opacity="0.15" transform="rotate(-20, 155, 80)" />
      </motion.g>
      {/* Ant fossil inside amber */}
      <motion.g transform="translate(200, 120)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
        {/* Body */}
        <ellipse cx="-8" cy="0" rx="10" ry="7" fill="#5a3a10" opacity="0.7" />
        <ellipse cx="6" cy="-2" rx="7" ry="5" fill="#5a3a10" opacity="0.7" />
        <ellipse cx="16" cy="-4" rx="5.5" ry="4.5" fill="#5a3a10" opacity="0.7" />
        {/* Mandibles (wasp-like) */}
        <path d="M21,-6 L28,-10 L26,-4" fill="#5a3a10" opacity="0.6" />
        <path d="M21,-2 L28,2 L26,-2" fill="#5a3a10" opacity="0.6" />
        {/* Antennae */}
        <path d="M20,-8 Q28,-18 32,-22" stroke="#5a3a10" strokeWidth="0.8" fill="none" opacity="0.6" />
        <path d="M20,-6 Q30,-12 35,-15" stroke="#5a3a10" strokeWidth="0.8" fill="none" opacity="0.6" />
        {/* Legs */}
        {[[-5, 5], [3, 4], [12, 2]].map(([lx, ly], i) => (
          <g key={i}>
            <path d={`M${lx},${ly} Q${lx + 8},${ly + 12} ${lx + 14},${ly + 16}`} stroke="#5a3a10" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d={`M${lx},${-ly - 2} Q${lx + 6},${-ly - 14} ${lx + 12},${-ly - 18}`} stroke="#5a3a10" strokeWidth="0.8" fill="none" opacity="0.6" />
          </g>
        ))}
        {/* Metapleural gland indicator */}
        <motion.circle cx="2" cy="4" r="2" fill="#8a6a30" opacity="0.5" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
      {/* Air bubbles in amber */}
      {[[170, 70], [230, 160], [160, 170], [245, 80]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2 + i * 0.5} fill="none" stroke="#c8a640" strokeWidth="0.5" opacity="0.3" />
      ))}
      {/* Label */}
      <text x="200" y="230" textAnchor="middle" fill="#c19a6b" fontSize="9" fontFamily="Georgia" opacity="0.5" letterSpacing="0.15em">PRESERVED IN AMBER</text>
    </svg>
  );
}

/* 92 MYA — Hell Ants */
export function HellAnts() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hellBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1010" />
          <stop offset="100%" stopColor="#1a0e0e" />
        </linearGradient>
        <radialGradient id="hellGlow" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#8a2020" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="url(#hellBg)" />
      <rect width="400" height="240" fill="url(#hellGlow)" />
      {/* Hell Ant — large central illustration */}
      <motion.g transform="translate(200, 125)" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        {/* Abdomen */}
        <ellipse cx="-25" cy="10" rx="18" ry="14" fill="#3a2218" />
        {/* Petiole */}
        <ellipse cx="-8" cy="5" rx="4" ry="5" fill="#3a2218" />
        {/* Thorax */}
        <ellipse cx="5" cy="0" rx="12" ry="9" fill="#4a3020" />
        {/* Head */}
        <ellipse cx="25" cy="-5" rx="12" ry="10" fill="#4a2a18" />
        <circle cx="30" cy="-10" r="2" fill="#8a3020" />
        {/* UPWARD-FACING MANDIBLES — the defining feature */}
        <motion.g animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <path d="M30,-15 Q25,-40 20,-50 L23,-48 Q28,-38 33,-15" fill="#5a3020" stroke="#6a3828" strokeWidth="0.5" />
        </motion.g>
        <motion.g animate={{ rotate: [2, -2, 2] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <path d="M35,-12 Q38,-38 42,-48 L40,-46 Q36,-36 33,-12" fill="#5a3020" stroke="#6a3828" strokeWidth="0.5" />
        </motion.g>
        {/* Horn appendage */}
        <path d="M28,-15 Q32,-28 30,-35" stroke="#6a4028" strokeWidth="2" fill="none" />
        <circle cx="30" cy="-36" r="2" fill="#8a5030" />
        {/* Legs */}
        {[[15, 5], [5, 5], [-5, 8]].map(([lx, ly], i) => (
          <g key={i}>
            <path d={`M${lx},${ly} Q${lx - 10},${ly + 18} ${lx - 15},${ly + 28}`} stroke="#3a2218" strokeWidth="1.5" fill="none" />
            <path d={`M${lx},${-ly + 5} Q${lx - 12},${-ly - 10} ${lx - 18},${-ly - 18}`} stroke="#3a2218" strokeWidth="1.5" fill="none" />
          </g>
        ))}
        {/* Antennae */}
        <path d="M35,-12 Q45,-20 50,-18" stroke="#4a2a18" strokeWidth="1" fill="none" />
        <path d="M35,-8 Q48,-12 52,-8" stroke="#4a2a18" strokeWidth="1" fill="none" />
      </motion.g>
      {/* Prey caught in mandibles */}
      <motion.circle cx="226" cy="75" r="4" fill="#5a6a3a" opacity="0.6" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      {/* Ominous background elements */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.line
          key={i}
          x1={50 + i * 60} y1="240" x2={60 + i * 60} y2={180 + Math.random() * 30}
          stroke="#3a1a10" strokeWidth="1" opacity="0.3"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.1 }}
        />
      ))}
      <text x="200" y="225" textAnchor="middle" fill="#8a4030" fontSize="8" fontFamily="Georgia" opacity="0.4" letterSpacing="0.2em">HAIDOMYRMECINAE</text>
    </svg>
  );
}

/* 80 MYA — Ant Diversification with flowering plants */
export function AntDiversification() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="divBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2a10" />
          <stop offset="100%" stopColor="#1a140e" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#divBg)" />
      {/* Ground */}
      <path d="M0,200 Q100,185 200,195 Q300,185 400,200 L400,240 L0,240Z" fill="#2a1e14" />
      {/* Flowering plants */}
      {[[80, 195], [160, 190], [250, 192], [330, 188]].map(([x, y], i) => (
        <motion.g key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.2, duration: 0.6 }} style={{ transformOrigin: `${x}px ${y}px` }}>
          <line x1={x} y1={y} x2={x} y2={y - 50 - i * 10} stroke="#3a6a20" strokeWidth="2" />
          {/* Flower */}
          {Array.from({ length: 5 }).map((_, j) => {
            const angle = (Math.PI * 2 / 5) * j;
            const fx = x + Math.cos(angle) * 8;
            const fy = (y - 55 - i * 10) + Math.sin(angle) * 8;
            return <ellipse key={j} cx={fx} cy={fy} rx="5" ry="3" fill={['#c17a23', '#daa520', '#8a9a4a', '#c19a6b'][i]} opacity="0.6" transform={`rotate(${j * 72}, ${fx}, ${fy})`} />;
          })}
          <circle cx={x} cy={y - 55 - i * 10} r="3" fill="#daa520" opacity="0.8" />
          {/* Leaves */}
          <ellipse cx={x - 10} cy={y - 25} rx="8" ry="3" fill="#3a6a20" opacity="0.6" transform={`rotate(-30, ${x - 10}, ${y - 25})`} />
          <ellipse cx={x + 10} cy={y - 35} rx="8" ry="3" fill="#3a6a20" opacity="0.6" transform={`rotate(30, ${x + 10}, ${y - 35})`} />
        </motion.g>
      ))}
      {/* Multiple different ant silhouettes — showing diversification */}
      {[
        { x: 100, y: 205, size: 0.8 },
        { x: 140, y: 208, size: 0.5 },
        { x: 200, y: 202, size: 1.0 },
        { x: 270, y: 206, size: 0.6 },
        { x: 310, y: 203, size: 0.9 },
        { x: 180, y: 210, size: 0.4 },
      ].map((ant, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.12 }}>
          <g transform={`translate(${ant.x}, ${ant.y}) scale(${ant.size})`}>
            <ellipse cx="-8" cy="0" rx="6" ry="4" fill="#2a1810" />
            <ellipse cx="2" cy="0" rx="4" ry="3" fill="#2a1810" />
            <ellipse cx="9" cy="0" rx="3.5" ry="3" fill="#2a1810" />
            <path d={`M12,-2 Q16,-6 18,-5`} stroke="#2a1810" strokeWidth="0.6" fill="none" />
            <path d={`M12,0 Q16,-4 19,-2`} stroke="#2a1810" strokeWidth="0.6" fill="none" />
          </g>
        </motion.g>
      ))}
      {/* Diverging arrow paths */}
      <motion.g opacity="0.15" initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ delay: 1.2 }}>
        <path d="M200,100 Q150,130 100,150" stroke="#4c9900" strokeWidth="1" fill="none" strokeDasharray="4,4" />
        <path d="M200,100 Q250,130 300,150" stroke="#4c9900" strokeWidth="1" fill="none" strokeDasharray="4,4" />
        <path d="M200,100 Q200,130 200,160" stroke="#4c9900" strokeWidth="1" fill="none" strokeDasharray="4,4" />
      </motion.g>
    </svg>
  );
}

/* 66 MYA — K-Pg Extinction Event */
export function KPgExtinction() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="impactGlow" cx="0.5" cy="0.3">
          <stop offset="0%" stopColor="#c86020" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#8a3010" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1a0a05" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#0a0605" />
      <rect width="400" height="240" fill="url(#impactGlow)" />
      {/* Impact blast */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }}>
        {/* Shockwave rings */}
        {[60, 90, 130].map((r, i) => (
          <motion.circle
            key={i} cx="200" cy="80" r={r}
            fill="none" stroke="#c86020" strokeWidth={2 - i * 0.5}
            opacity={0.3 - i * 0.08}
            initial={{ r: 0, opacity: 0.4 }}
            animate={{ r, opacity: 0.3 - i * 0.08 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
          />
        ))}
      </motion.g>
      {/* Asteroid */}
      <motion.g initial={{ x: 100, y: -60, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <circle cx="200" cy="75" r="15" fill="#4a3020" />
        <circle cx="195" cy="70" r="3" fill="#3a2010" />
        <circle cx="205" cy="78" r="2" fill="#3a2010" />
        <circle cx="198" cy="82" r="1.5" fill="#3a2010" />
        {/* Fire trail */}
        <path d="M215,65 Q240,50 260,35" stroke="#c86020" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M215,65 Q245,55 270,42" stroke="#e8a040" strokeWidth="1.5" fill="none" opacity="0.4" />
      </motion.g>
      {/* Debris */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (Math.PI * 2 / 20) * i;
        const dist = 30 + Math.random() * 100;
        return (
          <motion.circle
            key={i}
            cx={200 + Math.cos(angle) * 30}
            cy={80 + Math.sin(angle) * 20}
            r={0.5 + Math.random() * 2}
            fill={i % 3 === 0 ? '#c86020' : '#8a5020'}
            initial={{ cx: 200, cy: 80, opacity: 1 }}
            animate={{ cx: 200 + Math.cos(angle) * dist, cy: 80 + Math.sin(angle) * dist * 0.7, opacity: 0 }}
            transition={{ duration: 2 + Math.random(), delay: 0.5, repeat: Infinity }}
          />
        );
      })}
      {/* Ground destruction */}
      <path d="M0,210 Q100,190 150,205 Q200,180 250,200 Q300,185 400,210 L400,240 L0,240Z" fill="#2a1510" />
      {/* Surviving ant — small, resilient */}
      <motion.g transform="translate(320, 205)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <ellipse cx="-4" cy="0" rx="3" ry="2" fill="#2a1810" />
        <ellipse cx="1" cy="0" rx="2" ry="1.5" fill="#2a1810" />
        <ellipse cx="5" cy="0" rx="2" ry="1.5" fill="#2a1810" />
      </motion.g>
      <motion.text x="325" y="218" fill="#4c9900" fontSize="6" fontFamily="Georgia" opacity="0" animate={{ opacity: 0.5 }} transition={{ delay: 2 }}>survivor</motion.text>
    </svg>
  );
}

/* 60 MYA — Explosive Radiation */
export function ExplosiveRadiation() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" fill="#1a140e" />
      {/* Radiating lines from center */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (Math.PI * 2 / 24) * i;
        return (
          <motion.line
            key={i}
            x1="200" y1="120"
            x2={200 + Math.cos(angle) * 180}
            y2={120 + Math.sin(angle) * 110}
            stroke="#4c9900" strokeWidth="0.5" opacity="0.15"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.05, duration: 0.8 }}
          />
        );
      })}
      {/* Branching tree of life */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
        {/* Central trunk */}
        <line x1="200" y1="220" x2="200" y2="120" stroke="#6a5020" strokeWidth="3" opacity="0.6" />
        {/* Major branches */}
        {[
          [200, 120, 100, 50], [200, 120, 300, 50],
          [200, 140, 120, 80], [200, 140, 280, 80],
          [200, 160, 140, 100], [200, 160, 260, 100],
          [200, 170, 160, 130], [200, 170, 240, 130],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5a4020" strokeWidth={2 - i * 0.15} opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }} />
        ))}
      </motion.g>
      {/* Ant silhouettes at branch tips — showing species diversity */}
      {[
        [100, 45], [300, 45], [120, 75], [280, 75],
        [140, 95], [260, 95], [80, 60], [320, 60],
        [160, 125], [240, 125], [100, 90], [300, 90],
      ].map(([x, y], i) => (
        <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.08, type: 'spring' }}>
          <g transform={`translate(${x}, ${y}) scale(${0.4 + (i % 3) * 0.15})`}>
            <ellipse cx="-5" cy="0" rx="5" ry="3" fill="#2a1810" />
            <ellipse cx="2" cy="0" rx="3" ry="2.5" fill="#2a1810" />
            <circle cx="6" cy="0" r="2.5" fill="#2a1810" />
          </g>
        </motion.g>
      ))}
      {/* Glow at center */}
      <motion.circle cx="200" cy="120" r="8" fill="#4c9900" opacity="0.2" animate={{ r: [8, 12, 8], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
    </svg>
  );
}

/* 50 MYA — Formicinae & Myrmicinae Rise */
export function FormicinaeMyrmicinaeRise() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" fill="#1a140e" />
      {/* Split composition — two subfamilies */}
      <line x1="200" y1="30" x2="200" y2="210" stroke="#3a2a1a" strokeWidth="1" strokeDasharray="4,6" opacity="0.4" />
      {/* Left — Formicinae (formic acid) */}
      <motion.g initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
        <text x="100" y="35" textAnchor="middle" fill="#4c9900" fontSize="9" fontFamily="Georgia" letterSpacing="0.1em" opacity="0.6">FORMICINAE</text>
        {/* Large Formicinae ant */}
        <g transform="translate(100, 110)">
          <ellipse cx="-14" cy="2" rx="12" ry="9" fill="#3a3020" />
          <ellipse cx="2" cy="0" rx="8" ry="6" fill="#4a3a24" />
          <circle cx="13" cy="-2" r="6" fill="#4a3828" />
          <circle cx="16" cy="-5" r="1.5" fill="#1a1a0a" />
          <path d="M16,-8 Q22,-16 26,-14" stroke="#4a3828" strokeWidth="0.8" fill="none" />
          <path d="M18,-6 Q24,-12 28,-10" stroke="#4a3828" strokeWidth="0.8" fill="none" />
          {/* Formic acid spray */}
          <motion.g animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>
            <path d="M-26,4 Q-36,0 -42,-4" stroke="#4c9900" strokeWidth="1.5" fill="none" opacity="0.4" />
            <path d="M-26,6 Q-38,8 -45,6" stroke="#4c9900" strokeWidth="1" fill="none" opacity="0.3" />
            <path d="M-26,2 Q-34,-4 -40,-10" stroke="#4c9900" strokeWidth="1" fill="none" opacity="0.3" />
          </motion.g>
          {/* Legs */}
          {[-1, 1].map(side => [0, 8, -6].map((lx, j) => (
            <line key={`${side}${j}`} x1={lx} y1={side * 5} x2={lx + side * 12} y2={side * 18} stroke="#3a2a18" strokeWidth="1" />
          )))}
        </g>
        <text x="100" y="170" textAnchor="middle" fill="#4c9900" fontSize="7" fontFamily="Georgia" opacity="0.4">Formic acid defense</text>
      </motion.g>
      {/* Right — Myrmicinae (stinger) */}
      <motion.g initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
        <text x="300" y="35" textAnchor="middle" fill="#c17a23" fontSize="9" fontFamily="Georgia" letterSpacing="0.1em" opacity="0.6">MYRMICINAE</text>
        <g transform="translate(300, 110)">
          <ellipse cx="-14" cy="2" rx="11" ry="8" fill="#4a2818" />
          <ellipse cx="-2" cy="1" rx="4" ry="4" fill="#4a2818" />
          <ellipse cx="6" cy="0" rx="7" ry="5.5" fill="#5a3420" />
          <circle cx="16" cy="-2" r="5.5" fill="#5a3420" />
          <circle cx="19" cy="-5" r="1.5" fill="#1a1a0a" />
          <path d="M19,-8 Q25,-16 29,-14" stroke="#5a3420" strokeWidth="0.8" fill="none" />
          <path d="M21,-6 Q27,-12 31,-10" stroke="#5a3420" strokeWidth="0.8" fill="none" />
          {/* Stinger */}
          <motion.g animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <line x1="-25" y1="4" x2="-33" y2="8" stroke="#8a4020" strokeWidth="2" />
            <polygon points="-33,8 -38,6 -37,10" fill="#8a4020" />
          </motion.g>
          {/* Legs */}
          {[-1, 1].map(side => [0, 8, -6].map((lx, j) => (
            <line key={`${side}${j}`} x1={lx} y1={side * 4} x2={lx + side * 11} y2={side * 16} stroke="#4a2818" strokeWidth="1" />
          )))}
        </g>
        <text x="300" y="170" textAnchor="middle" fill="#c17a23" fontSize="7" fontFamily="Georgia" opacity="0.4">Stinger defense</text>
      </motion.g>
      {/* DNA helix connecting them */}
      <motion.g opacity="0.15" initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ delay: 1 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 190 + i * 0;
          return (
            <g key={i}>
              <circle cx={180 + Math.sin(i * 0.8) * 15} cy={190 + i * 4} r="1.5" fill="#c19a6b" />
              <circle cx={220 - Math.sin(i * 0.8) * 15} cy={190 + i * 4} r="1.5" fill="#c19a6b" />
            </g>
          );
        })}
      </motion.g>
    </svg>
  );
}

/* 45 MYA — Baltic Amber Forests */
export function BalticAmber() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" fill="#1a140e" />
      {/* Multiple amber pieces */}
      {[
        { x: 80, y: 80, r: 35, ant: true },
        { x: 200, y: 130, r: 45, ant: true },
        { x: 310, y: 70, r: 30, ant: true },
        { x: 140, y: 170, r: 25, ant: false },
        { x: 290, y: 175, r: 28, ant: true },
        { x: 50, y: 170, r: 20, ant: false },
        { x: 350, y: 150, r: 22, ant: true },
      ].map((amber, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15, duration: 0.6 }}>
          {/* Amber glow */}
          <circle cx={amber.x} cy={amber.y} r={amber.r * 1.3} fill="#a87a18" opacity="0.08" />
          {/* Amber body */}
          <ellipse cx={amber.x} cy={amber.y} rx={amber.r} ry={amber.r * 0.8}
            fill={`rgba(${168 + i * 8}, ${122 + i * 5}, ${24 + i * 3}, 0.5)`}
            stroke="#c8961e" strokeWidth="0.5" opacity="0.6"
          />
          {/* Highlight */}
          <ellipse cx={amber.x - amber.r * 0.2} cy={amber.y - amber.r * 0.25} rx={amber.r * 0.3} ry={amber.r * 0.15} fill="#e8c860" opacity="0.15" transform={`rotate(-20, ${amber.x}, ${amber.y})`} />
          {/* Ant inside */}
          {amber.ant && (
            <g transform={`translate(${amber.x}, ${amber.y}) scale(${amber.r / 45})`}>
              <ellipse cx="-5" cy="0" rx="5" ry="3" fill="#4a3010" opacity="0.6" />
              <ellipse cx="2" cy="0" rx="3.5" ry="2.5" fill="#4a3010" opacity="0.6" />
              <circle cx="7" cy="0" r="2.5" fill="#4a3010" opacity="0.6" />
              <path d="M9,-2 Q13,-5 15,-4" stroke="#4a3010" strokeWidth="0.5" fill="none" opacity="0.5" />
              <path d="M9,-1 Q14,-3 16,-1" stroke="#4a3010" strokeWidth="0.5" fill="none" opacity="0.5" />
            </g>
          )}
        </motion.g>
      ))}
      {/* Counter */}
      <motion.text x="200" y="225" textAnchor="middle" fill="#c19a6b" fontSize="8" fontFamily="Georgia" opacity="0" animate={{ opacity: 0.5 }} transition={{ delay: 1.5 }} letterSpacing="0.15em">100+ SPECIES IN A SINGLE DEPOSIT</motion.text>
    </svg>
  );
}

/* 30 MYA — Fungus Farming */
export function FungusFarming() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1e14" />
          <stop offset="100%" stopColor="#1a1008" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#soilGrad)" />
      {/* Underground chamber */}
      <ellipse cx="200" cy="140" rx="140" ry="80" fill="#1a1008" stroke="#3a2a1a" strokeWidth="1" opacity="0.8" />
      {/* Fungus garden */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
        {/* Fungal mass */}
        {[
          [160, 140, 20, 15], [200, 130, 25, 18], [240, 135, 18, 14],
          [180, 155, 15, 12], [220, 150, 22, 16], [170, 125, 12, 10],
          [230, 120, 14, 11],
        ].map(([cx, cy, rx, ry], i) => (
          <motion.ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
            fill={i % 2 === 0 ? '#8a9a5a' : '#6a7a4a'}
            opacity={0.5 + (i % 3) * 0.1}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          />
        ))}
        {/* Mushroom caps */}
        {[[175, 115], [210, 108], [195, 120], [235, 112]].map(([x, y], i) => (
          <motion.g key={`m${i}`} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1 + i * 0.15 }} style={{ transformOrigin: `${x}px ${y + 10}px` }}>
            <line x1={x} y1={y + 10} x2={x} y2={y} stroke="#8a7a5a" strokeWidth="1.5" />
            <ellipse cx={x} cy={y - 2} rx={6 + i * 1.5} ry={4} fill="#a89a6a" opacity="0.7" />
          </motion.g>
        ))}
      </motion.g>
      {/* Gardener ants */}
      {[
        { x: 150, y: 150, flip: false },
        { x: 220, y: 145, flip: true },
        { x: 190, y: 160, flip: false },
        { x: 250, y: 155, flip: true },
      ].map((ant, i) => (
        <motion.g key={`a${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.1 }}>
          <g transform={`translate(${ant.x}, ${ant.y}) scale(${ant.flip ? -0.6 : 0.6}, 0.6)`}>
            <ellipse cx="-5" cy="0" rx="5" ry="3" fill="#5a3a20" />
            <ellipse cx="2" cy="0" rx="3.5" ry="2.5" fill="#5a3a20" />
            <circle cx="7" cy="0" r="2.5" fill="#5a3a20" />
          </g>
        </motion.g>
      ))}
      {/* Leaf bits being carried — top of scene */}
      {[[100, 50, -20], [300, 40, 15], [70, 70, -10]].map(([x, y, rot], i) => (
        <motion.g key={`l${i}`} animate={{ x: [0, -15, 0], y: [0, 5, 0] }} transition={{ duration: 4 + i, repeat: Infinity }}>
          <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#4a7a20" opacity="0.5" />
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#3a5a18" strokeWidth="0.5" />
            {/* Ant carrying leaf */}
            <g transform="translate(0, 6) scale(0.4)">
              <ellipse cx="-4" cy="0" rx="4" ry="2.5" fill="#4a2a18" />
              <ellipse cx="2" cy="0" rx="3" ry="2" fill="#4a2a18" />
              <circle cx="6" cy="0" r="2" fill="#4a2a18" />
            </g>
          </g>
        </motion.g>
      ))}
      {/* Soil texture lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <line key={`s${i}`} x1={20 + i * 25} y1={200 + Math.random() * 20} x2={30 + i * 25} y2={205 + Math.random() * 20} stroke="#3a2a1a" strokeWidth="0.5" opacity="0.3" />
      ))}
    </svg>
  );
}

/* 20 MYA — Army Ants Emerge */
export function ArmyAntsEmerge() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" fill="#1a140e" />
      {/* Swarm raid column — the signature formation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        {/* Main column path */}
        <path d="M50,220 Q80,200 120,180 Q160,160 200,120 Q240,80 300,60 Q350,45 380,30"
          stroke="#3a2a18" strokeWidth="20" fill="none" opacity="0.3" strokeLinecap="round" />
        <path d="M50,220 Q80,200 120,180 Q160,160 200,120 Q240,80 300,60 Q350,45 380,30"
          stroke="#2a1a10" strokeWidth="12" fill="none" opacity="0.5" strokeLinecap="round" />
      </motion.g>
      {/* Army ants swarming along the path */}
      {Array.from({ length: 35 }).map((_, i) => {
        const t = i / 35;
        // Approximate bezier position
        const x = 50 + t * 330 + (Math.random() - 0.5) * 20;
        const y = 220 - t * 190 + (Math.random() - 0.5) * 15 + Math.sin(t * 4) * 10;
        const size = 0.4 + Math.random() * 0.4;
        return (
          <motion.g key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, (Math.random() - 0.5) * 4], y: [0, (Math.random() - 0.5) * 3] }}
            transition={{ delay: t * 1.5, duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            <g transform={`translate(${x}, ${y}) scale(${size}) rotate(${-45 + (Math.random() - 0.5) * 20})`}>
              <ellipse cx="-5" cy="0" rx="5" ry="3.5" fill="#3a2010" />
              <ellipse cx="2" cy="0" rx="3.5" ry="2.5" fill="#4a2818" />
              <circle cx="7" cy="-1" r="2.5" fill="#4a2818" />
              {/* Mandibles */}
              <line x1="9" y1="-2" x2="12" y2="-4" stroke="#4a2818" strokeWidth="0.8" />
              <line x1="9" y1="0" x2="12" y2="2" stroke="#4a2818" strokeWidth="0.8" />
            </g>
          </motion.g>
        );
      })}
      {/* Bivouac nest hint */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <ellipse cx="45" cy="225" rx="30" ry="15" fill="#2a1a10" opacity="0.6" />
        <text x="45" y="228" textAnchor="middle" fill="#6a5030" fontSize="5" fontFamily="Georgia">BIVOUAC</text>
      </motion.g>
      {/* Fleeing insects */}
      {[[340, 40], [360, 55], [380, 35]].map(([x, y], i) => (
        <motion.g key={`flee${i}`} animate={{ x: [0, 10 + i * 5], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}>
          <circle cx={x} cy={y} r={1.5} fill="#6a8a3a" opacity="0.4" />
        </motion.g>
      ))}
    </svg>
  );
}

/* 15 MYA — Leafcutter Specialization */
export function LeafcutterSpecialization() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5a8a20" />
          <stop offset="100%" stopColor="#3a6a10" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="#1a180e" />
      {/* Tree branch at top */}
      <path d="M100,0 Q120,20 150,25 Q200,30 250,20 Q300,15 350,0" stroke="#5a4020" strokeWidth="6" fill="none" />
      {/* Large leaf being cut */}
      <motion.g transform="translate(200, 60)">
        <path d="M0,-30 Q30,-25 40,0 Q30,25 0,30 Q-30,25 -40,0 Q-30,-25 0,-30Z" fill="url(#leafGrad)" opacity="0.7" />
        <line x1="-40" y1="0" x2="40" y2="0" stroke="#4a7a18" strokeWidth="0.8" opacity="0.5" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#4a7a18" strokeWidth="0.8" opacity="0.5" />
        {/* Cut arc */}
        <motion.path d="M15,-25 Q25,-15 20,0" stroke="#1a180e" strokeWidth="2.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        {/* Ant cutting */}
        <g transform="translate(20, -12) scale(0.5) rotate(45)">
          <ellipse cx="-5" cy="0" rx="6" ry="4" fill="#6a3a18" />
          <ellipse cx="3" cy="0" rx="4" ry="3" fill="#7a4a20" />
          <circle cx="9" cy="0" r="3" fill="#7a4a20" />
          <path d="M12,-2 L16,-6" stroke="#8a5020" strokeWidth="1.5" />
          <path d="M12,2 L16,6" stroke="#8a5020" strokeWidth="1.5" />
        </g>
      </motion.g>
      {/* Procession of leaf-carrying ants */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 60 + i * 40;
        const y = 170 + Math.sin(i * 0.8) * 5;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12 }}>
            {/* Leaf fragment carried overhead */}
            <ellipse cx={x} cy={y - 12} rx={7 + (i % 3) * 2} ry={4} fill="#5a8a20" opacity="0.6" transform={`rotate(${-15 + i * 8}, ${x}, ${y - 12})`} />
            {/* Ant */}
            <g transform={`translate(${x}, ${y}) scale(0.5)`}>
              <ellipse cx="-5" cy="0" rx="5" ry="3" fill="#5a3018" />
              <ellipse cx="2" cy="0" rx="3.5" ry="2.5" fill="#5a3018" />
              <circle cx="7" cy="0" r="2.5" fill="#5a3018" />
              <line x1="-4" y1="3" x2="-8" y2="8" stroke="#5a3018" strokeWidth="0.8" />
              <line x1="0" y1="3" x2="-3" y2="8" stroke="#5a3018" strokeWidth="0.8" />
              <line x1="4" y1="3" x2="2" y2="8" stroke="#5a3018" strokeWidth="0.8" />
            </g>
          </motion.g>
        );
      })}
      {/* Trail path */}
      <path d="M40,172 Q120,175 200,170 Q280,168 360,172" stroke="#3a2a18" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="2,4" />
      {/* Underground garden hint */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <ellipse cx="200" cy="220" rx="60" ry="15" fill="#2a2010" opacity="0.5" />
        <text x="200" y="223" textAnchor="middle" fill="#6a8a3a" fontSize="6" fontFamily="Georgia" opacity="0.5">FUNGUS GARDEN BELOW</text>
      </motion.g>
    </svg>
  );
}

/* 5 MYA — Modern Ant World */
export function ModernAntWorld() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" fill="#1a140e" />
      {/* Globe */}
      <motion.g transform="translate(200, 115)" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
        <circle cx="0" cy="0" r="80" fill="none" stroke="#3a5a20" strokeWidth="1" opacity="0.3" />
        <circle cx="0" cy="0" r="80" fill="rgba(26, 40, 14, 0.3)" />
        {/* Continent shapes (simplified) */}
        {/* Americas */}
        <path d="M-30,-40 Q-25,-50 -20,-45 Q-15,-35 -20,-25 Q-25,-15 -28,-5 Q-35,10 -30,25 Q-25,35 -30,45 Q-35,55 -28,60" fill="#3a5a20" opacity="0.4" stroke="none" />
        {/* Europe/Africa */}
        <path d="M5,-45 Q15,-40 10,-30 Q5,-20 10,-10 Q15,5 12,20 Q8,35 15,50 Q10,60 5,55" fill="#3a5a20" opacity="0.4" />
        {/* Asia */}
        <path d="M20,-40 Q35,-35 45,-25 Q50,-15 40,-5 Q35,5 30,10" fill="#3a5a20" opacity="0.4" />
        {/* Australia */}
        <ellipse cx="45" cy="30" rx="15" ry="10" fill="#3a5a20" opacity="0.4" />
        {/* Ant dots on continents — showing global spread */}
        {[
          [-25, -35], [-22, -10], [-30, 20], [-28, 45],
          [8, -30], [10, 10], [12, 40],
          [30, -20], [38, -10],
          [45, 28],
        ].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="2" fill="#4c9900"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ delay: 0.5 + i * 0.1, duration: 2, repeat: Infinity }}
            opacity="0.7"
          />
        ))}
        {/* Latitude lines */}
        {[-40, 0, 40].map((y, i) => (
          <ellipse key={i} cx="0" cy={y} rx={Math.sqrt(80 * 80 - y * y)} ry="5" fill="none" stroke="#3a5a20" strokeWidth="0.3" opacity="0.2" />
        ))}
      </motion.g>
      {/* Stats */}
      <motion.text x="200" y="218" textAnchor="middle" fill="#4c9900" fontSize="10" fontFamily="Georgia" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.5 }}>Every continent except Antarctica</motion.text>
    </svg>
  );
}

/* Today — 22,000+ Species Strong */
export function TodaySpecies() {
  return (
    <svg viewBox="0 0 400 240" style={illustrationStyle} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="crownGlow" cx="0.5" cy="0.4">
          <stop offset="0%" stopColor="#daa520" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#1a140e" />
      <rect width="400" height="240" fill="url(#crownGlow)" />
      {/* Crown */}
      <motion.g transform="translate(200, 55)" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
        <path d="M-30,15 L-25,-10 L-10,5 L0,-15 L10,5 L25,-10 L30,15Z" fill="#daa520" opacity="0.6" />
        <rect x="-32" y="15" width="64" height="8" rx="2" fill="#daa520" opacity="0.5" />
        {/* Jewels */}
        <circle cx="0" cy="-10" r="3" fill="#4c9900" opacity="0.6" />
        <circle cx="-20" cy="-2" r="2" fill="#c17a23" opacity="0.6" />
        <circle cx="20" cy="-2" r="2" fill="#c17a23" opacity="0.6" />
      </motion.g>
      {/* Large ant wearing the crown */}
      <motion.g transform="translate(200, 115)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        {/* Abdomen */}
        <ellipse cx="-25" cy="5" rx="20" ry="15" fill="#3a2218" />
        {/* Petiole */}
        <ellipse cx="-6" cy="2" rx="4" ry="5" fill="#3a2218" />
        {/* Thorax */}
        <ellipse cx="8" cy="0" rx="14" ry="10" fill="#4a3020" />
        {/* Head */}
        <circle cx="28" cy="-5" r="11" fill="#4a2a18" />
        <circle cx="32" cy="-10" r="2" fill="#1a1a0a" />
        <circle cx="25" cy="-10" r="2" fill="#1a1a0a" />
        {/* Mandibles */}
        <path d="M35,-2 Q42,-8 44,-3" stroke="#5a3420" strokeWidth="2" fill="none" />
        <path d="M35,2 Q42,8 44,3" stroke="#5a3420" strokeWidth="2" fill="none" />
        {/* Antennae */}
        <path d="M30,-16 Q36,-28 42,-30" stroke="#4a2a18" strokeWidth="1.2" fill="none" />
        <path d="M34,-14 Q42,-24 48,-25" stroke="#4a2a18" strokeWidth="1.2" fill="none" />
        {/* Legs */}
        {[-1, 1].map(side => [0, 10, -8].map((lx, j) => (
          <line key={`${side}${j}`} x1={lx} y1={side * 8} x2={lx + side * 18} y2={side * 28} stroke="#3a2218" strokeWidth="1.5" />
        )))}
      </motion.g>
      {/* Surrounding smaller ants — representing diversity */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (Math.PI * 2 / 16) * i;
        const dist = 80 + Math.random() * 30;
        const x = 200 + Math.cos(angle) * dist;
        const y = 115 + Math.sin(angle) * dist * 0.6;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.8 + i * 0.06 }}>
            <g transform={`translate(${x}, ${y}) scale(0.3) rotate(${angle * 180 / Math.PI + 90})`}>
              <ellipse cx="-4" cy="0" rx="4" ry="2.5" fill="#2a1810" />
              <ellipse cx="1" cy="0" rx="2.5" ry="2" fill="#2a1810" />
              <circle cx="5" cy="0" r="2" fill="#2a1810" />
            </g>
          </motion.g>
        );
      })}
      {/* Number */}
      <motion.text x="200" y="210" textAnchor="middle" fill="#daa520" fontSize="16" fontFamily="Georgia" fontWeight="700" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.2 }}>22,000+</motion.text>
      <motion.text x="200" y="228" textAnchor="middle" fill="#c19a6b" fontSize="8" fontFamily="Georgia" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.5 }} letterSpacing="0.2em">SPECIES STRONG</motion.text>
    </svg>
  );
}

// Export map
export const illustrations = {
  0: HymenopteraAncestors,
  1: ProtoAntWasps,
  2: Sphecomyrma,
  3: HellAnts,
  4: AntDiversification,
  5: KPgExtinction,
  6: ExplosiveRadiation,
  7: FormicinaeMyrmicinaeRise,
  8: BalticAmber,
  9: FungusFarming,
  10: ArmyAntsEmerge,
  11: LeafcutterSpecialization,
  12: ModernAntWorld,
  13: TodaySpecies,
};
