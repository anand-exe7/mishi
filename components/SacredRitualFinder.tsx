"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ShoppingCart,
  ArrowRight,
  Flame,
  Leaf,
  Moon,
  Sun,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useCartStore, useProductStore } from "@/store/store";
import { toast } from "react-hot-toast";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"] });

const INTENTS = [
  {
    id: "meditation",
    title: "Peace & Meditation",
    subtitle: "Calm your mind & create a quiet sanctuary",
    icon: Moon,
    color: "from-emerald-900 to-[#1e271d]",
  },
  {
    id: "pooja",
    title: "Sacred Pooja & Prayer",
    subtitle: "Purify room energy with authentic divine resins",
    icon: Flame,
    color: "from-[#2C392A] to-emerald-950",
  },
  {
    id: "immunity",
    title: "Immunity & Vitality",
    subtitle: "Organic Siddha herbal powders for daily health",
    icon: Leaf,
    color: "from-emerald-800 to-[#2C392A]",
  },
  {
    id: "evening",
    title: "Evening Aromatherapy",
    subtitle: "Natural fragrant incense for restful relaxation",
    icon: Sun,
    color: "from-[#1e271d] to-emerald-900",
  },
];

const PREFERENCES = [
  {
    id: "incense",
    title: "Natural Resins & Incense",
    desc: "Sambrani, Dhoop, and pure aromatic sticks",
    icon: "💨",
  },
  {
    id: "powder",
    title: "Sun-Dried Herbal Powders",
    desc: "Ashwagandha, Triphala, and authentic Siddha herbs",
    icon: "🍃",
  },
  {
    id: "oil",
    title: "Divine Deepam Oil",
    desc: "Pure sesame & aromatic lamp oils",
    icon: "🪔",
  },
  {
    id: "all",
    title: "Complete Ritual Bundle",
    desc: "All-in-one curated sacred wellness kit",
    icon: "📦",
  },
];

