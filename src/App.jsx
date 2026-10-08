import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Sparkles, CalendarHeart, Clock, MapPin } from "lucide-react";

/* ---------- reusable animation variants ---------- */
const EASE = [0.22, 1, 0.36, 1];
const focusIn = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 14 },
  show: (d = 0) => ({ opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 1.5, delay: d, ease: EASE } }),
  exit: { opacity: 0, filter: "blur(16px)", transition: { duration: 0.9 } },
};

/* reveals a sentence word by word, blur to sharp */
function Words({ text, delay = 0, className = "" }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <motion.span key={i} aria-hidden className="inline-block mr-[0.28em]"
          initial={{ opacity: 0, filter: "blur(10px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.1, delay: delay + i * 0.16, ease: EASE }}>
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/* small gold divider with a star in the middle */
function Ornament({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden>
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/70" />
      <span className="text-xs">✦</span>
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}

/* ---------- background: glow + falling petals ---------- */
function Backdrop({ celebrate }) {
  const petals = useMemo(() => Array.from({ length: celebrate ? 38 : 13 }, (_, i) => ({
    id: i, left: Math.random() * 100, size: 12 + Math.random() * 14,
    dur: (celebrate ? 8 : 16) + Math.random() * 9, delay: Math.random() * (celebrate ? 2.5 : 12),
    sway: 30 + Math.random() * 70, spin: 120 + Math.random() * 300,
    heart: celebrate && i % 4 === 0, tone: ["#e9a8b3", "#f2c6c8", "#d98a98", "#e8cfa0"][i % 4],
  })), [celebrate]);
  return (
    <>
      <div className="orb w-[28rem] h-[28rem] -top-32 -left-32 bg-rose/40" />
      <div className="orb w-[24rem] h-[24rem] bottom-0 -right-24 bg-[#e8cfa0]/40" style={{ animationDelay: "-8s" }} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-[2]" aria-hidden>
        {petals.map((p) => (
          <motion.span key={p.id} className="absolute block" style={{ left: `${p.left}%`, top: -40, color: p.tone, opacity: 0.7 }}
            animate={{ y: "112vh", x: [0, p.sway, -p.sway, 0], rotate: p.spin }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}>
            {p.heart ? <Heart size={p.size * 0.8} fill="currentColor" strokeWidth={0} /> : (
              <svg width={p.size} height={p.size * 1.4} viewBox="0 0 20 28"><path d="M10 0C18 6 20 16 10 28 0 16 2 6 10 0Z" fill="currentColor" /></svg>
            )}
          </motion.span>
        ))}
      </div>
    </>
  );
}

/* line-art flower */
function Flower({ className = "" }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" strokeWidth="0.8" aria-hidden>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <ellipse key={r} cx="60" cy="36" rx="9" ry="24" transform={`rotate(${r} 60 60)`} stroke="#c0788a" fill="rgba(241,207,204,.3)" />
      ))}
      <circle cx="60" cy="60" r="8" stroke="#c3a46b" fill="rgba(195,164,107,.2)" />
      <circle cx="60" cy="60" r="2" fill="#c3a46b" />
    </svg>
  );
}

/* corner flourish for the card */
const Corner = ({ cls }) => (
  <svg viewBox="0 0 28 28" className={`absolute w-7 h-7 ${cls}`} fill="none" stroke="#c3a46b" strokeWidth="1" aria-hidden>
    <path d="M2 26V10Q2 2 10 2H26" /><circle cx="10" cy="10" r="1.2" fill="#c3a46b" />
  </svg>
);

/* ---------- 1. Opening ---------- */
function OpeningScreen({ onOpen }) {
  return (
    <motion.section variants={focusIn} initial="hidden" animate="show" exit="exit"
      className="relative z-10 flex min-h-svh flex-col items-center justify-center overflow-hidden px-8 text-center">
      <motion.div className="opening-orbit absolute h-[26rem] w-[26rem] rounded-full border border-gold/20" aria-hidden="true" />
      <motion.div className="absolute h-72 w-72 rounded-full bg-rose/10 blur-3xl" animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.75, 0.45] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} aria-hidden="true" />
      <Ornament className="mb-10" />
      <h1 className="relative font-serif font-light italic text-4xl leading-tight text-plum sm:text-6xl max-w-xl shine">
        Vartika, I have a little question for you...
      </h1>
      <p className="relative mt-7 max-w-md font-serif text-base italic leading-relaxed text-plum/65 sm:text-lg">
        A tiny invitation, made with a whole lot of feelings.
      </p>
      <motion.button variants={focusIn} custom={1.8} initial="hidden" animate="show" onClick={onOpen}
        whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.97 }}
        className="relative mt-16 flex flex-col items-center gap-5 cursor-pointer bg-transparent border-0" aria-label="Open the invitation">
        <span className="relative">
          <motion.span className="absolute inset-0 rounded-full border border-rose"
            animate={{ scale: [1, 1.7], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }} />
          <span className="seal relative flex h-20 w-20 items-center justify-center rounded-full">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 font-script text-3xl text-white/90">♡</span>
          </span>
        </span>
        <span className="tracking-[0.3em] text-xs text-plum/80">Open this ♡</span>
      </motion.button>
    </motion.section>
  );
}

