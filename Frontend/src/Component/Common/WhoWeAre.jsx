import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const features = [
  "Professional Development Team",
  "Modern UI/UX Design",
  "Scalable Web Applications",
  "Client-Centered Approach",
];

export default function WhoWeAre() {
  return (
    <section className="bg-slate-950 py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img
            src="/images/about-team.jpg"
            alt="Our Team"
            className="rounded-3xl shadow-2xl border border-slate-800 w-full object-cover"
          />

          {/* Experience Card */}
          <div className="absolute -bottom-8 -right-6 bg-cyan-500 text-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold">5+</h2>
            <p className="text-sm">Years of Experience</p>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-cyan-400 uppercase tracking-[4px] font-semibold mb-3">
            Who We Are
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            We Build Powerful Digital Experiences
          </h2>

          <p className="text-slate-400 text-lg leading-8 mb-8">
            We are a passionate team of developers, designers, and digital
            strategists dedicated to helping businesses grow through innovative
            technology. From websites and e-commerce platforms to enterprise
            applications, we deliver high-quality solutions tailored to our
            clients' needs.
          </p>

          {/* Features */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {features.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4"
              >
                <CheckCircle className="text-cyan-400" size={22} />
                <span className="text-slate-200">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 transition px-7 py-3 rounded-xl text-white font-semibold">
              Learn More
            </button>

            <button className="border border-slate-700 hover:border-cyan-500 transition px-7 py-3 rounded-xl text-white font-semibold">
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
