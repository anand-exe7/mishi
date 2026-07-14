import re

with open("app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace emerald with rose globally
content = content.replace("emerald", "rose")

# Replace Navbar
navbar_old = r"""        \{\/\* New Navbar \*\/\}
        <motion\.nav.*?<\/motion\.nav>"""
navbar_new = """        {/* New Navbar */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-xl shadow-lg border border-white/50" : "bg-white/50 backdrop-blur-md border border-white/20 shadow-sm"}`}
        >
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("#home")}>
            <img src="/logo.webp" alt="Mishi" className="h-8 md:h-10 w-auto object-contain" />
            <span className={`text-xl font-bold tracking-widest uppercase text-rose-950 ${cormorant.className} hidden sm:block`}>Mishi</span>
          </div>
          
          <div className={`hidden md:flex gap-8 text-xs uppercase tracking-widest font-semibold text-neutral-800`}>
             <button onClick={() => scrollTo("#home")} className="hover:text-rose-600 transition-colors">Home</button>
             <button onClick={() => scrollTo("#about")} className="hover:text-rose-600 transition-colors">Heritage</button>
             <button onClick={() => scrollTo("#products")} className="hover:text-rose-600 transition-colors">Collection</button>
          </div>

          <div className={`flex gap-4 items-center text-neutral-800`}>
            <button className="p-2 hover:bg-rose-500/10 rounded-full transition-colors"><User size={18} /></button>
            <button className="p-2 hover:bg-rose-500/10 rounded-full transition-colors relative">
               <ShoppingCart size={18} />
               <span className="absolute top-0 right-0 w-2 h-2 bg-rose-600 rounded-full"></span>
            </button>
          </div>
        </motion.nav>"""

content = re.sub(navbar_old, navbar_new, content, flags=re.DOTALL)

# Replace Hero
hero_old = r"""        \{\/\* New Hero Section \*\/\}
        <section id="home".*?<\/section>"""
hero_new = """        {/* New Hero Section */}
        <section id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex items-center justify-center overflow-hidden bg-[#faf9f6]">
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
              <motion.div style={{ y: heroY }} className="w-full h-full opacity-40">
                 <img src="https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover blur-[2px]" alt="Background" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/90 to-transparent"></div>
           </div>
           
           <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                 <motion.span 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="px-4 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-800 text-xs font-bold uppercase tracking-widest mb-6"
                 >
                    100% Pure & Natural
                 </motion.span>
                 <motion.h1 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className={`text-6xl md:text-7xl lg:text-[6rem] text-rose-950 leading-[0.95] mb-6 ${cormorant.className}`}
                 >
                    Awaken <br/><span className="text-rose-700 italic">Your Senses</span>
                 </motion.h1>
                 <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="text-neutral-600 text-lg md:text-xl font-light mb-10 max-w-lg"
                 >
                    Experience the profound purity of traditional Indian sambrani, handcrafted to elevate your space and soothe your soul.
                 </motion.p>
                 <motion.button
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    onClick={() => scrollTo("#products")}
                    className="px-8 py-4 bg-rose-900 text-white rounded-full hover:bg-rose-800 transition-colors flex items-center gap-3 text-sm tracking-widest uppercase font-semibold shadow-xl shadow-rose-900/20 hover:-translate-y-1"
                 >
                    Discover Collection <ArrowRight size={16} />
                 </motion.button>
              </div>
              
              <motion.div
                 initial={{ opacity: 0, scale: 0.9, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.4, type: "spring" }}
                 className="w-full lg:w-1/2 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative group border-4 border-white"
              >
                 <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/bg.webm" type="video/webm" />
                 </video>
                 <div className="absolute inset-0 bg-rose-900/10 group-hover:bg-rose-900/5 transition-colors"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 cursor-pointer hover:scale-110 transition-transform shadow-xl">
                       <Play className="text-white fill-white ml-1" size={32} />
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>"""

content = re.sub(hero_old, hero_new, content, flags=re.DOTALL)

# Replace Heritage
heritage_old = r"""        \{\/\* New Heritage Section \*\/\}
        <section id="about".*?<\/section>"""
heritage_new = """        {/* New Editorial Heritage Section */}
        <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
           <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full lg:w-5/12 relative">
                 <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
                    <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img1.jpg" className="w-full h-full object-cover" alt="Heritage 1" />
                 </div>
                 <motion.div initial={{ opacity:0, y:40, x:-20 }} whileInView={{ opacity:1, y:0, x:0 }} viewport={{ once:true }} transition={{ delay: 0.3 }} className="absolute -bottom-16 -right-16 w-64 aspect-square rounded-full overflow-hidden shadow-xl border-8 border-[#faf9f6] z-20">
                    <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img2.jpg" className="w-full h-full object-cover" alt="Heritage 2" />
                 </motion.div>
                 <motion.div initial={{ opacity:0, scale:0 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay: 0.6 }} className="absolute -top-10 -left-10 w-32 h-32 bg-rose-100 rounded-full flex flex-col items-center justify-center text-rose-800 z-0 shadow-lg">
                    <span className="text-2xl font-bold">100%</span>
                    <span className="text-xs uppercase tracking-widest font-semibold">Natural</span>
                 </motion.div>
              </motion.div>

              <motion.div variants={fadeBlurVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full lg:w-7/12 pt-16 lg:pt-0">
                 <h4 className="text-rose-600 font-bold tracking-widest uppercase text-sm mb-4">Our Legacy</h4>
                 <h2 className={`text-4xl md:text-6xl text-rose-950 mb-8 leading-tight ${cormorant.className}`}>A devotion to purity, <br/><span className="italic text-rose-700">crafted by hand.</span></h2>
                 
                 <div className="pl-6 border-l-2 border-rose-200">
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
                       <p className="font-bold text-rose-950">Mishi Founders</p>
                       <p className="text-xs uppercase tracking-widest text-neutral-500">Master Crafters</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>"""

content = re.sub(heritage_old, heritage_new, content, flags=re.DOTALL)


with open("app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done updating app/page.tsx")
