"use client";

/**
 * ProjectsCarousel Component
 * 3D Coverflow carousel — cards rotate in perspective like a circular wheel
 * Premium interior design portfolio showcase
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

const PROJECTS = [
  {
    id: 1,
    title: "Bachelor's Pad",
    location: "Dubai Marina",
    image: "/projectcarousel/BACHELOR'S PAD, MUMBAI.jpeg",
    style: "Modern Minimalist",
    scope: "FF&E Curation & Turnkey Delivery",
    year: "2025"
  },
  {
    id: 2,
    title: "Minimalist Apartment",
    location: "Downtown Dubai",
    image: "/projectcarousel/BUILDER APARTMENT, GURUGRAM.jpeg",
    style: "Warm Japandi",
    scope: "Space Planning & Styling",
    year: "2026"
  },
  {
    id: 3,
    title: "Classical Mansion",
    location: "Emirates Hills",
    image: "/projectcarousel/classical house, anand niketan.jpeg",
    style: "Neo-Classical Luxury",
    scope: "Complete Interior Design",
    year: "2026"
  },
  {
    id: 4,
    title: "Desert Oasis Villa",
    location: "Al Barari",
    image: "/projectcarousel/JAIPUR RETREAT.png",
    style: "Biophilic Organic",
    scope: "Full Architectural Interior",
    year: "2025"
  },
  {
    id: 5,
    title: "Palm Beach Villa",
    location: "Palm Jumeirah",
    image: "/projectcarousel/KAVERI HOUSE, CHENNAI.jpeg",
    style: "Contemporary Coastal",
    scope: "Curated Art & Curation",
    year: "2026"
  },
  {
    id: 6,
    title: "Jumeirah Manor",
    location: "Jumeirah Beach",
    image: "/projectcarousel/KRISHNA NIWAS, CHATTARPUR.jpeg",
    style: "Eclectic Grandeur",
    scope: "Interior Architecture",
    year: "2025"
  },
  {
    id: 7,
    title: "Lakeside Sanctuary",
    location: "Jumeirah Islands",
    image: "/projectcarousel/LAKE HOUSE, KOCHI.png",
    style: "Quiet Luxury Modern",
    scope: "Bespoke Fit-outs",
    year: "2026"
  },
  {
    id: 8,
    title: "Modern Villa",
    location: "Arabian Ranches",
    image: "/projectcarousel/MODERN HOUSE, LUCKNOW.jpeg",
    style: "Industrial Chic",
    scope: "Material Curation & Styling",
    year: "2025"
  },
  {
    id: 9,
    title: "Modern Luxury Penthouse",
    location: "Downtown Dubai",
    image: "/projectcarousel/MODERN LUXURY RESIDENCE, VASANT VIHAR.jpeg",
    style: "Ultra-Luxury Contemporary",
    scope: "Full Turnkey Curation",
    year: "2026"
  },
  {
    id: 10,
    title: "Scandinavian Holiday Home",
    location: "Jumeirah Golf Estates",
    image: "/projectcarousel/SCANDINAVIAN HOLIDAY HOME'.jpeg",
    style: "Nordic Minimalism",
    scope: "Soft Furnishings & Millwork",
    year: "2025"
  }
];

const CARD_W = 280;
const CARD_H = 420;

const ProjectsCarousel = ({ subtitle }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const splitLetters = (text) => {
    if (!text) return null;
    return text.split('').map((char, i) => (
      <span 
        key={i} 
        className="carousel-header-letter animate-letter" 
        style={{ 
          display: 'inline-block', 
          lineHeight: '1.2em', 
          transformOrigin: '0% 50%',
          perspective: '1000px',
          backfaceVisibility: 'hidden'
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const letters = gsap.utils.toArray('.carousel-header-letter');

        gsap.fromTo(letters,
          { 
            rotateY: -90,
            opacity: 0,
            scale: 0.8
          },
          { 
            rotateY: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.015,
            ease: "power2.out",
            duration: 1.0,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      return () => ctx.revert();
    };

    initGSAP();

  }, []);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const goTo = useCallback((idx) => {
    setActiveIdx(clamp(idx, 0, PROJECTS.length - 1));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(activeIdx + 1);
      if (e.key === 'ArrowLeft') goTo(activeIdx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, goTo]);

  const active = PROJECTS[activeIdx];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAF8F5] py-16 md:py-24 overflow-hidden"
    >
      {/* Background blueprint grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35 pointer-events-none z-0" />
      
      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', padding: '0 2rem' }} className="z-10 relative">
        <p style={{
          fontFamily: "'Tenor Sans', sans-serif",
          fontSize: isMobile ? '0.65rem' : '0.75rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: '#b2000a',
          fontWeight: 700,
          borderBottom: '1px solid rgba(178, 0, 10, 0.2)',
          paddingBottom: '4px',
          display: 'inline-block',
          margin: '0 0 0.5rem 0',
        }}>
          {splitLetters(subtitle || "Exhibition Gallery")}
        </p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: isMobile ? 'clamp(1.6rem, 5.5vw, 2.5rem)' : 'clamp(2.5rem, 6vw, 4rem)',
          color: '#2b2b2b',
          lineHeight: 1.05,
          marginBottom: '0.4rem',
        }}>
          {splitLetters("Curated Masterpieces")}
        </h2>
        <p style={{
          fontFamily: "'Tenor Sans', sans-serif",
          fontWeight: 300,
          fontSize: isMobile ? '0.9rem' : '1.2rem',
          color: '#6b6b6b',
          maxWidth: isMobile ? '90%' : '520px',
          lineHeight: 1.6,
          margin: '0.2rem auto 0',
        }}>
          {splitLetters("A testament to excellence. A collection of ")}
          <span style={{ color: '#b2000a', fontWeight: 500 }}>
            {splitLetters("spaces brought to life")}
          </span>
          {splitLetters(" with thoughtful detail.")}
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row gap-12 items-center z-10 relative">
        {/* Left Column: Arched Portal Frame */}
        <div className="w-full md:w-[45%] flex justify-center">
          <div className="relative w-[280px] md:w-[350px] h-[390px] md:h-[500px]">
            {/* Outer thin outline frame */}
            <div className="absolute inset-[-6px] rounded-t-full border border-[#d4c9be]/50 pointer-events-none z-20" />
            
            {/* Gold highlight accent frame */}
            <div className="absolute inset-[-3px] rounded-t-full border border-amber-600/15 pointer-events-none z-20" />

            {/* The primary white arch */}
            <div className="w-full h-full rounded-t-full border-[6px] border-white shadow-xl overflow-hidden relative bg-[#FAF8F5] z-10">
              {PROJECTS.map((project, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <div
                    key={project.id}
                    className="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scale(1.03)' : 'scale(1.12)',
                      zIndex: isActive ? 10 : 0,
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    {/* Faint black overlay inside portal for rich depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b2b2b]/40 via-transparent to-transparent opacity-85 pointer-events-none" />
                  </div>
                );
              })}

              {/* Blueprint overlay curves on top of image */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-20" viewBox="0 0 100 150">
                <path d="M 10 60 A 40 40 0 0 1 90 60" stroke="#b2000a" strokeWidth="0.4" strokeDasharray="1.2,1.2" fill="none" />
                <line x1="50" y1="20" x2="50" y2="60" stroke="rgba(43,43,43,0.3)" strokeWidth="0.3" strokeDasharray="1,1" />
                <text x="50" y="16" className="font-mono text-[3px]" fill="#b2000a" textAnchor="middle">RAD = 1.80m</text>
                <text x="12" y="65" className="font-mono text-[2.5px]" fill="rgba(43,43,43,0.5)">PORTAL A-12</text>
                <text x="88" y="65" className="font-mono text-[2.5px]" fill="rgba(43,43,43,0.5)" textAnchor="end">GRID X-08</text>
              </svg>
            </div>
            
            {/* Museum Exhibit Label underneath the arch */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#b2000a] text-white text-[8px] font-mono tracking-[0.2em] px-2.5 py-1 uppercase rounded-sm z-30 shadow-md">
              EXHIBIT #0{(activeIdx + 1)}
            </div>
          </div>
        </div>

        {/* Right Column: Accordion List */}
        <div className="w-full md:w-[55%] flex flex-col gap-1 w-full text-left">
          {PROJECTS.map((project, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={project.id}
                onClick={() => goTo(idx)}
                onMouseEnter={() => goTo(idx)}
                className={`border-b border-[#d4c9be]/30 py-3 md:py-4 transition-all duration-300 cursor-pointer ${
                  isActive ? 'border-[#b2000a]/40' : 'hover:border-[#2b2b2b]/35'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-xs md:text-sm font-bold tracking-widest transition-colors duration-300 ${
                      isActive ? 'text-[#b2000a]' : 'text-[#2b2b2b]/40'
                    }`}>
                      {project.id.toString().padStart(2, '0')}
                    </span>
                    <h3 className={`font-cormorant text-base md:text-lg tracking-wide uppercase transition-colors duration-300 ${
                      isActive ? 'text-[#2b2b2b]' : 'text-[#2b2b2b]/55'
                    }`}>
                      {project.title}
                    </h3>
                  </div>
                  {/* Arrow Indicator */}
                  <span className={`font-mono text-[#b2000a] text-sm font-bold transition-transform duration-300 ${
                    isActive ? 'translate-x-0 rotate-90' : '-translate-x-2 opacity-0'
                  }`}>
                    →
                  </span>
                </div>

                {/* Details Accordion Content */}
                <div
                  className="transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: isActive ? '180px' : '0px',
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                  }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 pl-8 text-left">
                    {/* Style & Year */}
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-[#b2000a]/75 tracking-wider uppercase mb-0.5">Style / Year</span>
                      <span className="font-tenor text-xs text-[#2b2b2b] font-medium uppercase">{project.style} ({project.year})</span>
                    </div>
                    {/* Location */}
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-[#b2000a]/75 tracking-wider uppercase mb-0.5">Location</span>
                      <span className="font-tenor text-xs text-[#2b2b2b] font-medium">📍 {project.location}</span>
                    </div>
                    {/* Scope / Work */}
                    <div className="flex flex-col col-span-2 md:col-span-1">
                      <span className="text-[8px] font-mono text-[#b2000a]/75 tracking-wider uppercase mb-0.5">Scope</span>
                      <span className="font-tenor text-[11px] text-[#555] font-light leading-snug">{project.scope}</span>
                    </div>

                    {/* CTA Details Button */}
                    <div className="col-span-2 md:col-span-3 pt-2">
                      <a
                        href={`/projects#${project.id}`}
                        className="font-tenor relative overflow-hidden group inline-flex items-center gap-1.5 text-white bg-[#2b2b2b] hover:text-white text-[9px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full transition-colors duration-300 shadow-sm cursor-pointer"
                      >
                        <span className="absolute inset-0 w-full h-full bg-[#b2000a] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                        <span className="relative z-10 flex items-center gap-1.5">
                          Examine Project
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsCarousel;
