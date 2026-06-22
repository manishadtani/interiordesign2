"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FloatingBubbles from '../../components/FloatingBubbles';

export default function ServicesPage() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [cursorHovered, setCursorHovered] = useState(false);
  const pageRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // ── 3. Custom Liquid Cursor ──
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
        target.closest('a') ||
        target.closest('.service-detail-card');

      setCursorHovered((prev) => {
        const next = !!isInteractive;
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

  // ── 4. Scroll reveals ──
  useEffect(() => {
    if (typeof window === 'undefined' || !pageRef.current) return;

    const initReveals = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Hero reveals
        gsap.fromTo('.hero-reveal-el',
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
        );

        // Service detail cards stagger
        gsap.fromTo('.service-detail-card',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.services-grid',
              start: 'top 75%',
            }
          }
        );

        // Process step staggers
        gsap.fromTo('.process-step',
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.25,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.process-timeline',
              start: 'top 70%',
            }
          }
        );
      }, pageRef);

      return () => ctx.revert();
    };

    initReveals();
  }, []);

  // ── 5. Scroll to Top button ──
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

  return (
    <main ref={pageRef} className="relative w-full overflow-x-hidden bg-[#FAF8F5]">
      {/* Custom Liquid Cursor */}
      <div 
        ref={cursorRef} 
        className={`custom-cursor hidden md:block ${cursorHovered ? 'hovered' : ''}`} 
        style={{ transform: 'translate(-50%, -50%)', transition: 'width 0.2s, height 0.2s, background-color 0.2s' }}
      />
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

      {/* ── SECTION 1: Services Hero (3D Canvas + Headline) ── */}
      <section 
        className="relative w-full flex flex-col md:flex-row items-center justify-center bg-[#FAF8F5] overflow-hidden"
        style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '2rem' }}
      >
        <div className="w-full md:w-1/2 h-[50vh] md:h-[70vh] flex items-center justify-center relative">
          <FloatingBubbles img1="/images/bub3.webp" img2="/images/bub4.webp" />
        </div>

        <div className="w-full md:w-1/2 px-6 md:px-16 flex flex-col justify-center text-center md:text-left">
          <span className="hero-reveal-el font-body text-[0.8rem] font-bold text-[#b2000a] tracking-[0.2em] uppercase mb-4 inline-block">
            What We Do
          </span>
          <h1 
            className="hero-reveal-el font-display text-[#2b2b2b] font-light leading-[1.05] tracking-tight mb-6 uppercase"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}
          >
            SERVICES &<br />
            <span className="text-[#b2000a]">CAPABILITIES</span>
          </h1>
          <p 
            className="hero-reveal-el font-body text-[#6b6b6b] leading-relaxed font-light mb-8 max-w-[500px] mx-auto md:mx-0"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}
          >
            Providing end-to-end interior design and fit-out execution in Dubai. 
            We transition abstract concepts into premium residential landmarks, handled with structural precision.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: Capabilities Breakdown (Hover Cards Grid) ── */}
      <section className="w-full py-16 md:py-32 bg-white border-t border-[#e2d8d8ff]">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12">
          
          <div className="text-center mb-16 md:mb-24">
            <span className="font-body text-[0.8rem] font-bold text-[#b2000a] tracking-[0.2em] uppercase border-b border-[#e2d8d8ff] pb-1">
              Expertise
            </span>
            <h2 className="font-display text-[2rem] md:text-[3.5rem] text-[#2b2b2b] mt-4 uppercase">
              Our Capabilities
            </h2>
          </div>

          <div className="services-grid grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Capability 01 */}
            <div className="service-detail-card bg-[#FAF8F5] p-8 md:p-12 rounded-[2rem] border border-[#e2d8d8ff] hover:border-[#b2000a] transition-all duration-500 shadow-sm hover:shadow-xl group relative overflow-hidden">
              <span className="font-display text-[3.5rem] text-[#b2000a]/20 group-hover:text-[#b2000a] transition-colors duration-300">
                01
              </span>
              <h3 className="font-display text-[1.5rem] text-[#2b2b2b] mt-4 mb-4 uppercase">
                Spatial Architecture
              </h3>
              <p className="font-body text-[#6b6b6b] leading-relaxed font-light text-[0.95rem] mb-6">
                Creating optimized blueprints, space allocations, and wall structures to direct flow and maximize volume.
              </p>
              <ul className="font-body text-xs text-[#8b8b8b] flex flex-col gap-2 border-t border-[#e2d8d8ff] pt-4">
                <li>✦ Space Planning & Layout Drafts</li>
                <li>✦ 3D Rendering & Visualizations</li>
                <li>✦ Structural Wall Modifications</li>
              </ul>
            </div>

            {/* Capability 02 */}
            <div className="service-detail-card bg-[#FAF8F5] p-8 md:p-12 rounded-[2rem] border border-[#e2d8d8ff] hover:border-[#b2000a] transition-all duration-500 shadow-sm hover:shadow-xl group relative overflow-hidden">
              <span className="font-display text-[3.5rem] text-[#b2000a]/20 group-hover:text-[#b2000a] transition-colors duration-300">
                02
              </span>
              <h3 className="font-display text-[1.5rem] text-[#2b2b2b] mt-4 mb-4 uppercase">
                Interior Curation
              </h3>
              <p className="font-body text-[#6b6b6b] leading-relaxed font-light text-[0.95rem] mb-6">
                Sourcing genuine construction assets—Italian marble slabs, bespoke walnut joinery fittings, and custom luxury textiles.
              </p>
              <ul className="font-body text-xs text-[#8b8b8b] flex flex-col gap-2 border-t border-[#e2d8d8ff] pt-4">
                <li>✦ High-end Material Selection</li>
                <li>✦ Custom Furniture & Lighting sourcing</li>
                <li>✦ Color Coordination & Styling</li>
              </ul>
            </div>

            {/* Capability 03 */}
            <div className="service-detail-card bg-[#FAF8F5] p-8 md:p-12 rounded-[2rem] border border-[#e2d8d8ff] hover:border-[#b2000a] transition-all duration-500 shadow-sm hover:shadow-xl group relative overflow-hidden">
              <span className="font-display text-[3.5rem] text-[#b2000a]/20 group-hover:text-[#b2000a] transition-colors duration-300">
                03
              </span>
              <h3 className="font-display text-[1.5rem] text-[#2b2b2b] mt-4 mb-4 uppercase">
                Turnkey Fit-Out
              </h3>
              <p className="font-body text-[#6b6b6b] leading-relaxed font-light text-[0.95rem] mb-6">
                Managing complete construction, MEP (mechanical/electrical/plumbing), HVAC work, and municipality clearances.
              </p>
              <ul className="font-body text-xs text-[#8b8b8b] flex flex-col gap-2 border-t border-[#e2d8d8ff] pt-4">
                <li>✦ Civil Construction & MEP Works</li>
                <li>✦ Government Authority Approvals</li>
                <li>✦ Project Handover & Styling Setup</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 3: Execution Timeline ("Our Process") ── */}
      <section className="w-full py-16 md:py-32 bg-[#FAF8F5] border-t border-[#e2d8d8ff]">
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12">
          
          <div className="text-center mb-16 md:mb-24">
            <span className="font-body text-[0.8rem] font-bold text-[#b2000a] tracking-[0.2em] uppercase border-b border-[#e2d8d8ff] pb-1">
              Methodology
            </span>
            <h2 className="font-display text-[2rem] md:text-[3.5rem] text-[#2b2b2b] mt-4 uppercase">
              Our Process
            </h2>
          </div>

          <div className="process-timeline flex flex-col gap-12 relative pl-8 md:pl-16 border-l border-[#e2d8d8ff]">
            
            {/* Step 01 */}
            <div className="process-step relative">
              <div className="absolute left-[-41px] md:left-[-73px] top-0 w-5 h-5 rounded-full bg-[#b2000a] border-4 border-[#FAF8F5]" />
              <span className="font-display text-2xl text-[#b2000a]">01</span>
              <h4 className="font-display text-xl text-[#2b2b2b] mt-2 mb-2 uppercase">Concept & Design Direction</h4>
              <p className="font-body text-sm text-[#6b6b6b] leading-relaxed max-w-xl font-light">
                We sit down to understand your needs, curate a mood board, and draft spatial layouts to establish design direction.
              </p>
            </div>

            {/* Step 02 */}
            <div className="process-step relative">
              <div className="absolute left-[-41px] md:left-[-73px] top-0 w-5 h-5 rounded-full bg-[#b2000a] border-4 border-[#FAF8F5]" />
              <span className="font-display text-2xl text-[#b2000a]">02</span>
              <h4 className="font-display text-xl text-[#2b2b2b] mt-2 mb-2 uppercase">3D Visualization & Curation</h4>
              <p className="font-body text-sm text-[#6b6b6b] leading-relaxed max-w-xl font-light">
                Converting drafts into high-resolution 3D renders. We select exact textures, stones, and wood samples with you.
              </p>
            </div>

            {/* Step 03 */}
            <div className="process-step relative">
              <div className="absolute left-[-41px] md:left-[-73px] top-0 w-5 h-5 rounded-full bg-[#b2000a] border-4 border-[#FAF8F5]" />
              <span className="font-display text-2xl text-[#b2000a]">03</span>
              <h4 className="font-display text-xl text-[#2b2b2b] mt-2 mb-2 uppercase">Execution & Handover</h4>
              <p className="font-body text-sm text-[#6b6b6b] leading-relaxed max-w-xl font-light">
                Our site engineers handle construction, authority approvals, and joinery fittings to ensure a seamless handover.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 4: Dubai Approvals & Compliance ── */}
      <section className="w-full py-16 md:py-28 bg-[#8B0012] text-white relative z-20">
        <div className="max-w-[1000px] w-full mx-auto px-6 text-center">
          <span className="font-body text-[0.8rem] font-bold text-white/70 tracking-[0.2em] uppercase mb-6 inline-block">
            Compliance
          </span>
          <h2 className="font-display text-white text-[2rem] md:text-[3.2rem] mb-6 uppercase">
            Dubai Authority Approvals
          </h2>
          <p className="font-body text-[#a1a1aa] leading-relaxed font-light mb-12 max-w-xl mx-auto text-sm">
            We handle complete compliance, drawing submissions, and approvals with all major Dubai construction and development authorities to guarantee civil security.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-body text-xs tracking-wider text-[#a1a1aa] font-semibold uppercase">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">Dubai Municipality</div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">Civil Defence</div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">DEWA</div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">Trakhees / Nakheel</div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Start a Project CTA ── */}
      <section className="w-full py-16 md:py-28 bg-[#FAF8F5] text-center">
        <div className="max-w-xl mx-auto px-6">
          <h3 className="font-display text-[1.8rem] md:text-[2.6rem] text-[#2b2b2b] mb-8 uppercase">
            Start Your Fit-Out Study
          </h3>
          
          <a
            href="/contact"
            style={{
              padding: '1.2rem 3.5rem',
              backgroundColor: '#b2000a',
              color: '#FFFFFF',
              borderRadius: '50px',
              border: 'none',
              fontFamily: "'Tenor Sans', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(178, 0, 10, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            className="hover:scale-105 active:scale-95 hover:bg-[#C7000B] hover:shadow-2xl"
          >
            Start A Project
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
