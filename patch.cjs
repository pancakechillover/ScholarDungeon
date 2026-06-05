const fs = require('fs');
let code = fs.readFileSync('src/components/TeamModule.tsx', 'utf8');

const t2 = `                   <input type="number" value={cfg.targetValue} onChange={e => setCfg({...cfg, targetValue: parseInt(e.target.value) || 0})}
                      disabled={!isCaptain && team.config.permission !== 'unanimous'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none tabular-nums disabled:opacity-50" />
                 </div>
               </div>`;

if (code.includes(t2)) {
    code = code.replace(t2, t2 + `\n\n               {cfg.targetType !== 'total_time' && (
                 <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1 block flex items-center gap-2"><Clock size={12} className="text-indigo-400" /> Goal Refresh Schedule</label>
                   <select 
                     value={cfg.resetTime || '00:00'} 
                     onChange={e => setCfg({...cfg, resetTime: e.target.value})}
                     disabled={!isCaptain && team.config.permission !== 'unanimous'}
                     className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none disabled:opacity-50"
                   >
                     <option value="00:00">Midnight (00:00) / End of Day</option>
                     <option value="03:00">Late Night (03:00 AM)</option>
                     <option value="04:00">Early Morning (04:00 AM)</option>
                     <option value="05:00">Dawn (05:00 AM)</option>
                     <option value="06:00">Morning (06:00 AM)</option>
                   </select>
                 </div>
               )}`);
    fs.writeFileSync('src/components/TeamModule.tsx', code);
    console.log("Success");
} else {
    console.log("Not found.");
}
