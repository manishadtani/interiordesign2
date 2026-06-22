"use client";

/**
 * ContactForm Component
 * "Zip Open & Curvy Paper Unfold" Animation
 * Scroll 10vh-60vh: A thin white vertical line (zip) grows downwards.
 * Scroll 60vh-100vh: The line expands horizontally with a curvy (ellipse) clip-path, smoothing out into the full rectangular form.
 */

import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const sectionRef = useRef(null);
  const formBoxRef = useRef(null);
  const labelRef = useRef(null);
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

  // --- Validation Logic ---
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
      case 'description':
        if (value.length < 10) error = "Min 10 characters required";
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
    if (formData.hp_field) return; // Silent block for bots

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

  // --- Responsiveness & GSAP ---
  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current || !formBoxRef.current) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=80%', 
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            snap: {
              snapTo: [0, 0.5, 1],
              duration: 0.4,
              ease: 'power1.inOut',
              delay: 0,
            },
          },
        });

        gsap.set(formBoxRef.current, {
          width: '4px', height: '0%', opacity: 0,
          clipPath: 'ellipse(200% 200% at 50% 50%)', borderRadius: '2px',
        });

        const formContents = formBoxRef.current.children;
        gsap.set(formContents, { opacity: 0 });

        tl.to(formBoxRef.current, { height: '80vh', opacity: 1, ease: 'none', duration: 0.5 })
          .to(labelRef.current, { y: '80vh', opacity: 1, ease: 'none', duration: 0.5 }, 0)
          .to(labelRef.current, { opacity: 0, duration: 0.1 })
          .to(formBoxRef.current, { 
            width: '90%', maxWidth: '1000px', borderRadius: '0px', 
            clipPath: 'ellipse(150% 150% at 50% 50%)', ease: 'power2.inOut', duration: 0.4 
          })
          .to(formBoxRef.current, { clipPath: 'ellipse(200% 200% at 50% 50%)', duration: 0.1 }, '-=0.1')
          .to(formContents, { opacity: 1, duration: 0.2, ease: 'power1.out' }, '-=0.2');
      }, sectionRef);

      return () => ctx.revert();
    };

    initGSAP();

  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact-form-section" style={sectionStyle}>
      <div style={noiseOverlayStyle} />

      <div ref={formBoxRef} style={formBoxStyle}>
        <h2 
          className="font-display"
          style={{ 
            fontWeight: 400, 
            color: '#2b2b2b', 
            lineHeight: 1.1, 
            textAlign: 'center', 
            marginBottom: '2rem',
            fontSize: isMobile ? 'clamp(1.7rem, 5vw, 2.3rem)' : 'clamp(2.5rem, 4vw, 3rem)' 
          }}
        >
          Design The Home You've <br /> Always Imagined
        </h2>

        <form style={{ ...formGridStyle, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }} onSubmit={handleSubmit}>
          {/* Honey Pot */}
          <input type="text" name="hp_field" value={formData.hp_field} onChange={handleChange} style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

          <div style={inputWrapperStyle}>
            <input name="name" type="text" placeholder="Name*" value={formData.name} onChange={handleChange} style={inputStyle(errors.name)} />
            {errors.name && <span style={errorLabelStyle}>{errors.name}</span>}
          </div>
          <div style={inputWrapperStyle}>
            <input name="phone" type="tel" placeholder="Phone No.*" value={formData.phone} onChange={handleChange} style={inputStyle(errors.phone)} />
            {errors.phone && <span style={errorLabelStyle}>{errors.phone}</span>}
          </div>
          <div style={inputWrapperStyle}>
            <input name="email" type="email" placeholder="Email*" value={formData.email} onChange={handleChange} style={inputStyle(errors.email)} />
            {errors.email && <span style={errorLabelStyle}>{errors.email}</span>}
          </div>
          <div style={inputWrapperStyle}>
            <input name="city" type="text" placeholder="City*" value={formData.city} onChange={handleChange} style={inputStyle(errors.city)} />
            {errors.city && <span style={errorLabelStyle}>{errors.city}</span>}
          </div>

          <div style={{ ...inputWrapperStyle, gridColumn: isMobile ? 'auto' : '1 / -1', marginTop: '1rem' }}>
            <input name="description" type="text" placeholder="Description*" value={formData.description} onChange={handleChange} style={inputStyle(errors.description)} />
            {errors.description && <span style={errorLabelStyle}>{errors.description}</span>}
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem' }}>
            {errors.submit && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginBottom: '8px' }}>{errors.submit}</p>}
            <button type="submit" disabled={isSending} style={submitBtnStyle} className="group font-body">
              {isSending ? 'Sending...' : 'Submit'}
              <div style={underlineStyle} className="group-hover:scale-x-110" />
            </button>
          </div>
        </form>
      </div>

      <div ref={labelRef} style={labelContainerStyle}>
        <span style={labelTextStyle} className="font-body">Scroll to explore</span>
        <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.6)' }} />
      </div>
    </section>
  );
};

