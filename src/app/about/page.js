"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FloatingBubbles from '../../components/FloatingBubbles';

export default function AboutPage() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [cursorHovered, setCursorHovered] = useState(false);
  const contentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // ── 1. Responsiveness ──
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── 2. Smooth Scroll (Lenis) & GSAP ScrollTrigger ──
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
        target.closest('.manifesto-card');

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

  // ── 4. Scroll reveals for text and cards ──
  useEffect(() => {
    if (typeof window === 'undefined' || !contentRef.current) return;

    const initReveals = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Stagger list elements in the hero
        gsap.fromTo('.hero-reveal',
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
        );

        // Grid cards fade-in
        const cards = gsap.utils.toArray('.manifesto-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.manifesto-grid',
              start: 'top 75%',
            }
          }
        );

        // Quotes banner parallax fade
        gsap.fromTo('.quote-banner',
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.quote-banner',
              start: 'top 80%',
            }
          }
        );
      }, contentRef);

      return () => ctx.revert();
    };

    initReveals();
  }, []);

  // ── 5. Scroll to Top button toggle ──
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
    <main ref={contentRef} className="relative w-full overflow-x-hidden bg-[#FAF8F5]">
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

      {/* ── SECTION 1: Hero Section (Minimal 3D Monolith) ── */}
      <section 
        className="relative w-full flex flex-col md:flex-row items-center justify-center bg-[#FAF8F5] overflow-hidden"
        style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '2rem' }}
      >
        <div className="w-full md:w-1/2 h-[50vh] md:h-[70vh] flex items-center justify-center relative">
          <FloatingBubbles img1="/images/bub1.webp" img2="/images/bub2.webp" />
        </div>

        <div className="w-full md:w-1/2 px-6 md:px-16 flex flex-col justify-center text-center md:text-left">
          <span className="hero-reveal font-body text-[0.8rem] font-bold text-[#b2000a] tracking-[0.2em] uppercase mb-4 inline-block">
            Our Heritage
          </span>
          <h1 
            className="hero-reveal font-display text-[#2b2b2b] font-light leading-[1.05] tracking-tight mb-6 uppercase"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}
          >
            CRAFTERS OF<br />
            <span className="text-[#b2000a]">LUXURY</span><br />
            SPACES
          </h1>
          <p 
            className="hero-reveal font-body text-[#6b6b6b] leading-relaxed font-light mb-8 max-w-[500px] mx-auto md:mx-0"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}
          >
            Marquis Living sets the benchmark for ultra-luxury residential and commercial fit-out services in Dubai. 
            We design, build, and hand-craft environments that represent spatial poetry, meticulously blending material authenticity with architectural rigor.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: The Design Manifesto (Kinetic Cards Grid) ── */}
      <section className="w-full py-16 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12">
          
          <div className="text-center mb-16 md:mb-24">
            <span className="font-body text-[0.8rem] font-bold text-[#b2000a] tracking-[0.2em] uppercase border-b border-[#e2d8d8ff] pb-1">
              Manifesto
            </span>
            <h2 className="font-display text-[2rem] md:text-[3.5rem] text-[#2b2b2b] mt-4 uppercase">
              Our Core Pillars
            </h2>
          </div>

          <div className="manifesto-grid grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Pillar 01 */}
            <div className="manifesto-card bg-white p-8 md:p-12 rounded-[2rem] border border-[#e2d8d8ff] hover:border-[#b2000a] transition-all duration-500 shadow-sm hover:shadow-xl group">
              <h3 className="font-display text-[3.5rem] text-[#b2000a] group-hover:scale-105 transition-transform duration-300">
                01
              </h3>
              <h4 className="font-display text-[1.6rem] text-[#2b2b2b] mt-4 mb-3 uppercase">
                Uncompromising Detail
              </h4>
              <p className="font-body text-[#6b6b6b] leading-relaxed font-light text-[0.95rem]">
                From bespoke joinery lines to hidden accent lighting pockets, we believe that real luxury resides in the details that most overlook.
              </p>
            </div>

            {/* Pillar 02 */}
            <div className="manifesto-card bg-white p-8 md:p-12 rounded-[2rem] border border-[#e2d8d8ff] hover:border-[#b2000a] transition-all duration-500 shadow-sm hover:shadow-xl group">
              <h3 className="font-display text-[3.5rem] text-[#b2000a] group-hover:scale-105 transition-transform duration-300">
                02
              </h3>
              <h4 className="font-display text-[1.6rem] text-[#2b2b2b] mt-4 mb-3 uppercase">
                Material Authenticity
              </h4>
              <p className="font-body text-[#6b6b6b] leading-relaxed font-light text-[0.95rem]">
                We select materials that mature beautifully over time—Carrara Marble, Brushed Brass, and solid European Walnut wood, handled with absolute respect.
              </p>
            </div>

            {/* Pillar 03 */}
            <div className="manifesto-card bg-white p-8 md:p-12 rounded-[2rem] border border-[#e2d8d8ff] hover:border-[#b2000a] transition-all duration-500 shadow-sm hover:shadow-xl group">
              <h3 className="font-display text-[3.5rem] text-[#b2000a] group-hover:scale-105 transition-transform duration-300">
                03
              </h3>
              <h4 className="font-display text-[1.6rem] text-[#2b2b2b] mt-4 mb-3 uppercase">
                Spatial Harmony
              </h4>
              <p className="font-body text-[#6b6b6b] leading-relaxed font-light text-[0.95rem]">
                We frame voids, direct natural sun rays, and shape architectural scale to construct spaces that feel spacious, welcoming, and balanced.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 3: The Statement Quote (Minimalist & High Contrast) ── */}
      <section className="w-full bg-[#8B0012] py-24 md:py-40 text-center relative z-20">
        <div className="max-w-[1000px] w-full mx-auto px-6 quote-banner">
          <span className="font-body text-[0.8rem] font-bold text-white/70 tracking-[0.2em] uppercase mb-6 inline-block">
            Our Creed
          </span>
          <h2 className="font-display text-white font-light leading-[1.2] mb-8" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)' }}>
            "We don't build layouts.<br />
            We shape spatial <span className="text-[#FAF8F5] italic">emotions</span>."
          </h2>
          <p className="font-body text-[#a1a1aa] uppercase tracking-[0.2em] text-[0.8rem] font-semibold">
            — Marquis Living Dubai
          </p>
        </div>
      </section>

      {/* ── SECTION 4: Interactive CTA Button ── */}
      <section className="w-full py-16 md:py-28 bg-[#FAF8F5] text-center">
        <div className="max-w-xl mx-auto px-6">
          <h3 className="font-display text-[1.8rem] md:text-[2.6rem] text-[#2b2b2b] mb-8 uppercase">
            Let's Shape Your Vision
          </h3>
          
          <a
            href="/#contact"
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
            Book Consultation
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
