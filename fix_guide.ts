import fs from 'fs';

let data = fs.readFileSync('src/components/GuideModals.tsx', 'utf8');

// Update imports
data = data.replace(
  "import { X, ChevronLeft, ChevronRight, Bookmark, Compass, Network, LayoutDashboard, Sword, Timer as TimerIcon, ShoppingBag, Package, BarChart3, Scroll, Trophy } from 'lucide-react';",
  "import { X, ChevronLeft, ChevronRight, Bookmark, Compass, Network, LayoutDashboard, Sword, Timer as TimerIcon, ShoppingBag, Package, BarChart3, Scroll, Trophy, Sparkles, Shield, Rocket, Briefcase, BookOpen, Coins, Puzzle } from 'lucide-react';"
);

// Add Sanctum Items to TOC and bump others
data = data.replace(
  /onClick=\{\(\) => goToChapter\(3\)\}.*?HandCoins[\s\S]*?Pg 9<\/span>\n          <\/button>\n        <\/div>/m,
  `onClick={() => goToChapter(3)} className="flex items-center gap-4 group w-full p-2 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600 group-hover:scale-110 transition-transform shadow-sm"><Package className="w-6 h-6" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-xl font-serif">Sanctum Items</span>
              <span className="block text-sm text-[#5c4033] font-sans">Resources & Consumables</span>
            </div>
            <span className="text-[#8b6b4a] text-sm sm:text-base font-serif italic">Pg 5</span>
          </button>
          <button onClick={() => goToChapter(4)} className="flex items-center gap-4 group w-full p-2 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600 group-hover:scale-110 transition-transform shadow-sm"><HandCoins className="w-6 h-6" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-xl font-serif">Gold Coins</span>
              <span className="block text-sm text-[#5c4033] font-sans">Economy & Wealth</span>
            </div>
            <span className="text-[#8b6b4a] text-sm sm:text-base font-serif italic">Pg 7</span>
          </button>
          <button onClick={() => goToChapter(5)} className="flex items-center gap-4 group w-full p-2 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform shadow-sm"><HandTarget className="w-6 h-6" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-xl font-serif">XP <span className="font-sans">&</span> Leveling</span>
              <span className="block text-sm text-[#5c4033] font-sans">Growth & Progression</span>
            </div>
            <span className="text-[#8b6b4a] text-sm sm:text-base font-serif italic">Pg 9</span>
          </button>
          <button onClick={() => goToChapter(6)} className="flex items-center gap-4 group w-full p-2 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform shadow-sm"><Network className="w-6 h-6" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-xl font-serif">Talent System</span>
              <span className="block text-sm text-[#5c4033] font-sans">Unlocking Potential</span>
            </div>
            <span className="text-[#8b6b4a] text-sm sm:text-base font-serif italic">Pg 11</span>
          </button>
        </div>`
);

