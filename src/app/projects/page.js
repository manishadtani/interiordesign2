"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PROJECTS_DATA = [
  {
    id: 1,
    title: "Bachelor's Pad",
    location: "Dubai Marina",
    image: "/projectcarousel/BACHELOR'S PAD, MUMBAI.jpeg",
    category: "Apartments",
    desc: "A sleek, masculine space balancing dark slate textures with polished brass accents for urban living.",
    area: "1,800 Sq. Ft.",
    year: "2024",
    type: "Bespoke Fit-Out"
  },
  {
    id: 2,
    title: "Minimalist Apartment",
    location: "Downtown Dubai",
    image: "/projectcarousel/BUILDER APARTMENT, GURUGRAM.jpeg",
    category: "Apartments",
    desc: "Clean geometry, seamless walnut joinery, and concealed lighting defining modern functionalism.",
    area: "2,400 Sq. Ft.",
    year: "2024",
    type: "Turnkey Styling"
  },
  {
    id: 3,
    title: "Classical Mansion",
    location: "Emirates Hills",
    image: "/projectcarousel/classical house, anand niketan.jpeg",
    category: "Villas",
    desc: "An architectural marvel featuring Italian stucco walls, grand archways, and double-height ceiling voids.",
    area: "12,500 Sq. Ft.",
    year: "2023",
    type: "Civil & Interior Architecture"
  },
  {
    id: 4,
    title: "Desert Oasis Villa",
    location: "Al Barari",
    image: "/projectcarousel/JAIPUR RETREAT.png",
    category: "Villas",
    desc: "Biophilic architectural layout blending stone textures with inner courtyards and skylights.",
    area: "8,200 Sq. Ft.",
    year: "2025",
    type: "Bespoke Design & Fit-Out"
  },
  {
    id: 5,
    title: "Palm Beach Villa",
    location: "Palm Jumeirah",
    image: "/projectcarousel/KAVERI HOUSE, CHENNAI.jpeg",
    category: "Villas",
    desc: "Oceanfront luxury featuring floor-to-ceiling glass paneling, open floor flow, and light oak fittings.",
    area: "9,500 Sq. Ft.",
    year: "2023",
    type: "Interior Styling"
  },
  {
    id: 6,
    title: "Jumeirah Manor",
    location: "Jumeirah Beach",
    image: "/projectcarousel/KRISHNA NIWAS, CHATTARPUR.jpeg",
    category: "Villas",
    desc: "A blend of traditional architectural scale and contemporary styling details for luxury family life.",
    area: "11,000 Sq. Ft.",
    year: "2024",
    type: "Turnkey Fit-Out"
  },
  {
    id: 7,
    title: "Lakeside Sanctuary",
    location: "Jumeirah Islands",
    image: "/projectcarousel/LAKE HOUSE, KOCHI.png",
    category: "Villas",
    desc: "A serene residence showcasing organic plaster finishes, custom linen textiles, and panoramic views.",
    area: "7,000 Sq. Ft.",
    year: "2025",
    type: "Interior Renovation"
  },
  {
    id: 8,
    title: "Modern Villa",
    location: "Arabian Ranches",
    image: "/projectcarousel/MODERN HOUSE, LUCKNOW.jpeg",
    category: "Villas",
    desc: "Crisp architectural volume, exposed raw concrete accents, and an open layout tailored for luxury entertainment.",
    area: "6,800 Sq. Ft.",
    year: "2024",
    type: "Architecture & Styling"
  },
  {
    id: 9,
    title: "Modern Luxury Penthouse",
    location: "Downtown Dubai",
    image: "/projectcarousel/MODERN LUXURY RESIDENCE, VASANT VIHAR.jpeg",
    category: "Penthouses",
    desc: "Opulent sky residence styled with bookmatched marble panels, plush velvet seating, and custom gold fixtures.",
    area: "4,500 Sq. Ft.",
    year: "2023",
    type: "Full Turnkey Execution"
  },
  {
    id: 10,
    title: "Scandinavian Holiday Home",
    location: "Jumeirah Golf Estates",
    image: "/projectcarousel/SCANDINAVIAN HOLIDAY HOME'.jpeg",
    category: "Apartments",
    desc: "Minimalist Scandinavian design focusing on light wood veneers, warm beige tones, and high-performance ergonomics.",
    area: "3,200 Sq. Ft.",
    year: "2024",
    type: "Styling & FF&E"
  }
];

