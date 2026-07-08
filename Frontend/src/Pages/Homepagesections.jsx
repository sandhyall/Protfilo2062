import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  ExternalLink,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Color system — matches the Services page exactly, site-wide        */
/* ------------------------------------------------------------------ */

const c = {
  bg: "#020617",
  cyan: "#22D3EE",
  purple: "#A855F7",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "rgba(255,255,255,0.08)",
  cardBg: "rgba(255,255,255,0.03)",
};

const gradientText = `linear-gradient(90deg, ${c.cyan}, ${c.purple})`;

/* ------------------------------------------------------------------ */
/*  Shared motion variants                                             */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const zoomIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/** Ambient floating blurred shapes, respects prefers-reduced-motion */
function FloatingShapes() {
  const prefersReducedMotion = useReducedMotion();
  const loop = (animate, duration) =>
    prefersReducedMotion ? {} : { animate, transition: { duration, repeat: Infinity, ease: "easeInOut" } };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        {...loop({ y: [0, -20, 0], x: [0, 12, 0] }, 9)}
        className="absolute -top-10 -left-10 w-72 h-72 rounded-full blur-3xl"
        style={{ backgroundColor: c.cyan, opacity: 0.15 }}
      />
      <motion.div
        {...loop({ y: [0, 24, 0], x: [0, -16, 0] }, 11)}
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: c.purple, opacity: 0.15 }}
      />
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.cyan }} />
      <span className="font-['JetBrains_Mono'] text-xs tracking-[0.2em] uppercase" style={{ color: c.cyan }}>
        {children}
      </span>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`max-w-2xl ${center ? "mx-auto text-center" : ""} mb-16`}
    >
      <div className={`flex ${center ? "justify-center" : ""}`}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-[2.75rem] font-semibold tracking-tight leading-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed" style={{ color: c.muted }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border backdrop-blur-xl ${className}`}
      style={{ backgroundColor: c.cardBg, borderColor: c.border }}
    >
      {children}
    </div>
  );
}

/** Button with hover lift and a ripple-on-click effect */
function RippleButton({ children, variant = "primary", className = "", ...props }) {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
  };

  const base =
    "relative overflow-hidden inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-medium text-sm transition-all duration-300";
  const variantStyle = {
    primary: { backgroundImage: gradientText, color: "#020617" },
    white: { backgroundColor: "white", color: "#020617" },
    ghost: { border: "1px solid rgba(255,255,255,0.4)", color: "white" },
  }[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={addRipple}
      style={variantStyle}
      className={`${base} ${variant === "ghost" ? "hover:bg-white/10" : ""} ${className}`}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ opacity: 0.4, scale: 0 }}
          animate={{ opacity: 0, scale: 4 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ left: r.x, top: r.y }}
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 pointer-events-none"
        />
      ))}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Trusted by Clients                                              */
/* ------------------------------------------------------------------ */

const clientLogos = ["NORTHPEAK", "VertexLabs", "ORBITAL", "Clearwave", "STRATUM", "haloworks"];

