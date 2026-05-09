import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShopItem, GachaPool, Rarity } from '../types';
import { ShoppingBag, Sparkles, Trophy, Coins, RefreshCw, HelpCircle, Zap, Flame, Gem, Target, Star, Heart, Shield, Sword, Coffee, Pizza, Gift, Package, Camera, Music, Book, Gamepad2, Ghost, Moon, Sun, Cloud, Anchor, Compass, Map, Key, Lock, Unlock, Bell, BellOff, Eye, EyeOff, Search, Settings, Trash2, Edit2, Plus, X, Check, CheckCircle2, AlertCircle, Info, HelpCircle as HelpIcon, Ticket, Crown } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { SlotMachine } from './icons/SlotMachine';
import { cn } from '../lib/utils';
import { getColorClass, RARITY_COLORS } from '../lib/colors';

const ICON_MAP: Record<string, any> = {
  ShoppingBag, Sparkles, Trophy, Coins, RefreshCw, HelpCircle, Zap, Flame, Gem, Target, Star, Heart, Shield, Sword, Coffee, Pizza, Gift, Package, Camera, Music, Book, Gamepad2, Ghost, Moon, Sun, Cloud, Anchor, Compass, Map, Key, Lock, Unlock, Bell, BellOff, Eye, EyeOff, Search, Settings, Trash2, Edit2, Plus, X, Check, CheckCircle2, AlertCircle, Info, HelpIcon, Ticket, SlotMachine
};

interface ShopProps {
  coins: number;
  shopItems: ShopItem[];
  gachaPools: GachaPool[];
  activeGachaPoolId?: string;
  activeIchibanPoolId?: string;
  onPurchase: (itemId: string) => void;
  onDrawGacha: (poolId: string, amount: number) => void;
  onResetIchiban: (poolId: string) => void;
  onShowCoinGuide?: () => void;
  onSetActivePool?: (type: 'gacha' | 'ichiban', poolId: string) => void;
}