const CATEGORIES = ["ALL", "VILLAS", "PENTHOUSES", "APARTMENTS"];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Custom cursor states
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [cursorHovered, setCursorHovered] = useState(false);
  const [cursorCardHovered, setCursorCardHovered] = useState(false);

  const pageRef = useRef(null);

  // ── 1. Responsiveness ──
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── 2. Smooth Scroll (Lenis) ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initLenis = async () => {
      const LenisModule = await import('lenis');
      const Lenis = LenisModule.default || LenisModule;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      lenis.on('scroll', ScrollTrigger.update);

      return () => {
        lenis.destroy();
      };
    };

    initLenis();
  }, []);

  // ── 3. Custom Liquid Cursor with VIEW prompt ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e) => {
      if (cursorRef.current && dotRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a');

      const isCard = target.closest('.project-grid-card');

      setCursorHovered((prev) => {
        const next = !!isInteractive || !!isCard;
        return prev === next ? prev : next;
      });

      setCursorCardHovered((prev) => {
        const next = !!isCard && !isInteractive;
        return prev === next ? prev : next;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // ── 4. Scroll reveals & Filter Animations ──
  useEffect(() => {
    if (typeof window === 'undefined' || !pageRef.current) return;

    const initReveals = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Hero texts
        gsap.fromTo('.project-hero-reveal',
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
        );

        // Filter buttons
        gsap.fromTo('.filter-btn',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.4 }
        );

        // Initial cards reveal
        gsap.fromTo('.project-grid-card',
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.projects-grid-section',
              start: 'top 85%',
            }
          }
        );
      }, pageRef);

      return () => ctx.revert();
    };

    initReveals();
  }, []);

  // ── 5. Trigger transition animation on category switch ──
  useEffect(() => {
    const animateGrid = async () => {
      const { gsap } = await import('gsap');
      gsap.fromTo('.project-grid-card',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      );
    };
    animateGrid();
  }, [activeCategory]);

  // ── 6. Scroll to Top button ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (window.scrollY > 800) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter projects
  const filteredProjects = activeCategory === "ALL" 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category.toUpperCase() === activeCategory);

  return (
    <main ref={pageRef} className="relative w-full overflow-x-hidden bg-[#FAF8F5]">
      {/* Custom Liquid Cursor */}
      <div 
        ref={cursorRef} 
        className={`custom-cursor hidden md:flex items-center justify-center ${cursorHovered ? 'hovered' : ''}`} 
        style={{ transform: 'translate(-50%, -50%)', transition: 'width 0.2s, height 0.2s, background-color 0.2s' }}
      >
        <span 
          className="font-body text-[8px] font-extrabold text-[#b2000a] tracking-widest transition-opacity duration-200"
          style={{ opacity: cursorCardHovered ? 1 : 0 }}
        >
          VIEW
        </span>
      </div>
      <div 
        ref={dotRef} 
        className="custom-cursor-dot hidden md:block" 
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Scroll To Top Button */}
      {showScrollButton && (
        <div className="fixed bottom-8 right-8 md:bottom-10 md:right-10 z-50 animate-bounce">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 md:w-12 md:h-12 border border-[#c4c4c4] rounded-full flex items-center justify-center hover:bg-[#b2000a] hover:border-[#b2000a] hover:text-white transition-all duration-300 shadow bg-white"
            aria-label="Scroll to top"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Hero Intro */}
      <section 
        className="w-full flex flex-col justify-center items-center text-center px-6 bg-[#FAF8F5]"
        style={{ minHeight: '65vh', paddingTop: '160px', paddingBottom: '3rem' }}
      >
        <span className="project-hero-reveal font-body text-[0.8rem] font-bold text-[#b2000a] tracking-[0.2em] uppercase mb-4 inline-block">
          Selected Portfolio
        </span>
        <h1 
          className="project-hero-reveal font-display text-[#2b2b2b] font-light leading-[1.05] tracking-tight mb-6 uppercase"
          style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.8rem)' }}
        >
          ARCHITECTURAL<br />
          <span className="text-[#b2000a]">LEGACIES</span>
        </h1>
        <p 
          className="project-hero-reveal font-body text-[#6b6b6b] leading-relaxed font-light max-w-[600px] mx-auto mb-10"
          style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)' }}
        >
          A curation of our finest residential fit-outs, luxury penthouses, and bespoke villas across Dubai's most prestigious districts.
        </p>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-2xl mt-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="filter-btn font-body text-xs tracking-wider uppercase font-semibold border rounded-full transition-all duration-300"
              style={{
                padding: '0.6rem 1.8rem',
                backgroundColor: activeCategory === cat ? '#b2000a' : 'transparent',
                borderColor: activeCategory === cat ? '#b2000a' : '#c8bfb5',
                color: activeCategory === cat ? '#ffffff' : '#2b2b2b',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Staggered Portfolio Grid */}
      <section className="projects-grid-section w-full pb-32 bg-white border-t border-[#e2d8d8ff]">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {filteredProjects.map((project, idx) => {
              // Apply odd column margin offset to create a staggered, high-end editorial layout
              const offsetStyle = !isMobile && idx % 2 === 1 ? { marginTop: '80px' } : {};

              return (
                <div 
                  key={project.id}
                  className="project-grid-card group relative cursor-pointer"
                  style={{ ...offsetStyle }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Image wrapper */}
                  <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#e2d8d8ff] relative shadow-sm group-hover:shadow-2xl transition-all duration-750">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform scale-102 group-hover:scale-106 transition-transform duration-750 ease-out"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating Info on Hover */}
                    <div className="absolute bottom-8 left-8 right-8 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex justify-between items-end">
                      <div>
                        <span className="font-body text-[0.65rem] tracking-[0.2em] font-semibold text-[#b2000a] bg-white/95 px-3 py-1 rounded-full uppercase mb-2 inline-block">
                          {project.category}
                        </span>
                        <h3 className="font-display text-xl leading-snug">{project.title}</h3>
                      </div>
                      <span className="font-body text-xs tracking-wider text-white/80">
                        📍 {project.location}
                      </span>
                    </div>
                  </div>

                  {/* Standard Static Info beneath (Visible when not hovered or on mobile) */}
                  <div className="mt-6 flex justify-between items-start px-2 group-hover:opacity-50 transition-opacity duration-300">
                    <div>
                      <h3 className="font-display text-lg text-[#2b2b2b] uppercase tracking-wide">{project.title}</h3>
                      <p className="font-body text-xs text-[#8b8b8b] mt-1">📍 {project.location}</p>
                    </div>
                    <span className="font-body text-[0.7rem] uppercase tracking-wider text-[#b2000a] font-bold border-b border-transparent group-hover:border-[#b2000a] transition-all">
                      Explore Design →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-24">
              <p className="font-body text-sm text-[#8b8b8b]">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-[#FAF8F5] w-full max-w-[900px] max-h-[90vh] rounded-[2.5rem] overflow-y-auto border border-[#e2d8d8ff] shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white border border-[#c4c4c4] hover:bg-[#b2000a] hover:border-[#b2000a] hover:text-white rounded-full flex items-center justify-center transition-all duration-300 z-50 shadow-md cursor-pointer"
              aria-label="Close details"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Modal Image */}
            <div className="w-full h-[40vh] md:h-[45vh] relative overflow-hidden">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-8 text-white">
                <span className="font-body text-[0.65rem] tracking-[0.2em] font-semibold text-white bg-[#b2000a] px-3.5 py-1.5 rounded-full uppercase mb-2 inline-block">
                  {selectedProject.category}
                </span>
                <h2 className="font-display text-2xl md:text-3xl leading-snug uppercase">{selectedProject.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="w-full md:w-3/5">
                <h4 className="font-body font-bold text-xs uppercase tracking-wider text-[#b2000a] mb-3">Project Narrative</h4>
                <p className="font-body text-[#6b6b6b] leading-relaxed font-light text-sm md:text-base">
                  {selectedProject.desc}
                </p>
              </div>

              {/* Specifications Column */}
              <div className="w-full md:w-2/5 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-[#e2d8d8ff] pt-6 md:pt-0 md:pl-8">
                <div>
                  <h5 className="font-body font-bold text-[0.65rem] uppercase tracking-wider text-[#8b8b8b]">Location</h5>
                  <p className="font-body text-sm font-semibold text-[#2b2b2b] mt-0.5">{selectedProject.location}</p>
                </div>
                <div>
                  <h5 className="font-body font-bold text-[0.65rem] uppercase tracking-wider text-[#8b8b8b]">Service Scope</h5>
                  <p className="font-body text-sm font-semibold text-[#2b2b2b] mt-0.5">{selectedProject.type}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-body font-bold text-[0.65rem] uppercase tracking-wider text-[#8b8b8b]">Area</h5>
                    <p className="font-body text-sm font-semibold text-[#2b2b2b] mt-0.5">{selectedProject.area}</p>
                  </div>
                  <div>
                    <h5 className="font-body font-bold text-[0.65rem] uppercase tracking-wider text-[#8b8b8b]">Completed</h5>
                    <p className="font-body text-sm font-semibold text-[#2b2b2b] mt-0.5">{selectedProject.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="px-8 pb-8 md:px-12 md:pb-12 text-center md:text-left border-t border-[#e2d8d8ff] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="font-body text-xs text-[#8b8b8b]">Interested in similar bespoke setups?</span>
              <Link 
                href="/contact"
                className="font-body text-xs uppercase font-bold text-white bg-[#b2000a] hover:bg-[#C7000B] px-6 py-3 rounded-full transition-colors tracking-wider"
              >
                Inquire For Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
