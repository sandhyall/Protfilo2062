import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="bg-slate-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-cyan-400 uppercase tracking-[4px] font-semibold">
            Mission & Vision
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Driven by Purpose, Inspired by Innovation
          </h2>

          <p className="text-slate-400 mt-6 max-w-3xl mx-auto">
            Our mission and vision guide every project we build,
            helping businesses grow with technology, creativity,
            and long-term partnerships.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-10"
          >
            <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 blur-3xl rounded-full"></div>

            <div className="relative z-10">

              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-8">
                <Target size={40} />
              </div>

              <h3 className="text-3xl font-bold text-white mb-5">
                Our Mission
              </h3>

              <p className="text-slate-400 leading-8">
                Our mission is to empower startups, businesses,
                and enterprises by delivering innovative,
                scalable, and secure digital solutions.
                We focus on quality, creativity, and technology
                to solve real business challenges and create
                meaningful digital experiences.
              </p>

              <ul className="mt-8 space-y-3 text-slate-300">
                <li>✔ Deliver high-quality software</li>
                <li>✔ Build long-term client relationships</li>
                <li>✔ Encourage innovation and creativity</li>
                <li>✔ Ensure customer satisfaction</li>
              </ul>

            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-10"
          >
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-purple-500/10 blur-3xl rounded-full"></div>

            <div className="relative z-10">

              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white mb-8">
                <Eye size={40} />
              </div>

              <h3 className="text-3xl font-bold text-white mb-5">
                Our Vision
              </h3>

              <p className="text-slate-400 leading-8">
                Our vision is to become a globally trusted
                technology partner known for delivering
                world-class digital products, inspiring
                innovation, and helping businesses thrive
                in the digital era.
              </p>

              <ul className="mt-8 space-y-3 text-slate-300">
                <li>✔ Become a global technology leader</li>
                <li>✔ Deliver future-ready solutions</li>
                <li>✔ Drive digital transformation</li>
                <li>✔ Create lasting business impact</li>
              </ul>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}