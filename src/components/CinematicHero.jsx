"use client";

import React, { useEffect, useRef, useState } from 'react';

const CinematicHero = () => {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const textContainerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [frameIndices, setFrameIndices] = useState([]);

  const totalFrames = 192;
  const framesRef = useRef([]);
  const lastFrameIndexRef = useRef(-1);
  const currentFrameIndexRef = useRef(0);
  const requestRef = useRef(null);

  // Resize handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload frames
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobileDevice = window.innerWidth < 768;
    const step = isMobileDevice ? 4 : 1;
    const indices = [];
    for (let i = 0; i < totalFrames; i += step) {
      indices.push(i);
    }
    if (indices[indices.length - 1] !== totalFrames - 1) {
      indices.push(totalFrames - 1);
    }
    setFrameIndices(indices);

    let loadedCount = 0;
    const preloadedImages = [];

    const loadImages = async () => {
      const totalToLoad = indices.length;
      const batchSize = 6; // Match browser max concurrent requests per domain

      for (let i = 0; i < totalToLoad; i += batchSize) {
        const batch = indices.slice(i, i + batchSize);
        await Promise.all(batch.map((idx) => {
          return new Promise((resolve) => {
            const img = new Image();
            const frameNum = String(idx).padStart(5, '0');
            img.src = `/scroll/1st frame_${frameNum}.webp`;
            
            img.onload = () => {
              preloadedImages[idx] = img;
              loadedCount++;
              setLoadProgress(Math.round((loadedCount / totalToLoad) * 100));
              resolve(img);
            };

            img.onerror = () => {
              console.error(`Failed to load frame ${idx}`);
              loadedCount++;
              setLoadProgress(Math.round((loadedCount / totalToLoad) * 100));
              resolve(null);
            };
          });
        }));
      }

      framesRef.current = preloadedImages;
      setIsReady(true);
    };

    // Lazy load: Wait 1.5 seconds after page loads to prevent choking initial hero assets
    const startPreload = () => {
      setTimeout(() => {
        loadImages();
      }, 1500);
    };

    if (document.readyState === 'complete') {
      startPreload();
    } else {
      window.addEventListener('load', startPreload);
      return () => window.removeEventListener('load', startPreload);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Canvas drawing logic
  const drawFrame = (index, canvas, ctx) => {
    const frameIndex = Math.max(0, Math.min(Math.floor(index), totalFrames - 1));
    currentFrameIndexRef.current = frameIndex;
    if (lastFrameIndexRef.current === frameIndex) return;
    lastFrameIndexRef.current = frameIndex;

    let img = framesRef.current[frameIndex];
    // Mobile fallback: Find closest preloaded frame
    if (!img) {
      const loadedIndices = Object.keys(framesRef.current).map(Number);
      if (loadedIndices.length > 0) {
        const closestIndex = loadedIndices.reduce((prev, curr) => 
          Math.abs(curr - frameIndex) < Math.abs(prev - frameIndex) ? curr : prev
        );
        img = framesRef.current[closestIndex];
      }
    }

    if (!img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let dw, dh, dx, dy;

    if (imgRatio > canvasRatio) {
      dh = canvas.height;
      dw = dh * imgRatio;
      dx = (canvas.width - dw) / 2;
      dy = 0;
    } else {
      dw = canvas.width;
      dh = dw / imgRatio;
      dx = 0;
      dy = (canvas.height - dh) / 2;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Canvas size handler
  const setCanvasDimensions = (canvas) => {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Draw current frame if ready
    const ctx = canvas.getContext('2d');
    if (ctx && framesRef.current[currentFrameIndexRef.current]) {
      lastFrameIndexRef.current = -1; // Force redraw
      drawFrame(currentFrameIndexRef.current, canvas, ctx);
    }
  };

  // GSAP ScrollTrigger integration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    // Set initial size
    setCanvasDimensions(canvas);

    const handleResize = () => setCanvasDimensions(canvas);
    window.addEventListener('resize', handleResize);

    let scrollTriggerInstance = null;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctxGSAP = gsap.context(() => {
        // ── Pinned Scroll Trigger ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: pinRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const frameIndex = progress * (totalFrames - 1);
              
              if (requestRef.current) cancelAnimationFrame(requestRef.current);
              requestRef.current = requestAnimationFrame(() => drawFrame(frameIndex, canvas, ctx));
            },
            onRefresh: () => {
              setCanvasDimensions(canvas);
            }
          }
        });

        // Set initial state for secondary reveal elements to avoid flashing
        gsap.set('.secondary-reveal', { opacity: 0, y: 40 });

        // Phase 1: Fade out the initial entrance text and scroll indicator (from progress 0% to 30%)
        tl.to('.entrance-reveal, .scroll-indicator-container', {
          opacity: 0,
          y: -30,
          stagger: 0.05,
          duration: 0.35,
          ease: 'power2.inOut'
        });

        // Phase 2: Fade in the secondary text (from 35% to 55%)
        tl.to('.secondary-reveal', {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.35,
          ease: 'power2.out'
        }, '>-0.05');

        // Keep secondary text visible to the end of the scroll (from 55% to 100%)
        tl.to({}, { duration: 0.65 });
      }, containerRef);

      scrollTriggerInstance = ScrollTrigger.getById(containerRef.current);
    };

    initGSAP();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, [isMobile]);

  // Redraw when ready & Mount entrance animations / scroll teaser
  useEffect(() => {
    if (isReady && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        lastFrameIndexRef.current = -1; // Force redraw
        drawFrame(currentFrameIndexRef.current, canvas, ctx);
      }
      
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });

      // Staggered entrance animation for primary text & indicator
      import('gsap').then(({ gsap }) => {
        gsap.fromTo('.entrance-reveal',
          { opacity: 0, y: 35 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1.2, 
            stagger: 0.15, 
            ease: 'power3.out',
            delay: 0.2 
          }
        );

        gsap.fromTo('.scroll-indicator-container',
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1.0, 
            ease: 'power3.out',
            delay: 0.8
          }
        );

        // Gentle bounce loop for scroll indicator line
        gsap.fromTo('.scroll-indicator-arrow',
          { y: -3 },
          { 
            y: 5, 
            duration: 1.0, 
            repeat: -1, 
            yoyo: true, 
            ease: 'power1.inOut',
            delay: 1.0
          }
        );

        // Scroll Teaser Nudge: animate frame index 0 -> 16 -> 0
        const teaserVal = { frame: 0 };
        gsap.timeline({ delay: 1.0 })
          .to(teaserVal, {
            frame: 16,
            duration: 1.2,
            ease: 'power1.out',
            onUpdate: () => {
              if (window.scrollY === 0 && ctx) {
                drawFrame(teaserVal.frame, canvas, ctx);
              }
            }
          })
          .to(teaserVal, {
            frame: 0,
            duration: 1.0,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (window.scrollY === 0 && ctx) {
                drawFrame(teaserVal.frame, canvas, ctx);
              }
            }
          });
      });
    }
  }, [isReady]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#FAF8F5] overflow-x-hidden h-[180vh] md:h-[220vh]"
    >
      <div
        ref={pinRef}
        className="w-full h-[100dvh] md:h-screen relative overflow-hidden"
      >
        {/* Walkthrough Canvas Background (Left side, wider, fading to right) */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[68%] z-0 select-none pointer-events-none">
          <canvas
            ref={canvasRef}
            className={`w-full h-full block object-cover transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
            style={{ willChange: 'transform' }}
          />
          {/* Direct Fade Overlay: Fades the canvas into the background towards the text */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAF8F5] md:bg-gradient-to-r md:from-transparent md:to-[#FAF8F5] md:via-transparent pointer-events-none z-1" />
        </div>

        {/* Content Layout */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between relative z-10 py-12 md:py-16 h-full">
          
          {/* Left Side: Empty spacer on desktop to allow walkthrough canvas to occupy this area */}
          <div className="hidden md:block w-3/5 order-1" />

          {/* Right Side: Editorial Typography Panel sitting on the clean faded background */}
          <div 
            ref={textContainerRef}
            className="w-full md:w-2/5 flex flex-col justify-center text-center md:text-left select-none order-2 relative min-h-[350px] md:min-h-[450px]"
          >
            {/* Primary Panel (Entrance) */}
            <div className="flex flex-col">
              <span
                className="entrance-reveal font-body text-[0.8rem] md:text-[0.9rem] font-bold text-[#b2000a] tracking-[0.25em] uppercase mb-4 md:mb-6"
                style={{ opacity: 0 }}
              >
                Marquis Living Dubai
              </span>

              <h1
                className="entrance-reveal font-display text-[#2b2b2b] font-light leading-[1.05] tracking-tight mb-8 uppercase"
                style={{
                  fontSize: 'clamp(2.5rem, 4.5vw, 4.2rem)',
                  opacity: 0
                }}
              >
                SHAPING / <br />
                SPATIAL / <br />
                <span className="text-[#b2000a]">POETRY</span>
              </h1>

              <p
                className="entrance-reveal font-body text-[#6b6b6b] font-light leading-relaxed max-w-[420px]"
                style={{
                  fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                  opacity: 0
                }}
              >
                Translating structural precision into ultra-luxury residential fit-outs and bespoke curations.
              </p>
            </div>

            {/* Secondary Panel (Scroll-Reveal) */}
            <div className="absolute inset-0 flex flex-col justify-center pointer-events-none text-center md:text-left">
              <span
                className="secondary-reveal font-body text-[0.8rem] md:text-[0.9rem] font-bold text-[#b2000a] tracking-[0.25em] uppercase mb-4 md:mb-6"
                style={{ opacity: 0 }}
              >
                Curating The Exquisite
              </span>

              <h1
                className="secondary-reveal font-display text-[#2b2b2b] font-light leading-[1.05] tracking-tight mb-8 uppercase"
                style={{
                  fontSize: 'clamp(2.5rem, 4.5vw, 4.2rem)',
                  opacity: 0
                }}
              >
                MATERIAL / <br />
                DETAIL / <br />
                <span className="text-[#b2000a]">HARMONY</span>
              </h1>

              <p
                className="secondary-reveal font-body text-[#6b6b6b] font-light leading-relaxed max-w-[420px]"
                style={{
                  fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                  opacity: 0
                }}
              >
                Sourcing premium marbles, custom metalworks, and hand-finished textiles from global ateliers.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator Icon */}
        <div className="scroll-indicator-container absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none" style={{ opacity: 0 }}>
          <span className="font-body text-[0.65rem] tracking-[0.2em] text-[#8b8b8b] uppercase">
            Scroll to explore
          </span>
          <div className="scroll-indicator-arrow w-[1px] h-10 bg-gradient-to-b from-[#8b8b8b] to-transparent" />
        </div>

        {/* Circular Luxury Loader Overlay */}
        {!isReady && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#FAF8F5] z-20">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#E8E3DD"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#B2000A"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={(2 * Math.PI * 34) * (1 - loadProgress / 100)}
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute font-body text-xs font-semibold text-[#2b2b2b]">
                {loadProgress}%
              </span>
            </div>
            <span className="font-body text-xs text-[#8b8b8b] uppercase tracking-[0.2em] mt-4">
              Loading Cinematic Walkthrough...
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CinematicHero;
