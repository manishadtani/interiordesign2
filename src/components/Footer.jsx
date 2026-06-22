import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#FAF8F5] pt-10 pb-0 relative z-30 overflow-hidden w-full">
      <div className="w-full max-w-[1500px] mx-auto px-6 md:px-16 lg:px-[8%] relative">
        
        {/* Main Flex Container */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 mt-8 md:mt-16 gap-12 md:gap-8">
           
           {/* Left Column: Heading */}
           <div className="max-w-xl">
             <h2 className="font-display text-[2.8rem] md:text-[3.5rem] lg:text-[4.2rem] text-[#111] mb-3 md:mb-5 leading-[1.05] tracking-tight uppercase">
               Turning Concepts<br/>Into Landmarks.
             </h2>
             <p className="font-body text-[#999] font-light text-base md:text-[1.05rem] tracking-wide">
               Your <span className="text-[#b2000a] font-medium">dream space</span> is just a conversation away
             </p>
           </div>

           {/* Right Column: Contact & Socials */}
           <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-12 lg:gap-16">
              
              {/* Contact Info */}
              <div>
                <h4 className="font-body font-semibold text-[#111] mb-3 text-[0.95rem]">Contact</h4>
                <ul className="list-none p-0 m-0 flex flex-col gap-[0.35rem] font-body text-[0.85rem] text-[#555] font-normal tracking-[0.02em]">
                   <li>Marquis Living</li>
                   <li className="leading-relaxed">The V Building, Arjan,<br/>Dubai, UAE</li>
                   <li>xxxxxxxxx</li>
                   <li className="pt-1">Info@Marquisliving.ae</li>
                </ul>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 pb-[0.15rem] mt-2 md:mt-0">
                <SocialIcon type="instagram" link="https://www.instagram.com/marquisliving.ae/" />
                <SocialIcon type="youtube" link="https://www.youtube.com/@MarquisLiving" />
              </div>
           </div>

        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-[#e3e3e3] mb-6" />

        {/* Copyright */}
        <div className="text-center mb-10 md:mb-8">
          <p className="font-body text-[0.7rem] md:text-[0.75rem] text-[#a0a0a0] font-light tracking-[0.05em]">
            Copyright © 2025 - All Rights Reserved By Marquis Living.
          </p>
        </div>
      </div>

      {/* Massive MARQUIS LIVING Bottom Text */}
      <div className="w-full flex justify-center overflow-hidden">
        <Link href="/" className="hover:opacity-85 transition-opacity duration-300" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="font-display font-normal text-[14.3vw] leading-none m-0 -mb-[3.5vw] whitespace-nowrap tracking-tight text-[#111] select-none cursor-pointer">
            MARQUIS LIVING
          </h1>
        </Link>
      </div>
    </footer>
  );
};

// ── Social Icon SVG Component ──
const SocialIcon = ({ type, link }) => {
  const getIcon = () => {
    switch (type) {
      case 'instagram':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      case 'youtube':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-7 h-7 bg-[#b2000a] text-white rounded cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >
      {getIcon()}
    </a>
  );
};

export default Footer;
