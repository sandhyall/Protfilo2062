import { motion } from "framer-motion";

import {
  FaReact,
  FaNodeJs,
  FaGithub,
  FaDocker,
  FaAws,
  FaFigma,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";

const technologies = [
  {
    name: "React",
    icon: <FaReact className="text-cyan-400 text-5xl" />,
  },
  {
    name: "Next.js",
    icon: <SiNextdotjs className="text-white text-5xl" />,
  },
  {
    name: "Node.js",
    icon: <FaNodeJs className="text-green-500 text-5xl" />,
  },
  {
    name: "Express",
    icon: <SiExpress className="text-gray-300 text-5xl" />,
  },
  {
    name: "MongoDB",
    icon: <SiMongodb className="text-green-600 text-5xl" />,
  },

 
 
  {
    name: "GitHub",
    icon: <FaGithub className="text-white text-5xl" />,
  },

  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="text-cyan-400 text-5xl" />,
  },
  {
    name: "Figma",
    icon: <FaFigma className="text-pink-500 text-5xl" />,
  },
];

export default function Technologies() {
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
          <p className="uppercase tracking-[4px] text-cyan-400 font-semibold">
            Technologies
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Technologies We Use
          </h2>

          <p className="text-slate-400 mt-6 max-w-3xl mx-auto">
            We use modern technologies and industry best practices to build
            secure, scalable, and high-performance digital products.
          </p>
        </motion.div>

        {/* Technology Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.08,
                y: -8,
              }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-cyan-500 transition-all duration-300"
            >
              <div className="mb-5">{tech.icon}</div>

              <h3 className="text-lg font-semibold text-white">
                {tech.name}
              </h3>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}