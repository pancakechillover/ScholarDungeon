import fs from 'fs';

let data = fs.readFileSync('src/components/GuideModals.tsx', 'utf8');

// 1. Fix max bound checks
data = data.replace(/pageIndex >= 14/g, 'pageIndex >= 16');

// 2. Fix the TOC. Let's find the TOC block.
// Let's replace the Gold Coins tab to be Chapter 4, XP to 5, Talent to 6.
data = data.replace(
  /<button onClick=\{\(\) => goToChapter\(3\)\} className="flex items-center gap-4 group w-full p-2 hover:bg-\[\#8b6b4a\]\/10 rounded-xl transition-colors border border-transparent hover:border-\[\#8b6b4a\]\/20">[\s\S]*?<div className="p-2 bg-amber-100/m,
  `<button onClick={() => goToChapter(3)} className="flex items-center gap-4 group w-full p-2 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600 group-hover:scale-110 transition-transform shadow-sm"><Package className="w-6 h-6" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-xl font-serif">Sanctum Items</span>
              <span className="block text-sm text-[#5c4033] font-sans">Resources & Consumables</span>
            </div>
            <span className="text-[#8b6b4a] text-sm sm:text-base font-serif italic">Pg 5</span>
          </button>
          <button onClick={() => goToChapter(4)} className="flex items-center gap-4 group w-full p-2 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-amber-100`
);

data = data.replace(
  /onClick=\{\(\) => goToChapter\(4\)\}/,
  'onClick={() => goToChapter(5)}'
);

data = data.replace(
  /onClick=\{\(\) => goToChapter\(5\)\}/,
  'onClick={() => goToChapter(6)}'
);

// update pages numbers in TOC
data = data.replace(
  /Gold Coins[\s\S]*?Pg 5/,
  'Gold Coins</span>\n              <span className="block text-sm text-[#5c4033] font-sans">Economy & Wealth</span>\n            </div>\n            <span className="text-[#8b6b4a] text-sm sm:text-base font-serif italic">Pg 9'
);

data = data.replace(
  /XP.*?Leveling[\s\S]*?Pg 7/,
  'XP <span className="font-sans">&</span> Leveling</span>\n              <span className="block text-sm text-[#5c4033] font-sans">Growth & Progression</span>\n            </div>\n            <span className="text-[#8b6b4a] text-sm sm:text-base font-serif italic">Pg 11'
);

data = data.replace(
  /Talent System[\s\S]*?Pg 9/,
  'Talent System</span>\n              <span className="block text-sm text-[#5c4033] font-sans">Unlocking Potential</span>\n            </div>\n            <span className="text-[#8b6b4a] text-sm sm:text-base font-serif italic">Pg 13'
);

// 3. Replace the 2-page Sanctum Items with a 4-page one.
// The current 2-page Sanctum items goes from "// Page 8: Sanctum Items - Core" to "// Page 10: Coins".
const startSearch = "// Page 8: Sanctum Items - Core (Left Page)";
const endSearch = "// Page 10: Coins (Left Page)";
const startIndex = data.indexOf(startSearch);
const endIndex = data.indexOf(endSearch);

