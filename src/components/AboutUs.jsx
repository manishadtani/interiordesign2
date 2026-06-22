"use client";

/**
 * AboutUs Component
 * Rebuilt & Enhanced with an editorial centered layout and elegant split-text scroll reveals.
 */

import React, { useEffect, useRef, useState } from 'react';

const AboutUs = () => {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  useEffect(() => {
    // Dynamic import to support client-only GSAP ScrollTrigger
    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Text reveals
        const revealElements = textContainerRef.current.querySelectorAll('.reveal-text');
        gsap.fromTo(
          revealElements,
          { y: '105%', rotate: 1 },
          {
            y: '0%',
            rotate: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        // Grid cards fade-in
        const cards = textContainerRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    };

    initGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-us"
      className="relative z-10 w-full flex items-center justify-center bg-[#FAF8F5] overflow-hidden"
      style={{
        paddingTop: isMobile ? '4rem' : '8rem',
        paddingBottom: isMobile ? '4rem' : '8rem',
      }}
    >
      <div className="max-w-[800px] w-full mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        {/* Editorial Text Block */}
        <div ref={textContainerRef} className="flex flex-col items-center justify-center text-center w-full">
          {/* Label — ABOUT US */}
          <div className="mb-6 flex justify-center">
            <div className="overflow-hidden inline-block">
              <span
                className="reveal-text inline-block font-body text-[0.80rem] font-bold text-[#b2000a] border-b border-[#e2d8d8ff] pb-1 uppercase tracking-[0.2em]"
              >
                About Us
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h2
            className="font-display text-[#2b2b2b] font-light leading-[1.1] tracking-tight mb-8 text-center"
            style={{
              fontSize: 'clamp(2.0rem, 3.8vw, 3.5rem)',
            }}
          >
            <div className="overflow-hidden block py-1">
              <span className="reveal-text block">PREMIER INTERIOR EXPERTISE,</span>
            </div>
            <div className="overflow-hidden block py-1">
              <span className="reveal-text block text-[#b2000a]">
                NOW IN DUBAI
              </span>
            </div>
          </h2>

          {/* Subtext Paragraph */}
          <div className="overflow-hidden mb-12 flex justify-center">
            <p
              className="reveal-text font-body text-[#6b6b6b] leading-relaxed font-light text-center"
              style={{
                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                maxWidth: '580px'
              }}
            >
              Bringing globally recognized design standards and meticulous structural craftsmanship to contemporary Dubai homes. We redefine living spaces to reflect pure elegance and luxury.
            </p>
          </div>

          {/* Centered Stats Grid */}
          <div className="flex justify-center gap-12 md:gap-20 border-t border-[#e2d8d8ff] pt-8 w-full max-w-[500px]">
            <div className="stat-card text-center">
              <h4 className="font-display text-4xl text-[#2b2b2b] font-light">100%</h4>
              <p className="font-body text-xs uppercase tracking-widest text-[#8b8b8b] mt-1">Bespoke Fitting</p>
            </div>
            <div className="stat-card text-center">
              <h4 className="font-display text-4xl text-[#b2000a] font-light">15+</h4>
              <p className="font-body text-xs uppercase tracking-widest text-[#8b8b8b] mt-1">Design Awards</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutUs;
