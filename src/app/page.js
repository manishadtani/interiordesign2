"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import CinematicHero from '../components/CinematicHero';
import AboutUs from '../components/AboutUs';
import BeforeAfter from '../components/BeforeAfter';
import DesignStyles from '../components/DesignStyles';
import ServicesSection from '../components/ServicesSection';
import ProjectsCarousel from '../components/ProjectsCarousel';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Custom cursor position refs
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [cursorHovered, setCursorHovered] = useState(false);

  // ── 1. Smooth Scroll (Lenis) Initialization ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initLenis = async () => {
      // Dynamic import to handle SSR safety
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

      // Sync GSAP ScrollTrigger with Lenis
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      lenis.on('scroll', ScrollTrigger.update);

      return () => {
        lenis.destroy();
      };
    };

    initLenis();

  }, []);

  // ── 2. Custom Liquid Cursor Logic ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e) => {
      if (cursorRef.current && dotRef.current) {
        // Outer ring has smooth elastic lag (using standard quickTo or transition)
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;

        // Inner dot has immediate tracking
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
        target.closest('.design-styles-section > div');

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

  // ── 3. Scroll To Top Toggle ──
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

  // Simulated page loading progress
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setLoadingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 400);
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="relative w-full overflow-x-hidden bg-[#FAF8F5]">
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

      {/* Loading Screen */}
      <LoadingScreen isLoading={isLoading} progress={loadingProgress} />

      {/* Scroll To Top Button */}
      {showScrollButton && (
        <div className="fixed bottom-8 right-8 md:bottom-10 md:right-10 z-50 animate-bounce">
          <button 
            onClick={scrollToTop}
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

      {/* Cinematic Card Reveal Hero */}
      <CinematicHero />

      {/* Core Sections (relative, solid backgrounds, blocking canvas bleed-through) */}
      <AboutUs />

      <BeforeAfter 
        beforeImage="/images/Minimalist.png" 
        afterImage="/images/Minimalist1.png" 
        title="MINIMALIST"
      />

      <DesignStyles />

      <ServicesSection />

      <ProjectsCarousel />

      <ContactForm />

      <Footer />
    </main>
  );
}
