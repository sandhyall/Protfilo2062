import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Globe,
  AppWindow,
  ShoppingCart,
  PenTool,
  Smartphone,
  Code2,
  LayoutDashboard,
  Webhook,
  Cloud,
  TrendingUp,
  Megaphone,
  Wrench,
  ClipboardList,
  Compass,
  Bug,
  Rocket,
  LifeBuoy,
  Users,
  ShieldCheck,
  Cpu,
  Zap,
  Wallet,
  Headphones,
  Star,
  Quote,
} from "lucide-react";

const c = {
  bg: "#020617",
  cyan: "#22D3EE",
  purple: "#A855F7",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "rgba(255,255,255,0.08)",
};

const gradientText = `linear-gradient(90deg, ${c.cyan}, ${c.purple})`;

const services = [
  {
    icon: Globe,
    title: "Website Development",
    desc: "Fast, SEO-friendly websites built to convert visitors into customers.",
    features: ["Responsive design", "SEO-ready structure", "CMS integration"],
  },
  {
    icon: AppWindow,
    title: "Web Application Development",
    desc: "Custom web apps that handle real workflows, not just static pages.",
    features: ["Scalable architecture", "Role-based access", "API-driven"],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Development",
    desc: "Online stores built to sell, from checkout flow to inventory.",
    features: ["Secure payments", "Inventory management", "Multi-device UX"],
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    desc: "Interfaces people enjoy using, backed by research and testing.",
    features: [
      "Wireframes & prototypes",
      "Design systems",
      "Usability testing",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "Native-feel apps for iOS and Android from a single codebase.",
    features: [
      "Cross-platform builds",
      "Push notifications",
      "App store support",
    ],
  },
  {
    icon: Code2,
    title: "Custom Software Development",
    desc: "Purpose-built software when off-the-shelf tools fall short.",
    features: [
      "Tailored workflows",
      "Legacy system integration",
      "Long-term ownership",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Development",
    desc: "Data dashboards that turn raw numbers into clear decisions.",
    features: ["Real-time data", "Custom visualizations", "Role-based views"],
  },
  {
    icon: Webhook,
    title: "API Development",
    desc: "Reliable, documented APIs that connect your systems together.",
    features: [
      "RESTful & GraphQL",
      "Third-party integrations",
      "Full documentation",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud Deployment",
    desc: "Infrastructure that scales with you, without the guesswork.",
    features: ["CI/CD pipelines", "Auto-scaling setup", "Monitoring & backups"],
  },
  {
    icon: TrendingUp,
    title: "SEO Optimization",
    desc: "Technical and content SEO that helps the right people find you.",
    features: [
      "Technical audits",
      "On-page optimization",
      "Performance tuning",
    ],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Campaigns built around measurable growth, not vanity metrics.",
    features: [
      "Social & paid ads",
      "Content strategy",
      "Analytics & reporting",
    ],
  },
  {
    icon: Wrench,
    title: "Website Maintenance",
    desc: "Ongoing care so your site stays fast, secure, and up to date.",
    features: ["Security patches", "Performance monitoring", "Priority fixes"],
  },
];

const process = [
  {
    icon: ClipboardList,
    title: "Requirement Analysis",
    desc: "We dig into your goals, users, and constraints before writing a spec.",
  },
  {
    icon: Compass,
    title: "Planning",
    desc: "Scope, milestones, and tech decisions are locked in and shared with you.",
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    desc: "Wireframes turn into polished, tested interfaces before any code is final.",
  },
  {
    icon: Code2,
    title: "Development",
    desc: "Engineers build in short, reviewable cycles so progress stays visible.",
  },
  {
    icon: Bug,
    title: "Testing",
    desc: "Manual and automated testing across devices before anything ships.",
  },
  {
    icon: Rocket,
    title: "Deployment",
    desc: "A controlled, zero-surprise launch with rollback plans in place.",
  },
  {
    icon: LifeBuoy,
    title: "Maintenance & Support",
    desc: "We stay on after launch to monitor, fix, and improve.",
  },
];

const whyUs = [
  {
    icon: Users,
    title: "Experienced Team",
    desc: "Senior engineers and designers who've shipped production products before.",
  },
  {
    icon: ShieldCheck,
    title: "High Quality Code",
    desc: "Reviewed, tested, and documented — built to be maintained, not just shipped.",
  },
  {
    icon: Cpu,
    title: "Modern Technologies",
    desc: "Current frameworks and tooling, chosen for the problem, not the trend.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    desc: "Clear milestones and tight feedback loops keep projects moving.",
  },
  {
    icon: Wallet,
    title: "Affordable Pricing",
    desc: "Transparent quotes with no hidden fees or scope surprises.",
  },
  {
    icon: Headphones,
    title: "Lifetime Support",
    desc: "We don't disappear after launch — ongoing help is part of the deal.",
  },
];

const technologies = [
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Tailwind CSS",
  "GitHub",
  "Figma",
];

const projects = [
  {
    title: "FinTrack",
    category: "Web Application",
    desc: "A personal finance dashboard with real-time budgeting and spend insights.",
  },
  {
    title: "ShopNest",
    category: "E-Commerce",
    desc: "A full-featured storefront with custom checkout and inventory sync.",
  },
  {
    title: "MediCare",
    category: "Mobile App",
    desc: "A healthcare booking app connecting patients with local clinics.",
  },
];

const testimonials = [
  {
    name: "Sarah Whitfield",
    company: "Founder, Nimbus Retail",
    feedback:
      "They understood our workflow better than we could explain it ourselves. The dashboard they built is now central to how we run the business.",
  },
  {
    name: "Daniel Osei",
    company: "CTO, Lendwise",
    feedback:
      "Clean code, clear communication, and they hit every milestone. It's rare to find a team this dependable.",
  },
  {
    name: "Priya Menon",
    company: "COO, Bloomcart",
    feedback:
      "From design to deployment, the process felt effortless. Our conversion rate improved within weeks of launch.",
  },
];

const faqs = [
  {
    q: "How long does it take to build a website or app?",
    a: "Most websites take 3–6 weeks and web or mobile apps take 8–16 weeks, depending on scope. We'll give you a firm timeline after the planning phase.",
  },
  {
    q: "Do you offer support after the project launches?",
    a: "Yes. Every project includes a post-launch support window, and we offer ongoing maintenance plans after that.",
  },
  {
    q: "What technologies do you typically use?",
    a: "React, Next.js, and Node.js form our core stack, paired with MongoDB or Firebase depending on the project's needs.",
  },
  {
    q: "Can you redesign or improve our existing website?",
    a: "Absolutely. We regularly take over existing codebases — we'll audit what's there first, then propose a plan.",
  },
  {
    q: "Do you sign NDAs before discussing project details?",
    a: "Yes, we're happy to sign an NDA before any detailed discussion if your project requires confidentiality.",
  },
  {
    q: "How does your pricing work?",
    a: "We quote fixed pricing for well-defined projects and time-and-materials for ongoing or evolving work — always agreed upfront.",
  },
];

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: c.cyan }}
      />
      <span
        className="font-['JetBrains_Mono'] text-xs tracking-[0.2em] uppercase"
        style={{ color: c.cyan }}
      >
        {children}
      </span>
    </div>
  );
}

