with open("app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the circle visibility in Heritage section
content = content.replace('className="absolute -top-10 -left-10 w-32 h-32 bg-rose-100 rounded-full flex flex-col items-center justify-center text-rose-800 z-0 shadow-lg"', 
                          'className="absolute -top-10 -left-10 w-32 h-32 bg-rose-100 rounded-full flex flex-col items-center justify-center text-rose-800 z-20 shadow-lg"')

# Change rose to emerald (dark green) globally
content = content.replace("rose", "emerald")
# Note: Since I used rose-950, rose-800, etc., they will become emerald-950, emerald-800, which are valid tailwind colors.

with open("app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done updating app/page.tsx")
