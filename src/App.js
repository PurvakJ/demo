import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

/* ✏️ EDIT YOUR DETAILS HERE */
const WEDDING = {
  bride: "Prerna Singh",
  groom: "Sumit Gupta",
  date: "2027-02-14T08:00:00",
  venue: "The Royal Lake Palace",
  address: "Lake Pichola, Udaipur, Rajasthan",
  rsvpBy: "1st February",
  phone: "+91 98765 43210",
};

/* 🖼️ OPTIONAL: your own transparent (background-removed) PNGs.
   Export from Canva → "Download → PNG → Transparent background", put the files
   in your project's /public/images folder and set the paths below.
   Leave "" to use the built-in drawn flowers and lanterns.
   flora   = a flower cluster that sits in the TOP-LEFT corner (it gets mirrored to the other corners)
   lantern = one hanging lantern (chain on top)                                                   */
const IMG = { flora: "", lantern: "", art: { kalash: "", rings: "", dhol: "", diya: "", mandap: "" } };

const EVENTS = [
  { name: "Mehndi", day: "12 Feb", time: "4:00 PM", note: "Henna, chai and folk songs", c: "#9c2347" },
  { name: "Haldi", day: "13 Feb", time: "10:00 AM", note: "Come dressed in yellow", c: "#e9a912" },
  { name: "Sangeet", day: "13 Feb", time: "7:30 PM", note: "An evening of dhol and dance", c: "#5f7a3a" },
  { name: "Phere", day: "14 Feb", time: "8:00 AM", note: "Baraat, varmala and saat phere", c: "#b8862b" },
];

/* ---------- little helpers ---------- */
const sprig = (x0, y0, x1, y1, n = 14) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return {
      x: x0 + (x1 - x0) * t + Math.sin(i * 12.9) * 6,
      y: y0 + (y1 - y0) * t + Math.cos(i * 7.1) * 6,
      r: 3 + ((i * 7) % 3),
    };
  });

function Rose({ x, y, s, delay }) {
  const layers = [
    { n: 7, r: 34, fill: "#efe3bf" },
    { n: 6, r: 25, fill: "#f8f0d8" },
    { n: 5, r: 16, fill: "#ecdcaa" },
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="bloom" style={{ animationDelay: `${delay}s` }}>
        {layers.map((l, li) =>
          Array.from({ length: l.n }, (_, i) => (
            <ellipse
              key={`${li}-${i}`}
              cx="0" cy={-l.r * 0.55} rx={l.r * 0.52} ry={l.r * 0.72}
              fill={l.fill} stroke="#cdb77c" strokeWidth=".8"
              transform={`rotate(${(i * 360) / l.n + li * 18})`}
            />
          ))
        )}
        <circle r="6" fill="#d7b25c" />
      </g>
    </g>
  );
}

function Flora({ pos }) {
  const leaves = [[40, 30, -30], [105, 22, 20], [155, 62, 45], [18, 105, -60], [75, 190, -20], [125, 150, 30], [50, 245, 10]];
  return (
    <div className={`flora ${pos}`} aria-hidden="true">
      {IMG.flora ? (
        <img className="flora-art" src={IMG.flora} alt="" />
      ) : (
        <svg className="flora-art" viewBox="0 0 220 300">
          {leaves.map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="9" ry="26" transform={`rotate(${r} ${x} ${y})`} fill={i % 2 ? "#7a9448" : "#5f7a3a"} />
          ))}
          {[sprig(110, 60, 212, 140), sprig(60, 140, 150, 285), sprig(20, 165, 42, 275, 10)].map((dots, k) => (
            <g key={k} className="mimosa" style={{ animationDelay: `${k * 0.6}s` }}>
              <line x1={dots[0].x} y1={dots[0].y} x2={dots[dots.length - 1].x} y2={dots[dots.length - 1].y} stroke="#6f7f3c" strokeWidth="1.5" />
              {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#f4b92b" stroke="#e29b0a" strokeWidth=".6" />)}
            </g>
          ))}
          <Rose x={55} y={55} s={1.25} delay={0.2} />
          <Rose x={132} y={44} s={0.8} delay={0.5} />
          <Rose x={40} y={150} s={1} delay={0.8} />
          <Rose x={105} y={122} s={0.85} delay={1.0} />
          <Rose x={72} y={218} s={0.7} delay={1.2} />
        </svg>
      )}
    </div>
  );
}

