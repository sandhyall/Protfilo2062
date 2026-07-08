import React, { useState } from "react";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
  ];

  const services = [
    "MERN Stack Development",
    "Website Development",
    "SEO Optimization",
    "Digital Marketing",
    "UI/UX Design",
  ];

  const socials = [
    { icon: FaFacebookF, label: "Facebook", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
    { icon: FaLinkedin, label: "LinkedIn", href: "#" },
    { icon: FaGithub, label: "GitHub", href: "#" },
  ];

  return (
    <footer className="bg-[#0B0F19] text-slate-400">
      <div className="h-px bg-gradient-to-r from-transparent via-[#C99B4A]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-12 mb-12 border-b border-white/[0.06]">
          <div>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Stay ahead of the curve
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Occasional notes on product, engineering, and growth. No noise.
            </p>
          </div>

          {subscribed ? (
            <p className="text-sm text-blue-500 font-medium">
              Thanks — you're on the list.
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-sm items-center gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-md transition"
              >
                Subscribe
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                YourCompany
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-500 max-w-xs">
              We design and build modern MERN Stack applications, then pair them
              with digital marketing that earns attention and drives measurable
              growth.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-sm text-slate-500">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-5">
              Get in touch
            </h4>
            <div className="space-y-3.5">
              <a
                href="tel:+97798XXXXXXXX"
                className="flex items-center gap-3 text-sm text-slate-500 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                +977-98XXXXXXXX
              </a>

              <a
                href="mailto:info@yourcompany.com"
                className="flex items-center gap-3 text-sm text-slate-500 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                info@yourcompany.com
              </a>

              <div className="flex items-start gap-3 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                Kathmandu, Nepal
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2026 YourCompany. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy policy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms &amp; conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
