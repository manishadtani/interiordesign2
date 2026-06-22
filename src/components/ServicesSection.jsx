"use client";

import React, { useEffect, useRef, useState } from 'react';

const SERVICES = [
  {
    id: "01",
    title: "Design Consultation",
    desc: "Thoughtful direction to help you shape spaces that feel personal and intentional.",
    image: "/images/service1.png",
  },
  {
    id: "02",
    title: "Luxury Projects",
    desc: "Delivering high-value projects with careful planning, precision, and superior finishes.",
    image: "/images/service2.png",
  },
  {
    id: "03",
    title: "Consultation + Execution",
    desc: "End-to-end execution, from concept development to the final handover.",
    image: "/images/service3.png",
  },
];

const ServicesSection = () => {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const slidesRef = useRef([]);
  const leftDoorsRef = useRef([]);
  const rightDoorsRef = useRef([]);
  const imagesRef = useRef([]);

  // New blueprint and seam refs
  const leftBlueprintsRef = useRef([]);
  const rightBlueprintsRef = useRef([]);
  const seamLeftRef = useRef([]);
  const seamRightRef = useRef([]);
  const rulerMarkerRef = useRef(null);
  const rulerMarkerMobileRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || windowWidth === 0) return;

    let ctxVal;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      ctxVal = gsap.context(() => {
        // Master ScrollTrigger timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            pin: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        });

        // Sliding directions based on screen layout
        const getLeftTransform = isMobile ? { y: '-51vh' } : { x: '-51vw' };
        const getRightTransform = isMobile ? { y: '51vh' } : { x: '51vw' };
        const resetTransform = isMobile ? { y: '0%' } : { x: '0%' };

        // Parallax sliding directions for blueprint overlays relative to doors
        const getLeftBlueprintTransform = isMobile ? { y: '16vh' } : { x: '16vw' };
        const getRightBlueprintTransform = isMobile ? { y: '-16vh' } : { x: '-16vw' };

        // Initially setup slides, doors, blueprints and seam states
        gsap.set(slidesRef.current.slice(1), { opacity: 0 });
        gsap.set(leftDoorsRef.current, resetTransform);
        gsap.set(rightDoorsRef.current, resetTransform);
        gsap.set(leftBlueprintsRef.current, { x: 0, y: 0, opacity: 0.3 });
        gsap.set(rightBlueprintsRef.current, { x: 0, y: 0, opacity: 0.3 });
        gsap.set(seamLeftRef.current, { opacity: 0.95 });
        gsap.set(seamRightRef.current, { opacity: 0.95 });
        gsap.set(imagesRef.current, { scale: 1.18 });

        // Setup progress ruler markers
        gsap.set(rulerMarkerRef.current, { y: 0 });
        gsap.set(rulerMarkerMobileRef.current, { x: 0 });

        // ───────────────── STAGE 1 (0 to 3.5) ─────────────────
        // Open Slide 0 doors
        tl.to(leftDoorsRef.current[0], { ...getLeftTransform, duration: 1.3, ease: 'power2.inOut' }, 0.2)
          .to(rightDoorsRef.current[0], { ...getRightTransform, duration: 1.3, ease: 'power2.inOut' }, 0.2)
          .to(leftBlueprintsRef.current[0], { ...getLeftBlueprintTransform, opacity: 0.02, duration: 1.3, ease: 'power2.inOut' }, 0.2)
          .to(rightBlueprintsRef.current[0], { ...getRightBlueprintTransform, opacity: 0.02, duration: 1.3, ease: 'power2.inOut' }, 0.2)
          .to(seamLeftRef.current[0], { opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.2)
          .to(seamRightRef.current[0], { opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.2)
          .to(imagesRef.current[0], { scale: 1.02, duration: 1.3, ease: 'power2.inOut' }, 0.2);

        // Close Slide 0 doors
        tl.to(leftDoorsRef.current[0], { ...resetTransform, duration: 1.3, ease: 'power2.inOut' }, 2.0)
          .to(rightDoorsRef.current[0], { ...resetTransform, duration: 1.3, ease: 'power2.inOut' }, 2.0)
          .to(leftBlueprintsRef.current[0], { x: 0, y: 0, opacity: 0.3, duration: 1.3, ease: 'power2.inOut' }, 2.0)
          .to(rightBlueprintsRef.current[0], { x: 0, y: 0, opacity: 0.3, duration: 1.3, ease: 'power2.inOut' }, 2.0)
          .to(seamLeftRef.current[0], { opacity: 0.95, duration: 1.0, ease: 'power2.in' }, 2.3)
          .to(seamRightRef.current[0], { opacity: 0.95, duration: 1.0, ease: 'power2.in' }, 2.3)
          .to(rulerMarkerRef.current, { y: 105, duration: 1.3, ease: 'power2.inOut' }, 2.0)
          .to(rulerMarkerMobileRef.current, { x: 78, duration: 1.3, ease: 'power2.inOut' }, 2.0)
          .to(imagesRef.current[0], { scale: 1.18, duration: 1.3, ease: 'power2.inOut' }, 2.0);

        // Swap Slide 0 for Slide 1 (while doors are fully closed)
        tl.set(slidesRef.current[0], { opacity: 0 }, 3.3)
          .set(slidesRef.current[1], { opacity: 1 }, 3.3);

        // ───────────────── STAGE 2 (3.5 to 6.9) ─────────────────
        // Open Slide 1 doors
        tl.to(leftDoorsRef.current[1], { ...getLeftTransform, duration: 1.3, ease: 'power2.inOut' }, 3.8)
          .to(rightDoorsRef.current[1], { ...getRightTransform, duration: 1.3, ease: 'power2.inOut' }, 3.8)
          .to(leftBlueprintsRef.current[1], { ...getLeftBlueprintTransform, opacity: 0.02, duration: 1.3, ease: 'power2.inOut' }, 3.8)
          .to(rightBlueprintsRef.current[1], { ...getRightBlueprintTransform, opacity: 0.02, duration: 1.3, ease: 'power2.inOut' }, 3.8)
          .to(seamLeftRef.current[1], { opacity: 0, duration: 0.8, ease: 'power2.out' }, 3.8)
          .to(seamRightRef.current[1], { opacity: 0, duration: 0.8, ease: 'power2.out' }, 3.8)
          .to(imagesRef.current[1], { scale: 1.02, duration: 1.3, ease: 'power2.inOut' }, 3.8);

        // Close Slide 1 doors
        tl.to(leftDoorsRef.current[1], { ...resetTransform, duration: 1.3, ease: 'power2.inOut' }, 5.6)
          .to(rightDoorsRef.current[1], { ...resetTransform, duration: 1.3, ease: 'power2.inOut' }, 5.6)
          .to(leftBlueprintsRef.current[1], { x: 0, y: 0, opacity: 0.3, duration: 1.3, ease: 'power2.inOut' }, 5.6)
          .to(rightBlueprintsRef.current[1], { x: 0, y: 0, opacity: 0.3, duration: 1.3, ease: 'power2.inOut' }, 5.6)
          .to(seamLeftRef.current[1], { opacity: 0.95, duration: 1.0, ease: 'power2.in' }, 5.9)
          .to(seamRightRef.current[1], { opacity: 0.95, duration: 1.0, ease: 'power2.in' }, 5.9)
          .to(rulerMarkerRef.current, { y: 210, duration: 1.3, ease: 'power2.inOut' }, 5.6)
          .to(rulerMarkerMobileRef.current, { x: 156, duration: 1.3, ease: 'power2.inOut' }, 5.6)
          .to(imagesRef.current[1], { scale: 1.18, duration: 1.3, ease: 'power2.inOut' }, 5.6);

        // Swap Slide 1 for Slide 2 (while doors are fully closed)
        tl.set(slidesRef.current[1], { opacity: 0 }, 6.9)
          .set(slidesRef.current[2], { opacity: 1 }, 6.9);

        // ───────────────── STAGE 3 (6.9 to 10.5) ─────────────────
        // Open Slide 2 doors
        tl.to(leftDoorsRef.current[2], { ...getLeftTransform, duration: 1.3, ease: 'power2.inOut' }, 7.4)
          .to(rightDoorsRef.current[2], { ...getRightTransform, duration: 1.3, ease: 'power2.inOut' }, 7.4)
          .to(leftBlueprintsRef.current[2], { ...getLeftBlueprintTransform, opacity: 0.02, duration: 1.3, ease: 'power2.inOut' }, 7.4)
          .to(rightBlueprintsRef.current[2], { ...getRightBlueprintTransform, opacity: 0.02, duration: 1.3, ease: 'power2.inOut' }, 7.4)
          .to(seamLeftRef.current[2], { opacity: 0, duration: 0.8, ease: 'power2.out' }, 7.4)
          .to(seamRightRef.current[2], { opacity: 0, duration: 0.8, ease: 'power2.out' }, 7.4)
          .to(imagesRef.current[2], { scale: 1.02, duration: 1.3, ease: 'power2.inOut' }, 7.4);

        // Close Slide 2 doors (End of Section)
        tl.to(leftDoorsRef.current[2], { ...resetTransform, duration: 1.3, ease: 'power2.inOut' }, 9.2)
          .to(rightDoorsRef.current[2], { ...resetTransform, duration: 1.3, ease: 'power2.inOut' }, 9.2)
          .to(leftBlueprintsRef.current[2], { x: 0, y: 0, opacity: 0.3, duration: 1.3, ease: 'power2.inOut' }, 9.2)
          .to(rightBlueprintsRef.current[2], { x: 0, y: 0, opacity: 0.3, duration: 1.3, ease: 'power2.inOut' }, 9.2)
          .to(seamLeftRef.current[2], { opacity: 0.95, duration: 1.0, ease: 'power2.in' }, 9.5)
          .to(seamRightRef.current[2], { opacity: 0.95, duration: 1.0, ease: 'power2.in' }, 9.5)
          .to(imagesRef.current[2], { scale: 1.18, duration: 1.3, ease: 'power2.inOut' }, 9.2);

      }, triggerRef);
    };

    initGSAP();

    return () => {
      if (ctxVal) ctxVal.revert();
    };
  }, [windowWidth, isMobile]);

  return (
    <section
      ref={triggerRef}
      id="services-section"
      className="relative w-full bg-[#FAF8F5]"
      style={{
        // 3 stages pinning
        height: '320vh',
      }}
    >
      <div
        ref={containerRef}
        className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-[#FAF8F5]"
      >
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35 pointer-events-none z-0" />

        {/* Desktop Progress Ruler (Vertical scale sidebar) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center select-none pointer-events-none">
          <div className="relative h-[240px] w-[35px] border-r border-dashed border-[#b2000a]/20 flex flex-col justify-between items-end pr-2 text-[10px] font-mono text-[#2b2b2b]/40">
            <div className="flex items-center gap-1.5 font-bold text-[#2b2b2b]/50"><span>01</span><span className="w-2.5 h-[1.5px] bg-[#b2000a]/30"></span></div>
            <div className="flex items-center gap-1.5 font-bold text-[#2b2b2b]/50"><span>02</span><span className="w-2.5 h-[1.5px] bg-[#b2000a]/30"></span></div>
            <div className="flex items-center gap-1.5 font-bold text-[#2b2b2b]/50"><span>03</span><span className="w-2.5 h-[1.5px] bg-[#b2000a]/30"></span></div>
            
            {/* The sliding rule indicator */}
            <div 
              ref={rulerMarkerRef}
              className="absolute right-[-2.5px] w-[5px] h-[30px] bg-[#b2000a] rounded-full shadow-[0_0_8px_rgba(178,0,10,0.4)]"
              style={{
                transform: 'translateY(0px)',
                willChange: 'transform',
              }}
            />
          </div>
          <span className="text-[8px] font-mono tracking-[0.25em] text-[#2b2b2b]/40 rotate-90 translate-y-9 mt-1.5 uppercase whitespace-nowrap">
            Scale Ruler
          </span>
        </div>

        {/* Mobile Progress Ruler (Horizontal scale bar) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex md:hidden flex-col items-center select-none pointer-events-none">
          <div className="relative w-[180px] h-[25px] border-b border-dashed border-[#b2000a]/20 flex justify-between items-end pb-1.5 text-[9px] font-mono text-[#2b2b2b]/40">
            <div className="flex flex-col items-center gap-1 font-bold text-[#2b2b2b]/50"><span>01</span><span className="h-2 w-[1.5px] bg-[#b2000a]/30"></span></div>
            <div className="flex flex-col items-center gap-1 font-bold text-[#2b2b2b]/50"><span>02</span><span className="h-2 w-[1.5px] bg-[#b2000a]/30"></span></div>
            <div className="flex flex-col items-center gap-1 font-bold text-[#2b2b2b]/50"><span>03</span><span className="h-2 w-[1.5px] bg-[#b2000a]/30"></span></div>
            
            {/* The sliding rule indicator */}
            <div 
              ref={rulerMarkerMobileRef}
              className="absolute bottom-[-2.5px] h-[5px] w-[24px] bg-[#b2000a] rounded-full shadow-[0_0_8px_rgba(178,0,10,0.4)]"
              style={{
                transform: 'translateX(0px)',
                willChange: 'transform',
              }}
            />
          </div>
        </div>

        {/* Slides Stack */}
        <div className="w-full h-full relative z-10 flex items-center justify-center">
          {SERVICES.map((service, idx) => {
            const zIndexVal = 10 + idx * 2;

            // Responsive styling for Left (Top on Mobile) and Right (Bottom on Mobile) doors
            const doorLeftStyle = isMobile
              ? {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '50.5vh',
                  backgroundColor: '#FAF8F5',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  willChange: 'transform',
                }
              : {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '50.5vw',
                  backgroundColor: '#FAF8F5',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingLeft: '6rem',
                  paddingRight: '1rem',
                  borderRight: '1px solid rgba(0,0,0,0.05)',
                  willChange: 'transform',
                };

            const doorRightStyle = isMobile
              ? {
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '50.5vh',
                  backgroundColor: '#FAF8F5',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  borderTop: '1px solid rgba(0,0,0,0.05)',
                  willChange: 'transform',
                }
              : {
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '50.5vw',
                  backgroundColor: '#FAF8F5',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingRight: '6rem',
                  paddingLeft: '1rem',
                  borderLeft: '1px solid rgba(0,0,0,0.05)',
                  willChange: 'transform',
                };

            return (
              <div
                key={service.id}
                ref={el => slidesRef.current[idx] = el}
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{
                  zIndex: zIndexVal,
                  willChange: 'opacity',
                }}
              >
                {/* Background Image (Completely bright, clear, no dark overlays) */}
                <div className="absolute inset-0 z-0">
                  <img
                    ref={el => imagesRef.current[idx] = el}
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    style={{
                      willChange: 'transform',
                    }}
                  />
                  {/* Extremely soft overlay to prevent harsh highlights, keeping visual clarity */}
                  <div className="absolute inset-0 bg-black/[0.03] pointer-events-none" />
                </div>

                {/* Left (Top) Sliding Door */}
                <div 
                  ref={el => leftDoorsRef.current[idx] = el}
                  style={doorLeftStyle}
                  className="relative overflow-hidden"
                >
                  {/* Faint blueprint grid sheet texture */}
                  <div className="absolute inset-0 opacity-[0.25] bg-[linear-gradient(to_right,rgba(43,43,43,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(43,43,43,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
                  
                  {/* Detailed Architectural Floor Plan Blueprint SVG */}
                  <div 
                    ref={el => leftBlueprintsRef.current[idx] = el}
                    className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 opacity-30 flex items-center justify-center p-6"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <svg
                      className="w-full h-full max-w-[85%] max-h-[85%]"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Floor Plan Sketch */}
                      <g transform="translate(25, 20)" stroke="rgba(43,43,43,0.12)" strokeWidth="0.3" fill="none">
                        {/* Room boundary walls */}
                        <path d="M 0 0 L 45 0 L 45 45 L 0 45 Z" strokeWidth="0.5" stroke="rgba(43,43,43,0.15)" />
                        <path d="M 1.5 1.5 L 43.5 1.5 L 43.5 43.5 L 1.5 43.5 Z" strokeWidth="0.2" />
                        
                        {/* Internal partition wall */}
                        <path d="M 18 1.5 L 18 18 L 1.5 18" strokeWidth="0.4" />
                        <path d="M 18 30 L 18 43.5" strokeWidth="0.4" />
                        
                        {/* Door swing */}
                        <path d="M 1.5 6 A 4.5 4.5 0 0 1 6 1.5" strokeDasharray="0.8,0.8" />
                        <line x1="1.5" y1="6" x2="1.5" y2="1.5" strokeWidth="0.25" />

                        {/* Living sofa blueprint layout */}
                        <rect x="5" y="24" width="8" height="15" rx="1" strokeWidth="0.25" />
                        <path d="M 5 26.5 L 11 26.5 M 5 36.5 L 11 36.5" strokeWidth="0.18" />
                        {/* Coffee table */}
                        <circle cx="10" cy="31.5" r="2.5" strokeWidth="0.2" />

                        {/* Dining table & chairs */}
                        <rect x="28" y="10" width="10" height="15" rx="0.5" strokeWidth="0.25" strokeDasharray="1,1" />
                        <circle cx="26" cy="13.5" r="1.2" strokeWidth="0.18" />
                        <circle cx="26" cy="17.5" r="1.2" strokeWidth="0.18" />
                        <circle cx="26" cy="21.5" r="1.2" strokeWidth="0.18" />
                        <circle cx="40" cy="13.5" r="1.2" strokeWidth="0.18" />
                        <circle cx="40" cy="17.5" r="1.2" strokeWidth="0.18" />
                        <circle cx="40" cy="21.5" r="1.2" strokeWidth="0.18" />
                      </g>

                      {/* Dimensions Overlay */}
                      <g stroke="rgba(178,0,10,0.22)" strokeWidth="0.2" fill="none">
                        {/* Dimension Line 1 */}
                        <line x1="25" y1="72" x2="70" y2="72" />
                        <line x1="25" y1="70" x2="25" y2="74" strokeWidth="0.35" />
                        <line x1="70" y1="70" x2="70" y2="74" strokeWidth="0.35" />
                        <path d="M 25 72 L 27.5 70.8 M 25 72 L 27.5 73.2 M 70 72 L 67.5 70.8 M 70 72 L 67.5 73.2" strokeWidth="0.2" />
                        <text x="47.5" y="70" className="font-mono font-bold" fontSize="1.8" fill="rgba(178,0,10,0.55)" textAnchor="middle">5.80m [GRID A-D]</text>

                        {/* Dimension Line 2 */}
                        <line x1="75" y1="20" x2="75" y2="65" />
                        <line x1="73" y1="20" x2="77" y2="20" strokeWidth="0.35" />
                        <line x1="73" y1="65" x2="77" y2="65" strokeWidth="0.35" />
                        <path d="M 75 20 L 73.8 22.5 M 75 20 L 76.2 22.5 M 75 65 L 73.8 62.5 M 75 65 L 76.2 62.5" strokeWidth="0.2" />
                        <text x="78" y="42.5" className="font-mono font-bold" fontSize="1.8" fill="rgba(178,0,10,0.55)" transform="rotate(90 78 42.5)" textAnchor="middle">5.20m</text>
                      </g>

                      {/* Compass Rose details (Top Left) */}
                      {!isMobile && (
                        <g transform="translate(14, 18)">
                          <circle cx="0" cy="0" r="6" fill="none" stroke="rgba(43,43,43,0.08)" strokeWidth="0.2" />
                          <circle cx="0" cy="0" r="5" fill="none" stroke="rgba(43,43,43,0.12)" strokeWidth="0.2" strokeDasharray="0.8,0.8" />
                          <path d="M 0 -7 L 1.2 -1 L 0 0 L -1.2 -1 Z" fill="rgba(178,0,10,0.35)" stroke="rgba(178,0,10,0.5)" strokeWidth="0.18" />
                          <path d="M 0 7 L 1.2 1 L 0 0 L -1.2 1 Z" fill="rgba(43,43,43,0.15)" stroke="rgba(43,43,43,0.3)" strokeWidth="0.18" />
                          <text x="-1.2" y="-8.2" className="font-mono font-bold" fontSize="2.2" fill="rgba(43,43,43,0.5)" textAnchor="middle">N</text>
                        </g>
                      )}

                      {/* Corner Title Stamp Block */}
                      {!isMobile && (
                        <g transform="translate(10, 82)">
                          <rect x="0" y="0" width="32" height="12" fill="none" stroke="rgba(43,43,43,0.15)" strokeWidth="0.2" />
                          <line x1="0" y1="4" x2="32" y2="4" stroke="rgba(43,43,43,0.15)" strokeWidth="0.2" />
                          <line x1="16" y1="4" x2="16" y2="12" stroke="rgba(43,43,43,0.15)" strokeWidth="0.2" />
                          <text x="2" y="3" className="font-mono font-bold" fontSize="1.8" fill="rgba(43,43,43,0.5)">GLOCAL CORE STUDY</text>
                          <text x="2" y="7" className="font-mono" fontSize="1.4" fill="rgba(43,43,43,0.4)">SCALE: 1:25</text>
                          <text x="18" y="7" className="font-mono" fontSize="1.4" fill="rgba(43,43,43,0.4)">SHEET: A-101</text>
                          <text x="2" y="10.5" className="font-mono" fontSize="1.4" fill="rgba(43,43,43,0.4)">REV: OPT-02</text>
                          <text x="18" y="10.5" className="font-mono" fontSize="1.4" fill="rgba(43,43,43,0.4)">DATE: JUN26</text>
                        </g>
                      )}
                    </svg>
                  </div>

                  {/* Red Split Seam Line */}
                  <div 
                    ref={el => seamLeftRef.current[idx] = el}
                    className={
                      isMobile
                        ? "absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#b2000a] shadow-[0_1px_6px_rgba(178,0,10,0.5)] z-20"
                        : "absolute right-0 top-0 bottom-0 w-[1.5px] bg-[#b2000a] shadow-[1px_0_6px_rgba(178,0,10,0.5)] z-20"
                    }
                    style={{ willChange: 'opacity' }}
                  />

                  {/* Text Content */}
                  <div className="relative z-10 flex flex-col select-none text-left max-w-[400px] mx-auto md:mx-0">
                    <div className="flex items-center gap-4 mb-2 md:mb-4">
                      <span className="font-tenor text-[#b2000a] text-base md:text-xl font-bold tracking-[0.2em]">
                        {service.id}
                      </span>
                      <span className="w-10 h-[1px] bg-[#b2000a]/30" />
                    </div>
                    <h3 
                      className="font-cormorant text-[#2b2b2b] font-light uppercase tracking-tight leading-[1.05]"
                      style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)' }}
                    >
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Right (Bottom) Sliding Door */}
                <div 
                  ref={el => rightDoorsRef.current[idx] = el}
                  style={doorRightStyle}
                  className="relative overflow-hidden"
                >
                  {/* Faint blueprint grid sheet texture */}
                  <div className="absolute inset-0 opacity-[0.25] bg-[linear-gradient(to_right,rgba(43,43,43,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(43,43,43,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
                  
                  {/* Detailed Wall Elevation / Furniture Detail Blueprint SVG */}
                  <div 
                    ref={el => rightBlueprintsRef.current[idx] = el}
                    className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 opacity-30 flex items-center justify-center p-6"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <svg
                      className="w-full h-full max-w-[85%] max-h-[85%]"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Technical Elevation Layout */}
                      <g transform="translate(30, 20)" stroke="rgba(43,43,43,0.12)" strokeWidth="0.3" fill="none">
                        {/* Cabinet Front Elevation */}
                        <rect x="0" y="10" width="35" height="28" rx="0.5" strokeWidth="0.45" />
                        <line x1="17.5" y1="10" x2="17.5" y2="38" strokeWidth="0.3" />
                        <line x1="0" y1="24" x2="35" y2="24" strokeWidth="0.25" strokeDasharray="1,1" />
                        
                        {/* Circular pulls */}
                        <circle cx="15.5" cy="24" r="0.6" fill="rgba(43,43,43,0.2)" />
                        <circle cx="19.5" cy="24" r="0.6" fill="rgba(43,43,43,0.2)" />

                        {/* Minimal Designer Lounge Chair Elevation */}
                        <path d="M 42 38 L 42 27 C 42 21, 46 19, 49 19 C 52 19, 54 23, 60 23 C 66 23, 68 15, 68 11" strokeWidth="0.4" />
                        <path d="M 42 29 C 48 29, 54 32, 62 32 L 65 38" strokeWidth="0.4" />
                        <line x1="45" y1="32" x2="43" y2="43" strokeWidth="0.6" stroke="rgba(43,43,43,0.2)" />
                        <line x1="60" y1="32" x2="62" y2="43" strokeWidth="0.6" stroke="rgba(43,43,43,0.2)" />
                        <line x1="43" y1="43" x2="62" y2="43" strokeWidth="0.2" strokeDasharray="0.8,0.8" />
                      </g>

                      {/* Dimension Arcs & Radii */}
                      {!isMobile && (
                        <g transform="translate(72, 18)" stroke="rgba(178,0,10,0.22)" strokeWidth="0.2" fill="none">
                          {/* Protractor scale arc */}
                          <path d="M -8 0 A 8 8 0 0 1 0 -8" strokeWidth="0.2" strokeDasharray="0.8,0.8" />
                          <line x1="0" y1="0" x2="-8" y2="0" strokeWidth="0.2" />
                          <line x1="0" y1="0" x2="0" y2="-8" strokeWidth="0.2" />
                          <line x1="0" y1="0" x2="-5.65" y2="-5.65" stroke="rgba(178,0,10,0.35)" strokeWidth="0.25" />
                          <text x="-3" y="-2" className="font-mono text-[1.6px]" fill="rgba(178,0,10,0.65)" fontWeight="bold">45.0°</text>
                        </g>
                      )}

                      {/* Annotation Callouts */}
                      {!isMobile && (
                        <g stroke="rgba(43,43,43,0.22)" strokeWidth="0.18" fill="none">
                          {/* Callout 1 */}
                          <path d="M 30 38 L 22 44 L 10 44" />
                          <circle cx="30" cy="38" r="0.5" fill="rgba(43,43,43,0.4)" stroke="none" />
                          <text x="9" y="42.5" className="font-mono text-[1.4px]" fill="rgba(43,43,43,0.5)">[01] OAK VENEER CONSOLE</text>

                          {/* Callout 2 */}
                          <path d="M 80 50 L 84 55 L 92 55" />
                          <circle cx="80" cy="50" r="0.5" fill="rgba(43,43,43,0.4)" stroke="none" />
                          <text x="83.5" y="53.5" className="font-mono text-[1.4px]" fill="rgba(43,43,43,0.5)">[02] LEATHER SHELL</text>

                          {/* Callout 3 (Red Accent) */}
                          <path d="M 72 61 L 76 67 L 85 67" stroke="rgba(178,0,10,0.3)" />
                          <circle cx="72" cy="61" r="0.5" fill="rgba(178,0,10,0.5)" stroke="none" />
                          <text x="76.5" y="65.5" className="font-mono text-[1.4px]" fill="rgba(178,0,10,0.65)" fontWeight="bold">[03] SOLID BRASS COATING</text>
                        </g>
                      )}

                      {/* Architectural crosshair markers */}
                      <g stroke="rgba(43,43,43,0.18)" strokeWidth="0.2">
                        {/* Top Right Crosshair */}
                        <circle cx="95" cy="5" r="1.5" fill="none" />
                        <line x1="95" y1="1.5" x2="95" y2="8.5" />
                        <line x1="91.5" y1="5" x2="98.5" y2="5" />

                        {/* Bottom Right Crosshair */}
                        {!isMobile && (
                          <g transform="translate(95, 95)">
                            <circle cx="0" cy="0" r="1.5" fill="none" />
                            <line x1="0" y1="-3.5" x2="0" y2="3.5" />
                            <line x1="-3.5" y1="0" x2="3.5" y2="0" />
                          </g>
                        )}
                      </g>
                    </svg>
                  </div>

                  {/* Red Split Seam Line */}
                  <div 
                    ref={el => seamRightRef.current[idx] = el}
                    className={
                      isMobile
                        ? "absolute top-0 left-0 right-0 h-[1.5px] bg-[#b2000a] shadow-[0_-1px_6px_rgba(178,0,10,0.5)] z-20"
                        : "absolute left-0 top-0 bottom-0 w-[1.5px] bg-[#b2000a] shadow-[-1px_0_6px_rgba(178,0,10,0.5)] z-20"
                    }
                    style={{ willChange: 'opacity' }}
                  />

                  {/* Copy Content */}
                  <div className="relative z-10 flex flex-col select-none text-left md:text-right items-start md:items-end max-w-[360px] mx-auto md:mx-0">
                    <p 
                      className="font-tenor text-[#6b6b6b] font-light leading-relaxed mb-5 md:mb-8"
                      style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.02rem)' }}
                    >
                      {service.desc}
                    </p>
                    <a
                      href="#contact"
                      className="font-tenor relative overflow-hidden group inline-flex items-center gap-2 text-white bg-[#2b2b2b] hover:text-white text-xs md:text-sm tracking-[0.2em] uppercase px-6 py-3 rounded-full transition-colors duration-300 shadow-md cursor-pointer"
                    >
                      {/* Sliding background */}
                      <span className="absolute inset-0 w-full h-full bg-[#b2000a] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                      
                      {/* Button label */}
                      <span className="relative z-10 flex items-center gap-2">
                        Explore Service
                        <span className="text-[1.1rem] leading-none transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                      </span>
                    </a>
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

export default ServicesSection;
