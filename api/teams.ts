import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

let redisClient: any = null;
const getRedisClient = async () => {
  if (redisClient && redisClient.isOpen) return redisClient;
  if (process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
      await redisClient.connect();
      return redisClient;
    } catch (err) {
       console.error("Redis init error", err);
       return null;
    }
  }
  return null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await getRedisClient();
    if (!client) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const method = req.method;
    const { action } = req.query; // e.g. action=create, action=join, action=leave, action=settings, action=message, action=event
    
    // Auth & Identity
    // Instead of complex auth, users pass their secretCode in req.body or headers
    const secretCode = req.body?.secretCode || req.headers['x-secret-code'] || req.query?.secretCode;
    if (!secretCode && method !== 'GET') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Hash the secretCode to get a public userId
    let userId = "";
    if (secretCode) {
      userId = crypto.createHash('sha256').update(secretCode as string).digest('hex').substring(0, 16);
    }
    const userName = req.body?.userName || req.query?.userName || 'Scholar';
    const userAvatar = req.body?.userAvatar || req.query?.userAvatar || '';
    const userBio = req.body?.userBio || req.query?.userBio || '';
    const userTitle = req.body?.userTitle || req.query?.userTitle || '';
    const userLevelRaw = req.body?.userLevel !== undefined ? req.body.userLevel : req.query?.userLevel;
    const userLevel = userLevelRaw !== undefined ? parseInt(userLevelRaw as string) : 1;

    // GET: List all teams (Lobby)
    if (method === 'GET' && !req.query.id) {
       const keys = await client.keys('scholar_team:*');
       const teams = [];
       for (const key of keys) {
         if (key.includes(':')) continue; // Skip things like scholar_team:123:messages
         const teamData = await client.hGetAll(key);
         if (teamData && teamData.id) {
            // Only send basic info, not full members list
            teams.push({
               id: teamData.id,


               name: teamData.name,
               description: teamData.description,
               createdAt: parseInt(teamData.createdAt),

               memberCount: parseInt(teamData.memberCount || '0')
            });
         }
       }
       return res.json({ teams });
    }

    // GET: Team Details
    if (method === 'GET' && req.query.id) {
       const teamId = req.query.id as string;
       const teamData = await client.hGetAll(`scholar_team:${teamId}`);
       if (!teamData || !teamData.id) return res.status(404).json({ error: 'Team not found' });
       
       let membersData = await client.hGetAll(`scholar_team:${teamId}:members`);
       let members = Object.values(membersData).map((m: any) => JSON.parse(m));
       
       const proposalData = await client.get(`scholar_team:${teamId}:proposal`);
       const currentProposal = proposalData ? JSON.parse(proposalData) : undefined;

       // Also get latest 50 messages and events
       const rawMessages = await client.lRange(`scholar_team:${teamId}:messages`, 0, 50);
       const messages = rawMessages.map((m: any) => JSON.parse(m));
       
       const rawEvents = await client.lRange(`scholar_team:${teamId}:events`, 0, 50);
       const events = rawEvents.map((m: any) => JSON.parse(m));

       const config = {
          permission: teamData.config_permission || 'captain_only',
          joinRule: teamData.config_joinRule || 'direct',
          targetType: teamData.config_targetType,
          targetValue: parseInt(teamData.config_targetValue || '0'),
          rewardType: teamData.config_rewardType,
          rewardContent: teamData.config_rewardContent
       };

       let applicantsData = await client.hGetAll(`scholar_team:${teamId}:applicants`) || {};
       let applicants = Object.values(applicantsData).map((m: any) => JSON.parse(m));

       // Sync member profile on GET
       if (userId && membersData[userId]) {
          const existingMember = JSON.parse(membersData[userId]);
          let changed = false;
          if (userName && existingMember.name !== userName) { existingMember.name = userName; changed = true; }
          if (userAvatar && existingMember.avatar !== userAvatar) { existingMember.avatar = userAvatar; changed = true; }
          if (userBio && existingMember.bio !== userBio) { existingMember.bio = userBio; changed = true; }
          if (userTitle && existingMember.title !== userTitle) { existingMember.title = userTitle; changed = true; }
          if (userLevel && existingMember.level !== userLevel) { existingMember.level = userLevel; changed = true; }
          if (changed) {
             await client.hSet(`scholar_team:${teamId}:members`, userId, JSON.stringify(existingMember));
             membersData = await client.hGetAll(`scholar_team:${teamId}:members`) || {};
             members = Object.values(membersData).map((m: any) => JSON.parse(m));
          }
       }

       // Sync applicant profile on GET
       if (userId && applicantsData[userId]) {
          const existingApp = JSON.parse(applicantsData[userId]);
          let changed = false;
          if (userName && existingApp.name !== userName) { existingApp.name = userName; changed = true; }
          if (userAvatar && existingApp.avatar !== userAvatar) { existingApp.avatar = userAvatar; changed = true; }
          if (userBio && existingApp.bio !== userBio) { existingApp.bio = userBio; changed = true; }
          if (userTitle && existingApp.title !== userTitle) { existingApp.title = userTitle; changed = true; }
          if (userLevel && existingApp.level !== userLevel) { existingApp.level = userLevel; changed = true; }
          if (changed) {
             await client.hSet(`scholar_team:${teamId}:applicants`, userId, JSON.stringify(existingApp));
             applicantsData = await client.hGetAll(`scholar_team:${teamId}:applicants`) || {};
             applicants = Object.values(applicantsData).map((m: any) => JSON.parse(m));
          }
       }
        const isMember = userId ? members.some((m: any) => m.userId === userId) : false;
        const isPending = userId ? applicants.some((r: any) => r.userId === userId) : false;

       return res.json({
          team: {
             id: teamData.id,
             name: teamData.name,
             description: teamData.description,
             createdAt: parseInt(teamData.createdAt),
             config,
             members,
             applicants, isMember, isPending,
             currentProposal
          },
          messages,
          events
       });
    }

    // POST: Create a team
    if (method === 'POST' && action === 'create') {
       const { name, description, config } = req.body;
       if (!name) return res.status(400).json({ error: 'Name required' });
       
       const teamId = crypto.randomUUID();
       const now = Date.now();
       
       await client.hSet(`scholar_team:${teamId}`, {
          id: teamId,
          name,
          description: description || '',
          createdAt: now.toString(),
          memberCount: '1',
          config_permission: config?.permission || 'captain_only',
          config_joinRule: config?.joinRule || 'direct',
          config_targetType: config?.targetType || 'total_time',
          config_targetValue: (config?.targetValue || 0).toString(),
          config_rewardType: config?.rewardType || 'text',
          config_rewardContent: config?.rewardContent || ''
       });
       
       const captain: any = {
          userId,
          name: userName,
          avatar: userAvatar,
          title: userTitle,
          bio: userBio,
          level: userLevel,
          joinedAt: now,
          totalFocusTime: 0,
          isCaptain: true
       };
       
       await client.hSet(`scholar_team:${teamId}:members`, userId, JSON.stringify(captain));
       
       return res.json({ success: true, teamId });
    }

    // POST: Join a team
    if (method === 'POST' && action === 'join') {
       const { teamId } = req.body;
       const exists = await client.hExists(`scholar_team:${teamId}`, 'id');
       if (!exists) return res.status(404).json({ error: 'Team not found' });
       
       const isMember = await client.hExists(`scholar_team:${teamId}:members`, userId);
       if (isMember) return res.json({ success: true, teamId });

       const teamData = await client.hGetAll(`scholar_team:${teamId}`);
       const joinRule = teamData.config_joinRule || 'direct';

       if (joinRule === 'approval') {
          const applicant = {
             userId,
             name: userName,
             avatar: userAvatar,
             title: userTitle,
             bio: userBio,
             level: userLevel,
             appliedAt: Date.now()
          };
          await client.hSet(`scholar_team:${teamId}:applicants`, userId, JSON.stringify(applicant));
          
          const event = {
             id: crypto.randomUUID(),
             type: 'applicant_request',
             content: `${userName} sent a request to join the guild.`,
             timestamp: Date.now()
          };
          await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify(event));

          return res.json({ success: true, pendingApproval: true });
       }
       
       const member = {
          userId,
          name: userName,
          avatar: userAvatar,
          title: userTitle,
          bio: userBio,
          level: userLevel,
          joinedAt: Date.now(),
          totalFocusTime: 0,
          isCaptain: false
       };
       
       await client.hSet(`scholar_team:${teamId}:members`, userId, JSON.stringify(member));
       await client.hIncrBy(`scholar_team:${teamId}`, 'memberCount', 1);
       
       // Log event
       const event = {
          id: crypto.randomUUID(),
          type: 'join',
          content: `${userName} joined the team!`,
          timestamp: Date.now()
       };
       await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify(event));
       
       return res.json({ success: true, teamId });
    }

    // POST: Send message
    if (method === 'POST' && action === 'message') {
       const { teamId, content } = req.body;
       if (!content) return res.status(400).json({ error: 'Message empty' });
       
       const msg = {
          id: crypto.randomUUID(),
          userId,
          name: userName,
          avatar: userAvatar,
          content,
          timestamp: Date.now()
       };
       
       await client.lPush(`scholar_team:${teamId}:messages`, JSON.stringify(msg));
       await client.lTrim(`scholar_team:${teamId}:messages`, 0, 99); // max 100
       
       return res.json({ success: true, message: msg });
    }

    // POST: Log Event / Progress
    if (method === 'POST' && action === 'event') {
       const { teamId, type, content, duration } = req.body;
       
       // if duration is passed, increment member's totalFocusTime
       if (duration) {
          const memberStr = await client.hGet(`scholar_team:${teamId}:members`, userId);
          if (memberStr) {
             const m = JSON.parse(memberStr);
             m.totalFocusTime += duration;
             await client.hSet(`scholar_team:${teamId}:members`, userId, JSON.stringify(m));
          }
       }
       
       const evt = {
          id: crypto.randomUUID(),
          type: type || 'focus',
          content: content || `${userName} completed a session.`,
          timestamp: Date.now()
       };
       
       await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify(evt));
       await client.lTrim(`scholar_team:${teamId}:events`, 0, 99);
       
       return res.json({ success: true });
    }

    // POST: Update Settings
    if (method === 'POST' && action === 'settings') {
       const { teamId, targetType, targetValue, rewardType, rewardContent, permission, joinRule } = req.body;
       const teamData = await client.hGetAll(`scholar_team:${teamId}`);
       if (!teamData || !teamData.id) return res.status(404).json({ error: 'Not found' });
       
       const memberStr = await client.hGet(`scholar_team:${teamId}:members`, userId);
       if (!memberStr) return res.status(403).json({ error: 'Not a member' });
       const reqMember = JSON.parse(memberStr);

       if (reqMember.isCaptain) {
          const adminUpdates: Record<string, string> = {};
          if (permission) adminUpdates.config_permission = permission;
          if (joinRule) adminUpdates.config_joinRule = joinRule;
          if (Object.keys(adminUpdates).length > 0) {
             await client.hSet(`scholar_team:${teamId}`, adminUpdates);
             if (permission) teamData.config_permission = permission;
             if (joinRule) teamData.config_joinRule = joinRule;
          }
       }
       
       const isCaptainOnly = teamData.config_permission === 'captain_only';
       
       if (isCaptainOnly && !reqMember.isCaptain) {
          return res.status(403).json({ error: 'Only captain can modify goals' });
       }
       
       if (isCaptainOnly) {
          // Change immediately
          await client.hSet(`scholar_team:${teamId}`, {
             config_targetType: targetType,
             config_targetValue: targetValue.toString(),
             config_rewardType: rewardType,
             config_rewardContent: rewardContent
          });
          
          const evt = {
             id: crypto.randomUUID(),
             type: 'target_change',
             content: `${userName} updated the team goal!`,
             timestamp: Date.now()
          };
          await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify(evt));
          return res.json({ success: true });
       } else {
          // Unanimous - create proposal
          const allMembers = await client.hGetAll(`scholar_team:${teamId}:members`);
          const memberIds = Object.keys(allMembers);
          
          const proposal = {
             id: crypto.randomUUID(),
             proposerId: userId,
             targetType,
             targetValue,
             rewardType,
             rewardContent,
             votes: { [userId]: true },
             status: memberIds.length === 1 ? 'approved' : 'pending',
             expiresAt: Date.now() + 86400000 // 24h
          };
          
          if (proposal.status === 'approved') {
             await client.hSet(`scholar_team:${teamId}`, {
               config_targetType: targetType,
               config_targetValue: targetValue.toString(),
               config_rewardType: rewardType,
               config_rewardContent: rewardContent
             });
             await client.del(`scholar_team:${teamId}:proposal`);
          } else {
             await client.set(`scholar_team:${teamId}:proposal`, JSON.stringify(proposal));
          }
          return res.json({ success: true, proposal });
       }
    }

    // POST: Vote
    if (method === 'POST' && action === 'vote') {
       const { teamId, accept } = req.body;
       const propStr = await client.get(`scholar_team:${teamId}:proposal`);
       if (!propStr) return res.status(404).json({ error: 'No proposal' });
       
       const proposal = JSON.parse(propStr);
       proposal.votes[userId] = !!accept;
       
       if (!accept) {
          proposal.status = 'rejected';
          await client.set(`scholar_team:${teamId}:proposal`, JSON.stringify(proposal));
          return res.json({ success: true, proposal });
       }
       
       // check if all members voted true
       const allMembers = await client.hGetAll(`scholar_team:${teamId}:members`);
       const memberIds = Object.keys(allMembers);
       
       const allAccepted = memberIds.every(id => proposal.votes[id]);
       if (allAccepted) {
          proposal.status = 'approved';
          await client.hSet(`scholar_team:${teamId}`, {
             config_targetType: proposal.targetType,
             config_targetValue: proposal.targetValue.toString(),
             config_rewardType: proposal.rewardType,
             config_rewardContent: proposal.rewardContent
          });
          
          const evt = {
             id: crypto.randomUUID(),
             type: 'target_change',
             content: `Team unanimously updated the goal!`,
             timestamp: Date.now()
          };
          await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify(evt));
          await client.del(`scholar_team:${teamId}:proposal`);
       } else {
          await client.set(`scholar_team:${teamId}:proposal`, JSON.stringify(proposal));
       }
       return res.json({ success: true, proposal });
    }

    // POST: Approve or reject applicant
    if (method === 'POST' && action === 'handle_applicant') {
       const { teamId, applicantId, accept } = req.body;
       const memberStr = await client.hGet(`scholar_team:${teamId}:members`, userId);
       if (!memberStr) return res.status(403).json({ error: 'Not a member' });
       const reqMember = JSON.parse(memberStr);
       if (!reqMember.isCaptain) return res.status(403).json({ error: 'Only captain can manage applicants' });

       const applicantStr = await client.hGet(`scholar_team:${teamId}:applicants`, applicantId);
       if (!applicantStr) return res.status(404).json({ error: 'Applicant request not found' });

       await client.hDel(`scholar_team:${teamId}:applicants`, applicantId);

       if (accept) {
          const applicant = JSON.parse(applicantStr);
          const member = {
             userId: applicant.userId,
             name: applicant.name,
             avatar: applicant.avatar,
             title: applicant.title,
             bio: applicant.bio,
             level: applicant.level,
             joinedAt: Date.now(),
             totalFocusTime: 0,
             isCaptain: false
          };
          await client.hSet(`scholar_team:${teamId}:members`, applicantId, JSON.stringify(member));
          await client.hIncrBy(`scholar_team:${teamId}`, 'memberCount', 1);

          const event = {
             id: crypto.randomUUID(),
             type: 'join',
             content: `${applicant.name} was approved and joined the team!`,
             timestamp: Date.now()
          };
          await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify(event));
       } else {
          const applicant = JSON.parse(applicantStr);
          const event = {
             id: crypto.randomUUID(),
             type: 'application_declined',
             content: `Application request from ${applicant.name} was declined.`,
             timestamp: Date.now()
          };
          await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify(event));
       }

       return res.json({ success: true });
    }

    // POST: Vote
    if (method === 'POST' && action === 'leave') {
       const { teamId } = req.body;
       const memberStr = await client.hGet(`scholar_team:${teamId}:members`, userId);
       if (!memberStr) return res.status(403).json({ error: 'Not member' });
       const member = JSON.parse(memberStr);
       
       await client.hDel(`scholar_team:${teamId}:members`, userId);
       
       const remainingKeys = await client.hKeys(`scholar_team:${teamId}:members`);
       if (remainingKeys.length === 0) {
          // Disband completely
          await client.del(`scholar_team:${teamId}`);
          await client.del(`scholar_team:${teamId}:members`);
          await client.del(`scholar_team:${teamId}:messages`);
          await client.del(`scholar_team:${teamId}:events`);
          await client.del(`scholar_team:${teamId}:proposal`);
       } else {
          if (member.isCaptain) {
            // Assign new captain based on joined time
            const members = await Promise.all(remainingKeys.map(k => client.hGet(`scholar_team:${teamId}:members`, k)));
            const parsedMembers = members.map(m => m ? JSON.parse(m) : null).filter(Boolean).sort((a,b) => a.joinedAt - b.joinedAt);
            if (parsedMembers.length > 0) {
               const newCap = parsedMembers[0];
               newCap.isCaptain = true;
               await client.hSet(`scholar_team:${teamId}:members`, newCap.userId, JSON.stringify(newCap));
            }
          }
          await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify({
             id: crypto.randomUUID(), type: 'leave', content: `${userName} left the guild.`, timestamp: Date.now()
          }));
       }
       return res.json({ success: true });
    }

    return res.status(404).json({ error: "Not found" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