/* ---------- 2. Invitation ---------- */
function Invitation({ onYes }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 40, damping: 18 });
  const sy = useSpring(useTransform(my, [-1, 1], [-12, 12]), { stiffness: 40, damping: 18 });
  return (
    <section onMouseMove={(e) => { mx.set((e.clientX / innerWidth - 0.5) * 2); my.set((e.clientY / innerHeight - 0.5) * 2); }}
      className="relative z-10 flex min-h-svh flex-col items-center overflow-hidden px-5 pb-24 pt-20 text-center sm:px-8 sm:pt-24">
      <motion.div style={{ x: sx, y: sy }} className="absolute -left-14 top-12 w-52 opacity-60 -rotate-12 pointer-events-none sm:w-80" animate={{ rotate: [-12, -8, -12] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}><Flower /></motion.div>
      <motion.div style={{ x: sx, y: sy }} className="absolute -right-16 top-[29rem] w-44 opacity-50 rotate-12 pointer-events-none sm:w-72" animate={{ rotate: [12, 7, 12] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}><Flower /></motion.div>

      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE }} className="relative">
        <motion.p animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 3.5, repeat: Infinity }} className="font-script text-4xl text-dusty sm:text-5xl">So... I was wondering...</motion.p>
        <h2 className="mx-auto mt-7 max-w-3xl font-serif text-[2.8rem] font-light leading-[1.08] sm:text-7xl">
          <Words text="Vartika, would you like to go on a date with me?" delay={1.1} />
        </h2>
      </motion.div>
      <motion.div variants={focusIn} custom={2.4} initial="hidden" animate="show" className="relative mt-10 w-full">
        <Ornament />
        <p className="mt-6 text-sm tracking-[0.4em] text-gold">Friday Evening ✦</p>
        <p className="mx-auto mt-4 max-w-xs font-serif text-xl italic leading-relaxed text-plum/80 sm:text-2xl">
          Just you, me, and a little time away from everything else.
        </p>
      </motion.div>

      <DateDetails />
      <Question onYes={onYes} />
    </section>
  );
}

