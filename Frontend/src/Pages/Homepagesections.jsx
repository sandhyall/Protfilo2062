import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Lightbulb,
  Zap,
  Lock,
  TrendingUp,
  Headphones,
  Code2,
  Smartphone,
  Cloud,
  ShieldCheck,
  Database,
  LayoutDashboard,
  Search,
  ClipboardList,
  PenTool,
  Bug,
  Rocket,
  LifeBuoy,
  Star,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const zoomIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

function FloatingShapes({ variant = "light" }) {
  const tone = variant === "dark" ? "opacity-20" : "opacity-40";
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-10 -left-10 w-72 h-72 rounded-full bg-blue-400 blur-3xl ${tone}`}
      />
      <motion.div
        animate={{ y: [0, 24, 0], x: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-400 blur-3xl ${tone}`}
      />
    </div>
  );
}

function Eyebrow({ children, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold text-xs uppercase tracking-[0.2em] ${
        dark ? "text-cyan-400" : "text-blue-600"
      }`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  center = true,
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`max-w-2xl ${center ? "mx-auto text-center" : ""} mb-16`}
    >
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-4 text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-tight ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function RippleButton({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
  };

  const base =
    "relative overflow-hidden inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-sm transition-all duration-300";
  const styles = {
    primary:
      "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/40 hover:bg-indigo-600",
    outline:
      "border border-slate-300 text-slate-900 hover:border-blue-600 hover:text-blue-600",
    white: "bg-white text-blue-700 hover:bg-slate-50",
    ghost: "border border-white/40 text-white hover:bg-white/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={addRipple}
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ opacity: 0.45, scale: 0 }}
          animate={{ opacity: 0, scale: 4 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ left: r.x, top: r.y }}
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 pointer-events-none"
        />
      ))}
    </motion.button>
  );
}

const clientLogos = [
  "NORTHPEAK",
  "VertexLabs",
  "ORBITAL",
  "Clearwave",
  "STRATUM",
  "haloworks",
];

function TrustedByClients() {
  return (
    <section className="relative bg-white py-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center font-semibold text-xs uppercase tracking-[0.2em] text-slate-500 mb-10"
        >
          Trusted by Businesses Worldwide
        </motion.p>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center"
        >
          {clientLogos.map((name) => (
            <motion.div
              key={name}
              variants={zoomIn}
              className="flex items-center justify-center"
            >
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-400 grayscale opacity-70 hover:opacity-100 hover:text-blue-600 hover:grayscale-0 transition-all duration-300 cursor-default select-none">
                {name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section className="relative bg-slate-50 py-24 px-6 sm:px-10 overflow-hidden">
      <FloatingShapes />
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center relative">
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Eyebrow>Who We Are</Eyebrow>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Engineers who build software people actually enjoy using.
          </h2>
          <p className="mt-5 text-slate-600 text-base sm:text-lg leading-relaxed">
            We're a product engineering studio that partners with founders and
            enterprise teams to design, build, and ship reliable software. From
            the first line of code to production scaling, we treat every project
            like it's our own company.
          </p>
          <div className="mt-8">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105"
            >
              Learn More
              <motion.span whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-2xl shadow-blue-900/20 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 200 150" className="w-2/3 h-2/3 opacity-90">
              <rect
                x="10"
                y="20"
                width="180"
                height="110"
                rx="10"
                fill="white"
                fillOpacity="0.12"
              />
              <rect
                x="24"
                y="34"
                width="60"
                height="8"
                rx="4"
                fill="white"
                fillOpacity="0.5"
              />
              <rect
                x="24"
                y="50"
                width="140"
                height="6"
                rx="3"
                fill="white"
                fillOpacity="0.3"
              />
              <rect
                x="24"
                y="64"
                width="110"
                height="6"
                rx="3"
                fill="white"
                fillOpacity="0.3"
              />
              <rect
                x="24"
                y="86"
                width="46"
                height="34"
                rx="6"
                fill="white"
                fillOpacity="0.4"
              />
              <rect
                x="78"
                y="86"
                width="46"
                height="34"
                rx="6"
                fill="white"
                fillOpacity="0.25"
              />
              <rect
                x="132"
                y="86"
                width="46"
                height="34"
                rx="6"
                fill="white"
                fillOpacity="0.15"
              />
            </svg>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-6 py-4 border border-slate-100"
          >
            <p className="text-2xl font-bold text-slate-900">8+ yrs</p>
            <p className="text-xs text-slate-500 font-medium">
              building digital products
            </p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-4 bg-white rounded-2xl shadow-xl px-5 py-3 border border-slate-100 flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-cyan-500" />
            <p className="text-xs font-semibold text-slate-700">
              Enterprise-grade security
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: Code2,
    title: "Web Application Development",
    desc: "Scalable, high-performance web apps built with modern frameworks and clean architecture.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "Native and cross-platform mobile experiences designed for speed and usability.",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    desc: "Cloud infrastructure, CI/CD pipelines, and automation that keep your product shipping fast.",
  },
  {
    icon: LayoutDashboard,
    title: "UI/UX Design",
    desc: "Thoughtful, research-backed interfaces that make complex products feel effortless.",
  },
  {
    icon: Database,
    title: "API & Backend Engineering",
    desc: "Robust APIs and backend systems engineered for reliability and scale.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance & Security",
    desc: "Rigorous testing and security practices baked into every stage of delivery.",
  },
];

function ServiceCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      className="group rounded-2xl p-[1.5px] bg-gradient-to-br from-slate-200 to-slate-200 hover:from-blue-500 hover:to-cyan-400 transition-colors duration-500"
    >
      <div className="h-full rounded-2xl bg-white p-8 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.08 }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300"
        >
          <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
        </motion.div>
        <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
        <a
          href="#"
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all duration-300"
        >
          Learn More <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

function Services() {
  return (
    <section className="bg-white py-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="What We Do"
          title="Services built for modern products"
          subtitle="From first prototype to enterprise scale, we cover the full software lifecycle."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const whyUs = [
  {
    icon: Users,
    title: "Expert Team",
    desc: "Senior engineers and designers with deep product experience.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Solutions",
    desc: "Modern approaches tailored to your business, not cookie-cutter templates.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    desc: "Lean processes that ship working software in weeks, not months.",
  },
  {
    icon: Lock,
    title: "Secure Development",
    desc: "Security reviewed at every stage, from architecture to deployment.",
  },
  {
    icon: TrendingUp,
    title: "Scalable Applications",
    desc: "Built to handle growth from first users to millions.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Real humans on call whenever you need us, day or night.",
  },
];

function WhyChooseUs() {
  return (
    <section className="relative bg-slate-900 py-24 px-6 sm:px-10 overflow-hidden">
      <FloatingShapes variant="dark" />
      <div className="max-w-7xl mx-auto relative">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A partner you can build a business on"
          subtitle="Every engagement is backed by process, transparency, and craft."
          dark
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {whyUs.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={scaleIn}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 hover:bg-white/10 hover:border-cyan-400/40 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: -8 }}
                className="w-12 h-12 rounded-xl bg-cyan-400/15 flex items-center justify-center"
              >
                <Icon className="w-6 h-6 text-cyan-400" />
              </motion.div>
              <h3 className="mt-6 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const process = [
  {
    icon: Search,
    title: "Discovery",
    desc: "Understanding goals, users, and constraints.",
  },
  {
    icon: ClipboardList,
    title: "Planning",
    desc: "Scoping roadmap, milestones, and architecture.",
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    desc: "Wireframes and visual design for the product.",
  },
  {
    icon: Code2,
    title: "Development",
    desc: "Building features in focused, iterative sprints.",
  },
  {
    icon: Bug,
    title: "Testing",
    desc: "QA, performance, and security validation.",
  },
  {
    icon: Rocket,
    title: "Deployment",
    desc: "Shipping to production with zero downtime.",
  },
  {
    icon: LifeBuoy,
    title: "Maintenance",
    desc: "Ongoing support, monitoring, and improvements.",
  },
];

function DevelopmentProcess() {
  return (
    <section className="bg-white py-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="How We Work"
          title="Our development process"
          subtitle="A disciplined, transparent workflow from first commit to long-term support."
        />

        <div className="relative">
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-slate-200 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              style={{ originX: 0 }}
              className="h-full w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
            />
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-10 lg:gap-4 lg:grid-cols-7"
          >
            {process.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="relative flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-sm"
                >
                  <Icon className="w-5 h-5 text-blue-600" />
                </motion.div>
                <span className="mt-3 font-mono text-[11px] text-slate-400 tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-sm font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-[9rem]">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const projects = [
  {
    title: "FinFlow — Business Banking Platform",
    stack: ["React", "Node.js", "AWS"],
    desc: "A unified banking dashboard for SMEs to manage payments, invoicing, and cash flow.",
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    title: "Carely — Patient Scheduling App",
    stack: ["React Native", "Express.js", "MongoDB"],
    desc: "A mobile scheduling app connecting patients with clinics in real time.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "StackShip — DevOps Automation Suite",
    stack: ["TypeScript", "Docker", "AWS"],
    desc: "A CI/CD automation suite that cut deployment times for engineering teams by 70%.",
    gradient: "from-indigo-600 to-slate-800",
  },
];

function ProjectCard({ title, stack, desc, gradient }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-2xl overflow-hidden transition-shadow duration-300 flex flex-col group"
    >
      <div
        className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
      >
        <motion.div
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Code2 className="w-10 h-10 text-white/70" />
        </motion.div>
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-300 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1.5 text-white text-xs font-semibold bg-white/15 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/30"
          >
            Live Demo <ExternalLink className="w-3 h-3" />
          </motion.span>
        </div>
      </div>
      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {stack.map((t) => (
            <span
              key={t}
              className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 rounded-full px-2.5 py-1"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600 leading-relaxed flex-1">
          {desc}
        </p>
        <div className="mt-5 flex items-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:gap-2 transition-all duration-300"
          >
            View Details <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-300"
          >
            Live Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedProjects() {
  return (
    <section className="bg-slate-50 py-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Our Work"
          title="Featured projects"
          subtitle="A snapshot of products we've helped design, build, and scale."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const techStack = [
  "HTML",
  "CSS",
  "JS",
  "React",
  "TS",
  "Node",
  "Express",
  "Mongo",
  "Tailwind",
  "Git",
  "Docker",
  "AWS",
  "Figma",
];

function TechStack() {
  return (
    <section className="bg-white py-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Our Toolkit"
          title="Technologies we use"
          subtitle="A modern, battle-tested stack for building fast and scaling reliably."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4"
        >
          {techStack.map((label) => (
            <motion.div
              key={label}
              variants={zoomIn}
              whileHover={{ y: -4, scale: 1.08, rotate: 3 }}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-6 hover:border-blue-300 hover:bg-white hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <span className="w-10 h-10 rounded-lg bg-blue-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                {label.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Counter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  const start = () => {
    if (started.current) return;
    started.current = true;
    const duration = 1600;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(value);
    };
    requestAnimationFrame(tick);
  };

  return (
    <motion.span
      onViewportEnter={start}
      viewport={{ once: true, margin: "-50px" }}
      className="text-4xl sm:text-5xl font-bold text-white"
    >
      {count}
      {suffix}
    </motion.span>
  );
}

const stats = [
  { value: 150, suffix: "+", label: "Projects Completed" },
  { value: 100, suffix: "+", label: "Happy Clients" },
  { value: 20, suffix: "+", label: "Team Members" },
  { value: 5, suffix: "+", label: "Years Experience" },
];

function CompanyStats() {
  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 py-24 px-6 sm:px-10 overflow-hidden">
      <FloatingShapes variant="dark" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map(({ value, suffix, label }) => (
            <motion.div
              key={label}
              variants={scaleIn}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md py-10 px-4 text-center"
            >
              <Counter value={value} suffix={suffix} />
              <p className="mt-2 text-sm text-slate-200 font-medium">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Amara Osei",
    company: "Founder, Northpeak Retail",
    review:
      "The team shipped our platform ahead of schedule and the code quality has made every release since effortless.",
  },
  {
    name: "Daniel Cho",
    company: "CTO, Vertex Labs",
    review:
      "Communication was excellent throughout. They understood our constraints and made smart tradeoffs without being asked twice.",
  },
  {
    name: "Priya Nair",
    company: "Product Lead, Orbital",
    review:
      "Our app went from prototype to production in ten weeks. The attention to detail on UX was beyond what we expected.",
  },
];

function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % testimonials.length);
  };
  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };
  const t = testimonials[index];

  return (
    <section className="relative bg-slate-50 py-24 px-6 sm:px-10 overflow-hidden">
      <FloatingShapes />
      <div className="max-w-3xl mx-auto relative">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our clients say"
          subtitle="Feedback from the founders and teams we've partnered with."
        />

        <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-xl p-10 sm:p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
          <Quote className="w-8 h-8 text-blue-200" />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="mt-4"
            >
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-cyan-500 text-cyan-500"
                  />
                ))}
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                "{t.review}"
              </p>
              <div className="mt-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <p className="mt-3 font-bold text-slate-900">{t.name}</p>
                <p className="text-sm text-slate-500">{t.company}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-500 flex items-center justify-center transition-colors duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-500 flex items-center justify-center transition-colors duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-blue-600" : "w-2 bg-slate-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "How long does it take to build a custom application?",
    a: "Most projects take between 8 and 16 weeks depending on scope, from discovery through to launch. We'll give you a clear timeline after our first planning session.",
  },
  {
    q: "Do you work with startups as well as enterprises?",
    a: "Yes. We tailor our process to team size and stage, whether you're validating an MVP or scaling an existing enterprise system.",
  },
  {
    q: "What technologies do you specialize in?",
    a: "Our core stack includes React, Node.js, TypeScript, and cloud infrastructure on AWS, but we adapt to what best fits your product.",
  },
  {
    q: "Will I have visibility into progress during development?",
    a: "Absolutely. You'll get access to our project boards, weekly demos, and a dedicated point of contact throughout the engagement.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes, every project includes a maintenance option covering monitoring, bug fixes, and ongoing feature development.",
  },
  {
    q: "How do you handle project pricing?",
    a: "We offer both fixed-scope quotes and monthly retainers depending on project type. We'll recommend the best fit during discovery.",
  },
];

function FAQItem({ q, a, isOpen, onClick }) {
  return (
    <div className="border-b border-slate-200 py-5">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg font-semibold text-slate-900">
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm sm:text-base text-slate-600 leading-relaxed pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-white py-24 px-6 sm:px-10">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Answers to what clients ask us most before getting started."
        />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {faqs.map((item, i) => (
            <FAQItem
              key={item.q}
              q={item.q}
              a={item.a}
              isOpen={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 py-24 px-6 sm:px-10 overflow-hidden">
      <FloatingShapes variant="dark" />
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center relative"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Let's Build Something Amazing Together
        </h2>
        <p className="mt-5 text-blue-50 text-base sm:text-lg max-w-xl mx-auto">
          Tell us about your idea and we'll help you turn it into a polished,
          scalable product. Get a free consultation with our engineering team
          this week.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <RippleButton variant="white">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </RippleButton>
          <RippleButton variant="ghost">Contact Us</RippleButton>
        </div>
      </motion.div>
    </section>
  );
}

export default function HomepageSections() {
  return (
    <div className="font-sans antialiased">
      <TrustedByClients />
      <AboutPreview />
      <Services />
      <WhyChooseUs />
      <DevelopmentProcess />
      <FeaturedProjects />
      <TechStack />
      <CompanyStats />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