export const Shop = React.memo<ShopProps>(({ 
  coins, 
  shopItems, 
  gachaPools, 
  activeGachaPoolId,
  activeIchibanPoolId,
  onPurchase, 
  onDrawGacha, 
  onResetIchiban, 
  onShowCoinGuide,
  onSetActivePool 
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'gacha' | 'ichiban'>('shop');
  const [showProbabilities, setShowProbabilities] = useState(false);
  
  const gachaPoolsList = gachaPools.filter(p => p.type === 'gacha');
  const ichibanPoolsList = gachaPools.filter(p => p.type === 'ichiban');

  const gachaPool = gachaPoolsList.find(p => p.id === activeGachaPoolId) || gachaPoolsList[0] || gachaPools[0];
  const ichibanPool = ichibanPoolsList.find(p => p.id === activeIchibanPoolId) || ichibanPoolsList[0] || gachaPools[1];

  const remainingIchibanItems = ichibanPool?.items
    ?.filter(i => i.rarity.toUpperCase() !== 'LASTONE')
    ?.reduce((acc, i) => acc + (i.count || 0), 0) || 0;

  return (
    <div className="p-6 space-y-8">
      <PageHeader 
        title="Merchant's Outpost"
        description="Exchange your hard-earned gold"
        icon={ShoppingBag}
      >
        <div className="flex items-center gap-4 mt-4">
          <button 
            onClick={onShowCoinGuide}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <HelpCircle size={18} />
            How to get coins
          </button>
        </div>
      </PageHeader>

      <div className="flex space-x-1 p-1 bg-slate-900 rounded-xl w-full">
        {(['shop', 'gacha', 'ichiban'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 px-2 py-2 rounded-lg text-[10px] sm:text-sm font-bold uppercase tracking-widest transition-all",
              activeTab === tab ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {tab === 'gacha' ? 'Gacha' : tab === 'ichiban' ? 'ICHIBAN' : tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'shop' && (
          <motion.div
            key="shop"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {shopItems.map(item => {
              const IconComponent = (item.icon && ICON_MAP[item.icon]) || ShoppingBag;
              const isOutOfStock = item.stock !== undefined && item.stock === 0;

              return (
                <div key={item.id} className={cn(
                  "bg-slate-900 p-6 rounded-2xl border flex flex-col h-full transition-all",
                  isOutOfStock ? "opacity-50 grayscale border-slate-800" : "border-slate-800 hover:border-slate-700"
                )}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
                      <IconComponent size={24} />
                    </div>
                    {item.stock !== undefined && item.stock !== -1 && (
                      <div className="px-2 py-1 bg-slate-800 rounded-lg border border-slate-700">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Stock: {item.stock}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-slate-400 mb-6 flex-grow">{item.description}</p>
                  <button
                    onClick={() => onPurchase(item.id)}
                    disabled={coins < item.price || isOutOfStock}
                    className={cn(
                      "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2",
                      (coins >= item.price && !isOutOfStock)
                        ? "bg-amber-500 hover:bg-amber-600 text-slate-900" 
                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                    )}
                  >
                    <Coins size={18} />
                    <span>{isOutOfStock ? 'Out of Stock' : `${item.price.toLocaleString()} Gold`}</span>
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'gacha' && (
          <motion.div
            key="gacha"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col items-center space-y-12"
          >
            {gachaPoolsList.length > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 p-1 bg-slate-900 rounded-xl overflow-x-auto max-w-full">
                {gachaPoolsList.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onSetActivePool?.('gacha', p.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      gachaPool?.id === p.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {gachaPool && (
              <div key={gachaPool.id} className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-indigo-500/30 text-center space-y-6 relative">
                <div className="relative mx-auto w-32 h-32 flex items-center justify-center bg-indigo-500/20 rounded-full border-2 border-indigo-500 animate-pulse">
                  <SlotMachine size={64} className="text-indigo-400" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <h3 className="text-2xl font-bold text-white">{gachaPool.name}</h3>
                  <button 
                    onClick={() => setShowProbabilities(!showProbabilities)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
                  >
                    <HelpCircle size={18} />
                  </button>
                </div>
                <p className="text-slate-400">Try your luck for high-tier rewards!</p>
              
                <AnimatePresence>
                  {showProbabilities && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 pb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-widest">
                          {(() => {
                             const rarities = gachaPool.rarities || [];
                            const totalWeight = rarities.reduce((sum, r) => sum + r.weight, 0);
                            
                            return rarities.map(rarity => {
                              const prob = totalWeight > 0 ? ((rarity.weight / totalWeight) * 100).toFixed(1) : '0';
                              const colors = getColorClass(rarity.color);
                              return (
                                <div key={rarity.id} className={cn("p-2 rounded border transition-colors", colors.bgClass, colors.borderClass, colors.textClass)}>
                                  {rarity.name}: {prob}%
                                </div>
                              );
                            });
                          })()}
                        </div>
                        
                        <div className="text-left bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Available Rewards</h4>
                          <div className="space-y-2">
                            {(gachaPool.rarities || []).map(rarity => {
                              const items = gachaPool.items.filter(i => i.rarity === rarity.id);
                              if (items.length === 0) return null;
                              const colors = getColorClass(rarity.color);
                              const vibrantMapping: Record<string, string> = {
                                'rose': 'bg-rose-600 text-white',
                                'amber': 'bg-amber-500 text-slate-900',
                                'purple': 'bg-purple-600 text-white',
                                'blue': 'bg-blue-600 text-white',
                                'emerald': 'bg-emerald-600 text-white',
                                'slate': 'bg-slate-600 text-white'
                              };
                              const badgeBg = rarity.color && vibrantMapping[rarity.color] ? vibrantMapping[rarity.color] : colors.bgClass;

                              return (
                                <div key={rarity.id} className="flex flex-wrap gap-1.5 items-center">
                                  <span className={cn(
                                    "text-[9px] font-black px-1.5 py-0.5 rounded uppercase border",
                                    badgeBg, colors.borderClass, rarity.color === 'amber' ? 'text-slate-900' : 'text-white'
                                  )}>
                                    {rarity.name}
                                  </span>
                                  <span className="text-xs text-slate-300">
                                    {items.map(i => i.name).join(', ')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4">
                  <button
                    onClick={() => onDrawGacha(gachaPool.id, 1)}
                    disabled={coins < gachaPool.cost}
                    className={cn(
                      "flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-2",
                      coins >= gachaPool.cost 
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-[#ffffff] shadow-lg shadow-indigo-500/20" 
                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                    )}
                  >
                    <span>Pull 1x ({gachaPool.cost.toLocaleString()})</span>
                  </button>
                  <button
                    onClick={() => onDrawGacha(gachaPool.id, 10)}
                    disabled={coins < gachaPool.cost * 10}
                    className={cn(
                      "flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-2",
                      coins >= gachaPool.cost * 10
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-[#ffffff] shadow-lg shadow-amber-500/20" 
                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                    )}
                  >
                    <span>Pull 10x ({(gachaPool.cost * 10).toLocaleString()})</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'ichiban' && (
          <motion.div
            key="ichiban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col space-y-12"
          >
            {ichibanPoolsList.length > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 p-1 bg-slate-900 rounded-xl overflow-x-auto max-w-full self-center">
                {ichibanPoolsList.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onSetActivePool?.('ichiban', p.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      ichibanPool?.id === p.id ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {ichibanPool && (
              <div key={ichibanPool.id} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-slate-800/50 last:border-0">
                <div className="lg:col-span-1 bg-slate-900 p-8 rounded-3xl border border-emerald-500/30 space-y-6 relative h-fit">
                  <h3 className="text-2xl font-bold text-white">{ichibanPool.name}</h3>
                  <p className="text-slate-400 text-sm">Limited pool. Draw all to get the Last One prize!</p>
                  
                  <div className="flex flex-col gap-3">
                    {remainingIchibanItems > 0 ? (
                      <>
                        <button
                          onClick={() => onDrawGacha(ichibanPool.id, 1)}
                          disabled={coins < ichibanPool.cost}
                          className={cn(
                            "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2",
                            coins >= ichibanPool.cost 
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                              : "bg-slate-800 text-slate-600 cursor-not-allowed"
                          )}
                        >
                          <span>Draw 1x ({ichibanPool.cost.toLocaleString()} Gold)</span>
                        </button>
                        <button
                          onClick={() => onDrawGacha(ichibanPool.id, remainingIchibanItems < 10 ? remainingIchibanItems : 10)}
                          disabled={coins < ichibanPool.cost * (remainingIchibanItems < 10 ? remainingIchibanItems : 10)}
                          className={cn(
                            "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2",
                            coins >= ichibanPool.cost * (remainingIchibanItems < 10 ? remainingIchibanItems : 10)
                              ? "bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20" 
                              : "bg-slate-800 text-slate-600 cursor-not-allowed"
                          )}
                        >
                          {remainingIchibanItems < 10 ? (
                            <span>Take All Remaining ({(ichibanPool.cost * remainingIchibanItems).toLocaleString()} Gold)</span>
                          ) : (
                            <span>Draw 10x ({(ichibanPool.cost * 10).toLocaleString()} Gold)</span>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to reset this pool? All remaining items will be restored to their initial quantities.")) {
                            onResetIchiban(ichibanPool.id);
                          }
                        }}
                        className="w-full py-4 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center space-x-2"
                      >
                        <RefreshCw size={18} />
                        <span>Reset Pool</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4 h-fit content-start">
                  {[...ichibanPool.items].sort((a, b) => {
                    if (a.rarity === 'LastOne') return -1;
                    if (b.rarity === 'LastOne') return 1;
                    return 0;
                  }).map(item => {
                      const subItems = item.name.split('/').map(s => s.trim()).filter(s => s.length > 0);
                      const isExhausted = item.count === 0;
                      
                      return (
                        <div 
                          key={item.rarity + item.name} 
                          className={cn(
                            "p-4 bg-slate-900 rounded-2xl border transition-all",
                            isExhausted ? "opacity-40 grayscale border-slate-800" : "border-slate-800 hover:border-slate-700 shadow-lg shadow-black/20"
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.2)]",
                                (() => {
                                  const isLastOne = item.rarity.toUpperCase() === 'LASTONE';
                                  // Prefer color from data, fallback to mapping based on rarityValue, or rose for LastOne
                                  let colorId = item.color;
                                  if (!colorId) {
                                    if (isLastOne) colorId = 'rose';
                                    else if (item.rarityValue) {
                                      const mapped = RARITY_COLORS.find(c => c.value === item.rarityValue);
                                      if (mapped) colorId = mapped.id;
                                    }
                                  }
                                  
                                  const { bgClass, textClass, borderClass } = getColorClass(colorId || 'slate');
                                  
                                  // Use vibrant backgrounds for the label badges
                                  const vibrantMapping: Record<string, string> = {
                                    'rose': 'bg-rose-600 text-white shadow-rose-500/30',
                                    'amber': 'bg-amber-500 text-slate-900 shadow-amber-500/30',
                                    'purple': 'bg-purple-600 text-white shadow-purple-500/30',
                                    'blue': 'bg-blue-600 text-white shadow-blue-500/30',
                                    'emerald': 'bg-emerald-600 text-white shadow-emerald-500/30',
                                    'slate': 'bg-slate-600 text-white shadow-slate-500/30'
                                  };
                                  
                                  const vibrantBg = colorId && vibrantMapping[colorId] ? vibrantMapping[colorId] : bgClass;
                                  const vibrantText = colorId === 'amber' ? 'text-slate-900' : 'text-white font-black';
                                  
                                  return cn(vibrantBg, vibrantText, borderClass);
                                })()
                              )}>
                                {item.rarity}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {subItems.map((sub, sIdx) => (
                                  <span key={sIdx} className="text-sm text-white font-bold bg-slate-800 px-3 py-1 rounded-lg border border-slate-700/50">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 self-end sm:self-auto">
                              <div className="text-right">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter leading-none">Remaining</div>
                                <div className="text-lg font-black text-white leading-none mt-1">{item.count}</div>
                              </div>
                              {item.initialCount !== undefined && (
                                <div className="h-8 w-px bg-slate-800" />
                              )}
                              {item.initialCount !== undefined && (
                                <div className="text-left">
                                  <div className="text-xs font-bold text-slate-600 uppercase tracking-tighter leading-none">Total</div>
                                  <div className="text-sm font-bold text-slate-500 leading-none mt-1">{item.initialCount}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
