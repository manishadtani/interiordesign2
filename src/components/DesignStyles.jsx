"use client";

import React, { useEffect, useRef, useState } from 'react';

const STYLES = [
  {
    name: 'Japandi',
    image: '/design/Japandi.webp',
    desc: 'Blends Japanese simplicity with Scandinavian minimalism, emphasizing natural materials, quiet tones, and functional elegance.',
  },
  {
    name: 'Mid Century Modern',
    image: '/design/midcentury.webp',
    desc: 'Characterized by clean lines, organic curves, and a seamless integration of indoor and outdoor spaces, creating an airy, timeless elegance.',
  },
  {
    name: 'Art Deco',
    image: '/design/artdeco.webp',
    desc: 'Exudes early 20th-century glamour with bold geometric motifs, rich metallic details, lavish materials like lacquer, and polished finishes.',
  },
  {
    name: 'Industrial',
    image: '/design/Industrial.webp',
    desc: 'Emphasizes raw, exposed architectural materials like steel, concrete, and reclaimed wood, paired with high ceilings and open layouts.',
  },
  {
    name: 'Coastal',
    image: '/design/coastal.webp',
    desc: 'Features light-filled rooms, soft ocean-inspired colors, airy fabrics, and organic textures like jute and rattan for a breezy, relaxed vibe.',
  },
  {
    name: 'Bohemian',
    image: '/design/bohimian.webp',
    desc: 'An eclectic and free-spirited style filled with rich textures, vintage furniture, global artifacts, and a warm, inviting layering of patterns.',
  },
  {
    name: 'Maximalist',
    image: '/design/Maximalist.webp',
    desc: 'A vibrant celebration of bold color combinations, complex layers, rich patterns, and curated decorative collections where more is more.',
  },
];