/* ---------- 3. Date details ---------- */
function DateDetails() {
  const rows = [[CalendarHeart, "Friday"], [Clock, "Evening"], [MapPin, "Somewhere nice — I'll take care of the details."]];
  return (
    <motion.div initial={{ opacity: 0, y: 40, rotateX: 8, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.4, ease: EASE }}
      className="paper relative mt-28 w-full max-w-sm rounded-[26px] px-9 py-12 text-left shadow-[0_36px_70px_-40px_rgba(74,31,46,.62)]">
      <Corner cls="top-3 left-3" /><Corner cls="top-3 right-3 rotate-90" />
      <Corner cls="bottom-3 right-3 rotate-180" /><Corner cls="bottom-3 left-3 -rotate-90" />
      <motion.div initial={{ scale: 0, rotate: -16 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: 0.25, type: "spring", stiffness: 190, damping: 15 }} className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-white/35 text-gold">♡</motion.div>
      <p className="font-script text-3xl text-dusty">you're invited</p>
      <h3 className="mt-3 font-serif text-3xl tracking-[0.28em]">FRIDAY EVENING</h3>
      <Ornament className="my-7" />
      <ul>
        {rows.map(([Icon, text], i) => (
          <li key={text} className={`flex items-start gap-4 py-4 ${i ? "border-t border-gold/25" : ""}`}>
            <Icon size={18} strokeWidth={1.3} className="mt-0.5 shrink-0 text-dusty" />
            <span className="text-[15px] font-light leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ---------- 4. Question ---------- */
const maybeLines = ["Maybe...", "Hmm... I see how it is 👀", "Okay, I'll give you another second to think...", "Still thinking? Take your time ♡", "The yes button is getting lonely..."];

function Question({ onYes }) {
  const [tries, setTries] = useState(0);
  const s = 1 + Math.min(tries, 5) * 0.05;
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2 }} className="mt-28 flex w-full flex-col items-center">
      <h3 className="font-serif text-3xl font-light italic sm:text-4xl">So... what do you say?</h3>
      <div className="mt-10 flex w-full max-w-xs flex-col items-center gap-5">
        <motion.button animate={{ scale: s }} whileHover={{ scale: s + 0.04, y: -3 }} whileTap={{ scale: s - 0.03 }} onClick={onYes}
          className="btn-yes group relative min-h-14 w-full overflow-hidden rounded-full border-0 tracking-[0.18em] text-sm font-medium cursor-pointer">
          <span className="relative z-10">YES, I'D LOVE TO ♡</span>
          <motion.span className="absolute inset-0 bg-white/15" initial={{ x: "-100%" }} whileHover={{ x: 0 }} transition={{ duration: 0.65, ease: EASE }} />
        </motion.button>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => setTries((t) => t + 1)}
          className="min-h-12 rounded-full border border-transparent px-6 text-sm text-plum/70 transition hover:border-gold/50 hover:text-plum cursor-pointer">
          <AnimatePresence mode="wait">
            <motion.span key={tries} className="inline-block" initial={{ opacity: 0, filter: "blur(6px)", y: 8 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
              {maybeLines[tries % maybeLines.length]}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ---------- 5. Celebration ---------- */
function CelebrationScreen() {
  const [done, setDone] = useState(false);
  return (
    <motion.section initial={{ opacity: 0, scale: 0.92, filter: "blur(18px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease: EASE }}
      className="relative z-10 flex min-h-svh flex-col items-center justify-center overflow-hidden px-8 text-center">
      <motion.div className="absolute h-72 w-72 rounded-full border border-gold/50"
        initial={{ scale: 0.4, opacity: 0.8 }} animate={{ scale: [0.4, 2.8, 3.8], opacity: [0.8, 0.15, 0] }} transition={{ duration: 3.2, ease: "easeOut" }} />
      <motion.div className="absolute h-96 w-96 rounded-full border border-rose/20" animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.55, 0.25] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      {[...Array(12)].map((_, i) => (
        <motion.span key={i} className="absolute text-gold" style={{ left: `${5 + i * 8.5}%`, top: `${15 + ((i * 41) % 62)}%` }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.25, 0.6], rotate: [0, 90, 180] }} transition={{ duration: 3.8, delay: i * 0.25, repeat: Infinity, ease: "easeInOut" }}>
          <Sparkles size={14} />
        </motion.span>
      ))}
      <motion.div initial={{ y: 34, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 1.1, ease: EASE }}>
        <h2 className="font-serif text-6xl font-light italic leading-none sm:text-8xl shine">It's a date. ♡</h2>
        <Ornament className="my-8" />
        <p className="text-sm tracking-[0.3em] text-gold">Friday evening it is.</p>
        <p className="mx-auto mt-6 max-w-sm font-script text-3xl leading-snug text-dusty">I'll take care of the rest. You just show up looking cute.</p>
      </motion.div>
      <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setDone(true)}
        className="btn-yes relative mt-14 min-h-14 overflow-hidden rounded-full border-0 px-12 tracking-[0.2em] text-sm cursor-pointer">
        <span className="relative z-10">{done ? "See you Friday ♡" : "Can't wait ✦"}</span>
      </motion.button>
    </motion.section>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [stage, setStage] = useState("open");
  useEffect(() => { window.scrollTo({ top: 0 }); }, [stage]);
  return (
    <main className="relative min-h-svh">
      <Backdrop celebrate={stage === "yes"} key={stage === "yes" ? "b" : "c"} />
      <AnimatePresence mode="wait">
        {stage === "open" && <OpeningScreen key="o" onOpen={() => setStage("invite")} />}
        {stage === "invite" && (
          <motion.div key="i" initial={{ opacity: 0, filter: "blur(14px)" }} animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(14px)" }} transition={{ duration: 1.2 }}>
            <Invitation onYes={() => setStage("yes")} />
          </motion.div>
        )}
        {stage === "yes" && <CelebrationScreen key="y" />}
      </AnimatePresence>
    </main>
  );
}
