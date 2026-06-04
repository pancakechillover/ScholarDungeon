import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Users, LogIn, Plus, X, MessageSquare, Activity, Crown, Clock, Target, Check, AlertCircle, RefreshCw, Send, Settings, User, UserCheck, Landmark } from 'lucide-react';
import { AppState, Team, TeamMessage, TeamEvent, TeamMember, TeamSettingProposal } from '../types';
import { cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ProfileModal } from './ProfileModal';

interface TeamModuleProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const TeamModule: React.FC<TeamModuleProps> = ({ state, setState }) => {
  const [view, setView] = useState<'lobby' | 'team'>('lobby');
  const [lobbyTeams, setLobbyTeams] = useState<any[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [events, setEvents] = useState<TeamEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'events'>('chat');
  const [chatInput, setChatInput] = useState('');
  
  // Create / Settings Modal
  const [showCreate, setShowCreate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [showJoin, setShowJoin] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [showPlazaModal, setShowPlazaModal] = useState(false);

  const fetchLobby = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const data = await res.json();
        if (data.teams) setLobbyTeams(data.teams);
      }
    } catch (e) {
      // transient network error, ignore
    }
    setLoading(false);
  };

  const fetchTeam = async () => {
    if (!state.teamId) return;
    try {
      const res = await fetch(`/api/teams?id=${state.teamId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.team) {
        setTeam(data.team);
        setMessages(data.messages || []);
        setEvents(data.events || []);
        setView('team');
      } else {
        setState(s => ({ ...s, teamId: undefined }));
        setView('lobby');
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (state.teamId) {
      fetchTeam();
      const interval = setInterval(fetchTeam, 10000); // Poll every 10s
      return () => clearInterval(interval);
    } else {
      setView('lobby');
      fetchLobby();
    }
  }, [state.teamId]);

  const getOrGenerateIdentity = () => {
    if (state.secretCode) return state.secretCode;
    const newCode = crypto.randomUUID();
    setState(s => ({ ...s, secretCode: newCode }));
    return newCode;
  };

  const joinTeam = async (id: string) => {
    const identityCode = getOrGenerateIdentity();
    setLoading(true);
    try {
      const res = await fetch('/api/teams?action=join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          teamId: id, 
          secretCode: identityCode,
          userName: state.userName || 'Scholar',
          userAvatar: state.userAvatar,
          userBio: state.userBio,
          userTitle: state.userTitle,
          userLevel: state.level || 1
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.pendingApproval) {
          alert("Your application request has been submitted to the team captain for approval. (您的加入申请已提交，等待队长审核！)");
        } else {
          setState(s => ({ ...s, teamId: id }));
        }
      } else {
        alert(data.error || 'Failed to join');
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleApplicant = async (applicantId: string, accept: boolean) => {
    const identityCode = getOrGenerateIdentity();
    if (!state.teamId) return;
    try {
      const res = await fetch('/api/teams?action=handle_applicant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: state.teamId,
          secretCode: identityCode,
          userName: state.userName || 'Scholar',
          applicantId,
          accept
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchTeam();
      } else {
        alert(data.error || 'Failed to handle request');
      }
    } catch (e) {
      console.error(e);
    }
  };


  const sendMessage = async () => {
    const identityCode = getOrGenerateIdentity();
    if (!chatInput.trim() || !state.teamId) return;
    const msg = chatInput.trim();
    setChatInput('');
    try {
      await fetch('/api/teams?action=message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          teamId: state.teamId, 
          secretCode: identityCode,
          userName: state.userName || 'Scholar',
          userAvatar: state.userAvatar,
          userBio: state.userBio,
          userTitle: state.userTitle,
          userLevel: state.level || 1,
          content: msg
        })
      });
      fetchTeam();
    } catch (e) {
      console.error(e);
    }
  };

  const proposeSettings = async (cfg: any) => {
    const identityCode = getOrGenerateIdentity();
    if (!state.teamId) return;
    try {
      const res = await fetch('/api/teams?action=settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          teamId: state.teamId, 
          secretCode: identityCode,
          userName: state.userName || 'Scholar',
          ...cfg
        })
      });
      const data = await res.json();
      if (!data.success) alert(data.error || 'Failed to update settings');
      setShowSettings(false);
      fetchTeam();
    } catch (e) {
      console.error(e);
    }
  };

  const voteProposal = async (accept: boolean) => {
     const identityCode = getOrGenerateIdentity();
     if (!state.teamId) return;
     try {
       await fetch('/api/teams?action=vote', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ teamId: state.teamId, secretCode: identityCode, accept })
       });
       fetchTeam();
     } catch (e) {
       console.error(e);
     }
  };

  const renderLobby = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowPlazaModal(true)}
          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/20 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
          id="btn-plaza-tab"
        >
          <Landmark size={14} /> Plaza
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowJoin(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <LogIn size={14} /> Join Guild
          </button>
          <button 
            onClick={() => setShowCreate(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus size={14} /> Create Guild
          </button>
        </div>
      </div>

      {loading && lobbyTeams.length === 0 ? (
        <div className="flex justify-center p-8"><RefreshCw className="animate-spin text-indigo-500" /></div>
      ) : lobbyTeams.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-slate-700/50 rounded-2xl text-slate-500">
          No public guilds available. Be the first to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lobbyTeams.map(t => (
            <div key={t.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
              <div>
                <h4 className="text-white font-bold text-lg mb-1">{t.name}</h4>
                <p className="text-slate-400 text-xs line-clamp-2">{t.description || 'No description'}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Users size={12} /> {t.memberCount} Members
                </span>
                <button 
                  onClick={() => joinTeam(t.id)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg text-xs font-bold transition-all opacity-0 group-hover:opacity-100"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProposal = () => {
    if (!team?.currentProposal || team.currentProposal.status !== 'pending') return null;
    
    // Check if I have voted. Need my user ID. Let's just assume we don't have user ID in state, so we hash secretCode?
    // We can just try to vote, backend will block if already voted. Actually we can check UI if we want.
    // For simplicity, just show the banner.
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>
          <h4 className="text-amber-400 font-bold text-sm flex items-center gap-2 mb-1">
            <AlertCircle size={16} /> Pending Team Goal Change
          </h4>
          <p className="text-xs text-amber-500/80">
            A member proposed changing the goal to {team.currentProposal.targetValue}m ({team.currentProposal.targetType}). Reward: {team.currentProposal.rewardContent}. Waiting for unanimous vote.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => voteProposal(true)} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition-colors">
            Accept
          </button>
          <button onClick={() => voteProposal(false)} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg text-xs font-bold transition-colors">
            Reject
          </button>
        </div>
      </div>
    );
  };

  const renderTeamDashboard = () => {
    if (!team) return null;
    
    // Calc total progress
    let totalProgress = team.members.reduce((acc, m) => acc + m.totalFocusTime, 0);
    const target = team.config.targetValue;
    const isCompleted = target > 0 && totalProgress >= target;
    const isCaptain = team.members.find(x => x.userId === state.secretCode || x.name === state.userName)?.isCaptain;

    return (
      <div className="flex flex-col h-[500px]">
        {renderProposal()}
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">{team.name}</h3>
            <p className="text-xs text-slate-400">{team.description}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowSettings(true)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Left: Progress & Members */}
          <div className="w-1/3 flex flex-col gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Team Goal ({{'daily_time': 'Daily', 'weekly_time': 'Weekly', 'monthly_time': 'Monthly', 'yearly_time': 'Yearly', 'total_time': 'Total'}[team.config.targetType] || 'Total'})</div>
              <div className="flex justify-center items-end gap-1 mb-2">
                <span className="text-3xl font-bold text-white leading-none">{totalProgress}</span>
                <span className="text-sm font-semibold text-slate-500 mb-1">/ {target}m</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all", isCompleted ? "bg-emerald-500" : "bg-indigo-500")}
                  style={{ width: `${Math.min(100, (totalProgress / Math.max(1, target)) * 100)}%` }}
                />
              </div>
              {isCompleted && <div className="mt-2 text-xs font-bold text-emerald-400 flex justify-center items-center gap-1"><Check size={12} /> Goal Reached!</div>}
              
              {team.config.rewardContent && (
                <div className="mt-3 text-[10px] bg-slate-800/50 p-2 rounded-lg text-slate-400">
                  <span className="text-amber-400 font-bold block mb-1">Reward Pool:</span>
                  {team.config.rewardContent}
                </div>
              )}
            </div>
            
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Members ({team.members.length})</div>
              
              {totalProgress > 0 && (
                <div className="h-32 mb-4 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={team.members.filter(m => m.totalFocusTime > 0)}
                        dataKey="totalFocusTime"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        stroke="none"
                      >
                        {team.members.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#94a3b8', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-3">
                {team.members.map(m => (
                  <div 
                    key={m.userId} 
                    className="flex justify-between items-center group cursor-pointer hover:bg-slate-900/50 p-1.5 -mx-1.5 rounded-lg transition-colors"
                    onClick={() => setViewingProfile(m.userId)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden text-lg">
                        {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" alt="" /> : <User size={14} className="text-slate-500" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-300 flex items-center gap-1">
                          {m.name} {m.isCaptain && <Crown size={10} className="text-amber-400" />}
                        </span>
                        <span className="text-[10px] text-slate-500">{m.totalFocusTime}m focus</span>
                      </div>
                    </div>
                    {m.level && <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">Lv. {m.level}</span>}
                  </div>
                ))}
              </div>

              {isCaptain && (team as any).applicants && (team as any).applicants.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-sans">
                    <UserCheck size={12} /> Pending Applicants ({(team as any).applicants.length})
                  </div>
                  <div className="space-y-3">
                    {((team as any).applicants || []).map((app: any) => (
                      <div key={app.userId} className="bg-indigo-950/10 border border-indigo-500/10 p-2.5 rounded-xl flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                              {app.avatar ? <img src={app.avatar} className="w-full h-full object-cover" alt="" /> : <User size={12} className="text-slate-500" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-white leading-tight">{app.name}</span>
                              <span className="text-[9px] text-slate-500">Lv.{app.level || 1} {app.title || "Wandering Scholar"}</span>
                            </div>
                          </div>
                        </div>
                        {app.bio && (
                          <p className="text-[10px] text-slate-400 italic bg-slate-900/40 p-1.5 rounded-lg border border-slate-900/60 break-words">
                            "{app.bio}"
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <button 
                            onClick={() => handleApplicant(app.userId, true)}
                            className="flex-1 py-1.5 bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-400 font-bold text-[10px] rounded-lg transition-colors border border-indigo-500/20 font-sans"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleApplicant(app.userId, false)}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-[10px] rounded-lg transition-colors border border-slate-800/80 font-sans"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right: Board */}
          <div className="w-2/3 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col">
            <div className="flex border-b border-slate-800 p-1">
              <button 
                onClick={() => setActiveTab('chat')} 
                className={cn("flex-1 py-2 text-xs font-bold rounded-xl transition-colors", activeTab === 'chat' ? "bg-slate-800 text-white" : "text-slate-500")}
              >
                Message Board
              </button>
              <button 
                onClick={() => setActiveTab('events')} 
                className={cn("flex-1 py-2 text-xs font-bold rounded-xl transition-colors", activeTab === 'events' ? "bg-slate-800 text-white" : "text-slate-500")}
              >
                Event Log
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col-reverse">
              {activeTab === 'chat' ? (
                <div className="space-y-4 flex flex-col justify-end">
                  {messages.slice().reverse().map(m => {
                    const isMe = m.name === (state.userName || 'Scholar');
                    return (
                      <div key={m.id} className={cn("flex flex-col w-full", isMe ? "items-end" : "items-start")}>
                        <div className={cn("flex items-end gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0 translate-y-1">
                            {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" alt=""/> : <User size={14} className="text-slate-500 m-auto h-full" />}
                          </div>
                          <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                            <div className={cn("flex items-center gap-2 mb-1", isMe ? "flex-row-reverse" : "flex-row")}>
                              <span className="text-xs font-bold text-slate-400">{m.name}</span>
                              <span className="text-[9px] text-slate-600">{new Date(m.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className={cn(
                              "text-sm p-3 rounded-2xl w-fit max-w-[280px] break-words",
                              isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-800 text-slate-300 rounded-bl-none border border-slate-700/50"
                            )}>
                              {m.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {messages.length === 0 && <div className="text-center text-slate-600 mt-auto mb-auto text-sm">No messages yet.</div>}
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((e, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5", 
                        e.type === 'join' ? "bg-emerald-500/20 text-emerald-400" :
                        e.type === 'focus' ? "bg-indigo-500/20 text-indigo-400" :
                        "bg-amber-500/20 text-amber-400"
                      )}>
                        {e.type === 'focus' ? <Activity size={10} /> : e.type === 'join' ? <LogIn size={10} /> : <Target size={10} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-300">{e.content}</span>
                        <span className="text-[9px] text-slate-600">{new Date(e.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {activeTab === 'chat' && (
              <div className="p-3 border-t border-slate-800 bg-slate-900/50">
                <div className="relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Message the guild..."
                    className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-xl pl-4 pr-10 py-2.5 outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button onClick={sendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden group mb-6">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <Users size={120} />
      </div>

      <div className="relative z-10">
        <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2 mb-6">
          <Users className="text-indigo-400" />
          Fellowship
        </h2>
        
        {view === 'lobby' ? renderLobby() : renderTeamDashboard()}
      </div>

      {showSettings && team && (
        <SettingsModal 
           team={team} 
           onClose={() => setShowSettings(false)} 
           onSave={proposeSettings} 
           isCaptain={team.members.find(x => x.name === state.userName || x.userId === state.secretCode)?.isCaptain}
           onLeave={async () => {
             const isCap = team.members.find(x => x.name === state.userName || x.userId === state.secretCode)?.isCaptain;
             const msg = isCap 
               ? "Are you sure you want to disband this guild? This will remove all members. (您确定要解散并退出该公队吗？)"
               : "Are you sure you want to leave this guild? (您确定要退出当前公队吗？)";
             if (confirm(msg)) {
                const identityCode = getOrGenerateIdentity();
                await fetch('/api/teams?action=leave', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({ teamId: team.id, secretCode: identityCode, userName: state.userName || 'Scholar' })
                });
                setState(s => ({ ...s, teamId: undefined }));
                setShowSettings(false);
             }
           }}
        />
      )}

      {showCreate && (
        <CreateTeamModal 
           onClose={() => setShowCreate(false)}
           onCreate={async (cfg: any) => {
             const identityCode = getOrGenerateIdentity();
             const res = await fetch('/api/teams?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                   name: cfg.name,
                   description: cfg.description,
                   config: cfg.config,
                   secretCode: identityCode,
                   userName: state.userName || 'Scholar',
                   userAvatar: state.userAvatar,
                   userBio: state.userBio,
                   userTitle: state.userTitle,
                   userLevel: state.level || 1
                })
             });
             const data = await res.json();
             if (data.success && data.teamId) {
               setState(s => ({...s, teamId: data.teamId}));
               setShowCreate(false);
             }
           }}
        />
      )}
      
      {showJoin && (
        <JoinTeamModal 
           onClose={() => setShowJoin(false)}
           onJoin={(id: string) => {
             joinTeam(id);
             setShowJoin(false);
           }}
        />
      )}
      
      {viewingProfile && team && (
        <TeamMemberProfileModal 
           member={team.members.find(m => m.userId === viewingProfile)!}
           onClose={() => setViewingProfile(null)}
        />
      )}
      
      {showPlazaModal && (
        <PlazaModal onClose={() => setShowPlazaModal(false)} />
      )}
    </div>
  );
};

const CreateTeamModal = ({ onClose, onCreate }: any) => {
  const [cfg, setCfg] = useState({
     name: '',
     description: '',
     config: {
        permission: 'captain_only',
        targetType: 'total_time',
        targetValue: 1000,
        rewardType: 'text',
        rewardContent: ''
     }
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!cfg.name.trim()) {
      setError('A guild must have a name.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onCreate(cfg);
    } catch (e: any) {
      setError(e.message || 'Failed to create guild. Please ensure Cloud Sync is enabled.');
    }
    setIsSubmitting(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border-2 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] rounded-3xl p-8 max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full relative z-20">
          <X size={20}/>
        </button>
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-2xl border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
            <Users size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Found a Guild</h3>
            <p className="text-sm text-slate-400 font-medium tracking-tight">Gather scholars under one banner.</p>
          </div>
        </div>
         
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm flex items-start gap-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 relative z-10">
          {/* Identity */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest pl-1 mb-1 block">Guild Name <span className="text-rose-500">*</span></label>
              <input type="text" value={cfg.name} onChange={e => setCfg({...cfg, name: e.target.value})}
                 placeholder="e.g. Knights of Knowledge"
                 className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 hover:border-slate-600 rounded-xl px-4 py-3 text-sm text-white transition-colors outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1 block">Guild Philosophy</label>
              <textarea value={cfg.description} onChange={e => setCfg({...cfg, description: e.target.value})}
                 placeholder="What unites your members? Describe your shared purpose..."
                 className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 hover:border-slate-600 rounded-xl px-4 py-3 text-sm text-white min-h-[100px] transition-colors outline-none resize-none" />
            </div>
          </div>

          <div className="w-full h-px bg-slate-800" />

          {/* Goal System */}
          <div className="space-y-4">
             <h4 className="text-sm font-bold text-white flex items-center gap-2">
               <Target size={16} className="text-emerald-400" /> Goal Configuration
             </h4>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1 block">Target Rules</label>
                 <select 
                   value={cfg.config.targetType} 
                   onChange={e => setCfg({...cfg, config: {...cfg.config, targetType: e.target.value}})}
                   className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                 >
                   <option value="total_time">Cumulative Focus</option>
                   <option value="daily_time">Daily Routine Focus</option>
                   <option value="weekly_time">Weekly Challenge</option>
                   <option value="monthly_time">Monthly Marathon</option>
                   <option value="yearly_time">Yearly Epic Goal</option>
                 </select>
               </div>
               
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1 block">Target Value</label>
                 <input type="number" value={cfg.config.targetValue} onChange={e => setCfg({...cfg, config: {...cfg.config, targetValue: parseInt(e.target.value) || 0}})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none tabular-nums" />
               </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1 block">Reward Base</label>
                 <select 
                   value={cfg.config.rewardType} 
                   onChange={e => setCfg({...cfg, config: {...cfg.config, rewardType: e.target.value}})}
                   className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                 >
                   <option value="text">Honor / Promise</option>
                   <option value="coins">Shared Gold Pool</option>
                   <option value="xp">Shared XP Bonus</option>
                 </select>
               </div>
               
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1 block">Reward Content</label>
                 <input type="text" value={cfg.config.rewardContent} onChange={e => setCfg({...cfg, config: {...cfg.config, rewardContent: e.target.value}})}
                    placeholder={cfg.config.rewardType === 'text' ? "e.g. A Pizza Party" : "e.g. 500"}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none" />
               </div>
             </div>
             
             <div className="pt-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1 block">Goal Amendment Power</label>
               <select 
                 value={cfg.config.permission} 
                 onChange={e => setCfg({...cfg, config: {...cfg.config, permission: e.target.value}})}
                 className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
               >
                 <option value="captain_only">Captain's Decree (Captain Only)</option>
                 <option value="unanimous">Unanimous Concord (All members vote)</option>
               </select>
             </div>
          </div>
        </div>
        
        <div className="mt-8 relative z-10 flex gap-4">
          <button 
             onClick={onClose} 
             className="w-1/3 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors tracking-widest text-sm"
          >
            CANCEL
          </button>
          <button 
             onClick={handleSubmit} 
             disabled={!cfg.name.trim() || isSubmitting} 
             className={cn(
               "w-2/3 py-3.5 font-bold rounded-xl transition-all tracking-widest text-sm shadow-lg flex items-center justify-center gap-2",
               cfg.name.trim() && !isSubmitting ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30 text-white" : "bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed"
             )}
          >
            {isSubmitting ? 'FORGING...' : 'ESTABLISH'}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}

const TeamMemberProfileModal = ({ member, onClose }: { member: TeamMember, onClose: () => void }) => {
  if (!member) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full relative overflow-hidden group">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white z-20"><X size={20}/></button>
        
        <div className="flex flex-col items-center relative z-10 text-center">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl shadow-xl shadow-black/50 mb-4 overflow-hidden relative">
            {member.avatar ? <img src={member.avatar} className="w-full h-full object-cover" alt="" /> : <User size={40} className="text-slate-500" />}
          </div>
          
          <h2 className="text-2xl font-black text-white italic tracking-tight">{member.name}</h2>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Lv. {member.level || 1}
            </div>
            <div className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              {member.title || "Wandering Scholar"}
            </div>
          </div>
          
          <div className="my-6 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          
          <p className="text-sm text-slate-300 min-h-[60px] italic">
            {member.bio ? `"${member.bio}"` : '"This scholar walks the path of focus in silence."'}
          </p>
          
          <div className="w-full grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Focus</span>
              <span className="text-lg font-black text-white tabular-nums">{member.totalFocusTime} <span className="text-xs text-slate-500">min</span></span>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Joined</span>
              <span className="text-sm font-bold text-white tabular-nums leading-loose">{new Date(member.joinedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const SettingsModal = ({ team, onClose, onSave, isCaptain, onLeave }: any) => {
  const [cfg, setCfg] = useState(team.config);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(team.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
       <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar">
         <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
         <h3 className="text-lg font-bold text-white mb-6">Guild Settings & Goal</h3>
         
         <div className="space-y-4">
           {/* Guild Secret Key Section */}
           <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
             <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-sans">Guild Secret ID / Invite Key (团队钥匙 / 秘钥)</label>
             <div className="flex items-center gap-2">
               <span className="font-mono text-xs text-slate-300 select-all break-all bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 flex-1">{team.id}</span>
               <button 
                 onClick={handleCopy}
                 className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-white rounded-xl text-xs font-bold transition-all shrink-0 border border-indigo-500/20 font-sans"
               >
                 {copied ? "Copied!" : "Copy"}
               </button>
             </div>
             <p className="text-[9px] text-slate-500">Share this unique ID with other scholars to invite them to this guild.</p>
           </div>

           {/* Join Rule Section */}
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Joining Policy (入队规则)</label>
             <select 
               value={cfg.joinRule || 'direct'} 
               onChange={e => setCfg({...cfg, joinRule: e.target.value})}
               disabled={!isCaptain}
               className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
             >
               <option value="direct">Direct Join (输入秘钥其他人即可加入)</option>
               <option value="approval">Captain Approval Required (需要队长同意才能加入)</option>
             </select>
             {!isCaptain && (
               <p className="text-[10px] text-slate-500 mt-1">Only the captain can modify join policy.</p>
             )}
           </div>

           {/* Permission Section */}
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Goal Setting Authority</label>
             <select 
               value={cfg.permission} 
               onChange={e => setCfg({...cfg, permission: e.target.value})}
               disabled={!isCaptain}
               className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
             >
               <option value="captain_only">Captain Only</option>
               <option value="unanimous">Unanimous Vote Required</option>
             </select>
           </div>
           
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Target Horizon</label>
             <select 
               value={cfg.targetType} 
               onChange={e => setCfg({...cfg, targetType: e.target.value})}
               className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
             >
               <option value="total_time">Guild Total Focus (m)</option>
               <option value="daily_time">Guild Daily Progress (m)</option>
               <option value="weekly_time">Guild Weekly Challenge (m)</option>
               <option value="monthly_time">Guild Monthly Marathon (m)</option>
               <option value="yearly_time">Guild Yearly Epic Goal (m)</option>
             </select>
           </div>
           
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Target Value (Minutes)</label>
             <input type="number" value={cfg.targetValue} onChange={e => setCfg({...cfg, targetValue: parseInt(e.target.value) || 0})}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" />
           </div>

           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Goal Reward Type</label>
             <select 
               value={cfg.rewardType || 'text'} 
               onChange={e => setCfg({...cfg, rewardType: e.target.value})}
               className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
             >
               <option value="text">Text Only (e.g. Honor/Title)</option>
               <option value="coins">Gold Coins</option>
               <option value="xp">Experience (XP)</option>
               <option value="item">Custom Item Data</option>
             </select>
           </div>

           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Goal Reward Details</label>
             <input type="text" value={cfg.rewardContent} onChange={e => setCfg({...cfg, rewardContent: e.target.value})}
                placeholder={cfg.rewardType === 'text' ? "e.g. Pizza Party" : "e.g. 500"}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" />
           </div>
         </div>
         
         <div className="mt-6 flex flex-col gap-3">
           <button onClick={() => onSave(cfg)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors font-sans">
             Submit Changes
           </button>

           <div className="pt-4 border-t border-slate-800/80 mt-2">
             <button 
               onClick={onLeave}
               className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-xs rounded-xl transition-colors border border-rose-500/20 flex items-center justify-center gap-1.5 font-sans"
             >
               <LogIn size={14} className="rotate-180" />
               {isCaptain ? "Disband / Leave Guild (解散/退出团队)" : "Leave Guild (退出此团队)"}
             </button>
           </div>
         </div>
       </div>
    </div>,
    document.body
  )
}

const JoinTeamModal = ({ onClose, onJoin }: any) => {
  const [inviteId, setInviteId] = useState('');

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border-2 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] rounded-3xl p-8 max-w-sm w-full relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 rounded-full z-20">
          <X size={20}/>
        </button>
        
        <div className="flex flex-col items-center mb-6 relative z-10 text-center">
          <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-2xl border border-indigo-500/30 shadow-lg shadow-indigo-500/20 mb-4">
            <LogIn size={28} />
          </div>
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Join Guild</h3>
          <p className="text-xs text-slate-400 font-medium tracking-tight mt-1">Enter a Guild ID to join your fellowship.</p>
        </div>
         
        <div className="relative z-10">
          <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest pl-1 mb-1 block">Guild ID</label>
          <input 
             type="text" 
             value={inviteId} 
             onChange={e => setInviteId(e.target.value)}
             placeholder="e.g. 1234-abcd..."
             className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 hover:border-slate-600 rounded-xl px-4 py-3 text-sm text-center font-mono text-white transition-colors outline-none" 
             onKeyDown={(e) => {
                if(e.key === 'Enter' && inviteId.trim()) onJoin(inviteId.trim());
             }}
          />
        </div>
        
        <div className="mt-8 relative z-10 flex gap-3">
          <button 
             onClick={onClose} 
             className="w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors tracking-widest text-sm"
          >
            CANCEL
          </button>
          <button 
             onClick={() => onJoin(inviteId.trim())} 
             disabled={!inviteId.trim()} 
             className={cn(
               "w-1/2 py-3 font-bold rounded-xl transition-all tracking-widest text-sm shadow-lg",
               inviteId.trim() ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30 text-white" : "bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed"
             )}
          >
            JOIN
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

const PlazaModal = ({ onClose }: { onClose: () => void }) => {
  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full relative overflow-hidden shadow-2xl shadow-black/80"
      >
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-indigo-400">
          <Landmark size={80} />
        </div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-20">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center relative z-10 py-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <Landmark size={28} className="text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sanctum Plaza</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            The Sanctum Plaza is currently under spiritual construction. A wider realm of shared guilds and achievements is on its way.
          </p>
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