function SectionHeader({ eyebrow, title, desc, center = true }) {
  return (
    <div className={`mb-14 ${center ? "text-center" : ""}`}>
      <div className={`flex ${center ? "justify-center" : ""}`}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-semibold text-white">
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-4 text-sm md:text-base ${center ? "max-w-2xl mx-auto" : "max-w-2xl"}`}
          style={{ color: c.muted }}
        >
          {desc}
        </p>
      )}
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border backdrop-blur-xl ${className}`}
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        borderColor: c.border,
      }}
    >
      {children}
    </div>
  );
}

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm text-white shrink-0"
      style={{ backgroundImage: gradientText }}
    >
      {initials}
    </div>
  );
}

export default function OurServicesPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div
      className="relative w-full font-['Inter'] antialiased overflow-hidden"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      <section className="relative px-6 pt-16 pb-28 md:pt-20 md:pb-36">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-40 -left-32 w-[30rem] h-[30rem] rounded-full blur-[110px]"
            style={{ backgroundColor: c.cyan, opacity: 0.18 }}
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 -right-32 w-[28rem] h-[28rem] rounded-full blur-[110px]"
            style={{ backgroundColor: c.purple, opacity: 0.2 }}
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute top-24 left-[15%] w-16 h-16 rounded-2xl border"
            style={{ borderColor: `${c.cyan}55` }}
            animate={{ y: [0, -18, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-16 right-[18%] w-20 h-20 rounded-full border"
            style={{ borderColor: `${c.purple}55` }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 right-[8%] w-10 h-10 border rotate-45"
            style={{ borderColor: `${c.cyan}40` }}
            animate={{ rotate: [45, 90, 45] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-sm mb-8"
            style={{ color: c.muted }}
          >
            <Home size={14} />
            <span>Home</span>
            <ChevronRight size={14} />
            <span style={{ color: c.cyan }}>Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-['Space_Grotesk'] font-semibold text-5xl md:text-7xl tracking-tight"
          >
            Our{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: gradientText }}
            >
              Services
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.muted }}
          >
            We provide modern digital solutions for businesses — from websites
            and applications to cloud infrastructure and ongoing growth support,
            all under one roof.
          </motion.p>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="What We Offer"
            title="Everything you need to build and grow"
            desc="Twelve core services, each handled by specialists who focus on that discipline every day."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <GlassCard className="p-7 h-full flex flex-col hover:border-white/20 transition group">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition group-hover:scale-105"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${c.cyan}26, ${c.purple}26)`,
                      color: c.cyan,
                    }}
                  >
                    <s.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-semibold mb-2">
                    {s.title}
                  </h3>
                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: c.muted }}
                  >
                    {s.desc}
                  </p>
                  <ul className="space-y-1.5 mb-6">
                    {s.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-xs"
                        style={{ color: c.muted }}
                      >
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: c.purple }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#"
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium transition group-hover:gap-2.5"
                    style={{ color: c.cyan }}
                  >
                    Learn More <ArrowRight size={14} />
                  </a>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="How We Work"
            title="Our Development Process"
            desc="A clear, repeatable path from first conversation to long-term support."
          />

          <div className="relative">
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{
                backgroundImage: `linear-gradient(180deg, ${c.cyan}, ${c.purple})`,
                opacity: 0.3,
              }}
            />
            <div className="space-y-8 md:space-y-0">
              {process.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className={`md:flex md:items-center md:gap-8 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    } md:py-6`}
                  >
                    <div
                      className={`md:w-1/2 ${isLeft ? "md:text-right" : "md:text-left"}`}
                    >
                      <GlassCard className="p-6 inline-block text-left w-full md:w-auto">
                        <span
                          className="font-['JetBrains_Mono'] text-xs tracking-widest"
                          style={{ color: c.purple }}
                        >
                          STEP 0{i + 1}
                        </span>
                        <h3 className="font-['Space_Grotesk'] font-semibold text-lg mt-1 mb-1.5">
                          {step.title}
                        </h3>
                        <p className="text-sm" style={{ color: c.muted }}>
                          {step.desc}
                        </p>
                      </GlassCard>
                    </div>

                    <div
                      className="hidden md:flex w-12 h-12 rounded-full items-center justify-center shrink-0 border-4 relative z-10"
                      style={{ backgroundColor: c.bg, borderColor: c.cyan }}
                    >
                      <step.icon size={18} style={{ color: c.cyan }} />
                    </div>

                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Why Us" title="Why Choose Our Services" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <GlassCard className="p-7 h-full hover:border-white/20 transition">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${c.cyan}, ${c.purple})`,
                    }}
                  >
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-['Space_Grotesk'] font-semibold mb-1.5">
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: c.muted }}
                  >
                    {f.desc}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Our Stack"
            title="Technologies We Use"
            desc="Modern, battle-tested tools chosen for reliability, not trend."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {technologies.map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                whileHover={{ y: -4, scale: 1.03 }}
              >
                <GlassCard className="p-5 flex flex-col items-center gap-3 text-center hover:border-white/20 transition">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-['Space_Grotesk'] text-sm font-semibold text-white"
                    style={{ backgroundImage: gradientText }}
                  >
                    {tech[0]}
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: c.text }}
                  >
                    {tech}
                  </span>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Our Work"
            title="Featured Projects"
            desc="A few recent builds — swap these placeholders with real case studies."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <GlassCard className="overflow-hidden h-full hover:border-white/20 transition">
                  <div
                    className="h-44 flex items-center justify-center"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${c.cyan}33, ${c.purple}33)`,
                    }}
                  >
                    <span className="font-['Space_Grotesk'] text-2xl font-semibold text-white/70">
                      {p.title}
                    </span>
                  </div>
                  <div className="p-6">
                    <span
                      className="font-['JetBrains_Mono'] text-[11px] tracking-widest uppercase"
                      style={{ color: c.purple }}
                    >
                      {p.category}
                    </span>
                    <h3 className="font-['Space_Grotesk'] font-semibold text-lg mt-2 mb-2">
                      {p.title}
                    </h3>
                    <p className="text-sm mb-5" style={{ color: c.muted }}>
                      {p.desc}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 text-sm font-medium"
                      style={{ color: c.cyan }}
                    >
                      View Project <ArrowRight size={14} />
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Client Words" title="Client Testimonials" />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard className="p-7 h-full flex flex-col hover:border-white/20 transition">
                  <Quote className="w-6 h-6 mb-4" style={{ color: c.purple }} />
                  <p
                    className="text-sm leading-relaxed mb-6 flex-1"
                    style={{ color: c.text }}
                  >
                    "{t.feedback}"
                  </p>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        fill={c.cyan}
                        style={{ color: c.cyan }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar name={t.name} />
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs" style={{ color: c.muted }}>
                        {t.company}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="space-y-3">
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <GlassCard key={item.q} className="overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left px-6 py-5"
                  >
                    <span className="font-medium text-sm md:text-base pr-4">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
                      style={{ color: c.cyan }}
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p
                          className="px-6 pb-5 text-sm leading-relaxed"
                          style={{ color: c.muted }}
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center"
            style={{
              backgroundImage: `linear-gradient(135deg, ${c.cyan}, #6366F1 50%, ${c.purple})`,
            }}
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, white 0, transparent 35%), radial-gradient(circle at 85% 80%, white 0, transparent 35%)",
              }}
            />
            <h2 className="relative font-['Space_Grotesk'] text-3xl md:text-4xl font-semibold mb-4 text-white">
              Ready to Build Your Next Digital Product?
            </h2>
            <p className="relative text-white/85 max-w-xl mx-auto mb-9">
              Tell us about your project and we'll map out the fastest, cleanest
              path to launch — no obligation.
            </p>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-white text-slate-950 font-medium px-8 py-3.5 rounded-xl shadow-lg"
              >
                Get Free Consultation
                <ArrowRight className="w-4 h-4" />
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
    </div>
  );
}
