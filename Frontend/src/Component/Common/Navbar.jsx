import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Our Services", to: "/services" },
    { name: "Projects", to: "/projects" },
    { name: "About Us", to: "/about" },
  ];

  return (
    <nav className="bg-[#111827] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="text-3xl font-bold tracking-wide text-blue-500"
          >
            LOGO
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[16px] font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="hover:text-blue-400 transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="border border-blue-500 px-5 py-2 rounded-lg hover:bg-blue-500 transition-all duration-300"
            >
              Contact Us
            </Link>
            <Link
              to="/audit"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold transition-all duration-300"
            >
              Get Free Audit
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#111827] border-t border-gray-800 flex flex-col items-center gap-4 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={toggleMenu}
              className="text-lg hover:text-blue-400"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-4 w-full px-6 mt-2">
            <Link
              to="/contact"
              onClick={toggleMenu}
              className="text-center border border-blue-500 py-3 rounded-lg hover:bg-blue-500"
            >
              Contact Us
            </Link>
            <Link
              to="/audit"
              onClick={toggleMenu}
              className="text-center bg-blue-600 py-3 rounded-lg font-semibold"
            >
              Get Free Audit
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