export default function SacredRitualFinder() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedIntent, setSelectedIntent] = useState<string>("");
  const [selectedPref, setSelectedPref] = useState<string>("");
  
  const { products } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  const handleIntentSelect = (intentId: string) => {
    setSelectedIntent(intentId);
    setStep(2);
  };

  const handlePrefSelect = (prefId: string) => {
    setSelectedPref(prefId);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedIntent("");
    setSelectedPref("");
  };

  // Recommendation Matcher (returns multiple matching products)
  const getRecommendations = () => {
    const candidates = [...products];

    // Fallback list of distinct products if store products not yet populated
    const fallbackList = [
      {
        id: "cup-sambrani",
        name: "Cup Sambrani",
        category: "Incense & Dhoop",
        price: 150,
        imageUrl: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg",
        description: "Handcrafted authentic Siddha sambrani resin cup for sacred rituals and room energy purification.",
        unitLabel: "g",
        benefits: ["Clears negative room energy", "100% Organic sun-dried resin", "Long-lasting divine aroma"]
      },
      {
        id: "computer-sambrani",
        name: "Computer Sambrani",
        category: "Incense & Dhoop",
        price: 120,
        imageUrl: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-4.jpg",
        description: "Convenient modern aromatic sambrani sticks for daily evening prayers and meditation.",
        unitLabel: "g",
        benefits: ["Easy to light", "Consistent burning time", "Refreshing divine fragrance"]
      },
      {
        id: "camphor",
        name: "Pure Natural Camphor",
        category: "Pooja Items",
        price: 80,
        imageUrl: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr4.jpg",
        description: "Pure sacred camphor for spiritual purification and high-energy aarthi rituals.",
        unitLabel: "g",
        benefits: ["Spiritual purification", "Divine essence", "Instantly clears heavy atmosphere"]
      },
      {
        id: "deepam-oil",
        name: "Divine Pooja Lamp Oil",
        category: "Deepam Oil",
        price: 220,
        imageUrl: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg",
        description: "Pure aromatic lamp oil formulated for long-lasting bright flames and positive energy.",
        unitLabel: "ml",
        benefits: ["Pure sesame & aromatic blend", "Smokeless clean burn", "Attracts positive vibrations"]
      }
    ];

    const itemsToFilter = candidates.length >= 2 ? candidates : fallbackList;

    let matched = itemsToFilter.filter((p: any) => {
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      if (selectedPref === "powder") return cat.includes("powder") || name.includes("powder") || cat.includes("herbal");
      if (selectedPref === "oil") return cat.includes("oil") || name.includes("oil") || cat.includes("deepam");
      if (selectedPref === "incense") return cat.includes("incense") || name.includes("dhoop") || name.includes("sambrani") || cat.includes("pooja");
      return true;
    });

    if (matched.length < 2) {
      matched = itemsToFilter;
    }

    return matched.slice(0, 4).map((p: any, idx: number) => ({
      id: p.id,
      name: p.name,
      category: p.category || "Sacred Ritual",
      price: p.price,
      imageUrl: p.imageUrl || "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg",
      description: p.description || "Authentic traditional formulation crafted for daily sacred living.",
      unitLabel: p.unitLabel || "unit",
      rawProduct: p,
      matchScore: Math.max(88, 99 - idx * 3),
      benefits: p.benefits || [
        "Crafted with 100% Pure Siddha Herbs",
        "Free from artificial chemical additives",
        "Sourced & sun-dried in Tamil Nadu"
      ]
    }));
  };

  const recommendedProducts = step === 3 ? getRecommendations() : [];

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-8 md:p-10 border border-emerald-100 shadow-xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-emerald-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-widest mb-2 border border-emerald-200">
            <Sparkles size={13} className="text-emerald-600 animate-spin" /> Interactive Ritual Assistant
          </div>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 tracking-tight ${playfair.className}`}>
            Find Your Sacred Herbal Ritual
          </h2>
          <p className="text-[#5F6D59] text-xs sm:text-sm mt-1 font-normal">
            Answer 2 quick questions to discover your personalized Siddha remedy matches.
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="flex items-center gap-2 bg-emerald-50/60 p-2 rounded-2xl border border-emerald-100 self-start sm:self-auto">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                step === s
                  ? "bg-[#2C392A] text-white shadow-md scale-105"
                  : step > s
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-100/60 text-emerald-800"
              }`}
            >
              {step > s ? <CheckCircle2 size={14} /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Intent */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> Step 1: What is your primary wellness or spiritual goal?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {INTENTS.map((intent) => {
                const Icon = intent.icon;
                return (
                  <button
                    key={intent.id}
                    onClick={() => handleIntentSelect(intent.id)}
                    className="group text-left p-4 sm:p-5 rounded-2xl border border-emerald-100 bg-[#F9F8F5] hover:bg-emerald-50/70 hover:border-emerald-400 transition-all duration-300 shadow-sm flex items-start gap-4 active:scale-[0.99]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#2C392A] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base mb-1 group-hover:text-emerald-700 transition-colors">
                        {intent.title}
                      </h4>
                      <p className="text-xs text-[#5F6D59] leading-relaxed">
                        {intent.subtitle}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform self-center" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Select Form Preference */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /> Step 2: How do you prefer to use your remedies?
              </h3>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                Back to Step 1
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {PREFERENCES.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => handlePrefSelect(pref.id)}
                  className="group text-left p-4 sm:p-5 rounded-2xl border border-emerald-100 bg-[#F9F8F5] hover:bg-emerald-50/70 hover:border-emerald-400 transition-all duration-300 shadow-sm flex items-start gap-4 active:scale-[0.99]"
                >
                  <div className="text-2xl p-2.5 rounded-2xl bg-white border border-emerald-100 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                    {pref.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      {pref.title}
                    </h4>
                    <p className="text-xs text-[#5F6D59] leading-relaxed">
                      {pref.desc}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform self-center" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3: Interactive Results Grid & Personalized Matches */}
        {step === 3 && recommendedProducts.length > 0 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Results Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">
                  Match Results Found ({recommendedProducts.length} Products)
                </span>
                <p className="text-xs text-emerald-950 font-bold mt-0.5">
                  Curated Siddha remedies tailored for your selected ritual preferences.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-[#2C392A] hover:bg-[#1e271d] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw size={14} /> Change Selections
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-gradient-to-r from-emerald-950 via-[#2C392A] to-emerald-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-emerald-500/30 flex flex-col justify-between"
                >
                  <div className="flex gap-4 mb-4">
                    {/* Image */}
                    <div className="w-28 sm:w-32 aspect-square rounded-2xl overflow-hidden bg-white/10 p-2 relative shrink-0 border border-white/20">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles size={10} /> {prod.matchScore}%
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <span className="text-emerald-300 text-[9px] font-extrabold uppercase tracking-widest block truncate">
                        {prod.category}
                      </span>
                      <h3 className={`text-lg sm:text-xl font-black text-white mb-1 leading-tight ${playfair.className}`}>
                        {prod.name}
                      </h3>
                      <p className="text-emerald-100/80 text-xs font-light line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                      
                      <div className="mt-2 space-y-1">
                        {prod.benefits.slice(0, 2).map((b: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-200 truncate">
                            <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Add To Cart Button */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] text-emerald-300 uppercase tracking-wider block font-bold">
                        Price
                      </span>
                      <span className="text-xl font-black text-white">
                        ₹{prod.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/products"
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          const itemToAdd = prod.rawProduct || {
                            id: prod.id,
                            name: prod.name,
                            price: prod.price,
                            category: prod.category,
                            imageUrl: prod.imageUrl,
                            unitLabel: prod.unitLabel
                          };
                          addItem(itemToAdd, 1, prod.unitLabel || "unit");
                          toast.success(`Added ${prod.name} to cart!`);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-1.5"
                      >
                        <ShoppingCart size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
