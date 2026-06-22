"use client";

import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ContactPage() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [cursorHovered, setCursorHovered] = useState(false);
  const pageRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    description: '',
    hp_field: '', // Honey pot field
  });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

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
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';

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
      gsap.fromTo('.reveal-el',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }
      );
    };

    initReveals();
  }, []);

  // ── 5. Form Validation & Delivery ──
  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) return "This field is required";

    switch (name) {
      case 'phone':
        if (!/^[0-9]{10}$/.test(value)) error = "Enter a valid 10-digit number";
        break;
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const forbiddenKeywords = ['exahut', 'mailinator', 'yopmail', 'temp', 'disposable', 'dropmail', 'tmail', 'guerrilla'];
        const domain = value.toLowerCase().split('@')[1] || "";
        
        if (!emailRegex.test(value)) {
          error = "Invalid email format";
        } else if (forbiddenKeywords.some(keyword => domain.includes(keyword))) {
          error = "Temporary/Fake emails not allowed";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.hp_field) return; // Honey pot

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'hp_field') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSending(true);

    const SERVICE_ID = "service_5ukbpwr";
    const TEMPLATE_ID = "template_6vphkp9";
    const PUBLIC_KEY = "iaQXY9VcI_ev3jcNL";

    emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY)
      .then(() => {
        window.location.href = "https://marquisliving.ae/thank-you/";
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        setErrors({ submit: "Failed to send. Please try again." });
        setIsSending(false);
      });
  };

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

      {/* Navigation */}
      <Navbar />

      {/* Main Stage */}
      <section 
        className="w-full flex flex-col justify-center items-center px-6 md:px-16 bg-[#FAF8F5]"
        style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '6rem' }}
      >
        <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
          
          {/* Left Column: Studio Details & Stylized Map */}
          <div className="flex flex-col justify-start">
            <span className="reveal-el font-body text-[0.8rem] font-bold text-[#b2000a] tracking-[0.2em] uppercase mb-4 inline-block">
              Get in Touch
            </span>
            <h1 className="reveal-el font-display text-[2.8rem] md:text-[4.5rem] text-[#2b2b2b] leading-[1.1] mb-8 uppercase">
              Let's Build<br />Your <span className="text-[#b2000a]">Legacy</span>
            </h1>

            <div className="reveal-el grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#e2d8d8ff] pt-8 mb-12">
              <div>
                <h4 className="font-body font-bold text-xs uppercase tracking-wider text-[#8b8b8b] mb-2">Location</h4>
                <p className="font-body text-sm text-[#2b2b2b] leading-relaxed">
                  Marquis Living<br />
                  The V Building, Arjan,<br />
                  Dubai, UAE
                </p>
              </div>
              <div>
                <h4 className="font-body font-bold text-xs uppercase tracking-wider text-[#8b8b8b] mb-2">Direct Contact</h4>
                <p className="font-body text-sm text-[#2b2b2b] leading-relaxed">
                  Phone: xxxxxxxxx<br />
                  Email: Info@Marquisliving.ae
                </p>
              </div>
            </div>

            {/* Stylized Monochrome Map Card with Red Pulse Beacon */}
            <div 
              className="reveal-el relative w-full h-[250px] md:h-[300px] rounded-[2rem] overflow-hidden shadow-md border border-[#e2d8d8ff] bg-[#121214] flex items-center justify-center select-none"
            >
              {/* Abstract Blueprint Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              {/* Concentric rings showing target area radar */}
              <div className="absolute w-[180px] h-[180px] border border-white/5 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
              <div className="absolute w-[120px] h-[120px] border border-white/5 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              
              {/* Map Title overlay */}
              <div className="absolute top-6 left-8 font-display text-xs tracking-widest text-[#a1a1aa] uppercase">
                Arjan, Dubai HQ
              </div>

              {/* Pulsing Beacon */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 bg-[#b2000a]/30 rounded-full animate-ping" />
                <div className="absolute w-4 h-4 bg-[#b2000a] rounded-full shadow-lg shadow-[#b2000a]/50" />
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>

              {/* Coordinates info */}
              <div className="absolute bottom-6 right-8 font-body text-[0.65rem] tracking-wider text-[#6b6b6b]">
                25.0568° N, 55.2443° E
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="reveal-el w-full bg-white border border-[#e2d8d8ff] rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <h3 className="font-display text-[1.8rem] md:text-[2.2rem] text-[#2b2b2b] mb-8 uppercase text-center md:text-left">
              Send a Query
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              {/* Honey Pot */}
              <input type="text" name="hp_field" value={formData.hp_field} onChange={handleChange} style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

              <div className="relative w-full group">
                <input 
                  name="name" 
                  type="text" 
                  placeholder="Name*" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full border-b border-[#dcdcdc] focus:border-[#b2000a] py-3 font-body text-sm text-[#2b2b2b] bg-transparent outline-none transition-colors duration-300"
                />
                {errors.name && <span className="absolute bottom-[-16px] left-0 text-[0.65rem] text-[#ff4d4d] font-semibold">{errors.name}</span>}
              </div>

              <div className="relative w-full group">
                <input 
                  name="phone" 
                  type="tel" 
                  placeholder="Phone No.*" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full border-b border-[#dcdcdc] focus:border-[#b2000a] py-3 font-body text-sm text-[#2b2b2b] bg-transparent outline-none transition-colors duration-300"
                />
                {errors.phone && <span className="absolute bottom-[-16px] left-0 text-[0.65rem] text-[#ff4d4d] font-semibold">{errors.phone}</span>}
              </div>

              <div className="relative w-full group">
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email*" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full border-b border-[#dcdcdc] focus:border-[#b2000a] py-3 font-body text-sm text-[#2b2b2b] bg-transparent outline-none transition-colors duration-300"
                />
                {errors.email && <span className="absolute bottom-[-16px] left-0 text-[0.65rem] text-[#ff4d4d] font-semibold">{errors.email}</span>}
              </div>

              <div className="relative w-full group">
                <input 
                  name="city" 
                  type="text" 
                  placeholder="City*" 
                  value={formData.city} 
                  onChange={handleChange} 
                  className="w-full border-b border-[#dcdcdc] focus:border-[#b2000a] py-3 font-body text-sm text-[#2b2b2b] bg-transparent outline-none transition-colors duration-300"
                />
                {errors.city && <span className="absolute bottom-[-16px] left-0 text-[0.65rem] text-[#ff4d4d] font-semibold">{errors.city}</span>}
              </div>

              <div className="relative w-full group" style={{ marginTop: '1rem' }}>
                <textarea 
                  name="description" 
                  placeholder="Tell us about your project*" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="4"
                  className="w-full border-b border-[#dcdcdc] focus:border-[#b2000a] py-3 font-body text-sm text-[#2b2b2b] bg-transparent outline-none transition-colors duration-300 resize-none"
                />
                {errors.description && <span className="absolute bottom-[-16px] left-0 text-[0.65rem] text-[#ff4d4d] font-semibold">{errors.description}</span>}
              </div>

              <div className="w-full flex flex-col items-center mt-6">
                {errors.submit && <p className="text-[#ff4d4d] text-xs mb-3">{errors.submit}</p>}
                
                <button 
                  type="submit" 
                  disabled={isSending} 
                  style={{
                    padding: '1rem 3.5rem',
                    backgroundColor: '#b2000a',
                    color: '#FFFFFF',
                    borderRadius: '50px',
                    border: 'none',
                    fontFamily: "'Tenor Sans', sans-serif",
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 25px rgba(178, 0, 10, 0.2)',
                  }}
                  className="hover:scale-105 active:scale-95 hover:bg-[#C7000B] hover:shadow-lg disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Submit'}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
