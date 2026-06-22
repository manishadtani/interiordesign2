"use client";

/**
 * BeforeAfter Component
 * GSAP ScrollTrigger-based horizontal before/after image reveal
 * Scroll-pinned animation — after image wipes in from right as you scroll
 */

import React, { useEffect, useRef } from 'react';

const BeforeAfter = ({
  beforeImage = '/images/Modern.png',
  afterImage = '/images/Modern 1.png',
  beforeLabel = 'Before',
  afterLabel = 'After',
  title = 'MINIMALIST',
}) => {
  const sectionRef = useRef(null);
  const afterDivRef = useRef(null);
  const afterImgRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const section = sectionRef.current;
    const afterDiv = afterDivRef.current;
    const afterImg = afterImgRef.current;
    if (!section || !afterDiv || !afterImg) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.config({
        ignoreMobileResize: true
      });

      gsap.set(afterDiv, { xPercent: 100 });
      gsap.set(afterImg, { xPercent: -100 });

      const ctx = gsap.context(() => {
        let mm = gsap.matchMedia();

        // Desktop: Pinned animation
        mm.add("(min-width: 768px)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => '+=' + (section.offsetWidth * 0.5),
              scrub: 1,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
            defaults: { ease: 'none' },
          });

          tl.to(afterDiv, { xPercent: 0 })
            .to(afterImg, { xPercent: 0 }, 0);
        });

        // Mobile: Unpinned, scroll animation
        mm.add("(max-width: 767px)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 70%',
              scrub: 1,
              pin: false,
            },
            defaults: { ease: 'none' },
          });

          tl.to(afterDiv, { xPercent: 0 })
            .to(afterImg, { xPercent: 0 }, 0);
        });
      }, section);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    initGSAP();

  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: '#111',
        overflow: 'hidden',
      }}
    >
      {/* Before image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={beforeImage}
          alt={beforeLabel}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* After image (slides in from right) */}
      <div
        ref={afterDivRef}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        <div
          ref={afterImgRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
          }}
        >
          <img
            src={afterImage}
            alt={afterLabel}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            <h2 
              className="font-display"
              style={{
                fontSize: 'clamp(2.5rem, 9vw, 8rem)',
                color: '#ffffff',
                margin: 0,
                fontWeight: 400,
                letterSpacing: '0.05em',
                lineHeight: 1,
                textShadow: '0 4px 30px rgba(0,0,0,0.5)'
              }}
            >
              {title}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfter;
