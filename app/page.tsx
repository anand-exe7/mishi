"use client";

import { useEffect, useRef, useState } from "react";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Phone,
  Mail,
  ArrowRight,
  Quote,
  ShieldCheck,
  Globe,
  Clock,
  MapPin,
  Sparkles,
  Leaf,
  Droplets,
  Wind,
  Sun,
  Heart,
  Plus,
  Minus,
  Play,
  User,
  ShoppingCart,
  Menu,
  X,
  
  
} from "lucide-react";
import { ReactLenis, useLenis } from "lenis/react";
import Link from "next/link";
const InstagramIcon = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({ subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const products = [
  {
    name: "Cup Sambrani",
    desc: "A traditional aromatic product used in many homes to create a pure and peaceful environment.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg",
  },
  {
    name: "Computer Sambrani",
    desc: "A modern and convenient form of traditional sambrani.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-4.jpg",
  },
  {
    name: "Cone Sambrani",
    desc: "Crafted to spread a rich and soothing fragrance.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr1.jpg",
  },
  {
    name: "Dhoop Sticks",
    desc: "Known for their rich and long-lasting fragrance.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr2.jpg",
  },
  {
    name: "Agarbathi",
    desc: "Creates a calm, refreshing, and spiritually uplifting atmosphere.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr3.jpg",
  },
  {
    name: "Camphor",
    desc: "A powerful and sacred element widely used in spiritual rituals.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr4.jpg",
  },
];

const flags = [
  { name: "Malaysia", gifName: "Malaysia" },
  { name: "Singapore", gifName: "Singapore" },
  { name: "Mauritius", gifName: "Mauritius" },
  { name: "Dubai", gifName: "United-Arab-Emirates" },
  { name: "Sri Lanka", gifName: "Sri-Lanka" },
  { name: "USA", gifName: "USA" },
  { name: "Nigeria", gifName: "Nigeria" },
];

const aromas = [
  {
    id: 1,
    name: "Sacred Sandalwood",
    description:
      "Deep, woody, and grounding. Ideal for intense meditation and spiritual focus.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr5.jpg",
  },
  {
    id: 2,
    name: "Divine Rose",
    description:
      "Soft, floral, and uplifting. Creates an aura of love, peace, and gentle positivity.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img1.jpg",
  },
  {
    id: 3,
    name: "Mystic Loban",
    description:
      "Rich, earthy, and cleansing. Traditionally used to purify spaces and ward off negativity.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img2.jpg",
  },
  {
    id: 4,
    name: "Pure Camphor",
    description:
      "Crisp, intense, and awakening. Instantly elevates the energy of any room.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Panchagavya-Vilaku.jpg",
  },
];

const faqs = [
  {
    q: "How long does the fragrance last after burning?",
    a: "Our pure natural ingredients ensure that the divine aroma lingers in your space for 4-6 hours after the sambrani has fully burned.",
  },
  {
    q: "Are your products safe for indoor use?",
    a: "Absolutely. We strictly use 100% natural herbs, resins, and essential oils with zero synthetic chemicals, making them safe for daily indoor use.",
  },
  {
    q: "Do you offer bulk or wholesale pricing?",
    a: "Yes, we specialize in bulk orders and third-party manufacturing. Please contact us directly for catalog and wholesale pricing details.",
  },
  {
    q: "What makes Mishi Pooja Products unique?",
    a: "Our commitment to ancestral formulas. We don't just create fragrances; we craft spiritual experiences using recipes passed down through generations.",
  },
];

const galleryImages = [
  "/gallery/gallery_setup_1783444417350.png",
  "/gallery/gallery_camphor_1783444405030.png",
  "/gallery/gallery_ingredients_1783444379768.png",
  "/gallery/gallery_sambrani_1783444367509.png",
  "/gallery/gallery_powders_1783444427961.png",
  "/gallery/gallery_incense_1783444391666.png",
];

const reelVideos = ["/bg.webm", "/bg.webm", "/bg.webm", "/bg.webm"];


const IncenseSmoke = ({ flip = false }: { flip?: boolean }) => (
  <div className={`absolute -bottom-8 ${flip ? '-right-4 md:right-8 lg:right-16' : '-left-4 md:left-8 lg:left-16'} z-20 pointer-events-none opacity-80 md:opacity-100 scale-100 md:scale-125 lg:scale-150 origin-bottom`}>
    <div className={`relative flex flex-col items-center ${flip ? '-rotate-[20deg]' : 'rotate-[20deg]'}`}>
      {/* Smoke Animations */}
      <div className="absolute bottom-[100%] w-0.5 h-64 overflow-visible flex flex-col-reverse items-center">
         <motion.div
            initial={{ opacity: 0, y: 10, scale: 1, filter: "blur(4px)" }}
            animate={{ opacity: [0, 0.7, 0], y: -150, scale: 7, x: flip ? -40 : 40 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            className="w-6 h-20 bg-neutral-200/40 rounded-[100%]"
         />
         <motion.div
            initial={{ opacity: 0, y: 10, scale: 1, filter: "blur(8px)" }}
            animate={{ opacity: [0, 0.6, 0], y: -220, scale: 9, x: flip ? -60 : 60 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
            className="w-8 h-24 bg-neutral-300/30 rounded-[100%] absolute bottom-10"
         />
         <motion.div
            initial={{ opacity: 0, y: 10, scale: 1, filter: "blur(6px)" }}
            animate={{ opacity: [0, 0.5, 0], y: -300, scale: 12, x: flip ? -90 : 90 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeOut", delay: 3 }}
            className="w-10 h-32 bg-neutral-200/20 rounded-[100%] absolute bottom-20"
         />
      </div>
      
      {/* Incense Stick Image */}
      <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr3.jpg" 
           alt="Incense" 
           className="w-12 h-64 object-cover rounded-full shadow-2xl border-4 border-emerald-900/20"
           style={{ clipPath: "polygon(40% 0%, 60% 0%, 60% 100%, 40% 100%)" }}
      />
      {/* Glowing tip */}
      <div className="absolute top-0 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_25px_8px_rgba(249,115,22,1)] z-10 animate-pulse" />
      {/* Base holder */}
      <div className="w-20 h-4 bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-full mt-[-6px] shadow-xl border-b-[3px] border-emerald-900 z-10" />
    </div>
  </div>
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "20%"]);
  const heroBlur = useTransform(
    scrollYProgress,
    [0, 0.15],
    ["blur(0px)", "blur(20px)"],
  );
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeAroma, setActiveAroma] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("250g");
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
      lenis.scrollTo(id, {
        offset: -80,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  const fadeBlurVariants = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 30 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
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
        mass: 0.8,
      },
    }),
  };

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <div className={`bg-neutral-50 text-neutral-900 min-h-screen ${outfit.className} selection:bg-emerald-600/30 selection:text-emerald-900 overflow-x-hidden`}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
        `,
          }}
        />

        {/* New Navbar */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-xl shadow-lg border border-white/50" : "bg-white/50 backdrop-blur-md border border-white/20 shadow-sm"}`}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <Link href="/">
              <img src="/logo.webp" alt="Mishi" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
          </div>
          
          <div className={`hidden md:flex gap-8 text-xs uppercase tracking-widest font-semibold text-neutral-800`}>
           <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
           <Link href="/#about" className="hover:text-emerald-600 transition-colors">Heritage</Link>
           <Link href="/#products" className="hover:text-emerald-600 transition-colors">Collection</Link>
           <Link href="/products" className="hover:text-emerald-600 transition-colors">Products</Link>
        </div>

          <div className={`flex gap-4 items-center text-neutral-800`}>
            <Link href="/profile" className="p-2 hover:bg-emerald-500/10 rounded-full transition-colors"><User size={18} /></Link>
            <Link href="/cart" className="p-2 hover:bg-emerald-500/10 rounded-full transition-colors relative">
               <ShoppingCart size={18} />
               <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-600 rounded-full"></span>
            </Link>
          </div>
        </motion.nav>

        {/* New Hero Section */}
        <section id="home" className="relative pt-32 pb-20 px-8 lg:px-20 min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#faf9f6]">
           <IncenseSmoke />
           <IncenseSmoke flip />
           
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
              <motion.div style={{ y: heroY }} className="w-full h-full opacity-40">
                 <img src="https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover blur-[2px]" alt="Background" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6] via-[#faf9f6]/95 to-[#faf9f6]"></div>
              {/* Premium Glowing Orbs */}
              <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-emerald-200/50 rounded-full blur-[120px] mix-blend-multiply"></div>
              <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-emerald-300/40 rounded-full blur-[150px] mix-blend-multiply"></div>
           </div>
           
           <div className="relative z-10 max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
              <div className="w-full lg:w-5/12 flex flex-col items-start text-left relative z-20">
                 <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, type: "spring" }}
                 >
                    <span className="px-5 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs md:text-sm font-bold uppercase tracking-widest mb-6 inline-block shadow-sm">
                       100% Pure & Natural
                    </span>
                 </motion.div>
                 
                 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <motion.h1 
                       animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                       className={`text-6xl md:text-7xl lg:text-[7rem] text-emerald-950 leading-[0.9] mb-8 ${cormorant.className}`}
                    >
                       Awaken <br/><span className="text-emerald-700 italic relative inline-block">Your Senses
                          <motion.span 
                             initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
                             className="absolute -bottom-2 left-0 w-full h-[2px] bg-emerald-300 origin-left rounded-full"
                          />
                       </span>
                    </motion.h1>
                 </motion.div>
                 
                 <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="text-neutral-600 text-lg md:text-xl font-light mb-6 max-w-lg leading-relaxed"
                 >
                    Immerse yourself in a divine aura with our masterfully blended agarbathis and traditional pooja essentials. Sourced from the finest Himalayan herbs and natural resins.
                 </motion.p>
                 
                 <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="text-emerald-800 font-semibold mb-10 text-sm tracking-wide"
                 >
                    ✨ Elevate your space. Soothe your soul.
                 </motion.p>

                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex gap-4">
                    <button onClick={() => scrollTo("#products")} className="px-8 py-4 bg-emerald-900 text-white rounded-full hover:bg-emerald-800 transition-all flex items-center gap-3 text-sm tracking-widest uppercase font-semibold shadow-[0_10px_40px_-10px_rgba(6,78,59,0.5)] hover:-translate-y-1 hover:scale-105">
                       Discover Collection <ArrowRight size={16} />
                    </button>
                 </motion.div>
              </div>
              
              <motion.div
                 initial={{ opacity: 0, scale: 0.9, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                 className="w-full lg:w-6/12 aspect-[16/10] md:aspect-[3/2] lg:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl relative group border-4 border-white bg-black z-10"
              >
                 <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700">
                    <source src="/bg2.mp4" type="video/mp4" />
                 </video>
                 <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent pointer-events-none"></div>
                 
                 <motion.img 
                    animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr4.jpg" 
                    className="absolute -top-12 -left-8 w-28 h-28 object-cover rounded-full shadow-2xl border-4 border-[#faf9f6] pointer-events-none z-30"
                    alt="Camphor"
                 />
                 <motion.img 
                    animate={{ y: [0, -15, 0], rotate: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img2.jpg" 
                    className="absolute -bottom-8 -right-8 w-24 h-24 object-cover rounded-full shadow-2xl border-4 border-[#faf9f6] pointer-events-none z-30"
                    alt="Pooja Item"
                 />
              </motion.div>
           </div>
        </section>

        {/* New Editorial Heritage Section */}
        <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
           <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full lg:w-5/12 relative">
                 <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
                    <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img1.jpg" className="w-full h-full object-cover" alt="Heritage 1" />
                 </div>
                 <motion.div initial={{ opacity:0, y:40, x:-20 }} whileInView={{ opacity:1, y:0, x:0 }} viewport={{ once:true }} transition={{ delay: 0.3 }} className="absolute -bottom-16 -right-16 w-64 aspect-square rounded-full overflow-hidden shadow-xl border-8 border-[#faf9f6] z-20">
                    <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img2.jpg" className="w-full h-full object-cover" alt="Heritage 2" />
                 </motion.div>
                 <motion.div initial={{ opacity:0, scale:0 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay: 0.6 }} className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-100 rounded-full flex flex-col items-center justify-center text-emerald-800 z-20 shadow-lg">
                    <span className="text-2xl font-bold">100%</span>
                    <span className="text-xs uppercase tracking-widest font-semibold">Natural</span>
                 </motion.div>
              </motion.div>

              <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full lg:w-7/12 pt-16 lg:pt-0">
                 <h4 className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4">Our Legacy</h4>
                 <h2 className={`text-4xl md:text-6xl text-emerald-950 mb-8 leading-tight ${cormorant.className}`}>A devotion to purity, <br/><span className="italic text-emerald-700">crafted by hand.</span></h2>
                 
                 <div className="pl-6 border-l-2 border-emerald-200">
                    <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
                       We believe that true peace begins with the atmosphere you create. For generations, we have perfected the art of making pure Sambrani, avoiding harsh chemicals to bring you the authentic scent of nature.
                    </p>
                    <p className="text-neutral-600 text-lg leading-relaxed">
                       Every product is a testament to our commitment to quality, tradition, and spiritual wellbeing. We don't just sell incense; we offer a gateway to a place of stillness.
                    </p>
                 </div>
                 <div className="mt-10 flex items-center gap-4">
                    <img src="https://ui-avatars.com/api/?name=Mishi&background=fda4af&color=881337" alt="Founder" className="w-12 h-12 rounded-full" />
                    <div>
                       <p className="font-bold text-emerald-950">Mishi Founders</p>
                       <p className="text-xs uppercase tracking-widest text-neutral-500">Master Crafters</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* New Spiritual Benefits Section */}
        <section className="py-24 px-6 bg-emerald-900 text-emerald-50 rounded-[3rem] max-w-[95%] mx-auto my-12 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-[100px] opacity-50"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-950 rounded-full blur-[100px] opacity-50"></div>
           
           <div className="max-w-7xl mx-auto relative z-10 text-center mb-16">
              <h2 className={`text-4xl md:text-6xl text-white mb-4 ${cormorant.className}`}>Elevate Your Wellbeing</h2>
              <p className="text-emerald-200 max-w-2xl mx-auto">Discover the transformative power of natural incense on your mind, body, and space.</p>
           </div>
           
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                 { icon: Sun, title: "Purify Energy", desc: "Clear stagnant energy and invite positivity into your living spaces with rich, earthy smoke." },
                 { icon: Wind, title: "Deepen Breath", desc: "The natural essential oils help expand the lungs and encourage slow, mindful breathing." },
                 { icon: Heart, title: "Soothe Mind", desc: "Aromatherapy elements calm the nervous system, preparing you for meditation or restful sleep." }
              ].map((b, i) => (
                 <motion.div key={i} custom={i} variants={popUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-emerald-800/40 backdrop-blur-md border border-emerald-700/50 p-10 rounded-[2rem] hover:bg-emerald-800/60 transition-colors">
                    <div className="w-14 h-14 bg-emerald-700 rounded-xl flex items-center justify-center mb-6 text-emerald-200">
                       <b.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">{b.title}</h3>
                    <p className="text-emerald-100/70 leading-relaxed">{b.desc}</p>
                 </motion.div>
              ))}
           </div>
        </section>

        {/* EXTRA COMPONENT: Expanding Aroma Gallery */}
        <section className="py-24 bg-white max-w-[1400px] mx-auto px-6 md:px-16">
          <motion.div
            variants={fadeBlurVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-4 font-bold">
              Discover Your Aura
            </h3>
            <h2
              className={`text-4xl md:text-6xl text-zinc-900 ${playfair.className}`}
            >
              Aroma Profiles
            </h2>
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
                <img
                  src={aroma.img}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={aroma.name}
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${activeAroma === i ? "bg-black/40" : "bg-black/60 group-hover:bg-black/50"}`}
                />

                <div
                  className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-end transition-all duration-500 ${activeAroma === i ? "opacity-100" : "lg:opacity-0"}`}
                >
                  <h3
                    className={`text-2xl md:text-3xl lg:text-4xl text-white font-bold mb-2 md:mb-3 ${playfair.className}`}
                  >
                    {aroma.name}
                  </h3>
                  <div
                    className={`transition-all duration-500 hidden lg:block ${activeAroma === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  >
                    <p className="text-zinc-200 text-xs md:text-sm max-w-sm leading-relaxed">
                      {aroma.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 flex items-center justify-center p-8 transition-all duration-500 hidden lg:flex ${activeAroma === i ? "opacity-0" : "opacity-100"}`}
                >
                  <h3
                    className={`text-2xl text-white font-bold whitespace-nowrap vertical-text ${playfair.className}`}
                  >
                    {aroma.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        {/* Global Reach / Flags Section */}
        <section
          id="exports"
          className="py-32 px-6 md:px-16 bg-white overflow-hidden relative"
        >
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none"></div>

          <div className="max-w-[1400px] mx-auto text-center relative z-10">
            <motion.div
              variants={fadeBlurVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-6 font-bold">
                Global Reach
              </h3>
              <h2
                className={`text-5xl md:text-7xl text-zinc-900 mb-6 ${playfair.className}`}
              >
                Our Exports & Imports
              </h2>
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
                  <div className="w-32 h-24 md:w-44 md:h-32 relative flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute left-[15%] md:left-[18%] top-[10%] bottom-[15%] w-1 md:w-1.5 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 rounded-b-sm z-20 shadow-sm">
                      <div className="absolute -top-1.5 -left-[3px] md:-left-[2px] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 shadow-sm border border-amber-600/50"></div>
                    </div>
                    <img
                      src={`/flags/${flag.gifName}_240-animated-flag-gifs.gif`}
                      alt={flag.name}
                      className="w-full h-[90%] object-contain mix-blend-multiply z-10 pl-2"
                    />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-700 group-hover:text-amber-600 transition-colors mt-4 bg-zinc-50 px-4 py-1 rounded-full shadow-sm border border-zinc-100">
                    {flag.name}
                  </h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* New Ingredients Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
           <div className="text-center mb-16">
              <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Pure Elements</span>
              <h2 className={`text-4xl md:text-6xl text-emerald-950 mt-4 ${cormorant.className}`}>Gifts from the Earth</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
              <motion.div variants={popUpVariants} custom={0} initial="hidden" whileInView="visible" viewport={{ once:true }} className="md:col-span-2 md:row-span-2 relative rounded-[2rem] overflow-hidden group">
                 <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Panchagavya-Vilaku.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Panchagavya" />
                 <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent flex flex-col justify-end p-8 text-white">
                    <h3 className={`text-3xl mb-2 ${cormorant.className}`}>Sacred Panchagavya</h3>
                    <p className="text-emerald-100/80 text-sm">The foundational element for deep spiritual cleansing.</p>
                 </div>
              </motion.div>
              <motion.div variants={popUpVariants} custom={1} initial="hidden" whileInView="visible" viewport={{ once:true }} className="md:col-span-2 bg-emerald-50 rounded-[2rem] p-8 flex flex-col justify-center border border-emerald-100 hover:border-emerald-200 transition-colors">
                 <Leaf className="text-emerald-600 mb-4" size={32} />
                 <h3 className={`text-2xl text-emerald-950 mb-2 ${cormorant.className}`}>Himalayan Herbs</h3>
                 <p className="text-neutral-600 text-sm">Sourced from pristine altitudes for an unadulterated fragrance.</p>
              </motion.div>
              <motion.div variants={popUpVariants} custom={2} initial="hidden" whileInView="visible" viewport={{ once:true }} className="bg-neutral-900 rounded-[2rem] p-8 flex flex-col justify-center text-white relative overflow-hidden group">
                 <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity"><img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr4.jpg" className="w-full h-full object-cover" alt="Camphor" /></div>
                 <div className="relative z-10">
                    <Sparkles className="text-amber-400 mb-4" size={32} />
                    <h3 className={`text-2xl mb-2 ${cormorant.className}`}>Pure Camphor</h3>
                    <p className="text-neutral-300 text-sm">Ignites instantly, leaving no residue.</p>
                 </div>
              </motion.div>
              <motion.div variants={popUpVariants} custom={3} initial="hidden" whileInView="visible" viewport={{ once:true }} className="bg-emerald-100 rounded-[2rem] p-8 flex flex-col justify-center border border-emerald-200">
                 <Wind className="text-emerald-800 mb-4" size={32} />
                 <h3 className={`text-2xl text-emerald-950 mb-2 ${cormorant.className}`}>Natural Resins</h3>
                 <p className="text-emerald-900/70 text-sm">Rich, sweet, and deeply grounding base notes.</p>
              </motion.div>
           </div>
        </section>

        {/* New Products Section */}
        <section id="products" className="py-24 bg-neutral-100/50">
           <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                 <div>
                    <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">The Collection</span>
                    <h2 className={`text-4xl md:text-6xl text-emerald-950 mt-4 ${cormorant.className}`}>Sacred Offerings</h2>
                 </div>
                 <Link href="/products" className="text-emerald-700 font-semibold border-b border-emerald-700 pb-1 hover:text-emerald-900 transition-colors">View All Products</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {products.map((product, i) => (
                    <motion.div key={product.name} custom={i} variants={popUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100">
                       <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 relative bg-neutral-50 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                          <img src={product.img} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                             <div className="opacity-0 group-hover:opacity-100 bg-white text-emerald-900 px-6 py-2 rounded-full font-bold text-sm translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">Quick View</div>
                          </div>
                       </div>
                       <div className="px-4 pb-4">
                          <h3 className={`text-2xl text-neutral-900 mb-2 ${cormorant.className}`}>{product.name}</h3>
                          <p className="text-neutral-500 text-sm line-clamp-2 mb-4">{product.desc}</p>
                          <div className="flex items-center justify-between">
                             <span className="font-semibold text-lg text-emerald-900">₹149</span>
                             <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Added ${product.name} to cart!`);
                                }}
                                className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                             >
                                <Plus size={20} />
                             </button>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Product Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm"
              onClick={() => { setSelectedProduct(null); setQty(1); setSelectedSize("250g"); }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => { setSelectedProduct(null); setQty(1); setSelectedSize("250g"); }}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-neutral-900 hover:bg-neutral-100 transition-colors shadow-sm"
                >
                  <Plus className="rotate-45" size={24} />
                </button>

                <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-neutral-50">
                  <img
                    src={selectedProduct.img}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-emerald-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">
                    Premium Quality
                  </span>
                  <h2 className={`text-3xl md:text-5xl text-neutral-900 mb-4 ${cormorant.className}`}>
                    {selectedProduct.name}
                  </h2>
                  <p className="text-neutral-600 font-light mb-8 leading-relaxed">
                    {selectedProduct.desc}
                  </p>

                  <div className="space-y-6 mb-8">
                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 block mb-3">Select Size</span>
                      <div className="flex gap-3">
                        {["100g", "250g", "500g"].map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all ${selectedSize === size ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 block mb-3">Quantity</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-neutral-200 rounded-full bg-neutral-50 overflow-hidden">
                          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"><Minus size={16} /></button>
                          <span className="w-8 text-center font-bold text-neutral-900">{qty}</span>
                          <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"><Plus size={16} /></button>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">
                          ₹{selectedSize === "100g" ? 149 * qty : selectedSize === "250g" ? 299 * qty : 499 * qty}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      alert(`Added ${qty}x ${selectedProduct.name} (${selectedSize}) to your cart!`);
                      setSelectedProduct(null);
                      setQty(1);
                      setSelectedSize("250g");
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-full uppercase tracking-widest text-sm transition-colors shadow-lg shadow-emerald-700/20"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Section */}
        <section
          id="gallery"
          className="py-24 px-6 md:px-16 max-w-[1400px] mx-auto bg-zinc-50 rounded-t-[3rem] mt-12"
        >
          <motion.div
            variants={fadeBlurVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-4 font-bold">
              Visual Journey
            </h3>
            <h2
              className={`text-4xl md:text-6xl text-zinc-900 ${playfair.className}`}
            >
              Our Gallery
            </h2>
            <p className="text-zinc-500 mt-4 max-w-xl mx-auto font-light">
              Experience the divine essence of our pure formulations through
              these snapshots.
            </p>
          </motion.div>

          {/* Masonry-like Grid for Gallery */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                variants={popUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                className="relative rounded-2xl overflow-hidden shadow-sm group break-inside-avoid bg-white"
              >
                <img
                  src={src}
                  alt={`Gallery item ${i}`}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">
                    Product View
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        {/* Reels Section */}
        <section className="py-24 px-6 md:px-16 max-w-[1400px] mx-auto bg-zinc-900 rounded-b-[3rem] mb-12 text-white">
          <motion.div
            variants={fadeBlurVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h3 className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 font-bold">
              Social Spotlight
            </h3>
            <h2 className={`text-4xl md:text-6xl ${playfair.className}`}>
              Behind the Scenes
            </h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto font-light">
              Watch how our sacred blends are traditionally crafted and used.
            </p>
          </motion.div>

          {/* Reels Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {reelVideos.map((src, i) => (
              <motion.div
                key={i}
                variants={popUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                className="relative rounded-3xl overflow-hidden shadow-2xl group aspect-[9/16] bg-black border border-white/5 mx-auto w-full max-w-[400px]"
              >
                <video
                  src={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white pl-1 shadow-2xl">
                    <Play size={24} className="fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-sm font-bold text-white flex items-center gap-3">
                  <InstagramIcon size={18} className="text-amber-500" />
                  <span className="truncate tracking-widest uppercase">
                    @mishi_sambrani
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <a
              href="https://www.instagram.com/mishi_sambrani/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              <InstagramIcon size={18} /> Follow on Instagram
            </a>
          </div>
        </section>
        {/* EXTRA COMPONENT: Wisdom & Queries (Animated FAQ) */}
        <section className="relative py-24 bg-zinc-50 border-y border-zinc-200 z-20">
          <div className="max-w-[800px] mx-auto px-6 md:px-16">
            <motion.div
              variants={fadeBlurVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-4 font-bold">
                Curiosity
              </h3>
              <h2
                className={`text-4xl md:text-5xl text-zinc-900 ${playfair.className}`}
              >
                Wisdom & Queries
              </h2>
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
                    <span className="font-bold text-zinc-800 pr-8">
                      {faq.q}
                    </span>
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openFAQ === i ? "bg-amber-600 text-white" : "bg-zinc-100 text-zinc-500"}`}
                    >
                      {openFAQ === i ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFAQ === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
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
            <motion.div
              variants={fadeBlurVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2
                className={`text-4xl md:text-5xl text-zinc-900 ${playfair.className}`}
              >
                What Our Devotees Say
              </h2>
            </motion.div>
          </div>

          <div className="relative w-full flex overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-amber-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-50 to-transparent z-10 pointer-events-none"></div>

            <div className="animate-marquee hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, arrayIndex) => (
                <div
                  key={arrayIndex}
                  className="flex gap-4 md:gap-8 px-2 md:px-4"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-[300px] md:w-[400px] bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-amber-100/50 flex-shrink-0"
                    >
                      <Quote className="text-amber-300 mb-6" size={40} />
                      <p className="text-zinc-600 italic mb-8 font-light leading-relaxed text-sm md:text-base">
                        &quot;The purity and fragrance of these products are
                        unmatched. It instantly elevates the spiritual ambiance
                        of my home during prayers. Highly recommended for daily
                        use!&quot;
                      </p>
                      <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-lg">
                          {String.fromCharCode(64 + i)}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-xs md:text-sm uppercase tracking-wider">
                            Devotee {i}
                          </h4>
                          <p className="text-[10px] md:text-xs text-zinc-500 mt-1">
                            Verified Buyer
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Contact Section */}
        <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
           <div className="bg-emerald-950 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
              <div className="w-full lg:w-1/2 p-12 md:p-20 relative z-10 flex flex-col justify-center">
                 <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4">Get in Touch</span>
                 <h2 className={`text-4xl md:text-5xl text-white mb-8 ${cormorant.className}`}>Visit Our Sanctuary</h2>
                 <p className="text-emerald-100/70 mb-12 text-lg">We welcome bulk inquiries and wholesale partnerships. Connect with us to share the gift of purity.</p>
                 
                 <div className="space-y-8">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-300"><MapPin size={20}/></div>
                       <p className="text-white text-sm">213/6A, Eripattai, Chembarambakkam, Chennai – 600123</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-300"><Phone size={20}/></div>
                       <p className="text-white text-sm">+91 80561 01114</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-300"><Mail size={20}/></div>
                       <p className="text-white text-sm">mishipoojaproducts@gmail.com</p>
                    </div>
                 </div>
              </div>
              
              <div className="w-full lg:w-1/2 h-[400px] lg:h-auto p-4">
                 <div className="w-full h-full rounded-[2rem] overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.054593925763!2d80.0381669!3d13.032223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528acaf3c9f2b3%3A0xc6ed7fb0c92bb214!2sChembarambakkam%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                      className="filter grayscale contrast-125 opacity-90"
                    ></iframe>
                 </div>
              </div>
           </div>
        </section>

        {/* New Footer */}
        <footer className="bg-neutral-950 py-12 text-center text-neutral-400 text-sm">
           <div className="flex items-center justify-center gap-4 mb-6 text-neutral-300">
              <a href="#" className="hover:text-emerald-500 transition-colors"><span>FB</span></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><InstagramIcon size={20}/></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><span>TW</span></a>
           </div>
           <p className="mb-2">© 2026 Mishi Pooja Products. Purity in every breath.</p>
           <p className="text-xs text-neutral-600 mt-4 uppercase tracking-widest">Designed with devotion by Cenexa Systems</p>
        </footer>
      </div>
    </ReactLenis>
  );
}
