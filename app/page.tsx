"use client";

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
  Star,
} from "lucide-react";
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({ subsets: ["latin"] });
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useCartStore, useProductStore } from "@/store/store";
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

const FacebookIcon = ({
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
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

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

// Important: To play videos without Instagram's UI, you MUST download your reels as .mp4 files 
// and place them in the 'public' folder (e.g., 'public/reel1.mp4').
// Then, update the names here:
const reelVideos = [
  "DX9JNchDWyW",
  "DYTZ_U1idZK",
  "DYCWOObD0x3",
  "Daxqbe-ihQE",
];



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
  const { products: storeProducts, fetchProducts } = useProductStore();

  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState("");
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    const defaultR = [
      { id: 1, text: "The purity and fragrance of these products are unmatched. It instantly elevates the spiritual ambiance of my home during prayers. Highly recommended for daily use!", author: "Customer 1", initial: "C", rating: 5 },
      { id: 2, text: "Amazing aroma, highly recommend for meditation and regular pooja. Gives a very calming vibe.", author: "Customer 2", initial: "C", rating: 5 },
      { id: 3, text: "Truly natural and relaxing fragrance. The best sambrani I've used.", author: "Customer 3", initial: "C", rating: 4 },
      { id: 4, text: "Excellent quality and packaging.", author: "Customer 4", initial: "C", rating: 5 },
      { id: 5, text: "Very divine and peaceful experience.", author: "Customer 5", initial: "C", rating: 5 }
    ];
    const saved = localStorage.getItem("mishi_reviews");
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch(e) {
        setReviews(defaultR);
      }
    } else {
      setReviews(defaultR);
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddReview = () => {
    if (!newReview.trim() || !newReviewName.trim()) {
      toast.error("Please provide both name and review.");
      return;
    }
    const r = { id: Date.now(), text: newReview, author: newReviewName, initial: newReviewName.charAt(0).toUpperCase(), rating: newReviewRating };
    const updated = [r, ...reviews];
    setReviews(updated);
    localStorage.setItem("mishi_reviews", JSON.stringify(updated));
    setNewReview("");
    setNewReviewName("");
    setNewReviewRating(5);
    setShowReviewForm(false);
    toast.success("Review added successfully!");
  };

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth"
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
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
      <div className={`bg-neutral-50 text-neutral-900 min-h-screen ${playfair.className} selection:bg-emerald-600/30 selection:text-emerald-900 overflow-x-hidden`}>
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
          @keyframes float-word {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-float-word {
            animation: float-word 4s ease-in-out infinite;
          }
        `,
          }}
        />


        {/* New Hero Section (Split Layout) */}
        <section id="home" className="w-full min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#1f3625] selection:bg-[#d5b976]/30 selection:text-white pt-20 lg:pt-0">
          {/* Left Side: Content */}
          <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-screen flex flex-col justify-center p-8 md:p-12 lg:p-16 z-10 overflow-hidden">
            
            {/* Background Image Leaf */}
            <div className="absolute inset-0 pointer-events-none z-0">
               <img src="/gold_leaf_bg.png" alt="Leaf Background" className="w-full h-full object-cover opacity-20 mix-blend-screen" />
            </div>

            {/* Main Content */}
            <div className="relative z-20 pl-0 lg:pl-12 max-w-xl flex flex-col justify-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="px-3 py-1 bg-[#d5b976]/20 border border-[#d5b976]/30 text-[#d5b976] rounded-full text-[10px] font-bold uppercase tracking-widest">
                  100% Natural
                </span>
                <span className="px-3 py-1 bg-[#d5b976]/20 border border-[#d5b976]/30 text-[#d5b976] rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Premium Quality
                </span>
              </motion.div>

              <motion.h1 
                className={`text-[3.5rem] sm:text-6xl md:text-5xl lg:text-6xl xl:text-[4.5rem] leading-[1.1] font-bold text-[#fde6a6] uppercase tracking-tight ${playfair.className}`}
              >
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="inline-block">
                  <span className="inline-block animate-float-word" style={{ animationDelay: '0s' }}>The</span>
                </motion.span>{" "}
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="inline-block">
                  <span className="inline-block animate-float-word" style={{ animationDelay: '-1s' }}>Essence</span>
                </motion.span>
                <br />
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-block">
                  <span className="inline-block animate-float-word" style={{ animationDelay: '-2s' }}>Of</span>
                </motion.span>{" "}
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="inline-block text-[#d5b976]">
                  <span className="inline-block animate-float-word" style={{ animationDelay: '-3s' }}>Serenity</span>
                </motion.span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
                className={`text-xl sm:text-2xl md:text-xl text-[#fde6a6] italic mt-6 mb-10 ${playfair.className}`}
              >
                Curated Incense & Rare Resins for Mindful Living
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-6 sm:items-center mt-2"
              >
                <button 
                  onClick={() => scrollTo("#products")} 
                  className="group relative px-8 py-5 md:px-10 md:py-4 border border-[#d5b976] bg-[#d5b976] text-[#1f3625] transition-colors hover:bg-transparent hover:text-[#d5b976] flex items-center justify-center gap-3 text-xs md:text-[10px] tracking-[0.2em] uppercase font-bold shadow-xl w-full sm:w-auto"
                  style={{ borderRadius: "50px 0 50px 0" }}
                >
                  Discover The Collection
                </button>

                <div className="flex items-center gap-5 sm:ml-4">
                  <div className="w-12 h-px bg-[#d5b976]/40 hidden sm:block"></div>
                  <a href="https://www.instagram.com/mishi_sambrani/" target="_blank" rel="noopener noreferrer" className="text-[#d5b976]/70 hover:text-[#d5b976] transition-colors flex items-center gap-2">
                    <InstagramIcon size={20} />
                    <span className="text-[10px] uppercase font-bold tracking-widest sm:hidden">Instagram</span>
                  </a>
                  <a href="https://www.facebook.com/people/Mishi-Pooja-Products/100078864755122/" target="_blank" rel="noopener noreferrer" className="text-[#d5b976]/70 hover:text-[#d5b976] transition-colors flex items-center gap-2">
                    <FacebookIcon size={20} />
                    <span className="text-[10px] uppercase font-bold tracking-widest sm:hidden">Facebook</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Video */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 pt-28 lg:pt-32 relative z-10 bg-[#1f3625]">
            {/* Video Container Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative w-full max-w-md xl:max-w-lg aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#16281a]"
            >
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                 <source src="/bg2.mp4" type="video/mp4" />
              </video>
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
                 <h4 className={`text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4 ${playfair.className}`}>Our Legacy</h4>
                 <h2 className={`text-4xl md:text-6xl text-emerald-950 mb-8 leading-tight ${playfair.className}`}>A devotion to purity, <br/><span className="italic text-emerald-700">crafted by hand.</span></h2>
                 
                 <div className={`pl-6 border-l-2 border-emerald-200 ${playfair.className}`}>
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
              <h2 className={`text-4xl md:text-6xl text-white mb-4 ${playfair.className}`}>Elevate Your Wellbeing</h2>
              <p className="text-emerald-200 max-w-2xl mx-auto">Discover the transformative power of natural incense on your mind, body, and space.</p>
           </div>
           
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                 { icon: Sun, title: "Purify Energy", desc: "Clear stagnant energy and invite positivity into your living spaces with rich, earthy smoke." },
                 { icon: Wind, title: "Deepen Breath", desc: "The natural essential oils help expand the lungs and encourage slow, mindful breathing." },
                 { icon: Heart, title: "Soothe Mind", desc: "Aromatherapy elements calm the nervous system, preparing you for meditation or restful sleep." }
              ].map((b, i) => (
                 <motion.div key={i} custom={i} variants={popUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(6,78,59,0.3)" }} className="bg-emerald-800/40 backdrop-blur-md border border-emerald-700/50 p-10 rounded-[2rem] transition-all cursor-pointer group">
                    <div className="w-14 h-14 bg-emerald-700 rounded-xl flex items-center justify-center mb-6 text-emerald-200 group-hover:scale-110 transition-transform">
                       <b.icon size={28} />
                    </div>
                    <h3 className={`text-2xl font-semibold text-white mb-3 ${playfair.className}`}>{b.title}</h3>
                    <p className="text-emerald-100/70 leading-relaxed font-light">{b.desc}</p>
                 </motion.div>
              ))}
           </div>
        </section>

        {/* EXTRA COMPONENT: Expanding Aroma Gallery */}
        <section className="py-24 max-w-[1400px] mx-auto px-6 md:px-16">
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
              <span className={`text-emerald-600 font-bold tracking-widest uppercase text-sm ${playfair.className}`}>Pure Elements</span>
              <h2 className={`text-5xl md:text-7xl text-emerald-950 mt-4 ${playfair.className}`}>Gifts from the Earth</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
              <motion.div variants={popUpVariants} custom={0} initial="hidden" whileInView="visible" viewport={{ once:true }} className="md:col-span-2 md:row-span-2 relative rounded-[2rem] overflow-hidden group">
                 <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Panchagavya-Vilaku.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Panchagavya" />
                 <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent flex flex-col justify-end p-8 text-white">
                    <h3 className={`text-3xl mb-2 ${playfair.className}`}>Sacred Panchagavya</h3>
                    <p className="text-emerald-100/80 text-sm">The foundational element for deep spiritual cleansing.</p>
                 </div>
              </motion.div>
              <motion.div variants={popUpVariants} custom={1} initial="hidden" whileInView="visible" viewport={{ once:true }} className="md:col-span-2 bg-emerald-50 rounded-[2rem] p-8 flex flex-col justify-center border border-emerald-100 hover:border-emerald-200 transition-colors">
                 <Leaf className="text-emerald-600 mb-4" size={32} />
                 <h3 className={`text-2xl text-emerald-950 mb-2 ${playfair.className}`}>Himalayan Herbs</h3>
                 <p className="text-neutral-600 text-sm">Sourced from pristine altitudes for an unadulterated fragrance.</p>
              </motion.div>
              <motion.div variants={popUpVariants} custom={2} initial="hidden" whileInView="visible" viewport={{ once:true }} className="bg-neutral-900 rounded-[2rem] p-8 flex flex-col justify-center text-white relative overflow-hidden group">
                 <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity"><img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr4.jpg" className="w-full h-full object-cover" alt="Camphor" /></div>
                 <div className="relative z-10">
                    <Sparkles className="text-amber-400 mb-4" size={32} />
                    <h3 className={`text-2xl mb-2 ${playfair.className}`}>Pure Camphor</h3>
                    <p className="text-neutral-300 text-sm">Ignites instantly, leaving no residue.</p>
                 </div>
              </motion.div>
              <motion.div variants={popUpVariants} custom={3} initial="hidden" whileInView="visible" viewport={{ once:true }} className="bg-emerald-100 rounded-[2rem] p-8 flex flex-col justify-center border border-emerald-200">
                 <Wind className="text-emerald-800 mb-4" size={32} />
                 <h3 className={`text-2xl text-emerald-950 mb-2 ${playfair.className}`}>Natural Resins</h3>
                 <p className="text-emerald-900/70 text-sm">Rich, sweet, and deeply grounding base notes.</p>
              </motion.div>
           </div>
        </section>

        {/* New Products Section */}
        <section id="products" className="py-24 bg-neutral-100/50">
           <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div>
                    <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Our Selection</span>
                    <h2 className={`text-4xl md:text-6xl text-zinc-900 mt-4 ${playfair.className}`}>Our Products</h2>
                 </div>
                 <Link href="/products" className="text-emerald-700 font-semibold border-b border-emerald-700 pb-1 hover:text-emerald-900 transition-colors">View All Products</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {storeProducts.filter(p => p.isActive !== false).slice(0, 6).map((product, i) => {
                    const availableOptions = product.predefinedOptions ? product.predefinedOptions.filter((opt: any) => opt.isAvailable !== false) : [];
                    const lowestPrice = availableOptions.length > 0 
                       ? Math.min(...availableOptions.map((opt: any) => opt.price))
                       : product.price;

                    return (
                       <Link href="/products" key={product.id || i}>
                          <motion.div custom={i} variants={popUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group flex flex-col bg-white border border-zinc-100 rounded-3xl p-3 sm:p-4 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative h-full">
                             <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative bg-zinc-50">
                                <img src={product.imageUrl || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 shadow-lg">
                                   <ArrowRight size={18} />
                                </div>
                             </div>
                             <div className="px-2 pb-2 flex flex-col flex-1">
                                 <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">
                                   {product.category}
                                 </span>
                                 <h3 className={`text-2xl text-zinc-900 mb-2 group-hover:text-amber-600 transition-colors ${playfair.className}`}>{product.name}</h3>
                                 {product.description && (
                                   <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                 )}
                                 <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-auto">
                                    <span className="text-zinc-900 font-bold text-base">From ₹{lowestPrice}</span>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-amber-600 hover:text-amber-700">
                                       View Details
                                    </span>
                                 </div>
                             </div>
                          </motion.div>
                       </Link>
                    )
                 })}
              </div>
           </div>
        </section>

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
                className="relative rounded-2xl overflow-hidden shadow-sm group break-inside-avoid bg-white cursor-pointer"
                onClick={() => setSelectedGalleryImage(src)}
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

        {/* Gallery Modal */}
        <AnimatePresence>
          {selectedGalleryImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedGalleryImage(null)}
            >
              <button
                className="absolute top-6 right-6 text-white hover:text-amber-500 transition-colors bg-white/10 p-2 rounded-full z-[210]"
                onClick={() => setSelectedGalleryImage(null)}
              >
                <X size={32} />
              </button>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={selectedGalleryImage}
                alt="Gallery Preview"
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl relative z-[205]"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reels Section */}
        <section className="py-24 px-6 md:px-16 w-full bg-zinc-900 mb-12 text-white overflow-hidden">
          <motion.div
            variants={fadeBlurVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center max-w-[1400px] mx-auto"
          >
            <h3 className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 font-bold">
              Customer Stories
            </h3>
            <h2 className={`text-4xl md:text-6xl ${playfair.className}`}>
              Video Testimonials
            </h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto font-light">
              Watch how our sacred blends are traditionally crafted and used.
            </p>
          </motion.div>

          {/* Reels Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
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
                {/* Cropping container to hide Instagram UI */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  <iframe 
                     src={`https://www.instagram.com/p/${src}/embed/?autoplay=1`} 
                     frameBorder="0" 
                     scrolling="no" 
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[110%] h-[125%] max-w-none"
                  ></iframe>
                </div>
                {/* Click overlay to still allow opening the post if needed, but prevents UI interaction */}
                <div 
                   className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                   onClick={() => window.open(`https://www.instagram.com/reel/${src}/`, "_blank")}
                ></div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center max-w-[1400px] mx-auto">
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
          <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
            <motion.div
              variants={fadeBlurVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2
                className={`text-4xl md:text-5xl text-zinc-900 ${playfair.className}`}
              >
                Reviews
              </h2>
            </motion.div>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-amber-600 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest shadow-md hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              {showReviewForm ? "Cancel" : "Add a Review"}
            </button>
          </div>

          <AnimatePresence>
            {showReviewForm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowReviewForm(false)}
              >
                <motion.div 
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   exit={{ scale: 0.9, y: 20 }}
                   onClick={(e) => e.stopPropagation()}
                   className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative"
                >
                   <button onClick={() => setShowReviewForm(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600">
                     <X size={24} />
                   </button>
                   <h3 className="text-2xl font-bold text-zinc-900 mb-6">Write a Review</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Your Name</label>
                       <input 
                         type="text" 
                         placeholder="John Doe"
                         value={newReviewName}
                         onChange={(e) => setNewReviewName(e.target.value)}
                         className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors text-zinc-700"
                       />
                     </div>
                     <div>
                       <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Rating</label>
                       <div className="flex gap-2">
                         {[1, 2, 3, 4, 5].map((star) => (
                           <button key={star} onClick={() => setNewReviewRating(star)} className="focus:outline-none">
                             <Star size={24} className={star <= newReviewRating ? "fill-amber-400 text-amber-400" : "text-zinc-300"} />
                           </button>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Review</label>
                       <textarea 
                         placeholder="Share your experience..."
                         value={newReview}
                         onChange={(e) => setNewReview(e.target.value)}
                         rows={4}
                         className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors text-zinc-700 resize-none"
                       />
                     </div>
                     <button 
                       onClick={handleAddReview}
                       className="w-full bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-amber-700 transition-colors"
                     >
                       Submit Review
                     </button>
                   </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  {reviews.map((r, i) => (
                    <div
                      key={`${arrayIndex}-${r.id}-${i}`}
                      className="w-[300px] md:w-[400px] bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-amber-100/50 flex-shrink-0"
                    >
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} size={16} className={idx < (r.rating || 5) ? "fill-amber-400 text-amber-400" : "text-amber-100"} />
                        ))}
                      </div>
                      <Quote className="text-amber-300 mb-6" size={40} />
                      <p className="text-zinc-600 italic mb-8 font-light leading-relaxed text-sm md:text-base">
                        &quot;{r.text}&quot;
                      </p>
                      <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-lg">
                          {r.initial}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-xs md:text-sm uppercase tracking-wider">
                            {r.author}
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
                 <h2 className={`text-4xl md:text-5xl text-white mb-8 ${playfair.className}`}>Visit Our Shop</h2>
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
                 <div className="w-full h-full rounded-[2rem] overflow-hidden relative group bg-neutral-100">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.054593925763!2d80.0381669!3d13.032223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528acaf3c9f2b3%3A0xc6ed7fb0c92bb214!2sChembarambakkam%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                      className="pointer-events-none"
                    ></iframe>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-auto">
                       <a href="https://maps.google.com/?q=13.032223,80.0381669" target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 bg-white text-emerald-900 px-6 py-3 rounded-full font-bold text-sm translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-2">
                         <MapPin size={18}/> Open in Google Maps
                       </a>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* New Footer */}
        <footer className="bg-[#05140b] pt-16 pb-8 px-6 lg:px-20 text-neutral-300 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
            
            {/* Left Column */}
            <div className="w-full md:w-1/3 flex flex-col items-start">
              <img src="/logo.webp" alt="Mishi Pooja Products" className="h-16 w-auto object-contain mb-6" />
              <p className="text-sm text-neutral-300 leading-relaxed max-w-sm">
                Bringing you the divine essence of pure, hand-crafted Himalayan herbs and natural resins. Create a peaceful sanctuary in your everyday life.
              </p>
            </div>

            {/* Middle Column */}
            <div className="w-full md:w-1/3 flex flex-col items-start md:items-center">
              <div className="flex flex-col items-start">
                <h4 className="text-emerald-100/60 font-bold tracking-[0.1em] uppercase text-[10px] mb-6">Explore</h4>
                <div className="flex flex-col gap-4 text-xs font-semibold text-neutral-200">
                  <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                  <Link href="/#about" className="hover:text-emerald-400 transition-colors">About</Link>
                  <Link href="/#products" className="hover:text-emerald-400 transition-colors">Categories</Link>
                  <Link href="/products" className="hover:text-emerald-400 transition-colors">Shop</Link>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/3 flex flex-col items-start md:items-end">
              <div className="flex flex-col items-start">
                <h4 className="text-emerald-100/60 font-bold tracking-[0.1em] uppercase text-[10px] mb-6">Contact Us</h4>
                <div className="flex flex-col gap-4 text-xs text-neutral-300 font-medium">
                  <div>
                    <p className="font-bold text-white mb-1">Address:</p>
                    <p>213/6A, Eripattai, Chembarambakkam,</p>
                    <p>Chennai – 600123</p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Email:</p>
                    <p>mishipoojaproducts@gmail.com</p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Phone:</p>
                    <p>+91 80561 01114</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] md:text-xs text-neutral-400 font-medium">
            <div className="w-full md:w-1/3 text-left">
              <p>© 2026 Mishi Pooja Products. All Rights Reserved</p>
            </div>
            <div className="w-full md:w-1/3 text-center">
              <p>Powered by <span className="text-white font-semibold">Cenexa Systems</span> © 2026</p>
            </div>
            <div className="w-full md:w-1/3 text-right flex justify-start md:justify-end">
              <div className="flex gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-300">
                <span>Purity</span>
                <span>•</span>
                <span>Devotion</span>
                <span>•</span>
                <span>Tradition</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}
