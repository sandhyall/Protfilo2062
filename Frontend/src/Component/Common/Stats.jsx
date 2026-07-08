import { motion } from "framer-motion";
import { FolderKanban, Users, Globe2, Smile } from "lucide-react";

const stats = [
  {
    icon: <FolderKanban size={40} />,
    number: "3+",
    title: "Projects Completed",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: <Users size={40} />,
    number: "5+",
    title: "Happy Clients",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Globe2 size={40} />,
    number: "8+",
    title: "Countries Served",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Smile size={40} />,
    number: "99%",
    title: "Client Satisfaction",
    color: "from-orange-500 to-red-500",
  },
];

export default function Stats() {
  return (
    <section className="bg-slate-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[5px] text-cyan-400 font-semibold">
            Company Statistics
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Our Journey In Numbers
          </h2>

          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Every project reflects our commitment to innovation, quality, and
            long-term partnerships with clients around the world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.04,
              }}
              className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`}
              />

              <div className="relative z-10">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${item.color} text-white mb-8`}
                >
                  {item.icon}
                </div>

                <h3 className="text-5xl font-black text-white">
                  {item.number}
                </h3>

                <p className="mt-4 text-slate-300 text-lg">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