function TrustedByClients() {
  return (
    <section className="relative py-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] mb-10"
          style={{ color: c.muted }}
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
            <motion.div key={name} variants={zoomIn} className="flex items-center justify-center">
              <span
                className="text-lg sm:text-xl font-['Space_Grotesk'] font-semibold tracking-tight grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-default select-none"
                style={{ color: c.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = c.cyan)}
                onMouseLeave={(e) => (e.currentTarget.style.color = c.muted)}
              >
                {name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2. About Company                                                    */
/* ------------------------------------------------------------------ */

function AboutPreview() {
  const prefersReducedMotion = useReducedMotion();
  const float = (y, duration) =>
    prefersReducedMotion ? {} : { animate: { y }, transition: { duration, repeat: Infinity, ease: "easeInOut" } };

  return (
    <section className="relative py-24 px-6 sm:px-10 overflow-hidden">
      <FloatingShapes />
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center relative">
        <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Eyebrow>Who We Are</Eyebrow>
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
            Engineers who build software people actually enjoy using.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: c.muted }}>
            We're a product engineering studio that partners with founders and enterprise teams
            to design, build, and ship reliable software. From the first line of code to
            production scaling, we treat every project like it's our own company.
          </p>
          <div className="mt-8">
            <RippleButton variant="primary">
              Learn More
              <motion.span whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.span>
            </RippleButton>
          </div>
        </motion.div>

        <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative">
          <div
            className="aspect-[4/3] rounded-3xl flex items-center justify-center overflow-hidden"
            style={{ backgroundImage: `linear-gradient(135deg, ${c.cyan}33, #6366F133, ${c.purple}33)`, border: `1px solid ${c.border}` }}
          >
            <svg viewBox="0 0 200 150" className="w-2/3 h-2/3 opacity-90">
              <rect x="10" y="20" width="180" height="110" rx="10" fill="white" fillOpacity="0.06" />
              <rect x="24" y="34" width="60" height="8" rx="4" fill={c.cyan} fillOpacity="0.6" />
              <rect x="24" y="50" width="140" height="6" rx="3" fill="white" fillOpacity="0.2" />
              <rect x="24" y="64" width="110" height="6" rx="3" fill="white" fillOpacity="0.2" />
              <rect x="24" y="86" width="46" height="34" rx="6" fill={c.cyan} fillOpacity="0.25" />
              <rect x="78" y="86" width="46" height="34" rx="6" fill={c.purple} fillOpacity="0.25" />
              <rect x="132" y="86" width="46" height="34" rx="6" fill="white" fillOpacity="0.1" />
            </svg>
          </div>

          <motion.div {...float([0, -10, 0], 4)} className="absolute -bottom-6 -left-6">
            <GlassCard className="px-6 py-4">
              <p className="font-['Space_Grotesk'] text-2xl font-semibold text-white">8+ yrs</p>
              <p className="text-xs font-medium" style={{ color: c.muted }}>
                building digital products
              </p>
            </GlassCard>
          </motion.div>

          <motion.div {...float([0, 10, 0], 5)} className="absolute -top-6 -right-4">
            <GlassCard className="px-5 py-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" style={{ color: c.cyan }} aria-hidden="true" />
              <p className="text-xs font-semibold text-white">Enterprise-grade security</p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Our Services                                                    */
/* ------------------------------------------------------------------ */

const services = [
  { icon: Code2, title: "Web Application Development", desc: "Scalable, high-performance web apps built with modern frameworks and clean architecture." },
  { icon: Smartphone, title: "Mobile App Development", desc: "Native and cross-platform mobile experiences designed for speed and usability." },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Cloud infrastructure, CI/CD pipelines, and automation that keep your product shipping fast." },
  { icon: LayoutDashboard, title: "UI/UX Design", desc: "Thoughtful, research-backed interfaces that make complex products feel effortless." },
  { icon: Database, title: "API & Backend Engineering", desc: "Robust APIs and backend systems engineered for reliability and scale." },
  { icon: ShieldCheck, title: "Quality Assurance & Security", desc: "Rigorous testing and security practices baked into every stage of delivery." },
];

function ServiceCard({ icon: Icon, title, desc }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
      <GlassCard className="p-8 h-full flex flex-col hover:border-white/20 transition group">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.08 }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{ backgroundImage: `linear-gradient(135deg, ${c.cyan}26, ${c.purple}26)`, color: c.cyan }}
        >
          <Icon className="w-6 h-6" aria-hidden="true" />
        </motion.div>
        <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>
          {desc}
        </p>
        <a
          href="#"
          className="mt-5 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all duration-300"
          style={{ color: c.cyan }}
        >
          Learn More <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </GlassCard>
    </motion.div>
  );
}