// --- Static Styles ---
const sectionStyle = { 
  position: 'relative', 
  width: '100%', 
  height: '100vh', 
  backgroundImage: `url(/images/contactbg.jpg)`, 
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  display: 'flex', 
  alignItems: 'flex-start', 
  justifyContent: 'center', 
  paddingTop: '10vh', 
  overflow: 'hidden', 
  zIndex: 10 
};

const noiseOverlayStyle = { 
  position: 'absolute', 
  inset: 0, 
  width: '100%', 
  height: '100%', 
  opacity: 0.35, 
  pointerEvents: 'none', 
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, 
  mixBlendMode: 'overlay', 
  zIndex: 1 
};

const formBoxStyle = { 
  backgroundColor: '#ffffff', 
  boxShadow: '0 0 50px rgba(0,0,0,0.3)', 
  marginTop: '0', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center', 
  padding: '2rem', 
  willChange: 'width, height, clip-path', 
  overflow: 'hidden' 
};

const formGridStyle = { 
  width: '100%', 
  maxWidth: '600px', 
  display: 'grid', 
  gap: '1.5rem 3rem' 
};

const inputWrapperStyle = { 
  position: 'relative', 
  width: '100%' 
};

const inputStyle = (hasError) => ({ 
  width: '100%', 
  border: 'none', 
  borderBottom: hasError ? '1px solid #ff4d4d' : '1px solid #dcdcdc', 
  padding: '0.8rem 0', 
  fontSize: '1rem', 
  color: '#2b2b2b', 
  backgroundColor: 'transparent', 
  outline: 'none', 
  transition: 'border-color 0.3s' 
});

const errorLabelStyle = { 
  position: 'absolute', 
  bottom: '-16px', 
  left: 0, 
  fontSize: '0.65rem', 
  color: '#ff4d4d', 
  fontWeight: 500 
};

const submitBtnStyle = { 
  background: 'transparent', 
  border: 'none', 
  fontSize: '1.05rem', 
  color: '#2b2b2b', 
  cursor: 'pointer', 
  position: 'relative', 
  textTransform: 'capitalize', 
  display: 'inline-flex', 
  flexDirection: 'column', 
  alignItems: 'center' 
};

const underlineStyle = { 
  height: '1px', 
  width: '100%', 
  backgroundColor: '#2b2b2b', 
  marginTop: '4px', 
  transition: 'transform 0.3s ease', 
  transformOrigin: 'left' 
};

const labelContainerStyle = { 
  position: 'absolute', 
  top: '10vh', 
  left: '50%', 
  transform: 'translateX(-50%)', 
  opacity: 0, 
  pointerEvents: 'none', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  gap: '25px', 
  zIndex: 20 
};

const labelTextStyle = { 
  fontSize: '0.7rem', 
  color: '#ffffff', 
  letterSpacing: '0.25em', 
  textTransform: 'uppercase', 
  fontWeight: 600, 
  whiteSpace: 'nowrap' 
};

export default ContactForm;