// Insert new pages
const newPages = `
    // Page 6: Sanctum Items - Core (Left Page)
    (
      <div className="w-full h-full paper-texture p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">
          <Package className="text-rose-600 w-7 h-7" />
          <h2 className="text-3xl font-bold font-serif text-[#3a2e22]">Core Resources</h2>
        </div>
        <p className="text-[#5c4033] text-sm md:text-base mb-6 leading-relaxed font-sans">
          These essential resources form the foundation of your journey within the Sanctum.
        </p>
        <ul className="space-y-4 text-[#5c4033] text-sm md:text-base font-sans mt-auto mb-auto">
          <li>
            <strong className="text-amber-700 font-serif text-lg flex items-center gap-2"><Coins size={16} /> Gold Coins</strong>
            <p className="mt-1 leading-relaxed text-[#5c4033]">The primary currency. Earned through sessions, dungeons, and quests. Used in the Merchant Outpost for items and Gacha.</p>
          </li>
          <li>
            <strong className="text-emerald-700 font-serif text-lg flex items-center gap-2"><Sparkles size={16} /> XP (Experience Points)</strong>
            <p className="mt-1 leading-relaxed text-[#5c4033]">Represents your overall growth. Earn XP to level up, which unlocks rewards and Talent Points.</p>
          </li>
          <li>
            <strong className="text-indigo-700 font-serif text-lg flex items-center gap-2"><Zap size={16} /> Talent Points</strong>
            <p className="mt-1 leading-relaxed text-[#5c4033]">Rare points used exclusively to unlock powerful passive traits in the Talent Tree.</p>
          </li>
          <li>
            <strong className="text-indigo-500 font-serif text-lg flex items-center gap-2"><Puzzle size={16} /> Talent Shards</strong>
            <p className="mt-1 leading-relaxed text-[#5c4033]">Fragments of potential. Collect 3 shards to automatically forge 1 full Talent Point.</p>
          </li>
        </ul>
        <p className="text-center font-serif text-[#8b6b4a] text-sm mt-auto pt-4 border-t border-[#8b6b4a]/20">Page 5</p>
      </div>
    ),

    // Page 7: Sanctum Items - Advanced (Right Page)
    (
      <div className="w-full h-full paper-texture p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">
          <BookOpen className="text-rose-600 w-7 h-7" />
          <h2 className="text-3xl font-bold font-serif text-[#3a2e22]">Advanced Items</h2>
        </div>
        <p className="text-[#5c4033] text-sm md:text-base mb-6 leading-relaxed font-sans">
          Powerful artifacts that can significantly alter your progress. They can be obtained mainly from the Merchant's shop or Dungeon rewards.
        </p>
        <ul className="space-y-4 text-[#5c4033] text-sm md:text-base font-sans mt-auto mb-auto">
          <li className="bg-[#f4ebd8] p-3 rounded-xl border border-[#d8c5a5]">
            <strong className="text-rose-700 font-serif flex items-center gap-2"><Shield size={16} /> Protection Amulet (免死金牌)</strong>
            <p className="mt-1 text-sm leading-relaxed text-[#5c4033]">Automatically consumed to prevent a Dungeon Goal from failing if you miss a deadline, preserving your progress.</p>
          </li>
          <li className="bg-[#f4ebd8] p-3 rounded-xl border border-[#d8c5a5]">
            <strong className="text-sky-700 font-serif flex items-center gap-2"><Rocket size={16} /> Double XP Card</strong>
            <p className="mt-1 text-sm leading-relaxed text-[#5c4033]">When activated in your Vault, temporarily doubles all Experience Points earned from sessions and quests.</p>
          </li>
          <li className="bg-[#f4ebd8] p-3 rounded-xl border border-[#d8c5a5]">
            <strong className="text-amber-700 font-serif flex items-center gap-2"><Briefcase size={16} /> Double Gold Card</strong>
            <p className="mt-1 text-sm leading-relaxed text-[#5c4033]">When activated in your Vault, temporarily doubles all Gold Coins earned, accelerating your wealth.</p>
          </li>
        </ul>
        <p className="text-center font-serif text-[#8b6b4a] text-sm mt-auto pt-4 border-t border-[#8b6b4a]/20">Page 6</p>
      </div>
    ),

    // Page 8: Coins (Left Page)
`;

data = data.replace('    // Page 6: Coins (Left Page)\n', newPages);

// Update page bounds
data = data.replace(/pageIndex >= 12/g, 'pageIndex >= 14');

// Update comments from // Page 13 -> 15 down to // Page 6 -> 8
for (let i = 13; i >= 6; i--) {
  data = data.replace(new RegExp("// Page " + i + ":", 'g'), "// Page " + (i+2) + ":");
}

// Update bottom page numbers
for (let i = 12; i >= 5; i--) {
  data = data.replace(new RegExp(">Page " + i + "</p>", 'g'), ">Page " + (i+2) + "</p>");
}

fs.writeFileSync('src/components/GuideModals.tsx', data);
console.log('Done!');