function Services() {
  return (
    <section className="relative py-24 px-6 sm:px-10">
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

/* ------------------------------------------------------------------ */
/*  4. Why Choose Us                                                   */
/* ------------------------------------------------------------------ */

const whyUs = [
  { icon: Users, title: "Expert Team", desc: "Senior engineers and designers with deep product experience." },
  { icon: Lightbulb, title: "Innovative Solutions", desc: "Modern approaches tailored to your business, not cookie-cutter templates." },
  { icon: Zap, title: "Fast Delivery", desc: "Lean processes that ship working software in weeks, not months." },
  { icon: Lock, title: "Secure Development", desc: "Security reviewed at every stage, from architecture to deployment." },
  { icon: TrendingUp, title: "Scalable Applications", desc: "Built to handle growth from first users to millions." },
  { icon: Headphones, title: "24/7 Support", desc: "Real humans on call whenever you need us, day or night." },
];

function WhyChooseUs() {
  return (
    <section className="relative py-24 px-6 sm:px-10 overflow-hidden">
      <FloatingShapes />
      <div className="max-w-7xl mx-auto relative">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A partner you can build a business on"
          subtitle="Every engagement is backed by process, transparency, and craft."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {whyUs.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={scaleIn} whileHover={{ y: -6, scale: 1.02 }}>
              <GlassCard className="p-8 h-full hover:border-white/20 transition">
                <motion.div
                  whileHover={{ rotate: -8 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundImage: `linear-gradient(135deg, ${c.cyan}, ${c.purple})` }}
                >
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </motion.div>
                <h3 className="font-['Space_Grotesk'] font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>
                  {desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Development Process (animated connecting line)                   */
/* ------------------------------------------------------------------ */

const process = [
  { icon: Search, title: "Discovery", desc: "Understanding goals, users, and constraints." },
  { icon: ClipboardList, title: "Planning", desc: "Scoping roadmap, milestones, and architecture." },
  { icon: PenTool, title: "UI/UX Design", desc: "Wireframes and visual design for the product." },
  { icon: Code2, title: "Development", desc: "Building features in focused, iterative sprints." },
  { icon: Bug, title: "Testing", desc: "QA, performance, and security validation." },
  { icon: Rocket, title: "Deployment", desc: "Shipping to production with zero downtime." },
  { icon: LifeBuoy, title: "Maintenance", desc: "Ongoing support, monitoring, and improvements." },
];

function DevelopmentProcess() {
  return (
    <section className="relative py-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="How We Work"
          title="Our development process"
          subtitle="A disciplined, transparent workflow from first commit to long-term support."
        />

        <div className="relative">
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-px overflow-hidden" style={{ backgroundColor: c.border }}>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              style={{ originX: 0, backgroundImage: gradientText }}
              className="h-full w-full"
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
              <motion.div key={title} variants={fadeUp} className="relative flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: c.bg, border: `2px solid ${c.cyan}` }}
                >
                  <Icon className="w-5 h-5" style={{ color: c.cyan }} aria-hidden="true" />
                </motion.div>
                <span className="mt-3 font-['JetBrains_Mono'] text-[11px] tracking-widest" style={{ color: c.purple }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-sm font-['Space_Grotesk'] font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed max-w-[9rem]" style={{ color: c.muted }}>
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

/* ------------------------------------------------------------------ */
/*  6. Featured Projects                                               */
/* ------------------------------------------------------------------ */

const projects = [
  { title: "FinFlow — Business Banking Platform", stack: ["React", "Node.js", "AWS"], desc: "A unified banking dashboard for SMEs to manage payments, invoicing, and cash flow." },
  { title: "Carely — Patient Scheduling App", stack: ["React Native", "Express.js", "MongoDB"], desc: "A mobile scheduling app connecting patients with clinics in real time." },
  { title: "StackShip — DevOps Automation Suite", stack: ["TypeScript", "Docker", "AWS"], desc: "A CI/CD automation suite that cut deployment times for engineering teams by 70%." },
];

function ProjectCard({ title, stack, desc }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
      <GlassCard className="overflow-hidden h-full hover:border-white/20 transition flex flex-col group">
        <div
          className="relative h-44 flex items-center justify-center overflow-hidden"
          style={{ backgroundImage: `linear-gradient(135deg, ${c.cyan}33, ${c.purple}33)` }}
        >
          <motion.div whileHover={{ scale: 1.12 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex items-center justify-center">
            <Code2 className="w-10 h-10 text-white/50" aria-hidden="true" />
          </motion.div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
            <span
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1.5 text-white text-xs font-semibold rounded-full px-3 py-1.5 backdrop-blur-md"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              Live Demo <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </span>
          </div>
        </div>
        <div className="p-7 flex flex-col flex-1">
          <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-white">{title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {stack.map((t) => (
              <span
                key={t}
                className="text-[11px] font-['JetBrains_Mono'] font-medium rounded-full px-2.5 py-1"
                style={{ color: c.cyan, backgroundColor: `${c.cyan}1A` }}
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed flex-1" style={{ color: c.muted }}>
            {desc}
          </p>
          <div className="mt-5 flex items-center gap-4">
            <a href="#" className="inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all duration-300" style={{ color: c.cyan }}>
              View Details <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-white/60 hover:text-white transition-colors duration-300">
              Live Demo
            </a>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function FeaturedProjects() {
  return (
    <section className="relative py-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading eyebrow="Our Work" title="Featured projects" subtitle="A snapshot of products we've helped design, build, and scale." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="grid md:grid-cols-3 gap-8">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Technologies                                                     */
/* ------------------------------------------------------------------ */

const techStack = ["HTML", "CSS", "JS", "React", "TS", "Node", "Express", "Mongo", "Tailwind", "Git", "Docker", "AWS", "Figma"];

function TechStack() {
  return (
    <section className="relative py-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading eyebrow="Our Toolkit" title="Technologies we use" subtitle="A modern, battle-tested stack for building fast and scaling reliably." />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4"
        >
          {techStack.map((label) => (
            <motion.div key={label} variants={zoomIn} whileHover={{ y: -4, scale: 1.08, rotate: 3 }}>
              <GlassCard className="flex flex-col items-center justify-center gap-2 py-6 hover:border-white/20 transition-all duration-300">
                <span
                  className="w-10 h-10 rounded-lg text-white font-['JetBrains_Mono'] text-[11px] font-semibold flex items-center justify-center"
                  style={{ backgroundImage: gradientText }}
                >
                  {label.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-medium" style={{ color: c.text }}>
                  {label}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Company Statistics                                              */
/* ------------------------------------------------------------------ */

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
    <motion.span onViewportEnter={start} viewport={{ once: true, margin: "-50px" }} className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-semibold text-white">
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
    <section className="relative py-24 px-6 sm:px-10 overflow-hidden">
      <FloatingShapes />
      <div className="max-w-7xl mx-auto relative">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, suffix, label }) => (
            <motion.div key={label} variants={scaleIn} whileHover={{ y: -4 }}>
              <GlassCard className="py-10 px-4 text-center">
                <Counter value={value} suffix={suffix} />
                <p className="mt-2 text-sm font-medium" style={{ color: c.muted }}>
                  {label}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. Testimonials                                                     */
/* ------------------------------------------------------------------ */

const testimonials = [
  { name: "Amara Osei", company: "Founder, Northpeak Retail", review: "The team shipped our platform ahead of schedule and the code quality has made every release since effortless." },
  { name: "Daniel Cho", company: "CTO, Vertex Labs", review: "Communication was excellent throughout. They understood our constraints and made smart tradeoffs without being asked twice." },
  { name: "Priya Nair", company: "Product Lead, Orbital", review: "Our app went from prototype to production in ten weeks. The attention to detail on UX was beyond what we expected." },
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
    <section className="relative py-24 px-6 sm:px-10 overflow-hidden">
      <FloatingShapes />
      <div className="max-w-3xl mx-auto relative">
        <SectionHeading eyebrow="Testimonials" title="What our clients say" subtitle="Feedback from the founders and teams we've partnered with." />

        <GlassCard className="relative p-10 sm:p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
          <Quote className="w-8 h-8" style={{ color: c.purple, opacity: 0.5 }} aria-hidden="true" />

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
              <div className="flex justify-center gap-0.5 mb-4" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4" fill={c.cyan} style={{ color: c.cyan }} aria-hidden="true" />
                ))}
              </div>
              <p className="text-lg leading-relaxed" style={{ color: c.text }}>
                "{t.review}"
              </p>
              <div className="mt-6 flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundImage: gradientText }}
                >
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="mt-3 font-['Space_Grotesk'] font-semibold text-white">{t.name}</p>
                <p className="text-sm" style={{ color: c.muted }}>
                  {t.company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: c.muted }}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: c.muted }}
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </GlassCard>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to testimonial ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: i === index ? "1.5rem" : "0.5rem", backgroundColor: i === index ? c.cyan : "rgba(255,255,255,0.2)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. FAQ                                                            */
/* ------------------------------------------------------------------ */

const faqs = [
  { q: "How long does it take to build a custom application?", a: "Most projects take between 8 and 16 weeks depending on scope, from discovery through to launch. We'll give you a clear timeline after our first planning session." },
  { q: "Do you work with startups as well as enterprises?", a: "Yes. We tailor our process to team size and stage, whether you're validating an MVP or scaling an existing enterprise system." },
  { q: "What technologies do you specialize in?", a: "Our core stack includes React, Node.js, TypeScript, and cloud infrastructure on AWS, but we adapt to what best fits your product." },
  { q: "Will I have visibility into progress during development?", a: "Absolutely. You'll get access to our project boards, weekly demos, and a dedicated point of contact throughout the engagement." },
  { q: "Do you provide support after launch?", a: "Yes, every project includes a maintenance option covering monitoring, bug fixes, and ongoing feature development." },
  { q: "How do you handle project pricing?", a: "We offer both fixed-scope quotes and monthly retainers depending on project type. We'll recommend the best fit during discovery." },
];

function FAQItem({ q, a, isOpen, onClick, index }) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;
  return (
    <GlassCard className="overflow-hidden mb-3">
      <button
        id={buttonId}
        onClick={onClick}
        className="w-full flex items-center justify-between text-left px-6 py-5 gap-4"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="text-base sm:text-lg font-medium text-white">{q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0" style={{ color: c.cyan }}>
          <ChevronDown className="w-5 h-5" aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm sm:text-base leading-relaxed" style={{ color: c.muted }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative py-24 px-6 sm:px-10">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" subtitle="Answers to what clients ask us most before getting started." />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {faqs.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} index={i} isOpen={open === i} onClick={() => setOpen(open === i ? -1 : i)} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. Final Call to Action                                           */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="relative py-24 px-6 sm:px-10">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-5xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center"
          style={{ backgroundImage: `linear-gradient(135deg, ${c.cyan}, #6366F1 50%, ${c.purple})` }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, white 0, transparent 35%), radial-gradient(circle at 85% 80%, white 0, transparent 35%)",
            }}
          />
          <h2 className="relative font-['Space_Grotesk'] text-3xl md:text-4xl font-semibold mb-4 text-white">
            Let's Build Something Amazing Together
          </h2>
          <p className="relative text-white/85 max-w-xl mx-auto mb-9">
            Tell us about your idea and we'll help you turn it into a polished, scalable product.
            Get a free consultation with our engineering team this week.
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-white text-slate-950 font-medium px-8 py-3.5 rounded-xl shadow-lg"
            >
              Get Started
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.a>
            <motion.a
              href="contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 border border-white/40 text-white font-medium px-8 py-3.5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition"
            >
              Contact Us
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}



export default function HomepageSections() {
  return (
    <div className="relative w-full font-['Inter'] antialiased overflow-hidden" style={{ backgroundColor: c.bg, color: c.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
      <main>
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
      </main>
    </div>
  );
}