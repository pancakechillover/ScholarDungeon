import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, BookOpen, Coins, Zap, Target, Bookmark } from 'lucide-react';
import { createPortal } from 'react-dom';

interface GuideBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage: number;
  navigateToSettings: (section: 'general' | 'timer' | 'rewards' | 'shop' | 'gacha' | 'dev' | 'levelRewards' | 'about' | 'level' | 'merchant') => void;
}

export const GuideBookModal: React.FC<GuideBookModalProps> = ({ 
  isOpen, 
  onClose, 
  initialPage,
  navigateToSettings 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [pageIndex, setPageIndex] = useState(initialPage * 2);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPageIndex(initialPage * 2);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialPage]);

  if (!isOpen) return null;

  const goToChapter = (chapter: number) => {
    const target = chapter * 2;
    if (target === pageIndex) return;
    setDirection(target > pageIndex ? 1 : -1);
    setPageIndex(target);
  };

  const pages = [
    // Page 0: Cover
    (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 border-4 border-double border-[#8b6b4a] rounded bg-[#e8dac1] m-2">
        <BookOpen className="text-[#5c4033] mb-6 w-16 h-16" />
        <h1 className="text-xl sm:text-2xl font-black text-[#3a2e22] font-serif uppercase tracking-widest mb-4 leading-snug">
          Scholar's<br/>Sanctum<br/>Guide
        </h1>
        <div className="w-16 h-1 bg-[#8b6b4a] my-4 rounded-full" />
        <p className="text-[#5c4033] text-sm sm:text-base italic font-bold">Official Compendium</p>
      </div>
    ),
    // Page 1: TOC
    (
      <div className="w-full h-full p-6 sm:p-8 flex flex-col pb-16">
        <h2 className="text-lg font-bold font-serif text-[#3a2e22] border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">Table of Contents</h2>
        <div className="flex flex-col gap-4 overflow-y-auto pr-2">
          <button onClick={() => goToChapter(1)} className="flex items-center gap-4 group w-full p-3 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600 group-hover:scale-110 transition-transform shadow-sm"><Coins className="w-5 h-5" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-sm">Gold Coins</span>
              <span className="block text-xs text-[#5c4033]">Economy & Wealth</span>
            </div>
            <span className="text-[#8b6b4a] text-xs font-serif italic">Pg 2</span>
          </button>
          <button onClick={() => goToChapter(2)} className="flex items-center gap-4 group w-full p-3 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform shadow-sm"><Target className="w-5 h-5" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-sm">XP & Leveling</span>
              <span className="block text-xs text-[#5c4033]">Growth & Progression</span>
            </div>
            <span className="text-[#8b6b4a] text-xs font-serif italic">Pg 4</span>
          </button>
          <button onClick={() => goToChapter(3)} className="flex items-center gap-4 group w-full p-3 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform shadow-sm"><Zap className="w-5 h-5" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-sm">Talent System</span>
              <span className="block text-xs text-[#5c4033]">Unlocking Potential</span>
            </div>
            <span className="text-[#8b6b4a] text-xs font-serif italic">Pg 6</span>
          </button>
        </div>
      </div>
    ),
    // Page 2: Coins
    (
      <div className="w-full h-full p-6 sm:p-8 flex flex-col pb-16">
        <div className="flex items-center gap-3 border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">
          <Coins className="text-amber-600 w-6 h-6" />
          <h2 className="text-lg font-bold font-serif text-[#3a2e22]">Gold Coins</h2>
        </div>
        <p className="text-[#5c4033] text-sm mb-6 font-medium leading-relaxed">
          Gold is the primary currency within the Sanctum. It is used to purchase items from the Shop and roll the Gacha at the Merchant's Outpost.
        </p>
        <div className="bg-[#e8dac1] p-4 sm:p-5 rounded-xl border border-[#d8c5a5]">
          <h3 className="font-bold text-[#3a2e22] mb-3 uppercase tracking-wider text-[11px]">How to Acquire</h3>
          <ul className="space-y-3 test-sm text-[#5c4033] font-medium text-xs sm:text-sm">
            <li className="flex gap-3 text-sm"><span className="text-amber-600">❖</span> Complete study sessions using the Timer</li>
            <li className="flex gap-3 text-sm"><span className="text-amber-600">❖</span> Clear instances and rooms in Dungeons</li>
            <li className="flex gap-3 text-sm"><span className="text-amber-600">❖</span> Complete Daily/Weekly Quests & Achievements</li>
          </ul>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-xs italic mt-auto pt-4">Page 2</p>
      </div>
    ),
    // Page 3: Coins Pro tips
    (
      <div className="w-full h-full p-6 sm:p-8 flex flex-col pb-16">
        <div className="bg-[#f0e6d2] p-4 sm:p-5 rounded-xl border border-[#d8c5a5] shadow-inner mb-auto mt-4">
          <h3 className="font-bold text-amber-800 mb-3 uppercase tracking-wider text-[11px] border-b border-amber-900/10 pb-2">Pro Tip: Customization</h3>
          <p className="text-sm text-[#5c4033] leading-relaxed mb-4">
            You can adjust how much Gold you earn and customize level-up gifts!
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { onClose(); navigateToSettings('dev'); }} className="text-left w-full p-3 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors shadow-sm">
              Go to Settings &gt; Developer<br/><span className="font-normal text-[11px] opacity-80 mt-1 block">Adjust base Gold rates and multipliers.</span>
            </button>
            <button onClick={() => { onClose(); navigateToSettings('levelRewards'); }} className="text-left w-full p-3 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors shadow-sm">
              Go to Settings &gt; Level Rewards<br/><span className="font-normal text-[11px] opacity-80 mt-1 block">Add or modify Gold gifts upon leveling up.</span>
            </button>
          </div>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-xs italic mt-6 border-t border-[#8b6b4a]/20 pt-4">Page 3</p>
      </div>
    ),
    // Page 4: XP
    (
      <div className="w-full h-full p-6 sm:p-8 flex flex-col pb-16">
        <div className="flex items-center gap-3 border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">
          <Target className="text-emerald-600 w-6 h-6" />
          <h2 className="text-lg font-bold font-serif text-[#3a2e22]">XP & Leveling</h2>
        </div>
        <p className="text-[#5c4033] text-sm mb-6 font-medium leading-relaxed">
          Gain Experience Points (XP) to level up. Leveling up can reward you with items, Talent Points, or Gold, and unlocks new capabilities.
        </p>
        <div className="bg-[#e8dac1] p-4 sm:p-5 rounded-xl border border-[#d8c5a5]">
          <h3 className="font-bold text-[#3a2e22] mb-3 uppercase tracking-wider text-[11px]">How to Acquire</h3>
          <ul className="space-y-3 text-sm text-[#5c4033] font-medium text-xs sm:text-sm">
            <li className="flex gap-3 text-sm"><span className="text-emerald-600">❖</span> Complete study sessions using the Timer</li>
            <li className="flex gap-3 text-sm"><span className="text-emerald-600">❖</span> Clear instances and rooms in Dungeons</li>
            <li className="flex gap-3 text-sm"><span className="text-emerald-600">❖</span> Complete Daily/Weekly Quests & Achievements</li>
          </ul>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-xs italic mt-auto pt-4">Page 4</p>
      </div>
    ),
    // Page 5: XP Pro tips
    (
      <div className="w-full h-full p-6 sm:p-8 flex flex-col pb-16">
        <div className="bg-[#f0e6d2] p-4 sm:p-5 rounded-xl border border-[#d8c5a5] shadow-inner mb-auto mt-4">
          <h3 className="font-bold text-emerald-800 mb-3 uppercase tracking-wider text-[11px] border-b border-emerald-900/10 pb-2">Pro Tip: Customization</h3>
          <p className="text-sm text-[#5c4033] leading-relaxed mb-4">
            Configure your level-up rewards to match your progression style!
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { onClose(); navigateToSettings('dev'); }} className="text-left w-full p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition-colors shadow-sm">
              Go to Settings &gt; Developer<br/><span className="font-normal text-[11px] opacity-80 mt-1 block">Adjust base XP rates and formula.</span>
            </button>
            <button onClick={() => { onClose(); navigateToSettings('levelRewards'); }} className="text-left w-full p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition-colors shadow-sm">
              Go to Settings &gt; Level Rewards<br/><span className="font-normal text-[11px] opacity-80 mt-1 block">Add/remove level-up gifts (e.g., loot).</span>
            </button>
          </div>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-xs italic mt-6 border-t border-[#8b6b4a]/20 pt-4">Page 5</p>
      </div>
    ),
    // Page 6: Talents
    (
      <div className="w-full h-full p-6 sm:p-8 flex flex-col pb-16">
        <div className="flex items-center gap-3 border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">
          <Zap className="text-indigo-600 w-6 h-6" />
          <h2 className="text-lg font-bold font-serif text-[#3a2e22]">Talent System</h2>
        </div>
        <p className="text-[#5c4033] text-sm mb-6 font-medium leading-relaxed">
          The Talent Tree allows you to unlock passive bonuses and upgrades. You need <strong>Talent Points</strong> to unlock nodes.
        </p>
        <div className="bg-[#e8dac1] p-4 sm:p-5 rounded-xl border border-[#d8c5a5]">
          <h3 className="font-bold text-[#3a2e22] mb-3 uppercase tracking-wider text-[11px]">Acquiring Talent Points</h3>
          <ul className="space-y-4 text-[#5c4033] font-medium text-xs sm:text-sm">
            <li className="flex gap-3 text-sm">
              <span className="text-indigo-600 text-lg">❖</span>
              <div>
                <strong className="text-indigo-900 block mb-1">Leveling Up</strong>
                Points are granted at specific level milestones.
              </div>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="text-indigo-600 text-lg">❖</span>
              <div>
                <strong className="text-indigo-900 block mb-1">Finding Shards</strong>
                Shards are rare drops in <span className="font-bold text-emerald-700">Dungeons</span> or won from the <span className="font-bold text-amber-700">Gacha</span> & <span className="font-bold text-amber-700">Ichiban Kuji</span>. Collect enough Shards to form a Talent Point!
              </div>
            </li>
          </ul>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-xs italic mt-auto pt-4">Page 6</p>
      </div>
    ),
    // Page 7: Talents Pro tips
    (
      <div className="w-full h-full p-6 sm:p-8 flex flex-col pb-16">
        <div className="bg-[#f0e6d2] p-4 sm:p-5 rounded-xl border border-[#d8c5a5] shadow-inner mb-auto mt-4">
          <h3 className="font-bold text-indigo-800 mb-3 uppercase tracking-wider text-[11px] border-b border-indigo-900/10 pb-2">Pro Tip: Customization</h3>
          <p className="text-sm text-[#5c4033] leading-relaxed mb-4">
            Want more Talent Points? You can set them as rewards for leveling up!
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { onClose(); navigateToSettings('levelRewards'); }} className="text-left w-full p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-bold transition-colors shadow-sm">
              Go to Settings &gt; Level Rewards<br/><span className="font-normal text-[11px] opacity-80 mt-1 block">Add Talent Points or Shards as level-up gifts.</span>
            </button>
          </div>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-xs italic mt-6 border-t border-[#8b6b4a]/20 pt-4">Page 7</p>
      </div>
    )
  ];

  const totalPages = pages.length;

  const nextPage = () => {
    if (isFlipping) return;
    const maxIndex = isMobile ? totalPages - 1 : totalPages - 2;
    if (pageIndex >= maxIndex) {
      onClose(); // Close if we hit next on the last page
    } else {
      setOldPages(isMobile ? [pageIndex] : [pageIndex, pageIndex + 1]);
      setFlipDir(1);
      setPageIndex(p => p + (isMobile ? 1 : 2));
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 500);
    }
  };

  const prevPage = () => {
    if (isFlipping) return;
    if (pageIndex <= 0) {
      onClose(); // Close if we hit prev on the first page
    } else {
      setOldPages(isMobile ? [pageIndex] : [pageIndex, pageIndex + 1]);
      setFlipDir(-1);
      setPageIndex(p => p - (isMobile ? 1 : 2));
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 500);
    }
  };

  const renderNavButtons = () => (
    <>
      <button 
        onClick={prevPage}
        className="absolute bottom-4 left-6 z-40 text-[#8b6b4a] hover:text-[#5c4033] hover:scale-110 flex items-center gap-1 font-serif text-sm font-bold transition-all px-2 py-1 bg-[#e8dac1]/50 rounded-lg backdrop-blur-sm"
      >
        <ChevronLeft size={20} /> <span className="hidden sm:inline">Prev</span>
      </button>
      <button 
        onClick={nextPage}
        className="absolute bottom-4 right-6 z-40 text-[#8b6b4a] hover:text-[#5c4033] hover:scale-110 flex items-center gap-1 font-serif text-sm font-bold transition-all px-2 py-1 bg-[#e8dac1]/50 rounded-lg backdrop-blur-sm"
      >
        <span className="hidden sm:inline">Next</span> <ChevronRight size={20} />
      </button>
    </>
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container */}
      <div className="relative w-full h-[85vh] max-w-[calc(85vh/1.414)] sm:max-w-[calc(85vh*1.414)] mx-auto">
        
        {/* Book Background base */}
        <div className="absolute inset-0 bg-[#5c4033] rounded-xl shadow-2xl flex p-1 sm:p-2 border-2 sm:border-4 border-[#3a2e22]"
             style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(0,0,0,0.5)' }}>
            
            {/* The Pages Container */}
            <div className="relative flex-1 flex bg-[#f4ecd8] rounded shadow-inner overflow-hidden" 
                 style={{ perspective: 1500 }}>
                 
                {/* Center Spine Crease */}
                {!isMobile && (
                  <>
                    <div className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/20 to-transparent z-40 pointer-events-none" />
                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-black/30 z-40 pointer-events-none" />
                  </>
                )}
                
                {renderNavButtons()}
                
                {/* Static Background Pages (New Pages) */}
                <div className="w-full h-full flex flex-row absolute inset-0">
                  {isMobile ? (
                    <div className="flex-1 w-full overflow-y-auto flex flex-col relative">
                      {isFlipping ? pages[flipDir === 1 ? pageIndex : oldPages[0]] : pages[pageIndex]}
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 w-1/2 border-r border-[#d8c5a5]/50 flex flex-col relative overflow-y-auto custom-scrollbar">
                          {isFlipping && flipDir === 1 ? pages[oldPages[0]] : pages[pageIndex]}
                      </div>
                      <div className="flex-1 w-1/2 border-l border-white/50 flex flex-col relative overflow-y-auto custom-scrollbar">
                          {isFlipping && flipDir === -1 ? pages[oldPages[1]] : (pages[pageIndex + 1] || <div className="flex-1 bg-[#f4ecd8]" />)}
                      </div>
                    </>
                  )}
                </div>

                {/* The Flipping Layer */}
                <AnimatePresence>
                  {isFlipping && !isMobile && flipDir === 1 && (
                    <motion.div
                      className="absolute top-0 right-0 w-1/2 h-full z-30 pointer-events-none"
                      style={{ transformStyle: 'preserve-3d', originX: 0 }}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: -180 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {/* Front Face: Old Right Page */}
                      <div className="absolute inset-0 bg-[#f4ecd8] border-l border-white/50 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                          {pages[oldPages[1]] || <div className="flex-1 bg-[#f4ecd8] h-full" />}
                      </div>
                      {/* Back Face: New Left Page */}
                      <div className="absolute inset-0 bg-[#f4ecd8] border-r border-[#d8c5a5]/50 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                          {pages[pageIndex]}
                      </div>
                    </motion.div>
                  )}
                  {isFlipping && !isMobile && flipDir === -1 && (
                    <motion.div
                      className="absolute top-0 left-0 w-1/2 h-full z-30 pointer-events-none"
                      style={{ transformStyle: 'preserve-3d', originX: 1 }}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: 180 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {/* Front Face: Old Left Page */}
                      <div className="absolute inset-0 bg-[#f4ecd8] border-r border-[#d8c5a5]/50 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                          {pages[oldPages[0]]}
                      </div>
                      {/* Back Face: New Right Page */}
                      <div className="absolute inset-0 bg-[#f4ecd8] border-l border-white/50 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                          {pages[pageIndex + 1] || <div className="flex-1 bg-[#f4ecd8] h-full" />}
                      </div>
                    </motion.div>
                  )}
                  {/* Mobile Turn Right to Left (Next) */}
                  {isFlipping && isMobile && flipDir === 1 && (
                    <motion.div
                      className="absolute top-0 right-0 w-full h-full z-30 pointer-events-none origin-left"
                      style={{ transformStyle: 'preserve-3d' }}
                      initial={{ rotateY: 0, opacity: 1 }}
                      animate={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeIn" }}
                    >
                       <div className="absolute inset-0 bg-[#f4ecd8] overflow-hidden flex flex-col">
                          {pages[oldPages[0]]}
                       </div>
                    </motion.div>
                  )}
                  {/* Mobile Turn Left to Right (Prev) */}
                  {isFlipping && isMobile && flipDir === -1 && (
                    <motion.div
                      className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none origin-right"
                      style={{ transformStyle: 'preserve-3d' }}
                      initial={{ rotateY: 0, opacity: 1 }}
                      animate={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeIn" }}
                    >
                       <div className="absolute inset-0 bg-[#f4ecd8] overflow-hidden flex flex-col">
                          {pages[oldPages[0]]}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
        </div>

        {/* Bookmarks (Tabs) on the right edge */}
        <div className="absolute right-0 top-8 z-10 flex flex-col gap-2 translate-x-full">
            {[
              { id: 0, icon: <BookOpen size={16} />, color: 'bg-slate-700', text: 'text-white' },
              { id: 1, icon: <Coins size={16} />, color: 'bg-amber-500', text: 'text-amber-950' },
              { id: 2, icon: <Target size={16} />, color: 'bg-emerald-500', text: 'text-emerald-950' },
              { id: 3, icon: <Zap size={16} />, color: 'bg-indigo-500', text: 'text-indigo-950' },
            ].map((tab, idx) => {
               const isActive = isMobile ? pageIndex >= idx * 2 && pageIndex <= (idx * 2) + 1 : Math.floor(pageIndex / 2) === idx;
               return (
                 <button 
                   key={tab.id}
                   onClick={() => goToChapter(idx)}
                   className={`
                     p-3 sm:p-4 rounded-r-xl border-y-2 border-r-2 border-[#3a2e22] flex items-center justify-center
                     transition-all origin-left
                     ${tab.color} ${tab.text} shadow-lg
                     ${isActive ? 'w-10 sm:w-16 z-20 shadow-xl' : 'w-8 sm:w-12 hover:w-10 sm:hover:w-14 z-10 opacity-90'}
                   `}
                   title={`Go to chapter ${idx + 1}`}
                 >
                   {tab.icon}
                 </button>
               )
            })}
        </div>
        
      </div>
      
      {/* Close button top right (Fixed to Screen) */}
      <button 
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 bg-slate-800 text-slate-300 hover:text-white rounded-full flex items-center justify-center shadow-xl hover:bg-rose-500 transition-colors border-2 border-[#3a2e22] z-[10000]"
      >
        <X className="w-5 h-5" />
      </button>

    </div>,
    document.body
  );
};
