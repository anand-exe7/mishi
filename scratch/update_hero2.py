import re

with open("app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update padding for zoom issue in Hero Section
hero_container_old = r'<section id="home" className="relative pt-32 pb-20 px-6 min-h-\[95vh\] flex items-center justify-center overflow-hidden bg-\[\#faf9f6\]">'
hero_container_new = r'<section id="home" className="relative pt-32 pb-20 px-8 lg:px-20 min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#faf9f6]">'
content = re.sub(hero_container_old, hero_container_new, content)

# 2. Update Left side content (animations, remove top image, remove play button)
left_side_old = r"""                 <motion\.div \n                    initial=\{\{ opacity: 0, x: -20, rotate: -5 \}\} animate=\{\{ opacity: 1, x: 0, rotate: 0 \}\} transition=\{\{ delay: 0\.1, type: "spring" \}\}\n                    className="relative"\n                 >\n                    <span className="px-5 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs md:text-sm font-bold uppercase tracking-widest mb-6 inline-block shadow-sm">\n                       100% Pure & Natural\n                    </span>\n                    <motion\.img \n                       animate=\{\{ y: \[0, -10, 0\], rotate: \[0, 5, 0\] \}\} transition=\{\{ duration: 4, repeat: Infinity, ease: "easeInOut" \}\}\n                       src="https://www\.mishipoojaproducts\.com/wp-content/uploads/2026/03/Panchagavya-Vilaku\.jpg" \n                       className="absolute -top-8 -right-16 w-16 h-16 object-cover rounded-full shadow-lg border-2 border-white mix-blend-multiply" \n                    />\n                 </motion\.div>\n                 \n                 <motion\.h1 \n                    initial=\{\{ opacity: 0, y: 30 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ delay: 0\.3 \}\}\n                    className=\{\`text-6xl md:text-7xl lg:text-\[7rem\] text-emerald-950 leading-\[0\.9\] mb-8 \$\{cormorant\.className\}\`\}\n                 >\n                    Awaken <br/><span className="text-emerald-700 italic relative inline-block">Your Senses\n                       <motion\.span \n                          initial=\{\{ scaleX: 0 \}\} animate=\{\{ scaleX: 1 \}\} transition=\{\{ delay: 0\.8, duration: 0\.8 \}\}\n                          className="absolute -bottom-2 left-0 w-full h-\[2px\] bg-emerald-300 origin-left rounded-full"\n                       />\n                    </span>\n                 </motion\.h1>\n                 \n                 <motion\.p\n                    initial=\{\{ opacity: 0, y: 20 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ delay: 0\.5 \}\}\n                    className="text-neutral-600 text-lg md:text-xl font-light mb-6 max-w-lg leading-relaxed"\n                 >\n                    Immerse yourself in a divine aura with our masterfully blended agarbathis and traditional pooja essentials\. Sourced from the finest Himalayan herbs and natural resins\.\n                 </motion\.p>\n                 \n                 <motion\.p\n                    initial=\{\{ opacity: 0, y: 20 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ delay: 0\.6 \}\}\n                    className="text-emerald-800 font-semibold mb-10 text-sm tracking-wide"\n                 >\n                    ✨ Elevate your space\. Soothe your soul\.\n                 </motion\.p>\n\n                 <motion\.div initial=\{\{ opacity: 0, y: 20 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ delay: 0\.7 \}\} className="flex gap-4">\n                    <button onClick=\{\(\) => scrollTo\("#products"\)\} className="px-8 py-4 bg-emerald-900 text-white rounded-full hover:bg-emerald-800 transition-all flex items-center gap-3 text-sm tracking-widest uppercase font-semibold shadow-\[0_10px_40px_-10px_rgba\(6,78,59,0\.5\)\] hover:-translate-y-1 hover:scale-105">\n                       Discover Collection <ArrowRight size=\{16\} />\n                    </button>\n                    <button className="w-14 h-14 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-800 hover:bg-emerald-50 transition-colors">\n                       <Play size=\{20\} className="ml-1" />\n                    </button>\n                 </motion\.div>"""

left_side_new = """                 <motion.div 
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
                 </motion.div>"""

content = re.sub(left_side_old, left_side_new, content)

# 3. Add camphor image to video side instead of the old floating image
video_img_old = r"""                 <motion\.img \n                    animate=\{\{ y: \[0, 15, 0\], rotate: \[0, -5, 0\] \}\} transition=\{\{ duration: 5, repeat: Infinity, ease: "easeInOut" \}\}\n                    src="https://www\.mishipoojaproducts\.com/wp-content/uploads/2026/03/img1\.jpg" \n                    className="absolute -bottom-10 -left-10 w-24 h-24 object-cover rounded-full shadow-2xl border-4 border-white pointer-events-none z-30" \n                 />"""

video_img_new = """                 <motion.img 
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
                 />"""

content = re.sub(video_img_old, video_img_new, content)

with open("app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updates applied")
