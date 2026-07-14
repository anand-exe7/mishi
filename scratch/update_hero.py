import re

with open("app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update IncenseSmoke component
incense_old = r"const IncenseSmoke = \(\{ flip = false \}: \{ flip\?: boolean \}\) => \(.*?  </div>\n\);"
incense_new = """const IncenseSmoke = ({ flip = false }: { flip?: boolean }) => (
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
);"""
content = re.sub(incense_old, incense_new, content, flags=re.DOTALL)

# 2. Update Hero Section
hero_old = r"        \{\/\* New Hero Section \*\/\}[\s\S]*?        \{\/\* New Editorial Heritage Section \*\/\}"
hero_new = """        {/* New Hero Section */}
        <section id="home" className="relative pt-32 pb-20 px-6 min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#faf9f6]">
           <IncenseSmoke />
           <IncenseSmoke flip />
           
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
              <motion.div style={{ y: heroY }} className="w-full h-full opacity-40">
                 <img src="https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover blur-[2px]" alt="Background" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6] via-[#faf9f6]/95 to-[#faf9f6]"></div>
           </div>
           
           <div className="relative z-10 max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
              <div className="w-full lg:w-5/12 flex flex-col items-start text-left relative z-20">
                 <motion.div 
                    initial={{ opacity: 0, x: -20, rotate: -5 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ delay: 0.1, type: "spring" }}
                    className="relative"
                 >
                    <span className="px-5 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs md:text-sm font-bold uppercase tracking-widest mb-6 inline-block shadow-sm">
                       100% Pure & Natural
                    </span>
                    <motion.img 
                       animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                       src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Panchagavya-Vilaku.jpg" 
                       className="absolute -top-8 -right-16 w-16 h-16 object-cover rounded-full shadow-lg border-2 border-white mix-blend-multiply" 
                    />
                 </motion.div>
                 
                 <motion.h1 
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className={`text-6xl md:text-7xl lg:text-[7rem] text-emerald-950 leading-[0.9] mb-8 ${cormorant.className}`}
                 >
                    Awaken <br/><span className="text-emerald-700 italic relative inline-block">Your Senses
                       <motion.span 
                          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
                          className="absolute -bottom-2 left-0 w-full h-[2px] bg-emerald-300 origin-left rounded-full"
                       />
                    </span>
                 </motion.h1>
                 
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
                    <button className="w-14 h-14 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-800 hover:bg-emerald-50 transition-colors">
                       <Play size={20} className="ml-1" />
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
                    animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img1.jpg" 
                    className="absolute -bottom-10 -left-10 w-24 h-24 object-cover rounded-full shadow-2xl border-4 border-white pointer-events-none z-30" 
                 />
              </motion.div>
           </div>
        </section>

        {/* New Editorial Heritage Section */}"""
content = re.sub(hero_old, hero_new, content, flags=re.DOTALL)

with open("app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done updating hero section in page.tsx")
