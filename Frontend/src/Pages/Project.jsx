import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Globe,
  LayoutGrid,
  ShoppingCart,
  BarChart3,
  Palette,
  Smartphone,
  Sparkles,
  ArrowRight,
  ExternalLink,

  X,
  Star,
  CheckCircle2,
  Users,
  TrendingUp,
  ChevronDown,
  Clock,
  Quote,
  Rocket,
  Mail,
  MapPin,
  Layers,
  ShieldCheck,
} from "lucide-react";
import {  FaGithub, } from "react-icons/fa";

const CATEGORIES = [
  "All",
  "Web Development",
  "Web Applications",
  "E-Commerce",
  "Dashboard",
  "UI/UX Design",
  "Mobile Apps",
  "Branding",
];

const CATEGORY_STYLE = {
  "Web Development": {
    icon: Globe,
    from: "from-cyan-400",
    to: "to-blue-500",
    ring: "ring-cyan-400/30",
    text: "text-cyan-300",
    bg: "bg-cyan-400/10",
  },
  "Web Applications": {
    icon: LayoutGrid,
    from: "from-blue-400",
    to: "to-indigo-500",
    ring: "ring-blue-400/30",
    text: "text-blue-300",
    bg: "bg-blue-400/10",
  },
  "E-Commerce": {
    icon: ShoppingCart,
    from: "from-purple-400",
    to: "to-fuchsia-500",
    ring: "ring-purple-400/30",
    text: "text-purple-300",
    bg: "bg-purple-400/10",
  },
  Dashboard: {
    icon: BarChart3,
    from: "from-teal-400",
    to: "to-cyan-500",
    ring: "ring-teal-400/30",
    text: "text-teal-300",
    bg: "bg-teal-400/10",
  },
  "UI/UX Design": {
    icon: Palette,
    from: "from-pink-400",
    to: "to-purple-500",
    ring: "ring-pink-400/30",
    text: "text-pink-300",
    bg: "bg-pink-400/10",
  },
  "Mobile Apps": {
    icon: Smartphone,
    from: "from-indigo-400",
    to: "to-purple-500",
    ring: "ring-indigo-400/30",
    text: "text-indigo-300",
    bg: "bg-indigo-400/10",
  },
  Branding: {
    icon: Sparkles,
    from: "from-amber-300",
    to: "to-pink-500",
    ring: "ring-amber-300/30",
    text: "text-amber-200",
    bg: "bg-amber-300/10",
  },
};

const STATS = [
  { label: "Projects Completed", value: 150, suffix: "+" },
  { label: "Happy Clients", value: 80, suffix: "+" },
  { label: "Countries Served", value: 10, suffix: "+" },
  { label: "Client Satisfaction", value: 98, suffix: "%" },
];

