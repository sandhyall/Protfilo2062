import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code2, TrendingUp, Users } from "lucide-react";
import video from "../../assets/design.mp4";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const stats = [
  { icon: Code2, value: "50+", label: "Projects Delivered" },
  { icon: Users, value: "30+", label: "Happy Clients" },
  { icon: TrendingUp, value: "3x", label: "Avg. Growth" },
];

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={video} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />

      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl z-10"
      />
      <motion.div
        animate={{ y: [0, -25, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/30 rounded-full blur-3xl z-10"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-20 container mx-auto px-6 text-center text-white pt-24"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 uppercase tracking-widest text-blue-300 font-semibold mb-6 text-xs md:text-sm bg-blue-500/10 border border-blue-400/30 rounded-full px-4 py-2 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          End-to-End Digital Solutions
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Build. Grow. Succeed With <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-[length:200%_auto] animate-gradient">
            MERN Stack & Digital Marketing
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-base md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light"
        >
          We develop high-performance websites, web applications, and
          result-driven digital marketing strategies that help businesses grow
          faster.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-colors"
          >
            Get Free Consultation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-sm transition-colors"
          >
            View Our Work
          </motion.button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-14 border-t border-white/10 pt-8 max-w-3xl mx-auto"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="bg-white/10 rounded-full p-2.5">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center p-1"
        >
          <div className="w-1 h-1.5 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