const DesignStyles = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(2); // Starts at the 3rd card (Art Deco)

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => Math.min(STYLES.length - 1, prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
  };

  // Mouse drag handlers for desktop swipe/flick navigation
  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragEndX.current = e.clientX;
  };

  const handleMouseMoveDrag = (e) => {
    if (!isDragging.current) return;
    dragEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragStartX.current - dragEndX.current;
    if (diff > 60) {
      nextSlide();
    } else if (diff < -60) {
      prevSlide();
    }
  };

  // 3D Magnetic Card Hover Tilt Effect (for active centered card only)
  const handleMouseMove = (e, card) => {
    if (isMobile) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateY = ((x - xc) / xc) * 12; // tilt up to 12 degrees
    const rotateX = -((y - yc) / yc) * 12;

    import('gsap').then(({ gsap }) => {
      gsap.to(card, {
        transformPerspective: 1000,
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  };

  const handleMouseLeave = (card) => {
    if (isMobile) return;
    import('gsap').then(({ gsap }) => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  };

  // Card transform calculations relative to activeIndex
  const cardWidth = isMobile ? 200 : 280;
  const gap = isMobile ? 24 : 40;
  const stepWidth = cardWidth + gap;
  const startX = windowWidth > 0 ? windowWidth / 2 - cardWidth / 2 : 500;
  const trackTranslateX = startX - activeIndex * stepWidth;

  const getCardScale = (diff) => {
    const absDiff = Math.abs(diff);
    if (absDiff === 0) return 1.08;
    if (absDiff === 1) return 0.9;
    return Math.max(0.75, 0.8 - (absDiff - 2) * 0.05);
  };

  const getCardY = (diff) => {
    const absDiff = Math.abs(diff);
    const mult = isMobile ? 30 : 45;
    if (absDiff === 0) return 0;
    if (absDiff === 1) return mult;
    return mult * 1.8;
  };

  const getCardRotateY = (diff) => {
    if (diff === 0) return 0;
    return diff > 0 ? -15 : 15;
  };

  const getCardOpacity = (diff) => {
    const absDiff = Math.abs(diff);
    if (absDiff === 0) return 1;
    if (absDiff === 1) return 0.6;
    return Math.max(0.15, 0.3 - (absDiff - 2) * 0.05);
  };

  const getCardFilter = (diff) => {
    if (diff === 0) return 'grayscale(0%)';
    return 'grayscale(70%)';
  };

  const getCardZIndex = (diff) => {
    return 10 - Math.abs(diff);
  };

  // Accent Border & Shadow Halo on Active Card
  const getCardBorder = (diff) => {
    if (diff === 0) return '1px solid rgba(178, 0, 10, 0.18)';
    return '1px solid rgba(0, 0, 0, 0.05)';
  };

  const getCardShadow = (diff) => {
    if (diff === 0) return '0 20px 45px rgba(178, 0, 10, 0.08), 0 5px 15px rgba(0, 0, 0, 0.04)';
    return '0 15px 35px rgba(0, 0, 0, 0.05)';
  };

  const progressPercent = (activeIndex / (STYLES.length - 1)) * 100;

  return (
    <section
      id="design-styles"
      className="relative w-full bg-[#FAF8F5] overflow-hidden py-12 md:py-20 select-none"
    >
      {/* Subtle architectural grid lines & glow backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Giant Parallax Watermark Text Backdrop (Architectural Text-Stroke Style) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        {STYLES.map((style, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={style.name}
              className="absolute font-display text-[11vw] font-black uppercase text-transparent tracking-[0.1em] whitespace-nowrap select-none text-center transition-all duration-700 ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateX(0)' : i < activeIndex ? 'translateX(-80px)' : 'translateX(80px)',
                WebkitTextStroke: '1.2px rgba(43, 43, 43, 0.055)',
                willChange: 'opacity, transform'
              }}
            >
              {style.name}
            </div>
          );
        })}
      </div>

      {/* Section Heading */}
      <div className="text-center z-10 relative mb-8 md:mb-12">
        <span className="font-body text-[0.8rem] font-bold text-[#b2000a] uppercase tracking-[0.25em] mb-2 block">
          Select Your Aesthetic
        </span>
        <h2 className="font-display text-4xl md:text-5xl text-[#2b2b2b] font-light uppercase tracking-tight">
          Design Styles
        </h2>
      </div>

      {/* Main Interactive Deck Wrapper (Supports Drag and Swipe) */}
      <div 
        className="w-full relative flex flex-col justify-center min-h-[50vh] md:min-h-[55vh]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveDrag}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Direct Arrow Navs (Desktop Only) */}
        <button
          onClick={prevSlide}
          disabled={activeIndex === 0}
          className={`hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 border rounded-full items-center justify-center transition-all duration-300 z-20 bg-[#FAF8F5]/80 backdrop-blur shadow-sm cursor-pointer ${
            activeIndex === 0 
              ? 'border-black/5 text-black/20 pointer-events-none' 
              : 'border-black/10 text-black/60 hover:bg-[#b2000a] hover:border-[#b2000a] hover:text-white'
          }`}
          aria-label="Previous style"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <button
          onClick={nextSlide}
          disabled={activeIndex === STYLES.length - 1}
          className={`hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 border rounded-full items-center justify-center transition-all duration-300 z-20 bg-[#FAF8F5]/80 backdrop-blur shadow-sm cursor-pointer ${
            activeIndex === STYLES.length - 1 
              ? 'border-black/5 text-black/20 pointer-events-none' 
              : 'border-black/10 text-black/60 hover:bg-[#b2000a] hover:border-[#b2000a] hover:text-white'
          }`}
          aria-label="Next style"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        {/* Sliding Fan-Deck Cards Container */}
        <div className="w-full flex items-center justify-start overflow-visible z-10 relative">
          <div 
            className="flex items-end gap-6 md:gap-10 py-12 px-0"
            style={{
              transform: `translateX(${trackTranslateX}px)`,
              transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform',
            }}
          >
            {STYLES.map((style, i) => {
              const diff = i - activeIndex;
              const cardScale = getCardScale(diff);
              const cardY = getCardY(diff);
              const cardRotY = getCardRotateY(diff);
              const cardOpacity = getCardOpacity(diff);
              const cardFilter = getCardFilter(diff);
              const cardZ = getCardZIndex(diff);
              const cardBorder = getCardBorder(diff);
              const cardShadow = getCardShadow(diff);

              return (
                <div
                  key={style.name}
                  onClick={() => setActiveIndex(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseMove={(e) => diff === 0 && handleMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => diff === 0 && handleMouseLeave(e, e.currentTarget)}
                  className="w-[200px] md:w-[280px] aspect-[3/4] rounded-[1.5rem] md:rounded-[2.2rem] overflow-hidden bg-white shrink-0 relative cursor-pointer select-none transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
                  style={{
                    transform: `translateY(${cardY}px) scale(${cardScale}) rotateY(${cardRotY}deg)`,
                    opacity: cardOpacity,
                    filter: cardFilter,
                    zIndex: cardZ,
                    border: cardBorder,
                    boxShadow: cardShadow,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity'
                  }}
                >
                  <img
                    src={style.image}
                    alt={style.name}
                    className="card-image w-full h-full object-cover select-none pointer-events-none transition-transform duration-700"
                    style={{
                      transform: diff === 0 ? 'scale(1.05)' : 'scale(1.0)',
                    }}
                  />
                  {/* Micro vignette border inside card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Indicator Fill (Desktop Only) */}
      <div className="w-full flex justify-center mt-6 md:mt-10">
        <div className="w-48 h-[2px] bg-black/5 rounded-full overflow-hidden z-10 hidden md:block">
          <div 
            className="h-full bg-[#b2000a] transition-all duration-700 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Editorial Text Content */}
      <div className="relative w-full max-w-[640px] h-[160px] mx-auto text-center px-6 z-10 select-none flex items-center justify-center mt-6">
        {STYLES.map((style, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={style.name}
              className="absolute inset-x-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                pointerEvents: isActive ? 'auto' : 'none',
                willChange: 'opacity, transform'
              }}
            >
              <h4 className="font-display text-[#2b2b2b] text-xl md:text-2.5xl font-light uppercase tracking-wide mb-1">
                {style.name}
              </h4>

              {/* Centered Animated Divider Line */}
              <div className="h-[1px] bg-black/5 w-20 my-3 overflow-hidden relative">
                <div 
                  className="absolute inset-y-0 left-0 bg-[#b2000a] transition-all duration-700 ease-out"
                  style={{
                    width: isActive ? '100%' : '0%',
                    transitionDelay: isActive ? '200ms' : '0ms'
                  }}
                />
              </div>

              <p className="font-body text-[#6b6b6b] text-xs md:text-sm font-light leading-relaxed max-w-[450px]">
                {style.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DesignStyles;