const PROJECTS = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    category: "E-Commerce",
    description:
      "A high-conversion online store with real-time inventory, smart search, and a checkout built to reduce cart abandonment.",
    tech: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
    date: "Mar 2025",
    client: "Norrway Retail Co.",
    duration: "14 weeks",
    live: "#",
    github: "#",
    features: [
      "Real-time inventory sync across 3 warehouses",
      "AI-assisted product search & filtering",
      "One-page checkout with saved payment methods",
      "Vendor dashboard for order & stock management",
    ],
  },
  {
    id: "travel-tourism",
    title: "Travel & Tourism Website",
    category: "Web Development",
    description:
      "An immersive booking experience for a boutique travel agency, built around rich storytelling and instant itinerary quotes.",
    tech: ["Next.js", "Tailwind CSS", "Sanity CMS"],
    date: "Jan 2025",
    client: "Aurelia Travel",
    duration: "8 weeks",
    live: "#",
    github: "#",
    features: [
      "Dynamic itinerary builder with live pricing",
      "CMS-managed destination stories",
      "Multi-currency support for 12 regions",
      "Lighthouse performance score of 98+",
    ],
  },
  {
    id: "school-management",
    title: "School Management System",
    category: "Web Applications",
    description:
      "A unified platform for admissions, attendance, grading, and parent communication across an 8-campus school network.",
    tech: ["React", "Express.js", "MongoDB", "JWT"],
    date: "Nov 2024",
    client: "Meridian Schools Group",
    duration: "20 weeks",
    live: "#",
    github: "#",
    features: [
      "Role-based portals for admins, teachers & parents",
      "Automated attendance & report-card generation",
      "In-app messaging between staff and guardians",
      "Fee tracking with automated payment reminders",
    ],
  },
  {
    id: "hospital-management",
    title: "Hospital Management System",
    category: "Web Applications",
    description:
      "A HIPAA-conscious system streamlining patient records, appointment scheduling, and inter-department coordination.",
    tech: ["React", "Node.js", "PostgreSQL", "Socket.io"],
    date: "Sep 2024",
    client: "Cascade General Hospital",
    duration: "22 weeks",
    live: "#",
    github: "#",
    features: [
      "Unified electronic health records",
      "Real-time bed & staff availability tracking",
      "Automated appointment scheduling & reminders",
      "Secure role-based access for clinical staff",
    ],
  },
  {
    id: "restaurant-website",
    title: "Restaurant Website",
    category: "Web Development",
    description:
      "A warm, appetite-driven website with online ordering and table reservations for a growing restaurant chain.",
    tech: ["Next.js", "Tailwind CSS", "Stripe"],
    date: "Jul 2024",
    client: "Olive & Oak Kitchen",
    duration: "6 weeks",
    live: "#",
    github: "#",
    features: [
      "Online ordering synced with kitchen display system",
      "Live table reservation calendar",
      "Seasonal menu CMS with imagery pipeline",
      "Loyalty points integrated at checkout",
    ],
  },
  {
    id: "real-estate-platform",
    title: "Real Estate Platform",
    category: "Web Applications",
    description:
      "A listings marketplace with map-based discovery, mortgage estimation, and a saved-search alert system for buyers.",
    tech: ["React", "Firebase", "Google Maps API"],
    date: "May 2024",
    client: "Harborline Properties",
    duration: "16 weeks",
    live: "#",
    github: "#",
    features: [
      "Interactive map search with neighborhood insights",
      "Built-in mortgage & affordability calculator",
      "Saved searches with instant listing alerts",
      "Agent dashboard for listing management",
    ],
  },
  {
    id: "crm-dashboard",
    title: "CRM Dashboard",
    category: "Dashboard",
    description:
      "A pipeline-first CRM giving sales teams a single view of leads, deals, and forecasted revenue.",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    date: "Feb 2025",
    client: "Northbeam Sales",
    duration: "12 weeks",
    live: "#",
    github: "#",
    features: [
      "Drag-and-drop deal pipeline",
      "Automated lead scoring & follow-up tasks",
      "Revenue forecasting with cohort breakdowns",
      "Two-way email sync per contact",
    ],
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    category: "UI/UX Design",
    description:
      "A minimal, motion-led portfolio for a design studio, built to make every case study feel like a short film.",
    tech: ["React", "Tailwind CSS"],
    date: "Dec 2024",
    client: "Studio Faire",
    duration: "5 weeks",
    live: "#",
    github: "#",
    features: [
      "Scroll-choreographed case study reveals",
      "Custom cursor & micro-interaction system",
      "Modular CMS-free content structure",
      "Sub-1.5s first contentful paint",
    ],
  },
  {
    id: "finance-dashboard",
    title: "Finance Dashboard",
    category: "Dashboard",
    description:
      "A personal-finance analytics dashboard turning raw transaction data into clear, actionable spending insights.",
    tech: ["React", "TypeScript", "Node.js"],
    date: "Oct 2024",
    client: "Ledgerly",
    duration: "10 weeks",
    live: "#",
    github: "#",
    features: [
      "Automated categorization of transactions",
      "Custom budget alerts & spending trends",
      "Multi-account net-worth tracking",
      "Exportable monthly financial reports",
    ],
  },
  {
    id: "fintech-mobile-app",
    title: "FinTech Mobile App",
    category: "Mobile Apps",
    description:
      "A cross-platform banking companion app focused on instant transfers, budgeting, and biometric security.",
    tech: ["React Native", "Firebase", "Node.js"],
    date: "Apr 2025",
    client: "Vaultly Bank",
    duration: "18 weeks",
    live: "#",
    github: "#",
    features: [
      "Biometric login with device-level encryption",
      "Instant peer-to-peer transfers",
      "Envelope-style budgeting tools",
      "Push alerts for unusual account activity",
    ],
  },
  {
    id: "brand-identity-system",
    title: "Brand Identity System",
    category: "Branding",
    description:
      "A full visual identity — logo system, type scale, and component library — for a climate-tech startup's launch.",
    tech: ["Figma", "Illustrator", "Design Tokens"],
    date: "Jun 2024",
    client: "Verdant Energy",
    duration: "7 weeks",
    live: "#",
    github: "#",
    features: [
      "Logo system with 4 responsive lockups",
      "Full type & color token library",
      "Illustration language for marketing surfaces",
      "60-page brand guideline document",
    ],
  },
];

