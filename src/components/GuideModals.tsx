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
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState(1);
  const [oldPages, setOldPages] = useState<number[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      let targetChapter = initialPage;
      if (initialPage > 0) {
        // External: 1=Coins, 2=XP, 3=Talents
        // Internal: 1=TOC, 2=Coins, 3=XP, 4=Talents
        targetChapter = initialPage + 1;
      }
      setPageIndex(targetChapter * 2);
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
    // Page 0: Transparent Left (Cover outside)
    (<div className="w-full h-full bg-transparent" />),

    // Page 1: Front Cover
    (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#5c4033] relative z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border-l flex-1 border-black/30">
        <div className="absolute inset-3 border-2 border-dashed border-[#8b6b4a]/60 pointer-events-none" />
        <BookOpen className="text-amber-500 mb-8 w-20 h-20 drop-shadow-lg" />
        <h1 className="text-2xl sm:text-3xl font-black text-amber-500 font-serif uppercase tracking-widest mb-6 leading-snug drop-shadow-md">
          Scholar's<br/>Sanctum<br/>Guide
        </h1>
        <div className="w-24 h-1 bg-amber-600/50 my-6 rounded-full" />
        <p className="text-amber-200 text-sm sm:text-base italic font-bold">Official Compendium</p>
      </div>
    ),

    // Page 2: Empty inside cover (Left page)
    (
      <div className="w-full h-full bg-[#f4ecd8] flex items-center justify-center relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
      </div>
    ),

    // Page 3: TOC (Right page)
    (
      <div className="w-full h-full bg-[#f4ecd8] p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
        <h2 className="text-lg font-bold font-serif text-[#3a2e22] border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">Table of Contents</h2>
        <div className="flex flex-col gap-4">
          <button onClick={() => goToChapter(2)} className="flex items-center gap-4 group w-full p-3 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600 group-hover:scale-110 transition-transform shadow-sm"><Coins className="w-6 h-6" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-sm sm:text-base">Gold Coins</span>
              <span className="block text-xs sm:text-sm text-[#5c4033]">Economy & Wealth</span>
            </div>
            <span className="text-[#8b6b4a] text-xs sm:text-sm font-serif italic">Pg 4</span>
          </button>
          <button onClick={() => goToChapter(3)} className="flex items-center gap-4 group w-full p-3 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform shadow-sm"><Target className="w-6 h-6" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-sm sm:text-base">XP & Leveling</span>
              <span className="block text-xs sm:text-sm text-[#5c4033]">Growth & Progression</span>
            </div>
            <span className="text-[#8b6b4a] text-xs sm:text-sm font-serif italic">Pg 6</span>
          </button>
          <button onClick={() => goToChapter(4)} className="flex items-center gap-4 group w-full p-3 hover:bg-[#8b6b4a]/10 rounded-xl transition-colors border border-transparent hover:border-[#8b6b4a]/20">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform shadow-sm"><Zap className="w-6 h-6" /></div>
            <div className="flex-1 text-left">
              <span className="block font-bold text-[#3a2e22] text-sm sm:text-base">Talent System</span>
              <span className="block text-xs sm:text-sm text-[#5c4033]">Unlocking Potential</span>
            </div>
            <span className="text-[#8b6b4a] text-xs sm:text-sm font-serif italic">Pg 8</span>
          </button>
        </div>
      </div>
    ),

    // Page 4: Coins (Left Page)
    (
      <div className="w-full h-full bg-[#f4ecd8] p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">
          <Coins className="text-amber-600 w-7 h-7" />
          <h2 className="text-lg font-bold font-serif text-[#3a2e22]">Gold Coins</h2>
        </div>
        <p className="text-[#5c4033] text-sm mb-6 font-medium leading-relaxed">
          Gold is the primary currency within the Sanctum. It is used to purchase items from the Shop and roll the Gacha at the Merchant's Outpost.
        </p>
        <div className="bg-[#e8dac1] p-4 sm:p-5 rounded-xl border border-[#d8c5a5]">
          <h3 className="font-bold text-[#3a2e22] mb-3 uppercase tracking-wider text-xs">How to Acquire</h3>
          <ul className="space-y-3 text-[#5c4033] font-medium text-sm">
            <li className="flex gap-3 text-sm"><span className="text-amber-600">❖</span> Complete study sessions using the Timer</li>
            <li className="flex gap-3 text-sm"><span className="text-amber-600">❖</span> Clear instances and rooms in Dungeons</li>
            <li className="flex gap-3 text-sm"><span className="text-amber-600">❖</span> Complete Daily/Weekly Quests & Achievements</li>
          </ul>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-sm italic mt-auto pt-4">Page 4</p>
      </div>
    ),

    // Page 5: Coins Pro tips (Right Page)
    (
      <div className="w-full h-full bg-[#f4ecd8] p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
        <div className="bg-[#f0e6d2] p-4 sm:p-5 rounded-xl border border-[#d8c5a5] shadow-inner mb-auto mt-4">
          <h3 className="font-bold text-amber-800 mb-3 uppercase tracking-wider text-xs border-b border-amber-900/10 pb-2">Pro Tip: Customization</h3>
          <p className="text-sm text-[#5c4033] leading-relaxed mb-4">
            You can adjust how much Gold you earn and customize level-up gifts!
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { onClose(); navigateToSettings('dev'); }} className="text-left w-full p-3 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-sm font-bold transition-colors shadow-sm">
              Go to Settings &gt; Developer<br/><span className="font-normal text-xs opacity-80 mt-1 block">Adjust base Gold rates and multipliers.</span>
            </button>
            <button onClick={() => { onClose(); navigateToSettings('levelRewards'); }} className="text-left w-full p-3 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-sm font-bold transition-colors shadow-sm">
              Go to Settings &gt; Level Rewards<br/><span className="font-normal text-xs opacity-80 mt-1 block">Add or modify Gold gifts upon leveling up.</span>
            </button>
          </div>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-sm italic mt-6 border-t border-[#8b6b4a]/20 pt-4">Page 5</p>
      </div>
    ),

    // Page 6: XP (Left Page)
    (
      <div className="w-full h-full bg-[#f4ecd8] p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">
          <Target className="text-emerald-600 w-7 h-7" />
          <h2 className="text-lg font-bold font-serif text-[#3a2e22]">XP & Leveling</h2>
        </div>
        <p className="text-[#5c4033] text-sm mb-6 font-medium leading-relaxed">
          Gain Experience Points (XP) to level up. Leveling up can reward you with items, Talent Points, or Gold, and unlocks new capabilities.
        </p>
        <div className="bg-[#e8dac1] p-4 sm:p-5 rounded-xl border border-[#d8c5a5]">
          <h3 className="font-bold text-[#3a2e22] mb-3 uppercase tracking-wider text-xs">How to Acquire</h3>
          <ul className="space-y-3 text-[#5c4033] font-medium text-sm">
            <li className="flex gap-3 text-sm"><span className="text-emerald-600">❖</span> Complete study sessions using the Timer</li>
            <li className="flex gap-3 text-sm"><span className="text-emerald-600">❖</span> Clear instances and rooms in Dungeons</li>
            <li className="flex gap-3 text-sm"><span className="text-emerald-600">❖</span> Complete Daily/Weekly Quests & Achievements</li>
          </ul>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-sm italic mt-auto pt-4">Page 6</p>
      </div>
    ),

    // Page 7: XP Pro tips (Right Page)
    (
      <div className="w-full h-full bg-[#f4ecd8] p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
        <div className="bg-[#f0e6d2] p-4 sm:p-5 rounded-xl border border-[#d8c5a5] shadow-inner mb-auto mt-4">
          <h3 className="font-bold text-emerald-800 mb-3 uppercase tracking-wider text-xs border-b border-emerald-900/10 pb-2">Pro Tip: Customization</h3>
          <p className="text-sm text-[#5c4033] leading-relaxed mb-4">
            Configure your level-up rewards to match your progression style!
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { onClose(); navigateToSettings('dev'); }} className="text-left w-full p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-sm font-bold transition-colors shadow-sm">
              Go to Settings &gt; Developer<br/><span className="font-normal text-xs opacity-80 mt-1 block">Adjust base XP rates and formula.</span>
            </button>
            <button onClick={() => { onClose(); navigateToSettings('levelRewards'); }} className="text-left w-full p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-sm font-bold transition-colors shadow-sm">
              Go to Settings &gt; Level Rewards<br/><span className="font-normal text-xs opacity-80 mt-1 block">Add/remove level-up gifts (e.g., loot).</span>
            </button>
          </div>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-sm italic mt-6 border-t border-[#8b6b4a]/20 pt-4">Page 7</p>
      </div>
    ),

    // Page 8: Talents (Left Page)
    (
      <div className="w-full h-full bg-[#f4ecd8] p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 border-b-2 border-[#8b6b4a]/30 pb-4 mb-6">
          <Zap className="text-indigo-600 w-7 h-7" />
          <h2 className="text-lg font-bold font-serif text-[#3a2e22]">Talent System</h2>
        </div>
        <p className="text-[#5c4033] text-sm mb-6 font-medium leading-relaxed">
          The Talent Tree allows you to unlock passive bonuses and upgrades. You need <strong>Talent Points</strong> to unlock nodes.
        </p>
        <div className="bg-[#e8dac1] p-4 sm:p-5 rounded-xl border border-[#d8c5a5]">
          <h3 className="font-bold text-[#3a2e22] mb-3 uppercase tracking-wider text-xs">Acquiring Talent Points</h3>
          <ul className="space-y-4 text-[#5c4033] font-medium text-sm">
            <li className="flex gap-3">
              <span className="text-indigo-600 text-base">❖</span>
              <div>
                <strong className="text-indigo-900 block mb-1">Leveling Up</strong>
                Points are granted at specific level milestones.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-600 text-base">❖</span>
              <div>
                <strong className="text-indigo-900 block mb-1">Finding Shards</strong>
                Shards are rare drops in <span className="font-bold text-emerald-700">Dungeons</span> or won from the <span className="font-bold text-amber-700">Gacha</span> & <span className="font-bold text-amber-700">Ichiban Kuji</span>. Collect enough Shards to form a Talent Point!
              </div>
            </li>
          </ul>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-sm italic mt-auto pt-4">Page 8</p>
      </div>
    ),

    // Page 9: Talents Pro tips (Right Page)
    (
      <div className="w-full h-full bg-[#f4ecd8] p-6 sm:p-8 flex flex-col pb-16 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.06)]">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
        <div className="bg-[#f0e6d2] p-4 sm:p-5 rounded-xl border border-[#d8c5a5] shadow-inner mb-auto mt-4">
          <h3 className="font-bold text-indigo-800 mb-3 uppercase tracking-wider text-xs border-b border-indigo-900/10 pb-2">Pro Tip: Customization</h3>
          <p className="text-sm text-[#5c4033] leading-relaxed mb-4">
            Want more Talent Points? You can set them as rewards for leveling up!
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { onClose(); navigateToSettings('levelRewards'); }} className="text-left w-full p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-sm font-bold transition-colors shadow-sm">
              Go to Settings &gt; Level Rewards<br/><span className="font-normal text-xs opacity-80 mt-1 block">Add Talent Points or Shards as level-up gifts.</span>
            </button>
          </div>
        </div>
        <p className="text-center font-serif text-[#8b6b4a] text-sm italic mt-6 border-t border-[#8b6b4a]/20 pt-4">Page 9</p>
      </div>
    ),

    // Page 10: Back Cover (Left Page)
    (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#5c4033] relative z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border-r flex-1 border-black/30">
        <div className="absolute inset-3 border-2 border-dashed border-[#8b6b4a]/60 pointer-events-none" />
        <BookOpen className="text-amber-500/50 mb-6 w-16 h-16 drop-shadow-lg" />
        <div className="w-16 h-1 bg-amber-600/30 my-4 rounded-full" />
        <p className="text-amber-200/50 text-xs italic font-bold">Scholar's Sanctum</p>
      </div>
    ),

    // Page 11: Transparent Right Page (Outside Back Cover)
    (<div className="w-full h-full bg-transparent" />)
  ];

  const totalPages = pages.length;

  const nextPage = () => {
    if (isFlipping) return;
    const maxIndex = isMobile ? totalPages - 1 : totalPages - 2;
    if (pageIndex >= maxIndex) {
      onClose();
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
      onClose();
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
        className={`absolute bottom-4 left-6 z-50 text-[#8b6b4a] hover:text-[#5c4033] hover:scale-110 flex items-center gap-1 font-serif text-sm font-bold transition-all px-2 py-1 bg-[#e8dac1]/50 rounded-lg backdrop-blur-sm ${(!isMobile && pageIndex === 0) ? 'hidden' : ''}`}
      >
        <ChevronLeft size={20} /> <span className="hidden sm:inline">Prev</span>
      </button>
      <button 
        onClick={nextPage}
        className={`absolute bottom-4 right-6 z-50 text-[#8b6b4a] hover:text-[#5c4033] hover:scale-110 flex items-center gap-1 font-serif text-sm font-bold transition-all px-2 py-1 bg-[#e8dac1]/50 rounded-lg backdrop-blur-sm ${(!isMobile && pageIndex >= 10) ? 'hidden' : ''}`}
      >
        <span className="hidden sm:inline">Next</span> <ChevronRight size={20} />
      </button>
    </>
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container */}
      <div className="relative w-full h-[85vh] max-w-[calc(85vh/1.414)] sm:max-w-[calc(85vh*1.414)] mx-auto">
        
        {/* Book Background base layer */}
        <div className={`absolute top-0 bottom-0 bg-[#5c4033] shadow-2xl transition-all duration-500 ease-in-out z-0
             ${isMobile ? "left-0 right-0 rounded-xl border-2 sm:border-4 border-[#3a2e22]" :
               pageIndex === 0 ? "left-1/2 right-0 rounded-r-xl rounded-l-sm border-y-2 sm:border-y-4 border-r-2 sm:border-r-4 border-l-0 border-[#3a2e22]" :
               pageIndex >= 10 ? "left-0 w-1/2 rounded-l-xl rounded-r-sm border-y-2 sm:border-y-4 border-l-2 sm:border-l-4 border-r-0 border-[#3a2e22]" :
               "left-0 right-0 rounded-xl border-2 sm:border-4 border-[#3a2e22]"
             }`}
             style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(0,0,0,0.5)' }} />

        {/* The Pages Container wrapper */}
        <div className="absolute inset-0 p-1 sm:p-2 flex flex-col z-10 pointer-events-none">
            {/* The Pages Container */}
            <div className="relative flex-1 flex rounded overflow-hidden pointer-events-auto" 
                 style={{ perspective: 1500 }}>
                 
                {/* Center Spine Crease */}
                {!isMobile && (
                  <div className={`transition-opacity duration-300 ${(pageIndex === 0 || pageIndex >= 10) ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/20 to-transparent z-40 pointer-events-none" />
                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-black/30 z-40 pointer-events-none" />
                  </div>
                )}
                
                {renderNavButtons()}
                
                {/* Static Background Pages */}
                <div className="w-full h-full flex flex-row absolute inset-0">
                  {isMobile ? (
                    <div className="flex-1 w-full flex flex-col relative overflow-hidden bg-[#f4ecd8]">
                      {isFlipping ? pages[flipDir === 1 ? pageIndex : oldPages[0]] : pages[pageIndex]}
                    </div>
                  ) : (
                    <>
                      <div className={`flex-1 w-1/2 flex flex-col relative overflow-hidden transition-colors ${pageIndex === 0 ? 'border-transparent' : 'border-r border-[#d8c5a5]/50'}`}>
                          {isFlipping && flipDir === 1 ? pages[oldPages[0]] : pages[pageIndex]}
                      </div>
                      <div className={`flex-1 w-1/2 flex flex-col relative overflow-hidden transition-colors ${pageIndex >= 10 ? 'border-transparent' : 'border-l border-white/50'}`}>
                          {isFlipping && flipDir === -1 ? pages[oldPages[1]] : (pages[pageIndex + 1] || null)}
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
                      <div className="absolute inset-0 border-l border-white/50 flex flex-col overflow-hidden bg-transparent" style={{ backfaceVisibility: 'hidden' }}>
                          {pages[oldPages[1]] || null}
                      </div>
                      {/* Back Face: New Left Page */}
                      <div className="absolute inset-0 border-r border-[#d8c5a5]/50 flex flex-col overflow-hidden bg-transparent" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
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
                      <div className="absolute inset-0 border-r border-[#d8c5a5]/50 flex flex-col overflow-hidden bg-transparent" style={{ backfaceVisibility: 'hidden' }}>
                          {pages[oldPages[0]]}
                      </div>
                      {/* Back Face: New Right Page */}
                      <div className="absolute inset-0 border-l border-white/50 flex flex-col overflow-hidden bg-transparent" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                          {pages[pageIndex + 1] || null}
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
        <div className={`absolute right-0 top-8 z-[5] flex flex-col gap-2 translate-x-full transition-all duration-300 ${(!isMobile && pageIndex >= 10) ? 'opacity-0 pointer-events-none -translate-x-full' : 'opacity-100'}`}>
            {[
              { id: 0, icon: <BookOpen size={16} />, color: 'bg-slate-700', text: 'text-white' },
              { id: 1, icon: <Coins size={16} />, color: 'bg-amber-500', text: 'text-amber-950' },
              { id: 2, icon: <Target size={16} />, color: 'bg-emerald-500', text: 'text-emerald-950' },
              { id: 3, icon: <Zap size={16} />, color: 'bg-indigo-500', text: 'text-indigo-950' },
            ].map((tab, idx) => {
               const targetChapter = idx + 1;
               const isActive = isMobile ? pageIndex >= targetChapter * 2 && pageIndex <= (targetChapter * 2) + 1 : Math.floor(pageIndex / 2) === targetChapter;
               return (
                 <button 
                   key={tab.id}
                   onClick={() => goToChapter(idx + 1)}
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