function Lantern({ chain, className, delay }) {
  return (
    <div className={`lantern ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      {IMG.lantern ? (
        <img src={IMG.lantern} alt="" />
      ) : (
        <svg viewBox={`0 0 60 ${chain + 92}`}>
          <line x1="30" y1="0" x2="30" y2={chain} stroke="#d9a441" strokeWidth="1.6" strokeDasharray="3 2" />
          <g transform={`translate(0 ${chain})`}>
            <circle cx="30" cy="0" r="4" fill="none" stroke="#d9a441" strokeWidth="1.6" />
            <path d="M16 15 L30 4 L44 15 Z" fill="url(#gold)" />
            <rect x="14" y="15" width="32" height="5" rx="2" fill="url(#gold)" />
            <path d="M17 20 H43 L47 62 H13 Z" fill="url(#glass)" stroke="#d9a441" strokeWidth="1.2" />
            <ellipse className="flame" cx="30" cy="42" rx="7" ry="12" fill="#fff4c2" />
            <line x1="23" y1="20" x2="22" y2="62" stroke="#d9a441" strokeWidth=".9" />
            <line x1="37" y1="20" x2="38" y2="62" stroke="#d9a441" strokeWidth=".9" />
            <rect x="12" y="62" width="36" height="5" rx="2" fill="url(#gold)" />
            <path d="M17 67 L30 84 L43 67 Z" fill="url(#gold)" />
          </g>
        </svg>
      )}
    </div>
  );
}

const ArchCap = () => (
  <svg className="arch-cap" viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M0 241 V190 A20 20 0 0 1 18 158 A22 22 0 0 1 48 118 A24 24 0 0 1 90 92 A26 26 0 0 1 140 62 Q175 40 200 8 Q225 40 260 62 A26 26 0 0 1 310 92 A24 24 0 0 1 352 118 A22 22 0 0 1 382 158 A20 20 0 0 1 400 190 V241"
      fill="url(#wineGrad)" stroke="url(#gold)" strokeWidth="3"
    />
    <path d="M200 8 L206 18 L194 18 Z" fill="#d9a441" />
  </svg>
);

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${on ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function Countdown({ target }) {
  const [t, setT] = useState({ Days: 0, Hours: 0, Minutes: 0, Seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const d = Math.max(0, new Date(target) - new Date());
      return { Days: Math.floor(d / 864e5), Hours: Math.floor((d / 36e5) % 24), Minutes: Math.floor((d / 6e4) % 60), Seconds: Math.floor((d / 1e3) % 60) };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <div className="countdown">
      {Object.entries(t).map(([k, v]) => (
        <div className="cd" key={k}>
          <b key={v}>{String(v).padStart(2, "0")}</b>
          <span>{k}</span>
        </div>
      ))}
    </div>
  );
}

/* ============ MORE DATA (edit freely) ============ */
const STATS = [
  { to: 3, label: "Days of celebration" },
  { to: 4, label: "Grand ceremonies" },
  { to: 500, suffix: "+", label: "Beloved guests" },
  { to: 2, label: "Families, one love" },
];

const STORY = [
  { art: "kalash", when: "December 2025", title: "The blessings", text: "Two families, one table and a kalash puja. Over endless cups of chai, the elders decided what the two of us already knew." },
  { art: "rings", when: "August 2026", title: "The promise", text: "Rings were exchanged in the presence of our loved ones, with tears, laughter and far too many photographs." },
  { art: "dhol", when: "12–13 February", title: "The music", text: "Mehndi, Haldi and Sangeet fill the palace with dhol, folk songs and dance-offs between the two families." },
  { art: "diya", when: "13 February, dusk", title: "The light", text: "Hundreds of diyas will light the lake-side courtyard as we welcome you with warmth, flowers and gold." },
  { art: "mandap", when: "14 February", title: "The vows", text: "Under a mandap of marigolds, we take the saat phere and begin our forever. We would love for you to be there." },
];

const TIMELINE = [
  { t: "6:30 AM", n: "Baraat", d: "The groom’s procession arrives with dhol, dancing and a decorated horse." },
  { t: "7:30 AM", n: "Jaimala", d: "Garlands are exchanged under a shower of petals." },
  { t: "8:00 AM", n: "Saat Phere", d: "Seven sacred vows around the holy fire." },
  { t: "10:00 AM", n: "Wedding brunch", d: "A royal Rajasthani spread, blessings and family portraits." },
  { t: "12:30 PM", n: "Vidaai", d: "A tearful, joyful farewell as the couple begins a new chapter." },
];

const GALLERY = [
  { art: "diya", cap: "Mehndi nights" }, { art: "mandap", cap: "Under the mandap" },
  { art: "rings", cap: "The promise" }, { art: "dhol", cap: "Sangeet beats" }, { art: "kalash", cap: "Blessings" },
];

const INFO = [
  { h: "Dress code", t: "Mehndi in greens, Haldi in yellows, Sangeet in glitter and Phere in royal reds and golds.", chips: ["#3f9b4b", "#f4b92b", "#c2185b", "#8b1e3f"] },
  { h: "Where to stay", t: "Rooms are held at The Royal Lake Palace. Mention our wedding when you book." },
  { h: "Getting there", t: "Udaipur Airport (UDR) is about 22 km away. Shuttles run every hour from the airport and station." },
  { h: "Gifts", t: "Your presence and blessings are the dearest gift we could ask for." },
];

/* ============ CUT-OUT ILLUSTRATIONS (transparent, drawn in code) ============ */
const ARTS = {
  kalash: (
    <g>
      <ellipse cx="100" cy="186" rx="52" ry="8" fill="#00000022" />
      {[-50, -25, 0, 25, 50].map((r) => (
        <ellipse key={r} cx="100" cy="60" rx="9" ry="30" transform={`rotate(${r} 100 84)`} fill={r % 50 === 0 ? "#5f7a3a" : "#7a9448"} stroke="#3f5a26" strokeWidth="1" />
      ))}
      <circle cx="100" cy="58" r="24" fill="#9a6a34" stroke="#6b431c" strokeWidth="2" />
      <path d="M86 50 Q100 38 114 50" stroke="#d9b07a" strokeWidth="3" fill="none" />
      <path d="M72 84 H128 L134 98 Q168 130 140 168 Q100 186 60 168 Q32 130 66 98 Z" fill="url(#gold)" stroke="#a8741b" strokeWidth="2" />
      <path d="M58 128 Q100 148 142 128" stroke="#5a1428" strokeWidth="5" fill="none" />
      {[72, 86, 100, 114, 128].map((x) => <circle key={x} cx={x} cy={x === 100 ? 156 : 150} r="4" fill="#5a1428" />)}
    </g>
  ),
  rings: (
    <g>
      <circle cx="78" cy="122" r="44" fill="none" stroke="url(#gold)" strokeWidth="10" />
      <circle cx="122" cy="122" r="44" fill="none" stroke="url(#gold)" strokeWidth="10" />
      <circle cx="78" cy="122" r="44" fill="none" stroke="#fff6c8" strokeWidth="2" strokeOpacity=".6" />
      <circle cx="122" cy="122" r="44" fill="none" stroke="#fff6c8" strokeWidth="2" strokeOpacity=".6" />
      <polygon points="122,50 138,66 122,90 106,66" fill="#fff3e0" stroke="#d9a441" strokeWidth="3" />
      <path d="M122 50 V90 M106 66 H138" stroke="#d9a441" strokeWidth="1.2" />
      <path className="twinkle" d="M36 44 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="#f6dc8e" />
      <path className="twinkle" style={{ animationDelay: "1s" }} d="M164 30 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#f6dc8e" />
    </g>
  ),
  dhol: (
    <g>
      <ellipse cx="100" cy="176" rx="62" ry="8" fill="#00000022" />
      <path d="M48 72 Q36 105 48 138 H152 Q164 105 152 72 Z" fill="#8b1e3f" stroke="url(#gold)" strokeWidth="3" />
      {[72, 100, 128].map((x) => <path key={x} d={`M${x} 74 V136`} stroke="#d9a441" strokeWidth="3" />)}
      <ellipse cx="48" cy="105" rx="14" ry="34" fill="#fff3e0" stroke="url(#gold)" strokeWidth="4" />
      <ellipse cx="152" cy="105" rx="14" ry="34" fill="#fff3e0" stroke="url(#gold)" strokeWidth="4" />
      <polyline points="52,74 72,136 92,74 112,136 132,74 148,136" fill="none" stroke="#f6dc8e" strokeWidth="2.5" />
      <g className="stick"><path d="M70 62 L122 22" stroke="#d9a441" strokeWidth="5" strokeLinecap="round" /><circle cx="126" cy="19" r="6" fill="#f6dc8e" /></g>
      <g className="stick" style={{ animationDelay: ".4s" }}><path d="M130 62 L78 22" stroke="#d9a441" strokeWidth="5" strokeLinecap="round" /><circle cx="74" cy="19" r="6" fill="#f6dc8e" /></g>
    </g>
  ),
  diya: (
    <g>
      <circle cx="100" cy="95" r="80" fill="url(#halo)" />
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse key={i} cx="100" cy="116" rx="14" ry="36" transform={`rotate(${-75 + i * 25} 100 150)`} fill={i % 2 ? "#f7b6c8" : "#fff3e0"} stroke="#d9a441" strokeWidth="1.2" />
      ))}
      <path d="M44 138 Q100 205 156 138 Z" fill="url(#gold)" stroke="#a8741b" strokeWidth="2" />
      <ellipse cx="100" cy="138" rx="56" ry="9" fill="#f6dc8e" stroke="#a8741b" />
      <rect x="98" y="120" width="4" height="18" fill="#5a1428" />
      <path className="flame" d="M100 50 Q126 90 100 124 Q74 90 100 50Z" fill="#ffb703" />
      <path className="flame" d="M100 82 Q112 104 100 122 Q88 104 100 82Z" fill="#fff4c2" />
    </g>
  ),
  mandap: (
    <g>
      <rect x="22" y="168" width="156" height="14" rx="4" fill="url(#gold)" />
      {[36, 70, 118, 152].map((x) => (
        <g key={x}><rect x={x} y="80" width="12" height="88" fill="url(#gold)" /><rect x={x - 3} y="160" width="18" height="8" fill="#a8741b" /></g>
      ))}
      <path d="M20 82 Q100 -14 180 82 Z" fill="#5a1428" stroke="url(#gold)" strokeWidth="4" />
      <path d="M100 14 V4" stroke="#d9a441" strokeWidth="3" /><circle cx="100" cy="4" r="5" fill="url(#gold)" />
      <rect x="26" y="80" width="148" height="9" rx="4" fill="url(#gold)" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={36 + i *16} cy="98" r="6" fill={i % 2 ? "#ff7a00" : "#f4b92b"} />)}
      <path d="M46 89 Q58 132 70 89 Z M130 89 Q142 132 154 89 Z" fill="#fff3e0" opacity=".92" />
      <path d="M84 168 L90 152 H110 L116 168 Z" fill="#8b1e3f" />
      <path className="flame" d="M100 120 Q114 142 100 152 Q86 142 100 120Z" fill="#ffb703" />
    </g>
  ),
};

function Title({ children, light }) {
  const words = String(children).split(" ");
  return (
    <Reveal className="title-wrap">
      <h2 className={`script title ${light ? "light" : ""}`} aria-label={String(children)}>
        {words.map((w, i) => (
          <span className="w" key={i} style={{ "--i": i }}><span>{w}&nbsp;</span></span>
        ))}
      </h2>
    </Reveal>
  );
}

function Rangoli() {
  const n = Array.from({ length: 24 });
  return (
    <svg className="rangoli" viewBox="-100 -100 200 200" aria-hidden="true">
      {n.map((_, i) => (
        <g key={i} transform={`rotate(${i * 15})`}>
          <ellipse cx="0" cy="-78" rx="5" ry="16" fill="none" stroke="currentColor" strokeWidth=".8" />
          <circle cx="0" cy="-55" r="1.8" fill="currentColor" />
          <path d="M0 -98 L3 -91 L-3 -91 Z" fill="currentColor" />
        </g>
      ))}
      {n.map((_, i) => <ellipse key={`b${i}`} cx="0" cy="-44" rx="4" ry="12" transform={`rotate(${i * 15 + 7.5})`} fill="currentColor" opacity=".3" />)}
      <circle r="30" fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 3" />
      <circle r="62" fill="none" stroke="currentColor" strokeWidth=".6" />
    </svg>
  );
}

/* ---------- front-page scenery ---------- */
function Palace() {
  const far = [[40,70,120],[190,50,170],[320,80,110],[460,60,180],[630,90,130],[790,60,190],[950,80,120],[1090,50,170],[1220,70,115],[1340,70,150]];
  const near = [[0,90,140],[130,60,210],[250,100,130],[390,70,240],[530,110,150],[700,80,270],[890,100,150],[1040,70,230],[1170,100,135],[1290,80,200],[1390,60,160]];
  const draw = (list, fill, win, k) => list.map(([x, w, h], i) => {
    const y = 260 - h, d = w * 0.7;
    const wins = [];
    for (let r = 0; r < Math.floor(h / 46); r++)
      for (let c = 0; c < Math.max(1, Math.floor(w / 28)); c++)
        wins.push([x + 10 + c * 26, y + 22 + r * 44]);
    return (
      <g key={`${k}${i}`} fill={fill}>
        <rect x={x} y={y} width={w} height={h} />
        <path d={`M${x - 4} ${y} Q${x + w / 2} ${y - d} ${x + w + 4} ${y} Z`} />
        <path d={`M${x + w / 2} ${y - d * 0.5} V${y - d * 0.5 - 16}`} stroke="#d9a441" strokeWidth="2" />
        <circle cx={x + w / 2} cy={y - d * 0.5 - 18} r="3" fill="#f6dc8e" />
        {win && wins.map(([wx, wy], j) => (
          <path key={j} className="win" d={`M${wx} ${wy} v-10 a4 4 0 0 1 8 0 v10z`} style={{ animationDelay: `${((i * 7 + j * 3) % 9) * 0.45}s` }} />
        ))}
      </g>
    );
  });
  return (
    <>
      <svg className="palace far" viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">{draw(far, "#3a0b1b", false, "f")}</svg>
      <svg className="palace near" viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        {draw(near, "#1c040d", true, "n")}
        <rect x="0" y="250" width="1440" height="10" fill="#1c040d" />
      </svg>
    </>
  );
}

function Lights() {
  const bulbs = [];
  [[0, 720], [720, 1440]].forEach(([x0, x1], si) => {
    for (let k = 1; k <= 9; k++) {
      const t = k / 10;
      bulbs.push({ x: x0 + (x1 - x0) * t, y: 2 * (1 - t) * t * 120, c: ["#ffd35c", "#ff7a9c", "#fff3e0", "#ff9a3c"][(k + si) % 4], d: ((k * 3 + si) % 7) * 0.3 });
    }
  });
  return (
    <svg className="lights" viewBox="0 0 1440 100" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path d="M0 0 Q360 120 720 0 Q1080 120 1440 0" fill="none" stroke="#d9a441" strokeWidth="2" />
      {bulbs.map((b, i) => (
        <g key={i}>
          <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + 7} stroke="#d9a441" strokeWidth="1.5" />
          <circle className="bulb" cx={b.x} cy={b.y + 13} r="6" fill={b.c} style={{ animationDelay: `${b.d}s`, color: b.c }} />
        </g>
      ))}
    </svg>
  );
}

function Seal({ a, b, date }) {
  return (
    <svg className="seal-svg" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#4a0f20" stroke="url(#gold)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="#d9a441" strokeWidth="1.2" />
      <g className="ring">
        <path id="sealPath" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" fill="none" />
        <text fontSize="8.5" fill="#f6dc8e" fontWeight="700">
          <textPath href="#sealPath" textLength="236" lengthAdjust="spacing">SHUBH VIVAH ❖ {date} ❖ </textPath>
        </text>
      </g>
      <text x="50" y="57" textAnchor="middle" fontSize="19" fill="#f6dc8e" style={{ fontFamily: "var(--script)" }}>{a}&amp;{b}</text>
    </svg>
  );
}

function Art({ name }) {
  const src = IMG.art[name];
  if (src) return <img className="art" src={src} alt="" />;
  return <svg className="art" viewBox="0 0 200 200" aria-hidden="true">{ARTS[name]}</svg>;
}

function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 1800);
        setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <b ref={ref}>{n}{suffix}</b>;
}

function Marquee() {
  const items = ["॥ शुभ विवाह ॥", "Mehndi", "Haldi", "Sangeet", "Phere", "Vidaai"];
  const row = [...items, ...items].map((t, i) => <span key={i}>{t} <em>❖</em></span>);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">{row}{row}</div>
    </div>
  );
}

/* Sticky stage whose picture changes as you scroll through the chapters */
function Story() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(+e.target.dataset.ch)),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    document.querySelectorAll("[data-ch]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="story">
      <Title>Our journey</Title>
      <div className="story-grid">
        <div className="stage-wrap">
          <div className="stage">
            <div className="stage-ring" />
            <div className="orbit"><i /></div>
            <div className="orbit o2"><i /><i /></div>
            {STORY.map((c, i) => (
              <div key={c.art} className={`art-slot ${i === active ? "on" : i < active ? "past" : ""}`}><Art name={c.art} /></div>
            ))}
            <div className="stage-label"><b key={active}>{STORY[active].when}</b></div>
          </div>
        </div>
        <div className="chapters">
          {STORY.map((c, i) => (
            <article key={c.title} data-ch={i} className={`chapter ${i === active ? "on" : ""}`}>
              <span className="when">{c.when}</span>
              <h3 className="script">{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [stage, setStage] = useState("closed"); // closed → leaving → ready

  const sparkles = useMemo(
    () => Array.from({ length: 26 }, () => ({ l: Math.random() * 100, t: Math.random() * 100, s: 3 + Math.random() * 5, d: Math.random() * 6, du: 3 + Math.random() * 4 })),
    []
  );

  const open = () => {
    setStage("leaving");
    setTimeout(() => setStage("ready"), 1500);
  };

  const D = new Date(WEDDING.date);
  const month = D.toLocaleDateString("en-IN", { month: "long" }).toUpperCase();
  const weekday = D.toLocaleDateString("en-IN", { weekday: "long" }).toUpperCase();
  const time = D.toLocaleTimeString("en-IN", { hour: "numeric", minute: D.getMinutes() ? "2-digit" : undefined, hour12: true }).replace(" ", "").toUpperCase();
  const [bride1] = WEDDING.bride.split(" ");

  /* buttery scroll: --sy, --prog and --p are eased every frame instead of jumping */
  useEffect(() => {
    const root = document.documentElement;
    const els = [...document.querySelectorAll("[data-par]")];
    const ps = new Map();
    let target = window.scrollY, cur = target, raf = 0;
    const onScroll = () => { target = window.scrollY; };
    const loop = () => {
      cur += (target - cur) * 0.085;
      const vh = window.innerHeight, max = root.scrollHeight - vh;
      root.style.setProperty("--sy", cur.toFixed(2));
      root.style.setProperty("--prog", max > 0 ? (cur / max).toFixed(4) : 0);
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        const p = ps.has(el) ? ps.get(el) : t;
        const np = p + (t - p) * 0.09;
        ps.set(el, np);
        el.style.setProperty("--p", np.toFixed(4));
      });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    loop();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  /* 3D tilt on cards + golden sparkle trail behind the mouse */
  useEffect(() => {
    let last = 0;
    const move = (e) => {
      const t = e.target.closest ? e.target.closest(".tilt") : null;
      document.querySelectorAll(".tilt.hot").forEach((el) => {
        if (el !== t) { el.classList.remove("hot"); ["--rx", "--ry"].forEach((k) => el.style.removeProperty(k)); }
      });
      if (t) {
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        t.classList.add("hot");
        t.style.setProperty("--rx", `${(-y * 12).toFixed(2)}deg`);
        t.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
        t.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
        t.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
      }
      const now = performance.now();
      if (e.pointerType === "mouse" && now - last > 55) {
        last = now;
        const d = document.createElement("i");
        d.className = "trail";
        d.style.left = `${e.clientX}px`;
        d.style.top = `${e.clientY}px`;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 900);
      }
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const stars = useMemo(
    () => Array.from({ length: 46 }, () => ({ l: Math.random() * 100, t: Math.random() * 62, s: 2 + Math.random() * 3, d: Math.random() * 5, du: 2 + Math.random() * 3 })),
    []
  );
  const sealDate = `${String(D.getDate()).padStart(2, "0")} · ${String(D.getMonth() + 1).padStart(2, "0")} · ${D.getFullYear()}`;

  const petals = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ l: Math.random() * 100, s: 10 + Math.random() * 12, d: 11 + Math.random() * 10, de: -Math.random() * 20, c: ["#f4b92b", "#e8466f", "#ff7a00", "#fff3e0"][i % 4] })),
    []
  );

  return (
    <div className={`app ${stage !== "closed" ? "go" : ""}`}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#f6dc8e" /><stop offset=".5" stopColor="#d9a441" /><stop offset="1" stopColor="#a8741b" /></linearGradient>
          <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ffe9a8" /><stop offset="1" stopColor="#d9962b" /></linearGradient>
          <linearGradient id="wineGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7d1b3a" /><stop offset="1" stopColor="#5a1428" /></linearGradient>
          <radialGradient id="halo"><stop offset="0" stopColor="#ffe9a0" stopOpacity=".85" /><stop offset="1" stopColor="#ffe9a0" stopOpacity="0" /></radialGradient>
        </defs>
      </svg>

      <div className="progress" aria-hidden="true"><i /></div>

      <div className="petals" aria-hidden="true">
        {petals.map((p, i) => (
          <i key={i} style={{ left: `${p.l}%`, width: p.s, height: p.s * 1.3, background: p.c, animationDuration: `${p.d}s`, animationDelay: `${p.de}s` }} />
        ))}
      </div>

      <div className="sparkles" aria-hidden="true">
        {sparkles.map((p, i) => (
          <i key={i} style={{ left: `${p.l}%`, top: `${p.t}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, animationDuration: `${p.du}s` }} />
        ))}
      </div>

      {stage !== "ready" && (
        <div className={`intro ${stage === "leaving" ? "leaving" : ""}`}>
          <Rangoli />
          <div className="intro-arch">
            <svg viewBox="0 0 400 240" aria-hidden="true">
              <path d="M2 241 V190 A20 20 0 0 1 18 158 A22 22 0 0 1 48 118 A24 24 0 0 1 90 92 A26 26 0 0 1 140 62 Q175 40 200 8 Q225 40 260 62 A26 26 0 0 1 310 92 A24 24 0 0 1 352 118 A22 22 0 0 1 382 158 A20 20 0 0 1 398 190 V241" fill="none" stroke="url(#gold)" strokeWidth="3" pathLength="1" className="draw" />
            </svg>
            <div className="intro-text">
              <p className="hindi">॥ श्री गणेशाय नमः ॥</p>
              <h1 className="script">{bride1} <small>&amp;</small> {WEDDING.groom.split(" ")[0]}</h1>
              <p className="serif-i">request the honour of your presence</p>
              <button className="open-btn" onClick={open}>Open invitation</button>
            </div>
          </div>
        </div>
      )}

      <main className="page">
        {/* ============ HERO (full width) ============ */}
        <section className="hero">
          <div className="halo" />
          <div className="stars" aria-hidden="true">
            {stars.map((p, i) => <i key={i} style={{ left: `${p.l}%`, top: `${p.t}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, animationDuration: `${p.du}s` }} />)}
          </div>
          <Rangoli />
          <Palace />
          <Lights />
          <Flora pos="tl" /><Flora pos="tr" /><Flora pos="bl" /><Flora pos="br" />
          <Lantern chain={200} className="l1" delay={0} />
          <Lantern chain={340} className="l2" delay={0.4} />
          <Lantern chain={340} className="l3" delay={0.2} />
          <Lantern chain={200} className="l4" delay={0.6} />

          <div className="arch">
            <div className="cap-wrap">
              <ArchCap />
              <div className="seal-wrap rise" style={{ "--d": "0.9s" }}><Seal a={bride1[0]} b={WEDDING.groom[0]} date={sealDate} /></div>
              <div className="cap-text rise" style={{ "--d": "1.1s" }}>
                <p className="hindi">॥ श्री गणेशाय नमः ॥</p>
              </div>
            </div>
            <div className="arch-body">
              <p className="serif rise" style={{ "--d": "1.5s" }}>Together with their families</p>
              <h1 className="script names">
                <span className="rise" style={{ "--d": "1.9s" }}>{WEDDING.bride}</span>
                <em className="rise" style={{ "--d": "2.3s" }}>&amp;</em>
                <span className="rise" style={{ "--d": "2.6s" }}>{WEDDING.groom}</span>
              </h1>
              <div className="divider rise" style={{ "--d": "3s" }}><i /><b>❖</b><i /></div>
              <p className="serif-i rise" style={{ "--d": "3.3s" }}>cordially invite you to join the occasion of<br />their joyous commitment on</p>

              <div className="datebox rise" style={{ "--d": "3.7s" }}>
                <p className="month">{month}</p>
                <div className="daterow">
                  <span>{weekday}</span>
                  <strong>{D.getDate()}</strong>
                  <span>AT {time}</span>
                </div>
                <p className="year">{D.getFullYear()}</p>
              </div>

              <p className="serif-i rise" style={{ "--d": "4.1s" }}>at</p>
              <p className="serif caps venue-line rise" style={{ "--d": "4.3s" }}>{WEDDING.venue}<br />{WEDDING.address}</p>
              <p className="serif-i rise" style={{ "--d": "4.6s" }}>Kindly RSVP before {WEDDING.rsvpBy} on {WEDDING.phone}</p>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true"><i /><span>Scroll to explore</span></div>
        </section>

        <Marquee />

        {/* ============ COUNTDOWN ============ */}
        <section className="band">
          <Reveal>
            <Title light>The shubh muhurat begins in</Title>
            <Countdown target={WEDDING.date} />
            <div className="stats">
              {STATS.map((x) => (
                <div key={x.label}><CountUp to={x.to} suffix={x.suffix} /><span>{x.label}</span></div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ============ EVENTS ============ */}
        <section className="section">
          <Title>Celebrations</Title>
          <div className="events">
            {EVENTS.map((e, i) => (
              <Reveal key={e.name} delay={i * 0.12} className="event-wrap">
                <article className="event tilt">
                  <div className="medal">{e.day}</div>
                  <h3 className="script">{e.name}</h3>
                  <p className="time">{e.time}</p>
                  <p className="note">{e.note}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ STORY (image changes on scroll) ============ */}
        <Story />

        {/* ============ WEDDING DAY TIMELINE ============ */}
        <section className="section">
          <Title>The wedding day</Title>
          <div className="timeline" data-par>
            <div className="tl-line" />
            {TIMELINE.map((x, i) => (
              <Reveal key={x.n} className={`tl-item ${i % 2 ? "r" : "l"}`}>
                <span className="tl-dot" />
                <div className="tl-card tilt">
                  <b className="tl-time">{x.t}</b>
                  <h3 className="script">{x.n}</h3>
                  <p>{x.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ GALLERY (rows slide with scroll) ============ */}
        <section className="band gallery" data-par>
          <Title light>Moments & memories</Title>
          {[false, true].map((rev) => (
            <div key={String(rev)} className={`row ${rev ? "b" : "a"}`}>
              {[...GALLERY, ...GALLERY].map((g, i) => (
                <figure className="g-item tilt" key={i}>
                  <div className="g-art"><Art name={rev ? GALLERY[(GALLERY.length - 1 - (i % GALLERY.length))].art : g.art} /></div>
                  <figcaption className="script">{rev ? GALLERY[(GALLERY.length - 1 - (i % GALLERY.length))].cap : g.cap}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </section>

        {/* ============ GOOD TO KNOW ============ */}
        <section className="section">
          <Title>Good to know</Title>
          <div className="events">
            {INFO.map((x, i) => (
              <Reveal key={x.h} delay={i * 0.12} className="event-wrap">
                <article className="info tilt">
                  <h3 className="script">{x.h}</h3>
                  <p>{x.t}</p>
                  {x.chips && <div className="chips">{x.chips.map((c) => <i key={c} style={{ background: c }} />)}</div>}
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ VENUE ============ */}
        <section className="band">
          <div className="duo">
            <Reveal className="venue-info">
              <div className="venue-art"><Art name="mandap" /></div>
              <Title light>Where we celebrate</Title>
              <p className="venue-name">{WEDDING.venue}</p>
              <p className="serif">{WEDDING.address}</p>
              <p className="serif-i">{weekday.charAt(0) + weekday.slice(1).toLowerCase()}, {D.getDate()} {month.charAt(0) + month.slice(1).toLowerCase()} {D.getFullYear()} at {time}</p>
              <a className="open-btn" href={`https://www.google.com/maps/search/${encodeURIComponent(WEDDING.venue + " " + WEDDING.address)}`} target="_blank" rel="noreferrer">View on map</a>
            </Reveal>
          </div>
        </section>

        <Marquee />
        <footer className="foot">
          <p className="script">With love &amp; blessings</p>
          <p className="serif-i">{WEDDING.bride} &amp; {WEDDING.groom}</p>
          <div className="gold-border" />
        </footer>
      </main>
    </div>
  );
}