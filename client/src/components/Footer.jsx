import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const socialLinks = [
  { icon: <FaFacebookF />, url: "#" },
  { icon: <FaTwitter />, url: "#" },
  { icon: <FaInstagram />, url: "#" },
  { icon: <FaLinkedinIn />, url: "#" },
];

const quickLinks = [
  { name: "Property for Rent", path: "/properties/rent" },
  { name: "Property for Sale", path: "/properties/sale" },
  { name: "Society Maps", path: "/society-maps" },
  { name: "News & Guide", path: "/news-guide" },
];

const companyLinks = [
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Place Free Ad", path: "/place-free-ad" },
];

const contactInfo = [
  {
    type: "address",
    value: "House No: 27, 1st Floor, Road No: 5, Block-C Rampura Banasree",
  },
  { type: "email", value: "info@realproperty.com", href: "mailto:info@realproperty.com" },
  { type: "phone", value: "+88 320 145 00 92", href: "tel:+8803201450092" },
];

const Footer = () => {
  const [quickOpen, setQuickOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  return (
    <footer className="bg-[#0F2A4D] text-gray-200 pt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="RealProperty Logo" className="w-12 h-12 rounded-md" />
            <h2 className="text-xl font-bold text-white">Real Estate</h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            Bangladesh's most trusted free property listings platform. Buy, sell, or rent with confidence.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                aria-label={`Link to ${social.url}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div
            className="flex justify-between items-center cursor-pointer md:cursor-auto"
            onClick={() => setQuickOpen(!quickOpen)}
          >
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <span className="md:hidden">
              {quickOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          <ul
            className={`space-y-2 text-sm transition-all duration-300 overflow-hidden md:overflow-visible ${
              quickOpen ? "max-h-40" : "max-h-0 md:max-h-full"
            }`}
          >
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="hover:text-white transition block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <div
            className="flex justify-between items-center cursor-pointer md:cursor-auto"
            onClick={() => setCompanyOpen(!companyOpen)}
          >
            <h3 className="text-lg font-semibold text-white mb-3">Company</h3>
            <span className="md:hidden">
              {companyOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          <ul
            className={`space-y-2 text-sm transition-all duration-300 overflow-hidden md:overflow-visible ${
              companyOpen ? "max-h-40" : "max-h-0 md:max-h-full"
            }`}
          >
            {companyLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="hover:text-white transition block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <ul className="text-sm space-y-3">
            {contactInfo.map((item, idx) => (
              <li key={idx}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-white transition block break-words"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/20 mt-10 py-5 text-center text-sm text-gray-400">
        © 2025 RealProperty. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
