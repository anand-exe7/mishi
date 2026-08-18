"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ArrowRight,
  MapPin,
  Leaf,
  ShoppingCart,
  Star,
  Sparkles,
  Award,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Quote,
  X,
  CheckCircle2,
  Globe
} from "lucide-react";
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({ subsets: ["latin"] });
import { useEffect, useState, useRef } from "react";
import { useProductStore, useLangStore } from "@/store/store";
import { getT } from "@/lib/translations";
import Link from "next/link";
import SacredRitualFinder from "@/components/SacredRitualFinder";
import InstagramIcon from "@/components/InstagramIcon";

const reelVideos = ["DX9JNchDWyW", "DYTZ_U1idZK", "DYCWOObD0x3", "Daxqbe-ihQE"];

export default function Home() {
  const { lang } = useLangStore();
  const t = getT(lang);
  const { products: storeProducts, fetchProducts } = useProductStore();
  const [reviews, setReviews] = useState<any[]>([]);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newText, setNewText] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    const defaultR = [
      {
        id: 1,
        text: "Exceptional quality herbal products! Been using them for 6 months — truly authentic remedies that actually work. Packaging is perfect and delivery is fast.",
        author: "Priya Krishnamurthy",
        location: "Chennai",
        initial: "PK",
        rating: 5,
      },
      {
        id: 2,
        text: "The herbal oils are absolutely pure and give real results. Ordered multiple times and every batch smells fresh and aromatic. Best shop online!",
        author: "Ramesh Murugan",
        location: "Coimbatore",
        initial: "RM",
        rating: 5,
      },
      {
        id: 3,
        text: "Genuine products at very reasonable prices. Customer service via WhatsApp is very responsive. The herbal powders improved my family's immunity greatly.",
        author: "Kavitha Sundaram",
        location: "Madurai",
        initial: "KS",
        rating: 5,
      },
      {
        id: 4,
        text: "Outstanding quality. The sambrani powders are the best I have ever tried. Have been recommending to all my friends and relatives. 100% authentic!",
        author: "Anand Thiagarajan",
        location: "Trichy",
        initial: "AT",
        rating: 5,
      },
      {
        id: 5,
        text: "Direct Siddha formulations with natural sun-dried aroma. Very satisfying experience ordering through WhatsApp!",
        author: "Meenakshi Sundaram",
        location: "Salem",
        initial: "MS",
        rating: 5,
      },
      {
        id: 6,
        text: "Pure ingredients and divine fragrance that fills the entire home with peace. Highly recommended!",
        author: "Siddharth V.",
        location: "Tirunelveli",
        initial: "SV",
        rating: 5,
      }
    ];
    setReviews(defaultR);
  }, [fetchProducts]);

  const scrollToRitualFinder = () => {
    const el = document.getElementById("ritual-finder");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const initials = newAuthor
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

    const createdReview = {
      id: Date.now(),
      text: newText.trim(),
      author: newAuthor.trim(),
      location: newLocation.trim() || "Tamil Nadu",
      initial: initials,
      rating: newRating,
    };

    setReviews([createdReview, ...reviews]);
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setIsReviewModalOpen(false);
      setNewAuthor("");
      setNewLocation("");
      setNewText("");
      setNewRating(5);
    }, 1200);
  };

  return (
    <div
      className={`bg-[#F9F8F5] text-neutral-900 min-h-screen ${playfair.className} selection:bg-[#7DAA8F]/30 selection:text-[#2C392A] overflow-x-hidden font-sans`}
    >
      {/* HERO SECTION */}
      <section
        id="home"
        className="w-full pt-8 xs:pt-10 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 relative overflow-hidden bg-gradient-to-b from-[#F2F0E8] via-[#F9F8F5] to-[#F9F8F5]"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-1/2 -translate-x-1/2 sm:left-10 w-72 h-72 sm:w-96 sm:h-96 bg-[#7DAA8F]/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 text-left flex flex-col items-start">
              
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 sm:mb-6 bg-[#7DAA8F]/15 border border-[#7DAA8F]/30 backdrop-blur-sm shadow-sm"
              >
                <Leaf size={13} className="text-[#5F6D59] shrink-0 animate-spin" />
                <span className="text-[10px] xs:text-[11px] font-black uppercase tracking-widest text-[#2C392A]">
                  {t("hero.badge")}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`font-black mb-5 sm:mb-7 ${
                  lang === "ta" 
                    ? "text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl" 
                    : "text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[80px]"
                } leading-[1.06] tracking-tight text-emerald-900 drop-shadow-sm`}
              >
                <motion.span
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="block bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 bg-clip-text text-transparent"
                >
                  {t("hero.title1")}
                </motion.span>
                <span className="block animate-shimmer mt-1 sm:mt-2">
                  {t("hero.title2")}
                </span>
              </motion.h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "8rem" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-1.5 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full mb-6 sm:mb-8 shadow-sm"
              />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-[#5F6D59] text-xs xs:text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg leading-relaxed font-normal"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* HORIZONTAL Side-by-Side Hero Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-row items-center gap-2.5 sm:gap-4 w-full sm:w-auto"
              >
                <Link
                  href="/products"
                  className="flex-1 sm:flex-initial bg-[#2C392A] text-white px-4 sm:px-8 py-3.5 sm:py-4 rounded-full font-extrabold text-[11px] sm:text-sm hover:bg-[#1e271d] transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 shadow-xl shadow-[#2C392A]/15 active:scale-[0.98]"
                >
                  <ShoppingCart size={16} /> {t("hero.cta_shop")}
                </Link>

                <button
                  onClick={scrollToRitualFinder}
                  className="flex-1 sm:flex-initial bg-emerald-600 text-white px-4 sm:px-7 py-3.5 sm:py-4 rounded-full font-extrabold text-[11px] sm:text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98] border border-emerald-500/30 min-w-0 sm:whitespace-nowrap"
                >
                  <Sparkles size={16} /> Find Ritual Match
                </button>
              </motion.div>

              <div className="mt-6 sm:mt-8 pt-6 border-t border-neutral-200/70 w-full flex items-center justify-between xs:justify-start gap-4 text-[11px] font-bold text-[#5F6D59]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#7DAA8F]" />
                  <span>100% Siddha Pure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={16} className="text-emerald-700" />
                  <span>5,000+ Happy Orders</span>
                </div>
              </div>

            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-6 relative mt-2 lg:mt-0">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-[4/3] xs:aspect-[16/11] sm:aspect-[4/3] rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white"
              >
                <video
                  src="/bg2.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/95 backdrop-blur-md shadow-xl border border-neutral-100 rounded-2xl px-3 py-2 flex items-center gap-2.5 transform scale-95 sm:scale-100"
              >
                <div className="w-7 h-7 bg-[#7DAA8F] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Leaf size={13} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#2C392A]">
                    100% Natural
                  </span>
                  <span className="text-[8px] text-[#5F6D59] font-medium">
                    Siddha Certified
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 bg-white/95 backdrop-blur-md shadow-xl border border-neutral-100 rounded-2xl px-3 py-2 flex flex-col items-start transform scale-95 sm:scale-100"
              >
                <div className="flex gap-0.5 mb-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={10} className="fill-current" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black text-[#2C392A]">
                    4.9 / 5.0 Rating
                  </span>
                  <span className="text-[8px] text-[#5F6D59] font-medium">(2.4k+ Reviews)</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* 4 Trust Badges Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0">
                <Leaf size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[#2C392A] font-black text-xs sm:text-sm truncate">
                  {t("trust.organic")}
                </h4>
                <p className="text-[9px] sm:text-[10px] text-[#5F6D59] leading-tight mt-0.5 truncate">
                  {t("trust.organic_sub")}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0">
                <ShoppingCart size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[#2C392A] font-black text-xs sm:text-sm truncate">
                  {t("trust.shipping")}
                </h4>
                <p className="text-[9px] sm:text-[10px] text-[#5F6D59] leading-tight mt-0.5 truncate">
                  {t("trust.shipping_sub")}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[#2C392A] font-black text-xs sm:text-sm truncate">
                  {t("trust.pure")}
                </h4>
                <p className="text-[9px] sm:text-[10px] text-[#5F6D59] leading-tight mt-0.5 truncate">
                  {t("trust.pure_sub")}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0">
                <Star size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[#2C392A] font-black text-xs sm:text-sm truncate">
                  {t("trust.gmp")}
                </h4>
                <p className="text-[9px] sm:text-[10px] text-[#5F6D59] leading-tight mt-0.5 truncate">
                  {t("trust.gmp_sub")}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE: Sacred Ritual Finder */}
      <section id="ritual-finder" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SacredRitualFinder />
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-6 sm:mb-8">
          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7DAA8F] mb-1">
              Browse Collection
            </h3>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C392A] tracking-tight">
              {t("cat.title")}
            </h2>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollContainer(categoryScrollRef, "left")}
                className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[#2C392A] hover:bg-emerald-50 transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollContainer(categoryScrollRef, "right")}
                className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[#2C392A] hover:bg-emerald-50 transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link
              href="/products"
              className="text-[#7DAA8F] text-xs sm:text-sm font-bold flex items-center gap-1 hover:text-[#5F6D59]"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div
          ref={categoryScrollRef}
          className="flex overflow-x-auto gap-3 sm:gap-5 pb-4 snap-x snap-mandatory hide-scrollbar scroll-smooth"
        >
          {[
            { id: "pooja", img: 1, key: "cat.pooja" as const },
            { id: "powder", img: 2, key: "cat.powder" as const },
            { id: "oil", img: 3, key: "cat.oil" as const },
            { id: "incense", img: 4, key: "cat.incense" as const },
            { id: "spices", img: 5, key: "cat.spices" as const },
            { id: "bundles", img: 1, key: "cat.bundles" as const },
          ].map((cat) => (
            <Link
              href="/products"
              key={cat.id}
              className="min-w-[125px] xs:min-w-[145px] sm:min-w-[160px] flex flex-col items-center gap-2.5 snap-start group"
            >
              <div className="w-full aspect-square rounded-2xl bg-white p-2.5 sm:p-3 shadow-sm border border-neutral-200/80 group-hover:shadow-md group-hover:border-[#7DAA8F]/50 transition-all relative overflow-hidden">
                <img
                  src={`https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-${cat.img}.jpg`}
                  className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                  alt={t(cat.key)}
                />
              </div>
              <span className="text-xs font-extrabold text-[#2C392A] text-center group-hover:text-[#7DAA8F] transition-colors">
                {t(cat.key)}
              </span>
            </Link>
          ))}
          
          <Link
            href="/products"
            className="min-w-[125px] xs:min-w-[145px] sm:min-w-[160px] flex flex-col items-center gap-2.5 snap-start group"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#2C392A] text-white flex flex-col items-center justify-center p-3 shadow-md group-hover:bg-[#1f281d] transition-colors">
              <ArrowRight size={24} className="mb-2 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-center">
                Explore All
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* INSIDE OUR STORE */}
      <section
        id="about"
        className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-3xl my-6 border border-neutral-200/60 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-center">
          
          <div className="w-full lg:w-5/12 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7DAA8F]/15 text-[#5F6D59] text-[10px] font-black uppercase tracking-widest mb-3">
              <Sparkles size={12} /> A Glimpse of Tradition
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#2C392A] mb-4 tracking-tight leading-tight">
              Inside Our Store & Workshop
            </h2>
            <p className="text-[#5F6D59] text-xs sm:text-base mb-6 leading-relaxed font-normal">
              Explore our traditional herbal and pooja store in Chennai, where genuine organic quality and sacred authenticity have been our commitment.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-[#2C392A] font-bold text-xs sm:text-sm bg-[#F9F8F5] p-3 rounded-2xl border border-neutral-200/80">
                <div className="bg-[#7DAA8F] text-white p-1.5 rounded-xl shrink-0 shadow-sm">
                  <Award size={14} />
                </div>
                <span>100% Authentic Siddha Formulations</span>
              </div>
              <div className="flex items-center gap-3 text-[#2C392A] font-bold text-xs sm:text-sm bg-[#F9F8F5] p-3 rounded-2xl border border-neutral-200/80">
                <div className="bg-[#7DAA8F] text-white p-1.5 rounded-xl shrink-0 shadow-sm">
                  <Leaf size={14} />
                </div>
                <span>Hand-harvested & Sun-Dried Herbs</span>
              </div>
              <div className="flex items-center gap-3 text-[#2C392A] font-bold text-xs sm:text-sm bg-[#F9F8F5] p-3 rounded-2xl border border-neutral-200/80">
                <div className="bg-[#7DAA8F] text-white p-1.5 rounded-xl shrink-0 shadow-sm">
                  <Star size={14} />
                </div>
                <span>Traditional Pooja & Sambrani Resins</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12">
            <div className="grid grid-cols-2 sm:grid-rows-2 gap-3 sm:gap-4 sm:aspect-[3/2]">
              <div className="col-span-2 sm:col-span-1 sm:row-span-2 rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-md aspect-square sm:aspect-auto sm:h-full border-2 border-white group">
                <img
                  src="/gallery/gallery_setup_1783444417350.png"
                  alt="Inside Mishi Store Setup"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 text-white font-extrabold text-xs">
                  Authentic Workshop & Store
                </div>
              </div>
              <div className="col-span-1 rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-md aspect-square sm:aspect-auto sm:h-full border-2 border-white group">
                <img
                  src="/gallery/gallery_ingredients_1783444379768.png"
                  alt="Hand-Harvested Herbs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="col-span-1 rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-md aspect-square sm:aspect-auto sm:h-full border-2 border-white group">
                <img
                  src="/gallery/gallery_sambrani_1783444367509.png"
                  alt="Traditional Sambrani Resins"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* GLOBAL EXPORTED WORLDWIDE FLAGS SECTION */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-4 sm:my-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          
          {/* Flag Stand Display on the Left */}
          <div className="w-full lg:w-4/12 shrink-0 bg-white border border-emerald-900/10 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-start relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2C392A] text-white flex items-center justify-center shadow-md">
                <Globe size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7DAA8F] block">
                  Export Stand
                </span>
                <h3 className="text-xl font-black text-[#2C392A]">
                  Global Hub
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#5F6D59] font-medium leading-relaxed mb-4">
              Our divine pooja products & organic herbal formulations are officially exported across 7+ countries worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-[#2C392A] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Official Exporter & Supplier
            </div>
          </div>

          {/* Staggered Flag Row on the Right */}
          <div className="w-full lg:w-8/12">
            <div className="mb-4 text-center lg:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7DAA8F] mb-1 block">
                Worldwide Reach
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C392A] tracking-tight">
                Exported Worldwide
              </h2>
            </div>

            {/* Staggered Row Layout (Some Up, Some Down) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 items-center justify-center pt-2">
              {[
                { name: "Malaysia", flag: "/flags/Malaysia_240-animated-flag-gifs.gif", offset: "translate-y-0" },
                { name: "Singapore", flag: "/flags/Singapore_240-animated-flag-gifs.gif", offset: "sm:translate-y-4" },
                { name: "USA", flag: "/flags/USA_240-animated-flag-gifs.gif", offset: "sm:-translate-y-3" },
                { name: "UAE", flag: "/flags/United-Arab-Emirates_240-animated-flag-gifs.gif", offset: "sm:translate-y-5" },
                { name: "Sri Lanka", flag: "/flags/Sri-Lanka_240-animated-flag-gifs.gif", offset: "sm:-translate-y-2" },
                { name: "Mauritius", flag: "/flags/Mauritius_240-animated-flag-gifs.gif", offset: "sm:translate-y-4" },
                { name: "Nigeria", flag: "/flags/Nigeria_240-animated-flag-gifs.gif", offset: "translate-y-0" },
              ].map((country, idx, arr) => {
                // On mobile (2 cols) the final tile is orphaned in the left column - centre it.
                const isOrphan = idx === arr.length - 1 && arr.length % 2 === 1;
                return (
                <div
                  key={country.name}
                  className={`bg-white rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 border border-neutral-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group ${country.offset} ${
                    isOrphan
                      ? "col-span-2 w-[calc(50%-0.375rem)] mx-auto sm:col-span-1 sm:w-auto sm:mx-0"
                      : ""
                  }`}
                >
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="h-10 sm:h-12 w-auto object-contain rounded-md shadow-xs group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[11px] font-extrabold text-[#2C392A] text-center">
                    {country.name}
                  </span>
                </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* VIDEO TESTIMONIALS & CUSTOMER REELS SECTION */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7DAA8F] bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-100">
            Real Customer Experiences
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2C392A] tracking-tight mt-3 mb-2">
            Video Testimonials & Store Reels
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6D59] font-medium">
            Watch our customers and artisans share their journeys with Mishi Sacred Products.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5 max-w-5xl mx-auto">
          {[
            { title: "Sacred Fragrances", src: "/DX9JNchDWyW.mp4", tag: "Verified Review" },
            { title: "Natural Sambrani", src: "/DYCWOObD0x3.mp4", tag: "Store Experience" },
            { title: "Siddha Pooja Blends", src: "/DYTZ_U1idZK.mp4", tag: "Unboxing Reel" },
            { title: "Temple Rituals", src: "/Daxqbe-ihQE.mp4", tag: "Herbal Review" },
            { title: "Customer Unboxing", src: "/DcD0kIWI-rd.mp4", tag: "New Testimonial" },
            { title: "Sacred Store Tour", src: "/Db5kysJo3hb.mp4", tag: "Store Reel" },
          ].map((video, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-100 shadow-md relative group aspect-[9/16] flex flex-col justify-end p-3"
            >
              <video
                src={video.src}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="relative z-10 text-white">
                <span className="inline-block bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                  {video.tag}
                </span>
                <h4 className="text-xs font-black leading-tight text-white drop-shadow-sm">
                  {video.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* FOLLOW US ON INSTAGRAM */}
        <div className="mt-8 sm:mt-12 max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 p-6 sm:p-8 text-center sm:text-left">

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 min-w-0">
                <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center shadow-lg shrink-0">
                  <InstagramIcon size={30} className="text-white" />
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7DAA8F] block mb-1">
                    Follow Our Journey
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2C392A] tracking-tight">
                    @mishi_sambrani
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6D59] font-medium mt-1 max-w-sm">
                    Daily sacred rituals, new arrivals & behind-the-scenes from our workshop.
                  </p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/mishi_sambrani/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Mishi Pooja Products on Instagram"
                className="w-full sm:w-auto shrink-0 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white px-7 py-3.5 rounded-full font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg active:scale-[0.98]"
              >
                <InstagramIcon size={17} className="text-white" /> Follow on Instagram
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* TOP SELLING PRODUCTS */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-6 sm:mb-8">
          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7DAA8F] mb-1 flex items-center gap-1.5">
              <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Star size={10} />
              </span>
              Customer Favorites
            </h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2C392A] tracking-tight">
              Top Selling Products
            </h2>
          </div>
          <Link
            href="/products"
            className="text-[#7DAA8F] text-xs sm:text-sm font-bold flex items-center gap-1 hover:text-[#5F6D59]"
          >
            View Full Store <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {storeProducts
            .filter((p) => p.isActive)
            .slice(0, 4)
            .map((p) => (
              <Link
                href="/products"
                key={p.id}
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all group p-3 sm:p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-square rounded-xl sm:rounded-2xl bg-[#F9F8F5] mb-3 overflow-hidden relative border border-neutral-100 p-1.5 sm:p-2">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#7DAA8F] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Pure
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#2C392A] mb-1 line-clamp-1">
                    {lang === "ta" && p.nameTa ? p.nameTa : p.name}
                  </h3>
                  <p className="text-[10px] text-[#5F6D59] uppercase tracking-wider mb-2">
                    {p.category}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between mt-2">
                  <span className="font-sans font-black text-[#2C392A] text-sm sm:text-base tracking-tight">
                    <span className="text-[10px] sm:text-xs font-bold text-[#5F6D59] mr-1 align-middle">From</span> ₹{p.price}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-[#2C392A] text-white flex items-center justify-center group-hover:bg-[#7DAA8F] transition-colors">
                    <ShoppingCart size={13} />
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS SHOWCASE */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7DAA8F] mb-1.5">
              Verified Customer Reviews
            </h3>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C392A] tracking-tight mb-1">
              Trusted by Thousands
            </h2>
            <p className="text-[#5F6D59] text-xs sm:text-sm">
              Real testimonials from customers across Tamil Nadu
            </p>
          </div>

          {/* Interactive Write a Review Button */}
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-[#2C392A] text-white px-5 py-3 rounded-full font-extrabold text-xs flex items-center gap-2 hover:bg-[#1e271d] transition-all shadow-md active:scale-95 shrink-0"
          >
            <Star size={15} className="fill-amber-400 text-amber-400" /> Write a Review
          </button>
        </div>

        {/* Masked Edge Overlay for Soft Fade */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#F9F8F5] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#F9F8F5] to-transparent z-10" />

          {/* Smooth Continuous Gliding Track */}
          <motion.div
            className="flex gap-4 sm:gap-6 w-max py-3 cursor-grab active:cursor-grabbing"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35,
                ease: "linear",
              },
            }}
          >
            {[...reviews, ...reviews, ...reviews, ...reviews].map((r, idx) => (
              <div
                key={`${r.id}-${idx}`}
                className="w-[280px] xs:w-[320px] sm:w-[360px] bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 shrink-0"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={13} className="fill-current" />
                      ))}
                    </div>
                    <Quote size={18} className="text-emerald-800/20" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#5F6D59] font-medium leading-relaxed mb-6 italic">
                    "{r.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                  <div className="w-9 h-9 rounded-full bg-[#2C392A] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
                    {r.initial}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#2C392A] leading-tight">
                      {r.author}
                    </h4>
                    <p className="text-[10px] text-[#7DAA8F] font-bold">
                      {r.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WRITE A REVIEW INTERACTIVE MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsReviewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden"
            >
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 bg-emerald-50 text-emerald-900 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors"
              >
                <X size={18} />
              </button>

              {reviewSuccess ? (
                <div className="py-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-[#2C392A] mb-2">
                    Review Submitted!
                  </h3>
                  <p className="text-xs text-[#5F6D59]">
                    Thank you for sharing your feedback with Mishi Pooja Products!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#7DAA8F] block mb-1">
                      Share Your Experience
                    </span>
                    <h3 className="text-2xl font-black text-[#2C392A]">
                      Write a Customer Review
                    </h3>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="text-xs font-bold text-[#2C392A] block mb-1.5">
                      Your Overall Rating
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            size={24}
                            className={star <= newRating ? "fill-amber-400" : "text-neutral-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Location Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#2C392A] block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all text-emerald-950 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#2C392A] block mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chennai"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all text-emerald-950 font-medium"
                      />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="text-xs font-bold text-[#2C392A] block mb-1">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write your honest thoughts about our herbal products..."
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all text-emerald-950 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2C392A] hover:bg-[#1e271d] text-white font-extrabold py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#2C392A]/20"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIMITED TIME WELLNESS KIT BANNER */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#1e271d] via-[#2C392A] to-[#1e271d] rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden flex flex-col justify-center items-start border border-emerald-500/20 shadow-2xl">
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 border border-emerald-500/30">
              # Limited Time Sacred Bundle
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
              Complete Wellness Kit
            </h2>
            <p className="text-zinc-300 text-xs sm:text-base mb-6 leading-relaxed font-light">
              Ashwagandha + Triphala + Pure Amla Powder — our most popular organic immunity trio for sacred living.
            </p>
            <Link
              href="/products"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-full font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 transition-all shadow-xl shadow-emerald-600/30"
            >
              Shop Wellness Kit <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* MAP & STORE LOCATION */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        <div className="bg-[#eaf2eb] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[240px] sm:min-h-[300px] border border-[#7DAA8F]/30">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-[#2C392A] rounded-2xl flex items-center justify-center text-white mb-3 shadow-md">
              <MapPin size={22} />
            </div>
            <h3 className="text-lg font-black text-[#2C392A] mb-1">
              Mishi Pooja Products
            </h3>
            <p className="text-xs text-[#5F6D59] font-semibold mb-3 max-w-xs">
              Padasallai street, Lake Road, near to spicot, Chembarambakkam, Tamil Nadu 600123
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Padasallai+street,+Lake+Road,+near+to+spicot,+Chembarambakkam,+Tamil+Nadu+600123"
              target="_blank"
              rel="noreferrer"
              className="bg-[#2C392A] text-white px-6 py-3 rounded-full text-xs font-extrabold flex items-center gap-2 hover:bg-[#1e271d] transition-colors shadow-md"
            >
              <MapPin size={14} /> Open in Google Maps
            </a>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-center shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7DAA8F] mb-2">
            Visit Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C392A] mb-3">
            Visit Our Store
          </h2>
          <p className="text-[#5F6D59] text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            Come experience our authentic herbal products in person. Our herbal artisans will assist you in selecting remedies.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-xl bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#2C392A]">Store Address</p>
                <p className="text-xs text-[#5F6D59] leading-relaxed">
                  Padasallai street, Lake Road, near to spicot, Chembarambakkam, Tamil Nadu 600123
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-xl bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#2C392A]">Contact Phone</p>
                <p className="text-xs text-[#5F6D59] font-bold">+91 80561 01114</p>
                <p className="text-xs text-[#5F6D59] font-bold">+91 73395 18091</p>
              </div>
            </div>
          </div>
        </div>

      </section>


    </div>
  );
}