const TECH_STACK = [
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Firebase",
  "Tailwind CSS",
  "TypeScript",
  "Docker",
  "AWS",
];

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Discovery",
    copy: "We dig into your goals, users, and constraints before writing a single line of code.",
  },
  {
    n: "02",
    title: "Planning",
    copy: "Scope, milestones, and architecture get mapped so the whole team builds toward the same target.",
  },
  {
    n: "03",
    title: "UI/UX Design",
    copy: "Wireframes evolve into a high-fidelity design system tailored to your brand.",
  },
  {
    n: "04",
    title: "Development",
    copy: "Clean, modular code shipped in short cycles so progress stays visible.",
  },
  {
    n: "05",
    title: "Testing",
    copy: "Manual and automated QA across devices, browsers, and edge cases.",
  },
  {
    n: "06",
    title: "Deployment",
    copy: "A monitored, zero-downtime release to production infrastructure.",
  },
  {
    n: "07",
    title: "Support",
    copy: "Ongoing monitoring, fixes, and enhancements after launch.",
  },
];

const TESTIMONIALS = [
  {
    name: "Amelia Ford",
    role: "Founder",
    company: "Norrway Retail Co.",
    initials: "AF",
    rating: 5,
    feedback:
      "They rebuilt our storefront from the ground up and checkout completion went up within the first month. Communication was sharp and deadlines were real.",
  },
  {
    name: "Daniel Osei",
    role: "COO",
    company: "Meridian Schools Group",
    initials: "DO",
    rating: 5,
    feedback:
      "Rolling out one system across eight campuses sounded risky. The team de-risked every phase and trained our staff without disrupting a single term.",
  },
  {
    name: "Priya Nair",
    role: "Head of Product",
    company: "Ledgerly",
    initials: "PN",
    rating: 5,
    feedback:
      "Our dashboard finally feels like a product instead of a spreadsheet. The attention to detail in the data visualizations was well above what we asked for.",
  },
];

const FAQS = [
  {
    q: "How long does a typical project take?",
    a: "Most projects run between 6 and 22 weeks depending on scope. During discovery we give you a milestone-based timeline so you always know what's shipping and when.",
  },
  {
    q: "What technologies do you build with?",
    a: "We work primarily with React, Next.js, Node.js, and TypeScript on the frontend and backend, with MongoDB or PostgreSQL for data, and AWS or Firebase for infrastructure — chosen based on what your product actually needs.",
  },
  {
    q: "Do you offer support after launch?",
    a: "Yes. Every project includes a post-launch support window, and most clients continue with a monthly maintenance plan for monitoring, updates, and new features.",
  },
  {
    q: "Who owns the source code once the project is done?",
    a: "You do, fully. Once final payment is made, all source code, design files, and credentials are handed over with no licensing strings attached.",
  },
  {
    q: "Can you improve or rebuild an existing system?",
    a: "Absolutely — a large share of our work is modernizing legacy systems. We start with an audit, then decide together whether to incrementally refactor or rebuild.",
  },
  {
    q: "How is pricing structured?",
    a: "Fixed price for well-defined scopes, or time-and-materials for evolving products. You'll get a clear proposal before any work begins — no surprise invoices.",
  },
];

function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

function useCountUp(target, inView, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}

function useReveal() {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return [ref, inView ? "reveal-in" : "reveal-out"];
}

const SectionEyebrow = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-cyan-300">
    {children}
  </span>
);

