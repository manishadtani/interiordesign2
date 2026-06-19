"use client";

import React, { useEffect, useRef, useState } from 'react';

const ScrollWalkthrough = () => {
  const triggerRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeStage, setActiveStage] = useState(0); // 0, 1, 2, 3 based on scroll progress
  
  const totalFrames = 192;
  const framesRef = useRef([]);
  const lastFrameIndexRef = useRef(-1);
  const currentFrameIndexRef = useRef(0);
  const requestRef = useRef(null);

  // Define editorial stages for text reveals
  const stages = [
    { title: "Meticulous Design", desc: "Crafting architectural blueprints with mathematical precision and luxury scaling." },
    { title: "Material Authenticity", desc: "Selecting rare stones, premium hardwoods, and bespoke metallic textures." },
    { title: "Crafting Comfort", desc: "Integrating biophilic layout flows and smart home luxury automation." },
    { title: "Spatial Masterpiece", desc: "The finished residence: A testament to ultra-luxury Dubai architecture." }
  ];

  // Preload frames
  const [frameIndices, setFrameIndices] = useState([]);

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

    // Lazy load: Wait 1.5 seconds after page loads to prevent choking Hero/BeforeAfter assets
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
    // Mobile fallback: Find the closest preloaded frame
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

  // GSAP ScrollTrigger Integration
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
    let mmInstance = null;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Prevent jumping due to mobile address bar resize
      ScrollTrigger.config({
        ignoreMobileResize: true
      });

      mmInstance = gsap.matchMedia();

      // Desktop: Pin and scrub
      mmInstance.add("(min-width: 768px)", () => {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: triggerRef.current,
          pin: pinRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1, // ultra smooth
          onUpdate: (self) => {
            const progress = self.progress;
            const frameIndex = progress * (totalFrames - 1);
            
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            requestRef.current = requestAnimationFrame(() => drawFrame(frameIndex, canvas, ctx));

            const stageIndex = Math.min(
              Math.floor(progress * stages.length),
              stages.length - 1
            );
            setActiveStage((prev) => (prev !== stageIndex ? stageIndex : prev));
          },
          onRefresh: () => {
            setCanvasDimensions(canvas);
          }
        });
      });

      // Mobile: CSS sticky handles pinning, we just scrub
      mmInstance.add("(max-width: 767px)", () => {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: false, // CSS sticky handles it
          scrub: 0.1,
          onUpdate: (self) => {
            const progress = self.progress;
            const frameIndex = progress * (totalFrames - 1);
            
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            requestRef.current = requestAnimationFrame(() => drawFrame(frameIndex, canvas, ctx));

            const stageIndex = Math.min(
              Math.floor(progress * stages.length),
              stages.length - 1
            );
            setActiveStage((prev) => (prev !== stageIndex ? stageIndex : prev));
          },
          onRefresh: () => {
            setCanvasDimensions(canvas);
          }
        });
      });
    };

    initGSAP();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      if (mmInstance) {
        mmInstance.revert();
      }
    };
  }, []);

  // Redraw when ready
  useEffect(() => {
    if (isReady && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        lastFrameIndexRef.current = -1; // Force redraw
        drawFrame(currentFrameIndexRef.current, canvas, ctx);
      }
      // Force ScrollTrigger refresh once ready
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }
  }, [isReady]);

  return (
    <div 
      ref={triggerRef} 
      className="relative w-full bg-[#FAF8F5] overflow-x-hidden h-[150vh] md:h-[220vh]"
    >
      <div
        ref={pinRef}
        className="w-full flex flex-col justify-center items-center sticky top-0 h-[100dvh] md:relative md:top-auto md:h-screen pt-14 pb-14 md:pt-0 md:pb-0"
      >
      {/* Editorial Content Layout */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 relative z-10 py-12 md:py-16">
        
        {/* Left Side: Editorial Typography Panel */}
        <div className="w-full md:w-2/5 flex flex-col justify-center text-center md:text-left select-none order-2 md:order-1">
          <span className="font-urbanist text-[0.8rem] font-bold text-[#b2000a] tracking-[0.25em] uppercase mb-4 inline-block">
            Bespoke Architectural Journey
          </span>
          
          <div className="relative min-h-[140px] md:min-h-[180px] flex items-center justify-center md:justify-start overflow-hidden">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className="absolute transition-all duration-700 ease-out flex flex-col"
                style={{
                  opacity: activeStage === idx ? 1 : 0,
                  transform: activeStage === idx ? 'translateY(0px)' : 'translateY(30px)',
                  pointerEvents: activeStage === idx ? 'auto' : 'none',
                }}
              >
                <h2 
                  className="font-lacroom text-[#2b2b2b] font-light leading-[1.05] tracking-tight mb-4 uppercase"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
                >
                  {stage.title}
                </h2>
                <p className="font-urbanist text-[#6b6b6b] leading-relaxed font-light text-sm md:text-base max-w-[420px]">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Timeline indicator dots */}
          <div className="flex gap-3 justify-center md:justify-start mt-8 items-center">
            {stages.map((_, idx) => (
              <div 
                key={idx}
                className="transition-all duration-500 rounded-full"
                style={{
                  width: activeStage === idx ? '28px' : '8px',
                  height: '8px',
                  backgroundColor: activeStage === idx ? '#b2000a' : '#E8E3DD'
                }}
              />
            ))}
            <span className="font-urbanist text-xs text-[#a0a0a0] font-semibold tracking-widest ml-2">
              0{activeStage + 1} / 0{stages.length}
            </span>
          </div>
        </div>

        {/* Right Side: Centered Rounded Canvas Frame */}
        <div className="w-full md:w-3/5 flex justify-center items-center order-1 md:order-2">
          <div 
            className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-[#e2d8d8ff] max-h-[40vh] md:max-h-[65vh]"
          >
            {/* Main scrubbing canvas */}
            <canvas 
              ref={canvasRef}
              className={`w-full h-full block object-cover transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
              style={{ willChange: 'transform' }}
            />

            {/* Frame index indicator badge */}
            {isReady && (
              <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B2000A] animate-ping" />
                <span className="font-urbanist text-[0.65rem] text-white tracking-[0.2em] font-medium uppercase">
                  Walkthrough / {String(lastFrameIndexRef.current + 1).padStart(3, '0')}
                </span>
              </div>
            )}

            {/* Circular luxury loader overlay */}
            {!isReady && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#FAF8F5]/95 z-20">
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
                  <span className="absolute font-urbanist text-xs font-semibold text-[#2b2b2b]">
                    {loadProgress}%
                  </span>
                </div>
                <span className="font-urbanist text-xs text-[#8b8b8b] uppercase tracking-[0.2em] mt-4">
                  Loading Frame Assets...
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  </div>
  );
};

export default ScrollWalkthrough;
