import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="bg-slate-950 py-28 px-6">

      <motion.div
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: .8 }}
        className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 p-16 text-center"
      >

        <h2 className="text-5xl font-bold text-white">
          Let's Build Something Amazing Together
        </h2>

        <p className="text-white/80 mt-6 text-lg max-w-2xl mx-auto">
          Whether you're launching a startup, growing your business,
          or building the next big product, we're here to help turn
          your ideas into reality.
        </p>

        <div className="mt-10 flex justify-center gap-5 flex-wrap">

          <button className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition">
            Get Started
          </button>

          <button className="border border-white px-8 py-4 rounded-xl text-white hover:bg-white hover:text-black transition">
            Contact Us
          </button>

        </div>

      </motion.div>

    </section>
  );
}