const newPagesBlock = `// Page 6: Sanctum Items - Core 1 (Left Page)
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
        </ul>
        <p className="text-center font-serif text-[#8b6b4a] text-sm mt-auto pt-4 border-t border-[#8b6b4a]/20">Page 5</p>
      </div>
    ),

    // Page 7: Sanctum Items - Core 2 (Right Page)
    (
      <div className="w-full h-full paper-texture p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
        
        <p className="text-[#5c4033] text-sm md:text-base mb-6 leading-relaxed font-sans mt-4">
          Core resources dedicated to your skill development. These materials cannot be bought, only earned through dedication and persistence.
        </p>
        <ul className="space-y-4 text-[#5c4033] text-sm md:text-base font-sans mb-auto">
          <li>
            <strong className="text-indigo-700 font-serif text-lg flex items-center gap-2"><Zap size={16} /> Talent Points</strong>
            <p className="mt-1 leading-relaxed text-[#5c4033]">Rare points used exclusively to unlock powerful passive traits in the Talent Tree.</p>
          </li>
          <li>
            <strong className="text-indigo-500 font-serif text-lg flex items-center gap-2"><Puzzle size={16} /> Talent Shards</strong>
            <p className="mt-1 leading-relaxed text-[#5c4033]">Fragments of potential. Collect 3 shards to automatically forge 1 full Talent Point. Sometimes they drop together with items.</p>
          </li>
        </ul>
        <p className="text-center font-serif text-[#8b6b4a] text-sm mt-auto pt-4 border-t border-[#8b6b4a]/20">Page 6</p>
      </div>
    ),

    // Page 8: Sanctum Items - Advanced 1 (Left Page)
    (
      <div className="w-full h-full paper-texture p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">
          <BookOpen className="text-rose-600 w-7 h-7" />
          <h2 className="text-3xl font-bold font-serif text-[#3a2e22]">Advanced Items</h2>
        </div>
        <p className="text-[#5c4033] text-sm md:text-base mb-6 leading-relaxed font-sans">
          Powerful artifacts that can significantly alter your progress. Obtained mainly from the Merchant's shop or Dungeon rewards.
        </p>
        <ul className="space-y-4 text-[#5c4033] text-sm md:text-base font-sans mt-auto mb-auto">
          <li className="bg-[#f4ebd8] p-3 rounded-xl border border-[#d8c5a5]">
            <strong className="text-rose-700 font-serif flex items-center gap-2"><Shield size={16} /> Death Defying Medal</strong>
            <p className="mt-1 text-sm leading-relaxed text-[#5c4033]">Automatically consumed to prevent a Dungeon Goal from failing if you miss a deadline, preserving your progress.</p>
          </li>
          <li className="bg-[#f4ebd8] p-3 rounded-xl border border-[#d8c5a5]">
            <strong className="text-sky-700 font-serif flex items-center gap-2"><Rocket size={16} /> Double XP Card</strong>
            <p className="mt-1 text-sm leading-relaxed text-[#5c4033]">When activated in your Vault, temporarily doubles all Experience Points earned from sessions and quests.</p>
          </li>
        </ul>
        <p className="text-center font-serif text-[#8b6b4a] text-sm mt-auto pt-4 border-t border-[#8b6b4a]/20">Page 7</p>
      </div>
    ),

    // Page 9: Sanctum Items - Advanced 2 (Right Page)
    (
      <div className="w-full h-full paper-texture p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
        
        <p className="text-[#5c4033] text-sm md:text-base mb-6 leading-relaxed font-sans mt-4">
          There are more secrets and artifacts to discover.
        </p>
        <ul className="space-y-4 text-[#5c4033] text-sm md:text-base font-sans mb-auto">
          <li className="bg-[#f4ebd8] p-3 rounded-xl border border-[#d8c5a5]">
            <strong className="text-amber-700 font-serif flex items-center gap-2"><Briefcase size={16} /> Double Gold Card</strong>
            <p className="mt-1 text-sm leading-relaxed text-[#5c4033]">When activated in your Vault, temporarily doubles all Gold Coins earned, accelerating your wealth.</p>
          </li>
        </ul>
        <div className="bg-[#f0e6d2]/80 p-4 rounded-xl border border-[#d8c5a5] shadow-inner mb-4">
           <h3 className="font-bold text-amber-800 mb-2 uppercase tracking-wider font-serif text-sm">Pro Tip: Item Usage</h3>
           <p className="text-sm text-[#5c4033] leading-relaxed font-sans">
             Visit the Vault and click "Use Item" on consumable cards to activate their effects. 
             They usually expire at the end of the day.
           </p>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-sm mt-auto pt-4 border-t border-[#8b6b4a]/20">Page 8</p>
      </div>
    ),

`;

if (startIndex !== -1 && endIndex !== -1) {
  data = data.substring(0, startIndex) + newPagesBlock + data.substring(endIndex);

  // Since we added 2 pages, subsequent page labels need to be updated.
  let rest = data.substring(data.indexOf(endSearch));
  for(let i = 14; i >= 7; i--) {
    rest = rest.replace(new RegExp(">Page " + i + "</p>", "g"), ">Page " + (i+2) + "</p>");
  }
  data = data.substring(0, data.indexOf(endSearch)) + rest;

  fs.writeFileSync('src/components/GuideModals.tsx', data);
  console.log('Successfully updated GuideModals');
} else {
  console.log('Could not find start or end block');
}
