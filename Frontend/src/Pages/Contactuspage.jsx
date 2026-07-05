import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  MessageSquare,
  Zap,
  Users,
  Headphones,
  CheckCircle2,
  
  
  

} from "lucide-react";
import {  FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";


const services = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Cloud & DevOps",
  "Custom Software Development",
  "Other",
];

const contactInfo = [
  { icon: Mail, title: "Email", val: "hello@yourcompany.com" },
  { icon: Phone, title: "Phone", val: "+977 98-XXXXXXXX" },
  { icon: MapPin, title: "Office", val: "Kathmandu, Nepal" },
  { icon: Clock, title: "Hours", val: "Sun – Fri, 9AM – 6PM" },
];

const whyUs = [
  {
    icon: Zap,
    label: "Fast Response",
    desc: "We reply within 24 hours, every time.",
  },
  {
    icon: MessageSquare,
    label: "Free Consultation",
    desc: "A no-obligation first call to scope your idea.",
  },
  {
    icon: Users,
    label: "Professional Team",
    desc: "Senior engineers and designers on every project.",
  },
  {
    icon: Headphones,
    label: "Ongoing Support",
    desc: "We stick around after launch — fixes and updates included.",
  },
];

const socials = [
  { icon: FaGithub, href: "#", label: "GitHub" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: CiTwitter, href: "#", label: "Twitter" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
];


const ContactUs = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1200);
  };

  const inputClasses =
    "bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 overflow-hidden">
     
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-900/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/3 -right-1/4 w-[70%] h-[70%] bg-emerald-900/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
     
        <section className="text-center space-y-6 pt-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-1.5 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            We're online and taking new projects
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-[1.05] bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
          >
            Let's Talk About Your Next Project
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Tell us what you're building — a new product, a redesign, or
            something that needs to scale. We read every message ourselves
            and reply with next steps, not a form letter.
          </motion.p>
        </section>

    
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800"
          >
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-16 gap-4"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <h3 className="text-xl font-semibold">Message sent</h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  Thanks, {form.fullName.split(" ")[0] || "there"} — we've got
                  it. Expect a reply in your inbox within a business day.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm({
                      fullName: "",
                      email: "",
                      phone: "",
                      company: "",
                      subject: "",
                      service: "",
                      message: "",
                    });
                  }}
                  className="mt-2 text-sm underline text-slate-400 hover:text-white transition"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={update("fullName")}
                    className={inputClasses}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={update("email")}
                    className={inputClasses}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={update("phone")}
                    className={inputClasses}
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={form.company}
                    onChange={update("company")}
                    className={inputClasses}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={update("subject")}
                  className={`w-full ${inputClasses}`}
                />

                <select
                  value={form.service}
                  onChange={update("service")}
                  className={`w-full ${inputClasses} ${
                    form.service === "" ? "text-slate-500" : "text-white"
                  }`}
                >
                  <option value="" disabled className="text-slate-500">
                    Service Required
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s} className="text-white">
                      {s}
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Your Message"
                  rows={4}
                  value={form.message}
                  onChange={update("message")}
                  className={`w-full resize-none ${inputClasses}`}
                />

                {status === "error" && (
                  <p className="text-sm text-rose-400">
                    Please fill in your name, email, and message so we know
                    how to reach you.
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={status === "sending"}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                >
                  {status === "sending" ? (
                    <>
                      <motion.span
                        className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="bg-slate-900 p-6 rounded-2xl border border-slate-800"
                >
                  <div className="text-blue-400 mb-2">
                    <item.icon size={20} />
                  </div>
                  <h4 className="text-slate-400 text-sm">{item.title}</h4>
                  <p className="font-semibold text-sm mt-1">{item.val}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900"
            >
              <iframe
                title="office-location"
                src="https://www.google.com/maps?q=Kathmandu,Nepal&output=embed"
                className="w-full h-48 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition duration-500"
                style={{ border: 0 }}
                loading="lazy"
              />
            </motion.div>

          
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition"
                >
                  <s.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

      
        <section className="grid md:grid-cols-4 gap-6">
          {whyUs.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800 text-center"
            >
              <div className="flex justify-center mb-4 text-emerald-400">
                <feature.icon size={22} />
              </div>
              <h3 className="font-medium mb-1">{feature.label}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </section>

       
        <section className="text-center py-10 border-t border-slate-800">
          <h2 className="text-3xl font-bold mb-3">
            Let's build something amazing together
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            No pressure, no sales pitch — just a conversation about what
            you're trying to build and whether we're a good fit to help.
          </p>
          <motion.a
            href="#top"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition"
          >
            Start Your Journey Now
          </motion.a>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;