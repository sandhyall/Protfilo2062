import { motion } from "framer-motion";

const floatingWords = [
  { text: "TEAMWORK", top: "10%", left: "8%" },
  { text: "INNOVATION", top: "20%", right: "10%" },
  { text: "TECHNOLOGY", top: "40%", left: "5%" },
  { text: "CREATIVITY", top: "70%", left: "12%" },
  { text: "DEVELOPMENT", top: "75%", right: "8%" },
  { text: "DESIGN", top: "55%", right: "15%" },
  { text: "REACT", top: "88%", left: "25%" },
  { text: "NODE JS", top: "85%", right: "25%" },
];

export default function AboutHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-6">
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {floatingWords.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: -50 }}
          animate={{
            opacity: 0.08,
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: index * 0.3,
          }}
          className="absolute text-white font-extrabold pointer-events-none select-none"
          style={{
            top: word.top,
            left: word.left,
            right: word.right,
            fontSize: "clamp(20px,3vw,50px)",
          }}
        >
          {word.text}
        </motion.span>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-cyan-400 uppercase tracking-[4px] mb-4"
        >
          About Our Company
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-white leading-tight"
        >
          Building The Future
          <br />
          Of Digital Experiences
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-slate-400 text-lg md:text-xl max-w-3xl mx-auto"
        >
          We help startups, businesses, and enterprises transform ideas into
          scalable digital products through innovation, creativity, and modern
          technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-5"
        >
          <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold transition-all">
            Start Project
          </button>

          <button className="px-8 py-4 border border-slate-700 hover:border-cyan-500 text-white rounded-xl font-semibold transition-all">
            View Portfolio
          </button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-7 h-12 border-2 border-slate-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 mt-2 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
