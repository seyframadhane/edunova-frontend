import React from "react";
import { MoveRight, Facebook, Instagram, Linkedin, Youtube, } from "lucide-react";

// Custom X (formerly Twitter) icon since it's in your image
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

interface FooterSectionProps {
  title: string;
  links: string[];
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => (
  <div className="flex items-start gap-8">
    {/* Vertical Title */}
    <h4 className="text-white text-2xl font-bold [writing-mode:vertical-lr] rotate-180 tracking-tight">
      {title}
    </h4>

    {/* Links List */}
    <ul className="space-y-6">
      {links.map((link) => (
        <li key={link}>
          <a
            href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-gray-300 hover:text-white flex items-center gap-2 group transition-colors text-sm font-medium"
          >
            {link}
            <MoveRight
              size={14}
              className="opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
            />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer: React.FC = () => {
  const footerData = [
    {
      title: "Our Company",
      links: ["Home", "About us", "Categories", "Contact us"],
    },
    {
      title: "Our Terms",
      links: [
        "Refund Policy",
        "Privacy Policy",
        "Cookie Policy",
        "Terms & Conditions",
      ],
    },
    {
      title: "Features",
      links: ["Settings", "My Learning", "Become an Edu Partner"],
    },
  ];

  const socialIcons = [
    { icon: <XIcon />, href: "#" },
    { icon: <Youtube size={20} />, href: "#" },
    { icon: <Facebook size={20} />, href: "#" },
    { icon: <Linkedin size={20} />, href: "#" },
    { icon: <Instagram size={20} />, href: "#" },
  ];
  return (
    <footer className="rounded-t-3xl w-full bg-white pt-12">
      {/* Dark Links Section */}
      <div className="bg-[#1e1e1e] mx-4 md:mx-10 rounded-t-[40px] px-16 py-16 flex flex-wrap justify-between items-start gap-12">
        {footerData.map((section) => (
          <FooterSection
            key={section.title}
            title={section.title}
            links={section.links}
          />
        ))}
      </div>

      {/* Social Media Bar */}
      <div className="py-8 flex justify-center gap-6">
        {socialIcons.map((social, index) => (
          <a
            key={index}
            href={social.href}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#333] text-white hover:bg-indigo-600 transition-all duration-300 shadow-sm"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </footer>
    // <footer className="text-gray-700 font-sans">
    //   <div className="container mx-auto px-4 py-8">
    //     <div className="flex flex-wrap justify-between">
    //       {/* Coursera Section */}
    //       <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-8 px-2">
    //         <h2 className="text-lg font-semibold mb-4 text-gray-800">Mini Coursera</h2>
    //         <div className="mb-4">
    //           <h3 className="text-md font-medium mb-2 text-gray-600">About</h3>
    //           <ul className="space-y-2">
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">What We Offer</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Leadership</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Careers</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Catalog</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Mini Coursera Plus</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Professional Certificates</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">MasterTrack® Certificates</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Degrees</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">For Enterprise</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">For Government</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">For Campus</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Become a Partner</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Social Impact</li>
    //           </ul>
    //         </div>
    //       </div>

    //       {/* Community Section */}
    //       <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-8 px-2">
    //         <h2 className="text-lg font-semibold mb-4 text-gray-800">Community</h2>
    //         <div className="mb-4">
    //           <h3 className="text-md font-medium mb-2 text-gray-600">Learners</h3>
    //           <ul className="space-y-2">
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Partners</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Beta Testers</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Blog</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">The Mini Coursera Podcast</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Tech Blog</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Teaching Center</li>
    //           </ul>
    //         </div>
    //       </div>

    //       {/* More Section */}
    //       <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-8 px-2">
    //         <h2 className="text-lg font-semibold mb-4 text-gray-800">More</h2>
    //         <div className="mb-4">
    //           <h3 className="text-md font-medium mb-2 text-gray-600">Press</h3>
    //           <ul className="space-y-2">
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Investors</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Terms</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Privacy</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Help</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Accessibility</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Contact</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Articles</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Directory</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Affiliates</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Modern Slavery Statement</li>
    //             <li className="text-sm hover:text-blue-600 cursor-pointer">Manage Cookie Preferences</li>
    //           </ul>
    //         </div>
    //       </div>

    //       {/* Contact Us Section */}
    //       <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-8 px-2">
    //         <h2 className="text-lg font-semibold mb-4 text-gray-800">Contact Us</h2>
    //         <ul className="space-y-2">
    //           <li><a href="mailto:mezragadnane@gmail.com" className="text-sm hover:text-blue-600 cursor-pointer">mezragadnane@gmail.com</a></li>
    //           <li className="text-sm hover:text-blue-600 cursor-pointer"><a href="https://www.linkedin.com/in/adnane-mezrag-525637248/">https://www.linkedin.com/in/adnane-mezrag-525637248</a></li>
    //         </ul>
    //       </div>
    //     </div>

    //     {/* Copyright */}
    //     <div className="border-t border-gray-200 pt-6 mt-6 text-center text-sm text-gray-500">
    //       © 2025 Mini Coursera Inc. All rights reserved.
    //     </div>
    //   </div>
    // </footer>
  );
};

export default Footer;
