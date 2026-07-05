import { motion } from "framer-motion";
import {
  Clock3,
  ShieldCheck,
  Rocket,
  Palette,
  DollarSign,
  Headphones,
} from "lucide-react";

const features = [
  {
    title: "Fast Delivery",
    description: "We deliver projects on time without compromising quality.",
    icon: <Clock3 size={36} />,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Experienced Team",
    description:
      "Our skilled developers and designers create modern digital solutions.",
    icon: <Rocket size={36} />,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Affordable Pricing",
    description:
      "High-quality services at competitive prices for businesses of all sizes.",
    icon: <DollarSign size={36} />,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Premium UI/UX",
    description:
      "Beautiful, responsive, and user-friendly interfaces for every project.",
    icon: <Palette size={36} />,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Scalable Solutions",
    description:
      "Applications built with modern technologies for future growth.",
    icon: <ShieldCheck size={36} />,
    color: "from-indigo-500 to-violet-500",
  },
  {
    title: "24/7 Support",
    description:
      "We provide continuous support and maintenance after project delivery.",
    icon: <Headphones size={36} />,
    color: "from-yellow-500 to-orange-500",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 uppercase tracking-[4px] font-semibold">
            Why Choose Us
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Why Businesses Trust Our Company
          </h2>

          <p className="text-slate-400 mt-6 max-w-3xl mx-auto">
            We combine creativity, innovation, and cutting-edge technology to
            deliver exceptional digital solutions that help businesses grow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 group"
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-gradient-to-br ${item.color}`}
              ></div>

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${item.color}`}
              >
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold text-white mt-8">
                {item.title}
              </h3>

              <p className="text-slate-400 mt-4 leading-7">
                {item.description}
              </p>

              <div
                className={`mt-8 h-1 rounded-full bg-gradient-to-r ${item.color}`}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
