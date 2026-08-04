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

  // Recommendation Matcher
  const getRecommendation = () => {
    if (!products || products.length === 0) {
      return {
        name: "Pure Natural Sambrani Powder",
        category: "Pooja Powder",
        price: 249,
        imageUrl: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg",
        description: "Handcrafted authentic Siddha sambrani resin powder for sacred rituals and room purification.",
        matchScore: 98,
        benefits: ["Clears negative room energy", "100% Organic sun-dried resin", "Long-lasting divine aroma"]
      };
    }

    let matched = products.find((p) => {
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      if (selectedPref === "powder" && (cat.includes("powder") || name.includes("powder"))) return true;
      if (selectedPref === "oil" && (cat.includes("oil") || name.includes("oil"))) return true;
      if (selectedPref === "incense" && (cat.includes("incense") || name.includes("dhoop") || name.includes("sambrani"))) return true;
      return false;
    });

    if (!matched) matched = products[0];

    return {
      id: matched.id,
      name: matched.name,
      category: matched.category || "Herbal Product",
      price: matched.price,
      imageUrl: matched.imageUrl || "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg",
      description: matched.description || "Authentic traditional formulation crafted for daily sacred living.",
      rawProduct: matched,
      matchScore: selectedPref === "all" ? 99 : 96,
      benefits: [
        "Crafted with 100% Pure Siddha Herbs",
        "Free from artificial chemical additives",
        "Sourced & sun-dried in Tamil Nadu"
      ]
    };
  };

  const recommendedProduct = step === 3 ? getRecommendation() : null;

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
            Answer 2 quick questions to discover your personalized Siddha remedy match.
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

        {/* STEP 3: Interactive Results & Personalized Match */}
        {step === 3 && recommendedProduct && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-gradient-to-r from-emerald-950 via-[#2C392A] to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/30">
              
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Product Image */}
                <div className="w-full md:w-5/12 aspect-square rounded-2xl overflow-hidden bg-white/10 p-3 relative shrink-0 border border-white/20">
                  <img
                    src={recommendedProduct.imageUrl}
                    alt={recommendedProduct.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles size={12} /> {recommendedProduct.matchScore}% Ritual Match
                  </div>
                </div>

                {/* Details */}
                <div className="w-full md:w-7/12 flex flex-col justify-between">
                  <div>
                    <span className="text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest mb-1.5 block">
                      Recommended Siddha Remedy • {recommendedProduct.category}
                    </span>
                    <h3 className={`text-2xl sm:text-3xl font-black text-white mb-2 ${playfair.className}`}>
                      {recommendedProduct.name}
                    </h3>
                    <p className="text-emerald-100/80 text-xs sm:text-sm font-light leading-relaxed mb-4">
                      {recommendedProduct.description}
                    </p>

                    {/* Key Benefits List */}
                    <div className="space-y-2 mb-6">
                      {recommendedProduct.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                          <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Cart Action */}
                  <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-bold">
                        Special Ritual Price
                      </span>
                      <span className="text-2xl font-black text-white">
                        ₹{recommendedProduct.price}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleReset}
                        className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-white/20"
                        title="Start Over"
                      >
                        <RotateCcw size={14} /> Retry
                      </button>

                      <button
                        onClick={() => {
                          if (recommendedProduct.rawProduct) {
                            addItem(recommendedProduct.rawProduct, 1, recommendedProduct.rawProduct.unitLabel || "unit");
                          }
                          toast.success(`Added ${recommendedProduct.name} to cart!`);
                        }}
                        className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
