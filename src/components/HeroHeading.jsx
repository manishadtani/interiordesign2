"use client";

import React, { useEffect, useRef, useState } from 'react';

const HeroHeading = () => {
  const componentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !componentRef.current) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(componentRef.current, {
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "100vh top",
          scrub: true,
        },
        opacity: 0,
        y: -100,
        ease: "none"
      });
    };

    initGSAP();

  }, []);

  return (
    <div
      ref={componentRef}
      className="fixed inset-0 w-full h-screen flex flex-col items-center justify-between z-10"
      style={{
        pointerEvents: 'none',
        marginTop: '4vh',
        paddingTop: '5vh',
        paddingBottom: '8vh',
        background: 'transparent'
      }}
    >
      {/* Bottom Right Button (Decorative Scroll Indicator) */}
      <div 
        className="absolute bottom-[9vh] right-[4vw] md:right-[5vw] hidden md:block"
        style={{ pointerEvents: 'auto', zIndex: 50 }}
      >
        <button 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
          className="group w-10 h-10 md:w-12 md:h-12 border border-[#c4c4c4] rounded-full flex items-center justify-center hover:bg-[#b2000a] hover:border-[#b2000a] hover:text-white transition-all duration-300 shadow bg-white/80 backdrop-blur"
          aria-label="Scroll downward arrow"
        >
          <svg className="group-hover:stroke-white transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </button>
      </div>

      {/* Main Heading Group */}
      <div className="w-full flex flex-col items-center pointer-events-none mt-4 text-center px-4">
        <h1
          className="font-display"
          style={{
            fontWeight: 400,
            fontSize: isMobile ? 'clamp(2.2rem, 8vw, 4rem)' : 'clamp(4.5rem, 7.5vw, 7.5rem)',
            lineHeight: 1.05,
            color: '#2b2b2b',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '-0.02em'
          }}
        >
          CREATE
        </h1>
        <h1
          className="font-display"
          style={{
            fontWeight: 400,
            fontSize: isMobile ? 'clamp(2.2rem, 8vw, 4rem)' : 'clamp(4.5rem, 7.5vw, 7.5rem)',
            lineHeight: 1.05,
            color: '#2b2b2b',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '-0.02em',
            whiteSpace: isMobile ? 'normal' : 'nowrap'
          }}
        >
          YOUR <span style={{ color: '#b2000a' }}>DREAM</span> SPACE
        </h1>
      </div>

      {/* Bottom Content Area */}
      <div className="flex flex-col items-center w-full pointer-events-none relative px-4">
        <p
          className="text-center mx-auto font-body"
          style={{
            fontSize: isMobile ? '0.95rem' : '1.2rem',
            lineHeight: 1.5,
            color: '#6b6b6b',
            maxWidth: isMobile ? '90%' : '520px',
            marginBottom: '2.5rem',
            fontWeight: 400,
          }}
        >
          Crafted interiors that turn spaces into homes that feel yours unmistakably.
        </p>

        <button
          style={{
            pointerEvents: 'auto',
            backgroundColor: '#b2000a',
            color: '#fff',
            fontFamily: "'Tenor Sans', sans-serif",
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            padding: '1.2rem 3rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          className="hover:scale-105 hover:brightness-110 active:scale-95 shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              const startY = contactSection.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({ top: startY, behavior: 'auto' });
              
              setTimeout(() => {
                window.scrollTo({ 
                  top: startY + (window.innerHeight * 0.8),
                  behavior: 'smooth' 
                });
              }, 50);
            }
          }}
        >
          BOOK A CONSULTATION TODAY
        </button>
      </div>
    </div>
  );
};

export default HeroHeading;
