"use client";

import React, { useEffect, useRef, useState } from 'react';

const CinematicHero = () => {
  const containerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // ── Card Reveal Scroll Trigger ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            pin: !isMobile,
            anticipatePin: 1
          }
        });

        // Animate image wrapper (scale down + round corners)
        tl.fromTo(imageWrapperRef.current,
          { 
            scale: 1, 
            borderRadius: '0rem',
            width: '100%',
            height: '100vh'
          },
          { 
            scale: isMobile ? 0.90 : 0.88, 
            borderRadius: '2.5rem',
            width: isMobile ? '92%' : '88%',
            height: '82vh',
            ease: 'power1.inOut'
          }
        );

        // Fade & scale out typographic overlay
        tl.to(textRef.current, {
          opacity: 0,
          scale: 1.08,
          y: -30,
          ease: 'power1.out'
        }, 0); // start at the same time

        // Entrance Reveal on load
        gsap.fromTo('.cinematic-reveal',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.4, stagger: 0.12, ease: 'power4.out', delay: 0.4 }
        );
      }, containerRef);

      return () => ctx.revert();
    };

    initGSAP();

  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#FAF8F5] flex items-center justify-center"
      style={{ height: '100vh', marginTop: '-1px' }}
    >
      {/* ── IMAGE WRAPPER (Scales down into a rounded card) ── */}
      <div
        ref={imageWrapperRef}
        className="relative overflow-hidden shadow-2xl transition-all duration-750 ease-out origin-center"
        style={{
          width: '100%',
          height: '100vh',
          willChange: 'transform, border-radius, width, height'
        }}
      >
        <img
          src="/projectcarousel/KRISHNA NIWAS, CHATTARPUR.jpeg"
          alt="Luxury Architecture & Fit-Out"
          className="w-full h-full object-cover filter brightness-[0.68]"
        />
        
        {/* Soft dark radial vignette overlay */}
        <div className="absolute inset-0 bg-radial-vignette bg-black/25 pointer-events-none" />
      </div>

      {/* ── TYPOGRAPHY OVERLAY (Fades/scales out on scroll) ── */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none px-6"
        style={{ willChange: 'transform, opacity' }}
      >
        <span
          className="cinematic-reveal font-urbanist text-[0.8rem] md:text-[0.9rem] font-bold text-[#FAF8F5] tracking-[0.25em] uppercase mb-4 md:mb-6"
          style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        >
          Marquis Living Dubai
        </span>

        <h1
          className="cinematic-reveal font-lacroom text-[#FAF8F5] font-light leading-[1.05] tracking-tight mb-8 uppercase"
          style={{
            fontSize: 'clamp(2.5rem, 6.5vw, 5.8rem)',
            textShadow: '0 10px 30px rgba(0,0,0,0.45)'
          }}
        >
          SHAPING / SPATIAL / <br />
          <span className="text-white">POETRY</span>
        </h1>

        <p
          className="cinematic-reveal font-urbanist text-[#e2d8d8] font-light leading-relaxed max-w-[520px]"
          style={{
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
            textShadow: '0 2px 8px rgba(0,0,0,0.35)'
          }}
        >
          Translating structural precision into ultra-luxury residential fit-outs and bespoke curations.
        </p>

        {/* Scroll Indicator Icon */}
        <div className="cinematic-reveal absolute bottom-12 flex flex-col items-center gap-2">
          <span className="font-urbanist text-[0.65rem] tracking-[0.2em] text-[#e2d8d8]/80 uppercase">
            Scroll to explore
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#e2d8d8]/80 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default CinematicHero;
