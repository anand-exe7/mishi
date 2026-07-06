"use client";

import { useEffect, useRef, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Phone, Mail, ArrowRight, Quote, ShieldCheck, Globe, Clock, MapPin, Sparkles, Leaf, Droplets, Wind, Sun, Heart, Plus, Minus } from "lucide-react";
import { ReactLenis, useLenis } from 'lenis/react';

const playfair = Playfair_Display({ subsets: ["latin"] });

const products = [
  { name: "Cup Sambrani", desc: "A traditional aromatic product used in many homes to create a pure and peaceful environment.", img: "https://images.unsplash.com/photo-1608222384784-2197171e2e0e?q=80&w=600&auto=format&fit=crop" },
  { name: "Computer Sambrani", desc: "A modern and convenient form of traditional sambrani.", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop" },
  { name: "Cone Sambrani", desc: "Crafted to spread a rich and soothing fragrance.", img: "https://images.unsplash.com/photo-1596434452187-578f7ebaf9fc?q=80&w=600&auto=format&fit=crop" },
  { name: "Dhoop Sticks", desc: "Known for their rich and long-lasting fragrance.", img: "https://images.unsplash.com/photo-1611077543666-c9535730a911?q=80&w=600&auto=format&fit=crop" },
  { name: "Agarbathi", desc: "Creates a calm, refreshing, and spiritually uplifting atmosphere.", img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600&auto=format&fit=crop" },
  { name: "Camphor", desc: "A powerful and sacred element widely used in spiritual rituals.", img: "https://images.unsplash.com/photo-1608681283626-444747715f5c?q=80&w=600&auto=format&fit=crop" },
];

const flags = [
  { name: "Malaysia", code: "my" },
  { name: "Singapore", code: "sg" },
  { name: "Mauritius", code: "mu" },
  { name: "Dubai", code: "ae" },
  { name: "Sri Lanka", code: "lk" },
  { name: "USA", code: "us" },
  { name: "Nigeria", code: "ng" }
];

const aromas = [
  { id: 1, name: "Sacred Sandalwood", description: "Deep, woody, and grounding. Ideal for intense meditation and spiritual focus.", img: "https://images.unsplash.com/photo-1608222384784-2197171e2e0e?q=80&w=800&auto=format&fit=crop" },
  { id: 2, name: "Divine Rose", description: "Soft, floral, and uplifting. Creates an aura of love, peace, and gentle positivity.", img: "https://images.unsplash.com/photo-1596434452187-578f7ebaf9fc?q=80&w=800&auto=format&fit=crop" },
  { id: 3, name: "Mystic Loban", description: "Rich, earthy, and cleansing. Traditionally used to purify spaces and ward off negativity.", img: "https://images.unsplash.com/photo-1611077543666-c9535730a911?q=80&w=800&auto=format&fit=crop" },
  { id: 4, name: "Pure Camphor", description: "Crisp, intense, and awakening. Instantly elevates the energy of any room.", img: "https://images.unsplash.com/photo-1608681283626-444747715f5c?q=80&w=800&auto=format&fit=crop" }
];

const faqs = [
  { q: "How long does the fragrance last after burning?", a: "Our pure natural ingredients ensure that the divine aroma lingers in your space for 4-6 hours after the sambrani has fully burned." },
  { q: "Are your products safe for indoor use?", a: "Absolutely. We strictly use 100% natural herbs, resins, and essential oils with zero synthetic chemicals, making them safe for daily indoor use." },
  { q: "Do you offer bulk or wholesale pricing?", a: "Yes, we specialize in bulk orders and third-party manufacturing. Please contact us directly for catalog and wholesale pricing details." },
  { q: "What makes Mishi Pooja Products unique?", a: "Our commitment to ancestral formulas. We don't just create fragrances; we craft spiritual experiences using recipes passed down through generations." }
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "20%"]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.15], ["blur(0px)", "blur(20px)"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeAroma, setActiveAroma] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (lenis) {
      lenis.scrollTo(id, { offset: -80, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
  };

  const fadeBlurVariants = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 30 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const popUpVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        delay: i * 0.1, 
        type: "spring" as const, 
        stiffness: 150, 
        damping: 12,
        mass: 0.8
      }
    })
  };

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <div className="bg-white text-zinc-900 min-h-screen font-sans selection:bg-amber-600/30 selection:text-amber-900 overflow-x-hidden">
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes wave-flag {
            0% { transform: perspective(600px) rotateY(-10deg) rotateX(5deg) skewY(1deg); }
            50% { transform: perspective(600px) rotateY(15deg) rotateX(-5deg) skewY(-1deg); }
            100% { transform: perspective(600px) rotateY(-10deg) rotateX(5deg) skewY(1deg); }
          }
          .flag-realistic {
            animation: wave-flag 4s ease-in-out infinite;
            transform-origin: center left;
            box-shadow: -5px 10px 20px rgba(0,0,0,0.3), inset 5px 0 20px rgba(255,255,255,0.2), inset -5px 0 20px rgba(0,0,0,0.2);
            border-radius: 4px;
          }
          .flag-shadow {
            background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.15) 50%, rgba(255,255,255,0.1) 100%);
            mix-blend-mode: overlay;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
            display: flex;
            width: max-content;
          }
          @keyframes spin-slow {
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 12s linear infinite;
          }
          .clip-diagonal {
            clip-path: polygon(0 0, 100% 10vw, 100% 100%, 0 calc(100% - 10vw));
          }
          .vertical-text {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transform: rotate(180deg);
          }
        `}} />

        {/* Dynamic Navbar */}
        <nav className={`fixed top-0 left-0 right-0 z-50 p-4 px-6 md:px-12 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-zinc-200/50 py-3 text-zinc-900' : 'bg-transparent py-6 text-white'}`}>
          <div className="flex items-center">
            <div className={`transition-all duration-300 ${isScrolled ? '' : 'bg-white/90 p-1.5 px-3 rounded-xl shadow-lg backdrop-blur-md'}`}>
              <img 
                src="/logo.webp" 
                alt="Mishi Pooja Products" 
                className="h-8 md:h-12 w-auto object-contain" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  (e.target as HTMLElement).nextElementSibling?.classList.remove('hidden');
                }} 
              />
              <span className={`hidden text-2xl font-bold tracking-widest ${playfair.className} uppercase text-zinc-900`}>
                Mishi
              </span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-semibold">
            <button onClick={() => scrollTo('#home')} className={`transition-colors ${isScrolled ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}>Home</button>
            <button onClick={() => scrollTo('#about')} className={`transition-colors ${isScrolled ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}>About</button>
            <button onClick={() => scrollTo('#exports')} className={`transition-colors ${isScrolled ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}>Exports</button>
            <button onClick={() => scrollTo('#products')} className={`transition-colors ${isScrolled ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}>Products</button>
            <button onClick={() => scrollTo('#contact')} className={`transition-colors ${isScrolled ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}>Contact</button>
          </div>
          <button onClick={() => scrollTo('#contact')} className={`px-6 py-2 border rounded-full text-xs uppercase tracking-widest font-bold transition-all shadow-md ${isScrolled ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700' : 'bg-white/10 text-white border-white/30 hover:bg-white hover:text-black backdrop-blur-sm'}`}>
            Enquire Now
          </button>
        </nav>

        {/* Hero Section with Blur Scroll Transition */}
        <motion.section 
          id="home" 
          style={{ y: heroY, filter: heroBlur, opacity: heroOpacity }}
          className="relative h-screen w-full overflow-hidden bg-black text-white origin-top"
        >
          <div className="absolute inset-0 w-full h-full">
            <video autoPlay loop muted playsInline poster="https://images.unsplash.com/photo-1608222384784-2197171e2e0e?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 scale-105">
              <source src="/bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
          </div>

          <div className="relative z-10 w-full h-full p-8 md:p-16 flex flex-col justify-between pointer-events-none">
            <div className="pt-24">
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 1 }} className="text-xs md:text-sm tracking-[0.3em] uppercase text-amber-200/90 font-semibold drop-shadow-md">
                EST. 2024
              </motion.p>
            </div>

            <div className={`w-full flex-1 relative ${playfair.className}`}>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1.2 }} className="absolute top-[10%] left-0 text-5xl md:text-8xl lg:text-[10rem] leading-none uppercase bg-clip-text text-transparent bg-gradient-to-b from-amber-100 to-amber-600 drop-shadow-2xl">
                Sanctify
              </motion.h1>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2 }} className="absolute top-[40%] right-[5%] md:right-[15%] text-4xl md:text-7xl lg:text-[8rem] leading-none uppercase text-gray-300 drop-shadow-2xl">
                Your
              </motion.h1>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1.2 }} className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-6xl md:text-9xl lg:text-[12rem] leading-none uppercase bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-100 to-gray-500 drop-shadow-2xl">
                Space
              </motion.h1>
            </div>

            <div className="flex justify-between items-end pb-8 pointer-events-auto">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => scrollTo('#about')} className="flex items-center gap-3 px-8 py-4 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-amber-500/20 transition-colors text-amber-50 shadow-[0_0_20px_rgba(217,119,6,0.2)]">
                Discover More <ArrowRight size={16} />
              </motion.button>
              
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-gray-400">Scroll down</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-amber-500 to-transparent"></div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Advanced About Section */}
        <section id="about" className="py-32 px-6 md:px-16 max-w-[1400px] mx-auto bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-50 rounded-l-[5rem] -z-10 transform translate-x-10"></div>
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-1/2 relative z-10">
              <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-6 font-bold flex items-center gap-3">
                <div className="w-12 h-[1px] bg-amber-600"></div> The Mishi Legacy
              </h3>
              <h2 className={`text-5xl md:text-7xl text-zinc-900 mb-8 leading-[1.1] ${playfair.className}`}>
                Forged in Excellence, Delivered with Trust
              </h2>
              <div className="text-zinc-600 text-lg font-light leading-relaxed space-y-6 relative">
                <div className={`absolute -top-16 -left-12 text-[15rem] text-zinc-100 opacity-50 z-[-1] ${playfair.className} pointer-events-none`}>
                  "
                </div>
                <p>We are a dedicated manufacturer of premium quality Cup Sambrani, Computer Sambrani, Cone Sambrani, Dhoop Sticks, and Agarbathi, crafted to create a pure and refreshing atmosphere.</p>
                <p>Our products are made using carefully selected natural ingredients to ensure long-lasting fragrance and a pleasant spiritual experience. With a strong commitment to quality and tradition, we focus on delivering products that enhance daily prayers, meditation, and home purification.</p>
              </div>
            </motion.div>

            <div className="w-full lg:w-1/2 relative h-[400px] md:h-[600px] flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 50, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, type: "spring" }}
                className="absolute left-0 top-10 w-2/3 h-2/3 rounded-3xl overflow-hidden shadow-2xl border-8 border-white z-20"
              >
                <img src="https://images.unsplash.com/photo-1542644265-0bc1d7fc484a?q=80&w=800&auto=format&fit=crop" alt="Spiritual" className="w-full h-full object-cover" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50, rotate: 5 }}
                whileInView={{ opacity: 1, x: 0, rotate: 3 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="absolute right-0 bottom-10 w-2/3 h-2/3 rounded-3xl overflow-hidden shadow-2xl border-8 border-white z-10"
              >
                <img src="https://images.unsplash.com/photo-1615592389070-bcc97e0504d3?q=80&w=800&auto=format&fit=crop" alt="Incense" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-amber-600 text-amber-50 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
              >
                <div className="relative w-full h-full animate-spin-slow">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-amber-100">
                    <path id="curve" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                    <text width="100" className="text-[12px] uppercase tracking-[3px] font-bold" fill="currentColor">
                      <textPath href="#curve" startOffset="50%" textAnchor="middle">
                        • 100% NATURAL • PREMIUM QUALITY 
                      </textPath>
                    </text>
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl">
                  24
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* EXTRA COMPONENT 1: Spiritual Benefits */}
        <section className="py-24 bg-amber-50 overflow-hidden relative border-y border-amber-100">
          <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
            <Sparkles size={400} />
          </div>
          <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
            <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
              <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-4 font-bold">The Essence</h3>
              <h2 className={`text-4xl md:text-5xl text-zinc-900 ${playfair.className} mb-6`}>Spiritual Benefits</h2>
              <p className="text-zinc-600 max-w-2xl mx-auto font-light">Incorporating pure Sambrani and Agarbathi into your daily routine offers profound effects on the mind, body, and space.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Wind, title: "Purifies the Air", desc: "Clears out negative energy and neutralizes foul odors organically." },
                { icon: Sparkles, title: "Deepens Meditation", desc: "The soothing aroma helps center the mind for deeper spiritual focus." },
                { icon: Sun, title: "Invokes Positivity", desc: "Uplifts the mood and creates a warm, welcoming aura in any room." },
                { icon: Heart, title: "Reduces Stress", desc: "Natural essential oils act as a gentle relaxant for the nervous system." }
              ].map((benefit, i) => (
                <motion.div 
                  key={i}
                  custom={i}
                  variants={popUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                    <benefit.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">{benefit.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EXTRA COMPONENT: Expanding Aroma Gallery */}
        <section className="py-24 bg-white max-w-[1400px] mx-auto px-6 md:px-16">
          <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
            <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-4 font-bold">Discover Your Aura</h3>
            <h2 className={`text-4xl md:text-6xl text-zinc-900 ${playfair.className}`}>Aroma Profiles</h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row h-[700px] lg:h-[600px] gap-4 w-full">
            {aromas.map((aroma, i) => (
              <motion.div 
                key={aroma.id}
                onMouseEnter={() => setActiveAroma(i)}
                onClick={() => setActiveAroma(i)}
                animate={{ flex: activeAroma === i ? 3 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="relative rounded-3xl overflow-hidden cursor-pointer group"
              >
                <img src={aroma.img} className="absolute inset-0 w-full h-full object-cover" alt={aroma.name} />
                <div className={`absolute inset-0 transition-opacity duration-700 ${activeAroma === i ? 'bg-black/40' : 'bg-black/60 group-hover:bg-black/50'}`} />
                
                <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-end transition-all duration-500 ${activeAroma === i ? 'opacity-100' : 'lg:opacity-0'}`}>
                  <h3 className={`text-2xl md:text-3xl lg:text-4xl text-white font-bold mb-2 md:mb-3 ${playfair.className}`}>{aroma.name}</h3>
                  <AnimatePresence>
                    {activeAroma === i && (
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 20 }} 
                        className="text-zinc-200 text-xs md:text-sm max-w-sm leading-relaxed hidden lg:block"
                      >
                        {aroma.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className={`absolute inset-0 flex items-center justify-center p-8 transition-all duration-500 hidden lg:flex ${activeAroma === i ? 'opacity-0' : 'opacity-100'}`}>
                  <h3 className={`text-2xl text-white font-bold whitespace-nowrap vertical-text ${playfair.className}`}>{aroma.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Global Reach / Flags Section */}
        <section id="exports" className="py-32 px-6 md:px-16 bg-white overflow-hidden relative">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-[1400px] mx-auto text-center relative z-10">
            <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-6 font-bold">Global Reach</h3>
              <h2 className={`text-5xl md:text-7xl text-zinc-900 mb-6 ${playfair.className}`}>Our Exports & Imports</h2>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-12 md:gap-20">
              {flags.map((flag, i) => (
                <motion.div 
                  key={flag.name} 
                  custom={i}
                  variants={popUpVariants} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-50px" }} 
                  className="flex flex-col items-center gap-6 group"
                >
                  <div className="w-28 h-20 md:w-40 md:h-28 relative">
                    <div className="absolute left-0 top-[-10px] bottom-[-20px] w-1.5 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-md z-0"></div>
                    <div className="absolute inset-0 left-1 flag-realistic z-10 overflow-hidden" style={{ animationDelay: `${i * -0.7}s` }}>
                      <img src={`https://flagcdn.com/w320/${flag.code}.png`} alt={flag.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flag-shadow pointer-events-none"></div>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-700 group-hover:text-amber-600 transition-colors mt-4 bg-zinc-50 px-4 py-1 rounded-full shadow-sm border border-zinc-100">{flag.name}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EXTRA COMPONENT 2: Symphony of Fragrances (Ingredients Parallax) */}
        <section className="relative py-40 clip-diagonal bg-black text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=1920&auto=format&fit=crop" alt="Ingredients" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          </div>
          
          <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
            <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl">
              <h3 className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-3">
                <div className="w-12 h-[1px] bg-amber-500"></div> The Ingredients
              </h3>
              <h2 className={`text-5xl md:text-7xl mb-8 leading-[1.1] ${playfair.className}`}>A Symphony of Pure Fragrances</h2>
              <p className="text-zinc-300 font-light text-lg mb-12 leading-relaxed">
                We believe that true spiritual connection requires absolute purity. That is why our products are formulated using a highly guarded blend of indigenous forest herbs, natural tree resins like Loban, Sandalwood extracts, and organic essential oils. No harmful chemicals, just nature's divine breath.
              </p>
              <div className="flex flex-wrap gap-4">
                {['Sandalwood', 'Pure Camphor', 'Natural Resins'].map((tag, i) => (
                  <span key={i} className="px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-amber-50">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Standard Products Grid Section */}
        <section id="products" className="py-32 px-6 md:px-16 max-w-[1400px] mx-auto">
          <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-200 pb-12">
            <div>
              <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-6 font-bold flex items-center gap-3">
                <div className="w-12 h-[1px] bg-amber-600"></div> Our Collection
              </h3>
              <h2 className={`text-5xl md:text-7xl text-zinc-900 ${playfair.className}`}>Traditional Aroma</h2>
            </div>
            <p className="text-zinc-600 max-w-md font-light text-lg">Explore our wide range of meticulously crafted pooja essentials, designed for your spiritual journey.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <motion.div 
                key={product.name} 
                custom={i}
                variants={popUpVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }} 
                className="group flex flex-col bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-full h-72 overflow-hidden relative bg-zinc-100">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-8 flex flex-col flex-1 bg-white">
                  <h3 className={`text-3xl text-zinc-900 mb-3 ${playfair.className}`}>{product.name}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-8 flex-1">{product.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EXTRA COMPONENT: Wisdom & Queries (Animated FAQ) */}
        <section className="py-24 bg-zinc-50 border-y border-zinc-200">
          <div className="max-w-[800px] mx-auto px-6 md:px-16">
            <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
              <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-4 font-bold">Curiosity</h3>
              <h2 className={`text-4xl md:text-5xl text-zinc-900 ${playfair.className}`}>Wisdom & Queries</h2>
            </motion.div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div 
                  key={i}
                  variants={fadeBlurVariants} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden"
                >
                  <button 
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-zinc-50 transition-colors"
                  >
                    <span className="font-bold text-zinc-800 pr-8">{faq.q}</span>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openFAQ === i ? 'bg-amber-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                      {openFAQ === i ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFAQ === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-8 pb-6 text-zinc-600 font-light leading-relaxed border-t border-zinc-100 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews Scrolling Marquee */}
        <section className="py-24 bg-amber-50 overflow-hidden border-y border-amber-100">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-12">
            <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className={`text-4xl md:text-5xl text-zinc-900 ${playfair.className}`}>What Our Devotees Say</h2>
            </motion.div>
          </div>

          <div className="relative w-full flex overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-amber-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-50 to-transparent z-10"></div>
            
            <div className="animate-marquee hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex gap-4 md:gap-8 px-2 md:px-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-[300px] md:w-[400px] bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-amber-100/50 flex-shrink-0">
                      <Quote className="text-amber-300 mb-6" size={40} />
                      <p className="text-zinc-600 italic mb-8 font-light leading-relaxed text-sm md:text-base">
                        "The purity and fragrance of these products are unmatched. It instantly elevates the spiritual ambiance of my home during prayers. Highly recommended for daily use!"
                      </p>
                      <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-lg">
                          {String.fromCharCode(64 + i)}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-xs md:text-sm uppercase tracking-wider">Devotee {i}</h4>
                          <p className="text-[10px] md:text-xs text-zinc-500 mt-1">Verified Buyer</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map & Contact Section */}
        <section id="contact" className="py-24 md:py-32 px-6 md:px-16 max-w-[1400px] mx-auto">
          <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col lg:flex-row gap-0 rounded-[3rem] overflow-hidden bg-zinc-900 text-white shadow-2xl">
            <div className="w-full lg:w-1/2 p-12 md:p-24 flex flex-col justify-center">
              <h3 className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 font-bold">Visit Us</h3>
              <h2 className={`text-4xl md:text-6xl mb-8 ${playfair.className}`}>Experience Pure Devotion</h2>
              <p className="text-zinc-400 font-light mb-16 text-lg">Reach out for bulk orders, third-party manufacturing, or general queries. We are here to serve you.</p>
              
              <ul className="space-y-10 text-zinc-300 text-sm">
                <li className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors"><MapPin size={24} /></div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Address</p>
                    <p className="text-lg leading-relaxed max-w-xs text-white">213/6A, Eripattai, Chembarambakkam, Chennai – 600 123.</p>
                  </div>
                </li>
                <li className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Phone size={24} /></div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Phone</p>
                    <a href="tel:+918056101114" className="hover:text-amber-400 transition-colors text-lg text-white block mt-1">+91 80561 01114</a>
                  </div>
                </li>
                <li className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Mail size={24} /></div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Email</p>
                    <a href="mailto:mishipoojaproducts@gmail.com" className="hover:text-amber-400 transition-colors text-lg text-white block mt-1 break-all">mishipoojaproducts@gmail.com</a>
                  </div>
                </li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 h-[500px] lg:h-auto bg-zinc-800 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.054593925763!2d80.0381669!3d13.032223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528acaf3c9f2b3%3A0xc6ed7fb0c92bb214!2sChembarambakkam%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                className="absolute inset-0 grayscale contrast-125 opacity-70 mix-blend-luminosity hover:grayscale-0 hover:opacity-100 hover:mix-blend-normal transition-all duration-1000"
              ></iframe>
            </div>
          </motion.div>
        </section>

        {/* Exactly Replicated Minimalist Dark Footer */}
        <footer className="bg-[#050806] text-zinc-400 py-6 border-t border-zinc-900">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
            
            <div className="text-zinc-400">
              © 2026 Mishi Pooja Products. All Rights Reserved
            </div>
            
            <div className="text-zinc-400">
              Powered by <span className="text-zinc-200">Cenexa Systems</span> © 2026
            </div>
            
            <div className="text-zinc-300">
              PURITY • TRADITION • DEVOTION
            </div>

          </div>
        </footer>

      </div>
    </ReactLenis>
  );
}