const GradientPanel = ({ category, className = "" }) => {
  const style = CATEGORY_STYLE[category] || CATEGORY_STYLE["Web Development"];
  const Icon = style.icon;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${style.from} ${style.to} opacity-20`}
      />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ${style.ring} transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6`}
        >
          <Icon className="h-8 w-8 text-white" strokeWidth={1.6} />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
    </div>
  );
};

const CategoryBadge = ({ category }) => {
  const style = CATEGORY_STYLE[category] || CATEGORY_STYLE["Web Development"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text} ring-1 ${style.ring}`}
    >
      {category}
    </span>
  );
};

const TechPill = ({ label }) => (
  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300">
    {label}
  </span>
);

const Hero = () => (
  <section className="relative overflow-hidden border-b border-white/5">
    <div className="absolute inset-0 aurora-bg" />
    <div className="absolute inset-0 grid-pattern opacity-[0.15]" />

    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="shape-float-1 absolute left-[8%] top-[18%] h-16 w-16 rounded-2xl border border-cyan-400/30 bg-cyan-400/5" />
      <div className="shape-float-2 absolute right-[12%] top-[28%] h-24 w-24 rounded-full border border-purple-400/30 bg-purple-400/5" />
      <div className="shape-float-3 absolute left-[18%] bottom-[15%] h-12 w-12 rotate-45 border border-cyan-300/25 bg-cyan-300/5" />
      <div
        className="shape-float-1 absolute right-[22%] bottom-[22%] h-10 w-10 rounded-full border border-pink-400/25 bg-pink-400/5"
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className="shape-float-2 absolute right-[6%] top-[10%] h-8 w-8 rotate-12 border border-indigo-300/25 bg-indigo-300/5"
        style={{ animationDelay: "0.6s" }}
      />
    </div>

    <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
      <div
        className="mb-10 flex items-center gap-2 text-sm text-slate-400 fade-up"
        style={{ animationDelay: "0.05s" }}
      >
        <span className="cursor-pointer transition-colors hover:text-cyan-300">
          Home
        </span>
        <span className="text-slate-600">/</span>
        <span className="font-medium text-slate-200">Projects</span>
      </div>

      <div className="fade-up" style={{ animationDelay: "0.15s" }}>
        <SectionEyebrow>
          <Sparkles className="h-3.5 w-3.5" /> Selected Work
        </SectionEyebrow>
      </div>

      <h1
        className="fade-up mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl"
        style={{ animationDelay: "0.25s" }}
      >
        Our{" "}
        <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-purple-400 bg-clip-text text-transparent">
          Projects
        </span>
      </h1>

      <p
        className="fade-up mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
        style={{ animationDelay: "0.35s" }}
      >
        Explore our latest work and discover how we've helped businesses
        transform their ideas into powerful digital solutions.
      </p>

      <div
        className="fade-up mt-9 flex flex-wrap items-center gap-4"
        style={{ animationDelay: "0.45s" }}
      >
        <a
          href="#projects"
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-transform duration-300 hover:scale-[1.03]"
        >
          View the work
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/5"
        >
          Start a project
        </a>
      </div>
    </div>
  </section>
);

const StatItem = ({ stat }) => {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const value = useCountUp(stat.value, inView);
  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-4xl font-semibold text-white sm:text-5xl">
        {value}
        <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
          {stat.suffix}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
    </div>
  );
};

const StatsSection = () => (
  <section className="relative border-b border-white/5 bg-slate-950/60">
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4">
      {STATS.map((s) => (
        <StatItem key={s.label} stat={s} />
      ))}
    </div>
  </section>
);

const FilterBar = ({ active, onChange }) => (
  <div className="flex flex-wrap items-center justify-center gap-2.5">
    {CATEGORIES.map((cat) => {
      const isActive = cat === active;
      return (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 shadow-md shadow-cyan-500/20"
              : "border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
          }`}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

