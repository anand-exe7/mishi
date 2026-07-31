"use client";

import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Phone,
  ArrowRight,
  MapPin,
  Leaf,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({ subsets: ["latin"] });
import { useEffect, useState } from "react";
import { useCartStore, useProductStore, useLangStore } from "@/store/store";
import { getT } from "@/lib/translations";
import Link from "next/link";

const reelVideos = [
  "DX9JNchDWyW",
  "DYTZ_U1idZK",
  "DYCWOObD0x3",
  "Daxqbe-ihQE",
];

export default function Home() {
  const { lang } = useLangStore();
  const t = getT(lang);
  const { products: storeProducts, fetchProducts } = useProductStore();
  const cartItems = useCartStore((state) => state.items);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    const defaultR = [
      { id: 1, text: "Exceptional quality herbal products! Been using them for 6 months — truly authentic remedies that actually work. Packaging is perfect and delivery is fast.", author: "Priya Krishnamurthy", location: "Chennai", initial: "PK", rating: 5 },
      { id: 2, text: "The herbal oils are absolutely pure and give real results. Ordered multiple times and every batch smells fresh and aromatic. Best shop online!", author: "Ramesh Murugan", location: "Coimbatore", initial: "RM", rating: 5 },
      { id: 3, text: "Genuine products at very reasonable prices. Customer service via WhatsApp is very responsive. The herbal powders improved my family's immunity greatly.", author: "Kavitha Sundaram", location: "Madurai", initial: "KS", rating: 5 },
      { id: 4, text: "Outstanding quality. The sambrani powders are the best I have ever tried. Have been recommending to all my friends and relatives. 100% authentic!", author: "Anand Thiagarajan", location: "Trichy", initial: "AT", rating: 5 }
    ];
    setReviews(defaultR);
  }, [fetchProducts]);

  const cartTotal = cartItems.reduce((acc, item) => {
    const option = item.product.predefinedOptions?.find((o:any) => o.unit === item.unit);
    return acc + (option ? option.price : item.product.price) * item.quantity;
  }, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`bg-[#F7F6F2] text-neutral-900 min-h-screen ${playfair.className} selection:bg-[#7DAA8F]/30 selection:text-[#2C392A] overflow-x-hidden font-sans`}>
      {/* Floating Cart Bar on Mobile & Desktop */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 pointer-events-auto max-w-md w-full sm:w-auto"
          >
            <Link href="/cart" className="flex items-center justify-between gap-3 bg-[#2C392A] hover:bg-[#1f281d] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-full shadow-2xl transition-all border border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={18} />
                  <span className="absolute -top-2 -right-2 bg-[#7DAA8F] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
                <div className="flex flex-col border-r border-white/20 pr-3">
                  <span className="text-xs text-white/70 uppercase font-bold text-[9px]">Total</span>
                  <span className="text-sm font-bold">₹{cartTotal}</span>
                </div>
              </div>
              <span className="text-xs font-bold tracking-wider flex items-center gap-1 bg-[#7DAA8F] text-white px-3.5 py-1.5 rounded-full hover:bg-[#6c987c] transition-colors">
                VIEW CART <ArrowRight size={13} />
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="w-full pt-28 sm:pt-32 lg:pt-36 pb-12 lg:pb-24 overflow-hidden relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 sm:mb-6 bg-[#7DAA8F]/15">
              <Leaf size={12} className="text-[#5F6D59]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6D59]">{t("hero.badge")}</span>
            </div>
            <h1 className={`font-black mb-4 sm:mb-6 ${lang === 'ta' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-3.5xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[68px]'} leading-[1.15] md:leading-[1.1] tracking-tight text-[#2C392A]`}>
              <span className="block">{t("hero.title1")}</span>
              <span className="block text-[#7DAA8F]">{t("hero.title2")}</span>
            </h1>
            <p className="text-[#5F6D59] text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-md leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link href="/products" className="bg-[#2C392A] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#1e271d] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#2C392A]/10">
                <ShoppingCart size={16} /> {t("hero.cta_shop")}
              </Link>
              <a href="#about" className="bg-white text-[#2C392A] px-7 py-3.5 rounded-full font-bold text-sm border border-[#2C392A]/15 hover:bg-[#F7F6F2] transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Leaf size={16} className="text-[#7DAA8F]" /> {t("hero.cta_browse")}
              </a>
            </div>
          </div>
          <div className="relative mt-2 lg:mt-0">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl sm:shadow-2xl border border-white/60">
              <video src="/bg2.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            {/* Overlay badge 1 */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur shadow-md border border-neutral-100 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#7DAA8F] rounded-full flex items-center justify-center text-white shrink-0"><Leaf size={10}/></div>
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] font-black text-[#2C392A]">100% Natural</span>
                <span className="text-[7px] text-[#5F6D59]">Siddha Certified</span>
              </div>
            </div>
            {/* Overlay badge 2 */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur shadow-md border border-neutral-100 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 flex flex-col items-center">
              <div className="flex gap-0.5 mb-0.5 text-amber-400">
                {[1,2,3,4,5].map(i => <Star key={i} size={8} className="fill-current"/>)}
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-[#2C392A]">4.9 / 5.0</span>
              <span className="text-[7px] text-[#5F6D59]">Happy Customers</span>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0"><Leaf size={18}/></div>
             <div>
               <h4 className="text-[#2C392A] font-black text-xs sm:text-sm">{t("trust.organic")}</h4>
               <p className="text-[9px] sm:text-[10px] text-[#5F6D59] leading-tight mt-0.5">{t("trust.organic_sub")}</p>
             </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0"><ShoppingCart size={18}/></div>
             <div>
               <h4 className="text-[#2C392A] font-black text-xs sm:text-sm">{t("trust.shipping")}</h4>
               <p className="text-[9px] sm:text-[10px] text-[#5F6D59] leading-tight mt-0.5">{t("trust.shipping_sub")}</p>
             </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0"><Leaf size={18}/></div>
             <div>
               <h4 className="text-[#2C392A] font-black text-xs sm:text-sm">{t("trust.pure")}</h4>
               <p className="text-[9px] sm:text-[10px] text-[#5F6D59] leading-tight mt-0.5">{t("trust.pure_sub")}</p>
             </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#7DAA8F]/15 flex items-center justify-center text-[#7DAA8F] shrink-0"><Star size={18}/></div>
             <div>
               <h4 className="text-[#2C392A] font-black text-xs sm:text-sm">{t("trust.gmp")}</h4>
               <p className="text-[9px] sm:text-[10px] text-[#5F6D59] leading-tight mt-0.5">{t("trust.gmp_sub")}</p>
             </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-6 sm:mb-8">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7DAA8F] mb-1">Browse Collection</h3>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C392A] tracking-tight">{t("cat.title")}</h2>
          </div>
          <Link href="/products" className="text-[#7DAA8F] text-xs sm:text-sm font-bold flex items-center gap-1 hover:text-[#5F6D59] self-start sm:self-auto">
            View All <ArrowRight size={14}/>
          </Link>
        </div>
        
        {/* Responsive horizontal touch scroll for categories */}
        <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
          {[
            { id: 'pooja', img: 1, key: 'cat.pooja' as const }, 
            { id: 'powder', img: 2, key: 'cat.powder' as const }, 
            { id: 'oil', img: 3, key: 'cat.oil' as const }, 
            { id: 'incense', img: 4, key: 'cat.incense' as const }, 
            { id: 'spices', img: 5, key: 'cat.spices' as const }, 
            { id: 'bundles', img: 1, key: 'cat.bundles' as const }
          ].map((cat) => (
            <Link href="/products" key={cat.id} className="min-w-[110px] sm:min-w-[140px] flex flex-col items-center gap-2.5 snap-start group">
              <div className="w-full aspect-square rounded-2xl bg-white p-2.5 sm:p-3 shadow-sm border border-neutral-100 group-hover:shadow-md transition-shadow relative overflow-hidden">
                <img src={`https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-${cat.img}.jpg`} className="w-full h-full object-cover rounded-xl" alt={t(cat.key)}/>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#2C392A] text-center group-hover:text-[#7DAA8F]">{t(cat.key)}</span>
            </Link>
          ))}
          <Link href="/products" className="min-w-[110px] sm:min-w-[140px] flex flex-col items-center gap-2.5 snap-start group">
            <div className="w-full aspect-square rounded-2xl bg-[#2C392A] text-white flex flex-col items-center justify-center p-3 shadow-sm group-hover:bg-[#1f281d] transition-colors">
              <ArrowRight size={20} className="mb-1 sm:mb-2" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">All</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Inside Our Store */}
      <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="w-full lg:w-1/3 text-left">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7DAA8F] mb-2">A Glimpse of our Tradition</h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2C392A] mb-4 sm:mb-6 tracking-tight">Inside Our Store</h2>
            <p className="text-[#5F6D59] text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              Explore our traditional herbal and pooja store, where quality and authenticity have been our promise since the beginning.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center gap-3 text-[#2C392A] font-bold text-xs sm:text-sm">
                <div className="bg-[#7DAA8F]/20 p-1.5 rounded-full shrink-0"><Star size={12} className="text-[#7DAA8F]" /></div> Trusted Brand
              </li>
              <li className="flex items-center gap-3 text-[#2C392A] font-bold text-xs sm:text-sm">
                <div className="bg-[#7DAA8F]/20 p-1.5 rounded-full shrink-0"><Leaf size={12} className="text-[#7DAA8F]" /></div> Authentic Herbal Products
              </li>
              <li className="flex items-center gap-3 text-[#2C392A] font-bold text-xs sm:text-sm">
                <div className="bg-[#7DAA8F]/20 p-1.5 rounded-full shrink-0"><Star size={12} className="text-[#7DAA8F]" /></div> Traditional Pooja Materials
              </li>
            </ul>
          </div>
          <div className="w-full lg:w-2/3">
             <div className="grid grid-cols-2 gap-3 sm:gap-4">
               <div className="col-span-2 sm:col-span-1 sm:row-span-2 rounded-2xl sm:rounded-[2rem] overflow-hidden relative shadow-lg aspect-[16/10] sm:aspect-[3/4]">
                 <video src={`/${reelVideos[0]}.mp4`} className="w-full h-full object-cover" autoPlay muted loop playsInline />
               </div>
               <div className="col-span-1 rounded-2xl sm:rounded-[2rem] overflow-hidden relative shadow-lg aspect-square">
                 <video src={`/${reelVideos[1]}.mp4`} className="w-full h-full object-cover" autoPlay muted loop playsInline />
               </div>
               <div className="col-span-1 rounded-2xl sm:rounded-[2rem] overflow-hidden relative shadow-lg aspect-square">
                 <video src={`/${reelVideos[2]}.mp4`} className="w-full h-full object-cover" autoPlay muted loop playsInline />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Top Selling Herbs & Products */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-6 sm:mb-8">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7DAA8F] mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#fde6a6] flex items-center justify-center text-amber-600 shrink-0"><Star size={10}/></span> Customer Favourites
            </h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2C392A] tracking-tight">Top Selling Products</h2>
          </div>
          <Link href="/products" className="text-[#7DAA8F] text-xs sm:text-sm font-bold flex items-center gap-1 hover:text-[#5F6D59]">
            View All <ArrowRight size={14}/>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {storeProducts.filter(p => p.isActive).slice(0, 4).map((p) => (
            <Link href="/products" key={p.id} className="bg-white rounded-2xl sm:rounded-[24px] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all group p-3 sm:p-4 flex flex-col">
              <div className="w-full aspect-square rounded-xl sm:rounded-2xl bg-[#F7F6F2] mb-3 overflow-hidden relative">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xs sm:text-[13px] font-bold text-[#2C392A] mb-1 truncate">{lang === 'ta' && p.nameTa ? p.nameTa : p.name}</h3>
              <p className="text-[9px] sm:text-[10px] text-[#5F6D59] uppercase tracking-wider mb-2">{lang === 'ta' ? 'அலகு' : 'piece'}</p>
              <div className="mt-auto font-black text-[#2C392A] text-sm sm:text-base">₹{p.price}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7DAA8F] mb-1.5">Customer Reviews</h3>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C392A] tracking-tight mb-1">Trusted by Thousands</h2>
            <p className="text-[#5F6D59] text-xs sm:text-sm">Real results from real customers across Tamil Nadu</p>
          </div>
          <button className="bg-[#2C392A] text-white px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-[#1e271d] shadow-sm">
            <Star size={14} className="fill-amber-400 text-amber-400"/> Write a Review
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reviews.map(r => (
            <div key={r.id} className="bg-[#f9f8f4] border border-[#e8e5d9] p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-amber-400 text-amber-400"/>)}
                </div>
                <p className="text-xs sm:text-[13px] text-[#5F6D59] font-medium leading-relaxed mb-6 italic">"{r.text}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7DAA8F] flex items-center justify-center text-white font-bold text-xs shrink-0">{r.initial}</div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#2C392A] leading-tight">{r.author}</h4>
                  <p className="text-[10px] text-[#7DAA8F] mt-0.5">{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Wellness Kit */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-[#2C392A] rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 md:p-12 relative overflow-hidden flex flex-col justify-center items-start min-h-[250px] sm:min-h-[300px]">
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-15 sm:opacity-20 pointer-events-none">
            <img src="/gallery/gallery_ingredients_1783444379768.png" className="w-full h-full object-cover" alt="bg"/>
          </div>
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-3 py-1 bg-white/10 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 border border-white/20">
              # Limited Time Offer
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">Complete Wellness Kit</h2>
            <p className="text-[#a0b09d] text-xs sm:text-base mb-6 sm:mb-8">Ashwagandha + Triphala + Amla Powder — our most popular immunity trio.</p>
            <Link href="/products" className="bg-white text-[#2C392A] px-6 py-3 rounded-full font-bold text-xs sm:text-sm inline-flex items-center gap-2 hover:bg-[#F7F6F2] shadow-md">
              Shop Now <ArrowRight size={15}/>
            </Link>
          </div>
        </div>
      </section>

      {/* Map & Location */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-[#eaf2eb] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[240px] sm:min-h-[300px]">
           <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(#2C392A 1px, transparent 1px), linear-gradient(90deg, #2C392A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
           <div className="relative z-10 flex flex-col items-center justify-center">
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2C392A] rounded-full flex items-center justify-center text-white mb-3"><MapPin size={18}/></div>
             <h3 className="text-base sm:text-lg font-bold text-[#2C392A] mb-1">Mishi Pooja Products</h3>
             <p className="text-xs text-[#5F6D59] mb-4">Tamil Nadu, India</p>
             <a href="https://maps.google.com/?q=13.032223,80.0381669" target="_blank" rel="noreferrer" className="bg-[#2C392A] text-white px-5 py-2.5 rounded-full text-[11px] font-bold flex items-center gap-2 hover:bg-[#1e271d] transition-colors shadow-sm">
               <MapPin size={12}/> Open in Google Maps
             </a>
           </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 md:p-10 flex flex-col justify-center">
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7DAA8F] mb-2">Find Us</span>
           <h2 className="text-2xl sm:text-3xl font-black text-[#2C392A] mb-3 sm:mb-4">Visit Our Store</h2>
           <p className="text-[#5F6D59] text-xs sm:text-sm leading-relaxed mb-6">Come experience our authentic herbal products in person. Our knowledgeable staff will help you find the right remedies for your needs.</p>
           <div className="space-y-3 sm:space-y-4">
             <div className="flex gap-3 sm:gap-4">
               <MapPin size={18} className="text-[#7DAA8F] shrink-0 mt-0.5"/>
               <div><p className="text-[11px] font-bold text-[#2C392A]">Store Location</p><p className="text-[11px] text-[#5F6D59]">213/6A, Eripattai, Chembarambakkam, Chennai – 600123</p></div>
             </div>
             <div className="flex gap-3 sm:gap-4">
               <Phone size={18} className="text-[#7DAA8F] shrink-0 mt-0.5"/>
               <div><p className="text-[11px] font-bold text-[#2C392A]">Phone Number</p><p className="text-[11px] text-[#5F6D59]">+91 80561 01114</p></div>
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C392A] pt-12 sm:pt-16 pb-8 px-4 sm:px-6 text-white/80 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12 border-b border-white/10 pb-8 sm:pb-12">
          <div className="sm:col-span-2">
            <img src="/logo.webp" alt="Mishi" className="h-10 sm:h-12 w-auto brightness-0 invert mb-4 sm:mb-6" />
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm">Bringing you the divine essence of pure, hand-crafted Himalayan herbs and natural resins. Create a peaceful sanctuary in your everyday life.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm">Quick Links</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm">Contact</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-white/70">
              <li>+91 80561 01114</li>
              <li>mishipoojaproducts@gmail.com</li>
              <li>Chembarambakkam, Chennai</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 text-center text-xs text-white/40">
          <p>© 2026 Mishi Pooja Products. Powered by Cenexa Systems</p>
          <div className="flex gap-3 sm:gap-4 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">
            <span>Purity</span>
            <span>•</span>
            <span>Devotion</span>
            <span>•</span>
            <span>Tradition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

