"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const navRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const HIDE_THRESHOLD = 80;

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        setScrolled(currentY > 20);

        if (currentY > HIDE_THRESHOLD) {
          if (currentY > lastScrollY.current) {
            setNavVisible(false); // Scrolling down
          } else {
            setNavVisible(true); // Scrolling up
          }
        } else {
          setNavVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      gsap.to(navRef.current, {
        y: navVisible ? 0 : '-110%',
        duration: navVisible ? 0.5 : 0.35,
        ease: navVisible ? 'power3.out' : 'power3.in',
      });
    };
    initGSAP();
  }, [navVisible]);

  // logoTheme and scroll triggers removed for simplified text color logic

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1.2rem 8vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        willChange: 'transform',
        background: scrolled
          ? 'rgba(10, 10, 10, 0.7)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        transition: 'background 0.5s ease, backdrop-filter 0.5s ease',
      }}
    >
      {/* Logo */}
      <div style={{ pointerEvents: 'auto' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span
            className="font-display tracking-[0.06em] select-none"
            style={{
              fontSize: isMobile ? '1.1rem' : '1.5rem',
              fontWeight: 400,
              color: isHomePage || scrolled ? '#ffffff' : '#2b2b2b',
              transition: 'color 0.4s ease',
            }}
          >
            MARQUIS LIVING
          </span>
        </Link>
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex items-center gap-8 font-body text-[0.78rem] tracking-[0.18em] font-semibold" style={{ pointerEvents: 'auto' }}>
        <Link href="/projects" className="hover:text-[#b2000a] transition-colors" style={{ color: isHomePage || scrolled ? '#ffffff' : '#2b2b2b', transition: 'color 0.4s ease' }}>PROJECTS</Link>
        <Link href="/services" className="hover:text-[#b2000a] transition-colors" style={{ color: isHomePage || scrolled ? '#ffffff' : '#2b2b2b', transition: 'color 0.4s ease' }}>SERVICES</Link>
        <Link href="/about" className="hover:text-[#b2000a] transition-colors" style={{ color: isHomePage || scrolled ? '#ffffff' : '#2b2b2b', transition: 'color 0.4s ease' }}>ABOUT US</Link>
        <Link href="/contact" className="hover:text-[#b2000a] transition-colors" style={{ color: isHomePage || scrolled ? '#ffffff' : '#2b2b2b', transition: 'color 0.4s ease' }}>CONTACT</Link>
      </div>

      {/* Phone Button */}
      <div style={{ pointerEvents: 'auto' }}>
        <a
          href="tel:xxxxxxxxx"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '6px' : '8px',
            backgroundColor: '#B2000A',
            color: '#ffffff',
            padding: isMobile ? '0.5rem 1rem' : '0.65rem 1.4rem',
            borderRadius: '9999px',
            fontFamily: "'Tenor Sans', sans-serif",
            fontSize: isMobile ? '0.8rem' : '1rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(178, 0, 10, 0.2)',
          }}
          className="hover:scale-105 active:scale-95 hover:bg-[#C7000B]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <span>xxxxxxxxx</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
