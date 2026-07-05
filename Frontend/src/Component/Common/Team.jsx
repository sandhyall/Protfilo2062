import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
} from "react-icons/fa";

const team = [
  {
    name: "John Smith",
    role: "CEO & Founder",
    image: "/images/team1.jpg",
  },
  {
    name: "Emily Johnson",
    role: "Frontend Developer",
    image: "/images/team2.jpg",
  },
  {
    name: "Michael Brown",
    role: "Backend Developer",
    image: "/images/team3.jpg",
  },
  {
    name: "Sophia Wilson",
    role: "UI/UX Designer",
    image: "/images/team4.jpg",
  },
];

export default function Team() {
  return (
    <section className="bg-slate-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <p className="text-cyan-400 uppercase tracking-[4px]">
            Meet Our Team
          </p>

          <h2 className="text-5xl font-bold text-white mt-4">
            Amazing People Behind Our Success
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {team.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800"
            >

              <img
                src={member.image}
                alt={member.name}
                className="h-80 w-full object-cover"
              />

              <div className="p-6">

                <h3 className="text-white text-2xl font-bold">
                  {member.name}
                </h3>

                <p className="text-cyan-400 mt-2">
                  {member.role}
                </p>

                <div className="flex gap-4 mt-5 text-xl text-white">

                  <FaFacebook className="cursor-pointer hover:text-cyan-400"/>

                  <FaLinkedin className="cursor-pointer hover:text-cyan-400"/>

                  <FaGithub className="cursor-pointer hover:text-cyan-400"/>

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}