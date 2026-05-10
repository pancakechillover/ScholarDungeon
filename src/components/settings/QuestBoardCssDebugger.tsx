import React from 'react';
import { X, CheckSquare, Square, Clock, Target, Gift } from 'lucide-react';

interface QuestBoardCssDebuggerProps {
  onClose: () => void;
}

export const QuestBoardCssDebugger: React.FC<QuestBoardCssDebuggerProps> = ({ onClose }) => {
  const themes = [
    { name: 'Default / Slate', attr: null },
    { name: 'Night', attr: 'night' },
    { name: 'Forest', attr: 'forest' },
    { name: 'Ocean', attr: 'ocean' },
    { name: 'Daylight', attr: 'daylight' },
    { name: 'Warm Sun', attr: 'warm' },
    { name: 'Candy', attr: 'candy' }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">Quest Board CSS Debugger</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto show-scrollbar space-y-8 flex-1 bg-slate-950">
          <p className="text-slate-400 text-sm">
            Here you can see exactly how the `.qb-*` classes look across all 7 theme variables. Modifying `src/index.css` will immediately reflect here.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {themes.map(t => (
              <div key={t.name} className="space-y-2 border border-slate-800 p-4 rounded-xl relative overflow-hidden" data-theme={t.attr}>
                <div className="absolute top-2 right-2 text-[10px] font-bold text-slate-500 uppercase z-10 px-2 py-1 bg-slate-900/50 rounded pointer-events-none">
                  {t.name}
                </div>
                
                {/* 模拟 Quest Board 主体 */}
                <div className="qb-board p-4 rounded-xl border relative shadow-inner">
                  
                  <div className="space-y-3">
                    {/* 未完成的任务卡片 */}
                    <div className="qb-card border rounded-lg p-3 relative shadow-md">
                      <div className="flex items-start gap-3">
                        <button className="qb-dark-box flex-shrink-0 mt-1 w-5 h-5 rounded flex items-center justify-center border hover:border-indigo-400 transition-colors">
                          <Square size={14} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base leading-tight mb-1">Defeat the Final Boss</h4>
                          <p className="qb-card-desc text-xs font-handwriting tracking-wide">Enter the lair and vanquish the ancient evil.</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="qb-tag text-[10px] uppercase font-bold px-2 py-0.5 rounded border flex items-center gap-1 shadow-sm">
                              <Target size={10} /> Daily
                            </span>
                            <span className="qb-tag text-[10px] uppercase font-bold px-2 py-0.5 rounded border flex items-center gap-1 shadow-sm">
                              <Gift size={10} /> +100 Gold
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 已完成的任务卡片 */}
                    <div className="qb-card border rounded-lg p-3 relative shadow-md opacity-80">
                      <div className="flex items-start gap-3">
                        <button className="qb-success flex-shrink-0 mt-1 w-5 h-5 rounded flex items-center justify-center border transition-colors">
                          <CheckSquare size={14} />
                        </button>
                        <div className="flex-1 min-w-0 line-through decoration-slate-400">
                          <h4 className="font-bold text-base leading-tight mb-1">Gather 10 Herbs</h4>
                          <p className="qb-card-desc text-xs font-handwriting tracking-wide">Find the rare plants in the mystical forest.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
