import re

with open("app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Video
video_old = r'<source src="/bg.webm" type="video/webm" />'
video_new = r'<source src="/bg2.mp4" type="video/mp4" />'
content = content.replace(video_old, video_new)

# 2. Remove play button
play_btn_old = r"""                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 cursor-pointer hover:scale-110 transition-transform shadow-xl">
                       <Play className="text-white fill-white ml-1" size={32} />
                    </div>
                 </div>"""
content = content.replace(play_btn_old, "")

# 3. Add Incense component before Home component
incense_comp = """
const IncenseSmoke = ({ flip = false }: { flip?: boolean }) => (
  <div className={`absolute bottom-0 ${flip ? '-right-10 md:right-10' : '-left-10 md:left-10'} z-20 pointer-events-none opacity-60 md:opacity-100 scale-75 md:scale-100`}>
    <div className={`relative flex flex-col items-center ${flip ? 'rotate-12' : '-rotate-12'}`}>
      {/* Smoke Animations */}
      <div className="absolute bottom-[100%] w-0.5 h-64 overflow-visible flex flex-col-reverse items-center">
         <motion.div
            initial={{ opacity: 0, y: 10, scale: 1, filter: "blur(4px)" }}
            animate={{ opacity: [0, 0.6, 0], y: -150, scale: 6, x: flip ? -30 : 30 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            className="w-4 h-16 bg-neutral-300/40 rounded-[100%]"
         />
         <motion.div
            initial={{ opacity: 0, y: 10, scale: 1, filter: "blur(8px)" }}
            animate={{ opacity: [0, 0.5, 0], y: -200, scale: 8, x: flip ? 50 : -50 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
            className="w-6 h-20 bg-neutral-400/30 rounded-[100%] absolute bottom-8"
         />
         <motion.div
            initial={{ opacity: 0, y: 10, scale: 1, filter: "blur(6px)" }}
            animate={{ opacity: [0, 0.4, 0], y: -250, scale: 10, x: flip ? -10 : 10 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeOut", delay: 3 }}
            className="w-8 h-24 bg-neutral-300/20 rounded-[100%] absolute bottom-16"
         />
      </div>
      
      {/* Incense Stick Image */}
      <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr3.jpg" 
           alt="Incense" 
           className="w-8 h-48 object-cover rounded-full shadow-2xl border-2 border-emerald-900/20"
           style={{ clipPath: "polygon(40% 0%, 60% 0%, 60% 100%, 40% 100%)" }}
      />
      {/* Glowing tip */}
      <div className="absolute top-0 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_15px_4px_rgba(249,115,22,0.8)] z-10 animate-pulse" />
      {/* Base holder */}
      <div className="w-12 h-3 bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-full mt-[-4px] shadow-xl border-b-2 border-emerald-900 z-10" />
    </div>
  </div>
);

"""

# Insert before `export default function Home() {`
content = content.replace("export default function Home() {", incense_comp + "export default function Home() {")

# Add incense sticks to left and right in the Hero section
hero_container_old = r'<section id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex items-center justify-center overflow-hidden bg-[#faf9f6]">'
hero_container_new = r"""<section id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex items-center justify-center overflow-hidden bg-[#faf9f6]">
           <IncenseSmoke />
           <IncenseSmoke flip />"""
content = content.replace(hero_container_old, hero_container_new)


with open("app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done updating page.tsx")