const ProjectCard = ({ project, onView, index }) => {
  const [ref, revealClass] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal group relative ${revealClass}`}
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
    >
      <div className="rounded-[22px] bg-gradient-to-br from-cyan-400/30 via-white/5 to-purple-500/30 p-px transition-opacity duration-500 group-hover:from-cyan-400/60 group-hover:to-purple-500/60">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[21px] bg-slate-900/70 backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-1.5">
          <div className="relative h-44 w-full overflow-hidden">
            <GradientPanel
              category={project.category}
              className="h-full w-full"
            />
            <div className="absolute right-3 top-3">
              <CategoryBadge category={project.category} />
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {project.date}
              </span>
              <span>{project.duration}</span>
            </div>

            <h3 className="mt-2 text-lg font-semibold text-white">
              {project.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.slice(0, 3).map((t) => (
                <TechPill key={t} label={t} />
              ))}
              {project.tech.length > 3 && (
                <span className="rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-500">
                  +{project.tech.length - 3}
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4">
              <button
                onClick={() => onView(project)}
                className="flex-1 rounded-lg bg-white/[0.06] px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-white/[0.12]"
              >
                View Details
              </button>
              <a
                href={project.live}
                onClick={(e) => e.preventDefault()}
                title="Live Demo"
                className="rounded-lg border border-white/10 p-2 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              {project.github && (
                <a
                  href={project.github}
                  onClick={(e) => e.preventDefault()}
                  title="GitHub"
                  className="rounded-lg border border-white/10 p-2 text-slate-300 transition-colors hover:border-purple-400/40 hover:text-purple-300"
                >
                  <FaGithub className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div className="scan-line pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = ({ onView }) => {
  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active);

  return (
    <section id="projects" className="relative border-b border-white/5 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Portfolio</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-3 text-slate-400">
            A cross-section of platforms, dashboards, and applications we've
            shipped for clients across industries.
          </p>
        </div>

        <div className="mt-10">
          <FilterBar active={active} onChange={setActive} />
        </div>

        <div
          key={active}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onView={onView}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-slate-500">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  );
};

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm modal-fade"
        onClick={onClose}
      />
      <div className="modal-pop relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-slate-950/70 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <GradientPanel category={project.category} className="h-56 w-full" />

        <div className="p-7">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryBadge category={project.category} />
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" /> {project.date} ·{" "}
              {project.duration}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-semibold text-white">
            {project.title}
          </h3>
          <p className="mt-3 leading-relaxed text-slate-400">
            {project.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Client
              </p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {project.client}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Duration
              </p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {project.duration}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-white">Key Features</p>
            <ul className="mt-3 space-y-2">
              {project.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-slate-400"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-white">
              Technologies Used
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-white">Project Gallery</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <GradientPanel
                  key={i}
                  category={project.category}
                  className="h-20 rounded-lg"
                />
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-6">
            <a
              href={project.live}
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.03]"
            >
              Visit Live Site <ExternalLink className="h-4 w-4" />
            </a>
            {project.github && (
              <a
                href={project.github}
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5"
              >
                <Github className="h-4 w-4" /> View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TechStackSection = () => {
  const [ref, revealClass] = useReveal();
  return (
    <section className="border-b border-white/5 py-20">
      <div
        ref={ref}
        className={`reveal mx-auto max-w-6xl px-6 text-center ${revealClass}`}
      >
        <SectionEyebrow>Our Toolkit</SectionEyebrow>
        <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
          Technologies We Build With
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          A modern, production-tested stack chosen for performance, reliability,
          and long-term maintainability.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {TECH_STACK.map((t) => (
            <span
              key={t}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.06] hover:text-cyan-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const [ref, revealClass] = useReveal();
  return (
    <section className="border-b border-white/5 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>How We Work</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
            Development Process
          </h2>
          <p className="mt-3 text-slate-400">
            Seven steps, repeated on every engagement — from first call to
            long-term support.
          </p>
        </div>

        <div
          ref={ref}
          className={`reveal mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${revealClass}`}
        >
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.n}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05]"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="font-mono text-3xl font-semibold text-white/10 transition-colors duration-300 group-hover:text-cyan-400/30">
                {step.n}
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {step.copy}
              </p>
              {i < PROCESS_STEPS.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-white/20 to-transparent lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ t, index }) => {
  const [ref, revealClass] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400/30 ${revealClass}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Quote className="h-6 w-6 text-cyan-400/60" />
      <div className="mt-4 flex gap-0.5">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">
        {t.feedback}
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-sm font-semibold text-slate-950">
          {t.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t.name}</p>
          <p className="text-xs text-slate-500">
            {t.role}, {t.company}
          </p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => (
  <section className="border-b border-white/5 py-24">
    <div className="mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <SectionEyebrow>Client Voices</SectionEyebrow>
        <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
          What Clients Say
        </h2>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const FAQItem = ({ item, isOpen, onToggle }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
    >
      <span className="text-sm font-medium text-slate-100">{item.q}</span>
      <ChevronDown
        className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-cyan-300" : ""}`}
      />
    </button>
    <div className={`faq-body ${isOpen ? "faq-open" : ""}`}>
      <p className="px-5 pb-4 text-sm leading-relaxed text-slate-400">
        {item.a}
      </p>
    </div>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="border-b border-white/5 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <SectionEyebrow>Good to Know</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section id="contact" className="relative overflow-hidden py-24">
    <div className="absolute inset-0 aurora-bg opacity-70" />
    <div className="absolute inset-0 grid-pattern opacity-10" />
    <div className="relative mx-auto max-w-3xl px-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-cyan-400/30">
        <Rocket className="h-7 w-7 text-cyan-300" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
        Have a Project in Mind?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-slate-400">
        We're ready to turn your ideas into a powerful digital product.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-transform duration-300 hover:scale-[1.03]">
          Start Your Project
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/5">
          <Mail className="h-4 w-4" /> Contact Us
        </button>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-400" /> NDA-friendly
        </span>
        <span className="inline-flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-400" /> Dedicated project lead
        </span>
        <span className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-cyan-400" /> Built to scale
        </span>
      </div>
    </div>
  </section>
);

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

    .projects-page, .projects-page button, .projects-page a { font-family: 'Inter', system-ui, sans-serif; }
    .projects-page h1, .projects-page h2, .projects-page h3 { font-family: 'Space Grotesk', system-ui, sans-serif; }
    .projects-page .font-mono { font-family: 'JetBrains Mono', monospace; }

    .aurora-bg {
      background: radial-gradient(600px circle at 20% 20%, rgba(34,211,238,0.18), transparent 60%),
                  radial-gradient(600px circle at 80% 30%, rgba(168,85,247,0.18), transparent 60%),
                  radial-gradient(700px circle at 50% 90%, rgba(34,211,238,0.10), transparent 60%),
                  #020617;
      background-size: 200% 200%;
      animation: aurora-shift 16s ease-in-out infinite;
    }
    @keyframes aurora-shift {
      0%, 100% { background-position: 0% 0%; }
      50% { background-position: 100% 50%; }
    }

    .grid-pattern {
      background-image:
        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 42px 42px;
      mask-image: radial-gradient(ellipse 70% 70% at 50% 30%, black 40%, transparent 100%);
    }

    @keyframes float-1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-22px) rotate(8deg); } }
    @keyframes float-2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(18px) rotate(-6deg); } }
    @keyframes float-3 { 0%,100% { transform: translateY(0) rotate(45deg); } 50% { transform: translateY(-14px) rotate(60deg); } }
    .shape-float-1 { animation: float-1 7s ease-in-out infinite; }
    .shape-float-2 { animation: float-2 8.5s ease-in-out infinite; }
    .shape-float-3 { animation: float-3 6.5s ease-in-out infinite; }

    @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .fade-up { opacity: 0; animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }

    .reveal { transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1); }
    .reveal-out { opacity: 0; transform: translateY(24px); }
    .reveal-in { opacity: 1; transform: translateY(0); }

    @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
    .group:hover .scan-line { animation: scan 1.6s linear infinite; }

    .faq-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
    .faq-open { max-height: 240px; }

    @keyframes modal-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modal-pop { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .modal-fade { animation: modal-fade 0.25s ease forwards; }
    .modal-pop { animation: modal-pop 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }

    @media (prefers-reduced-motion: reduce) {
      .aurora-bg, .shape-float-1, .shape-float-2, .shape-float-3, .fade-up, .reveal, .scan-line { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
    }
  `}</style>
);

export default function ProjectsPage() {
  const [selected, setSelected] = useState(null);

  const handleView = useCallback((project) => setSelected(project), []);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <div className="projects-page min-h-screen bg-slate-950 text-slate-100 antialiased">
      <GlobalStyles />
      <Hero />
      <StatsSection />
      <ProjectsSection onView={handleView} />
      <TechStackSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
      <ProjectModal project={selected} onClose={handleClose} />
    </div>
  );
}
