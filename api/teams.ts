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
    
    const decodeHeader = (val: any) => {
      if (!val) return "";
      try {
        return decodeURIComponent(Array.isArray(val) ? val[0] : val);
      } catch (e) {
        return Array.isArray(val) ? val[0] : val;
      }
    };

    const userName = req.body?.userName || decodeHeader(req.headers['x-user-name']) || req.query?.userName || 'Scholar';
    const userUniqueId = req.body?.userUniqueId || req.headers['x-user-unique-id'] || req.query?.userUniqueId || '';
    const userAvatar = req.body?.userAvatar || req.headers['x-user-avatar'] || req.query?.userAvatar || '';
    const userBio = req.body?.userBio || decodeHeader(req.headers['x-user-bio']) || req.query?.userBio || '';
    const userTitle = req.body?.userTitle || decodeHeader(req.headers['x-user-title']) || req.query?.userTitle || '';
    const userLevel = parseInt((req.body?.userLevel || req.headers['x-user-level'] || req.query?.userLevel || '1') as string, 10);

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
       
       const membersData = await client.hGetAll(`scholar_team:${teamId}:members`);
       if (userId && membersData[userId]) {
          try {
             const m = JSON.parse(membersData[userId]);
             let updated = false;
             if (userName && userName !== 'Scholar' && m.name !== userName) { m.name = userName; updated = true; }
             if (userAvatar && m.avatar !== userAvatar) { m.avatar = userAvatar; updated = true; }
             if (userBio && m.bio !== userBio) { m.bio = userBio; updated = true; }
             if (userTitle && m.title !== userTitle) { m.title = userTitle; updated = true; }
             if (userLevel && m.level !== userLevel) { m.level = userLevel; updated = true; }
             if (userUniqueId && m.uniqueId !== userUniqueId) { m.uniqueId = userUniqueId; updated = true; }
             m.lastActive = Date.now();
             updated = true;
             
             if (updated) {
                await client.hSet(`scholar_team:${teamId}:members`, userId, JSON.stringify(m));
                membersData[userId] = JSON.stringify(m);
             }
          } catch (e) {
             console.error("Failed to sync member info", e);
          }
       }
       const members = Object.values(membersData).map((m: any) => JSON.parse(m));
       
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

       const applicantsData = await client.hGetAll(`scholar_team:${teamId}:applicants`) || {};
       const applicants = Object.values(applicantsData).map((m: any) => JSON.parse(m));
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
             currentProposal,
             myUserId: userId
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
          uniqueId: userUniqueId,
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
             uniqueId: userUniqueId,
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
          uniqueId: userUniqueId,
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
       
       // safely handle duration parsing
       const timeVal = duration !== undefined ? Number(duration) : 0;
       
       if (timeVal > 0) {
          const memberStr = await client.hGet(`scholar_team:${teamId}:members`, userId);
          if (memberStr) {
             const m = JSON.parse(memberStr);
             m.totalFocusTime = (m.totalFocusTime || 0) + timeVal;
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
       const { teamId, name, description, targetType, targetValue, rewardType, rewardContent, permission, joinRule } = req.body;
       const teamData = await client.hGetAll(`scholar_team:${teamId}`);
       if (!teamData || !teamData.id) return res.status(404).json({ error: 'Not found' });
       
       const memberStr = await client.hGet(`scholar_team:${teamId}:members`, userId);
       if (!memberStr) return res.status(403).json({ error: 'Not a member' });
       const reqMember = JSON.parse(memberStr);

       if (reqMember.isCaptain) {
          const adminUpdates: Record<string, string> = {};
          if (name) adminUpdates.name = name;
          if (description !== undefined) adminUpdates.description = description;
          if (permission) adminUpdates.config_permission = permission;
          if (joinRule) adminUpdates.config_joinRule = joinRule;
          if (Object.keys(adminUpdates).length > 0) {
             await client.hSet(`scholar_team:${teamId}`, adminUpdates);
             if (permission) teamData.config_permission = permission;
             if (joinRule) teamData.config_joinRule = joinRule;
             if (name) teamData.name = name;
             if (description !== undefined) teamData.description = description;
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
             uniqueId: applicant.uniqueId || '',
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

    // POST: Leave or Disband
    if (method === 'POST' && action === 'leave') {
       const { teamId, disband } = req.body;
       const memberStr = await client.hGet(`scholar_team:${teamId}:members`, userId);
       if (!memberStr) return res.status(403).json({ error: 'Not member' });
       const member = JSON.parse(memberStr);
       
       if (member.isCaptain) {
          if (!disband) return res.status(400).json({ error: 'Captain cannot just leave. Please transfer leadership or disband the guild.' });
          
          // Disband completely
          await client.del(`scholar_team:${teamId}`);
          await client.del(`scholar_team:${teamId}:members`);
          await client.del(`scholar_team:${teamId}:messages`);
          await client.del(`scholar_team:${teamId}:events`);
          await client.del(`scholar_team:${teamId}:proposal`);
          return res.json({ success: true, disbanded: true });
       }
       
       await client.hDel(`scholar_team:${teamId}:members`, userId);
       
       // Clean up if it was the last non-captain member (though captain can't leave without disbanding, so this is just general cleanup)
       await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify({
          id: crypto.randomUUID(), type: 'leave', content: `${userName} left the guild.`, timestamp: Date.now()
       }));
       
       return res.json({ success: true });
    }

    // POST: Transfer Captain
    if (method === 'POST' && action === 'transfer') {
       const { teamId, targetMemberId } = req.body;
       const memberStr = await client.hGet(`scholar_team:${teamId}:members`, userId);
       if (!memberStr) return res.status(403).json({ error: 'Not member' });
       const member = JSON.parse(memberStr);
       if (!member.isCaptain) return res.status(403).json({ error: 'Only captain can transfer leadership' });
       
       const targetStr = await client.hGet(`scholar_team:${teamId}:members`, targetMemberId);
       if (!targetStr) return res.status(404).json({ error: 'Target not found' });
       const targetMember = JSON.parse(targetStr);
       
       member.isCaptain = false;
       targetMember.isCaptain = true;
       
       await client.hSet(`scholar_team:${teamId}:members`, userId, JSON.stringify(member));
       await client.hSet(`scholar_team:${teamId}:members`, targetMemberId, JSON.stringify(targetMember));
       
       await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify({
          id: crypto.randomUUID(), type: 'transfer', content: `${member.name} transferred guild leadership to ${targetMember.name}.`, timestamp: Date.now()
       }));
       
       return res.json({ success: true });
    }

    // POST: Kick Member
    if (method === 'POST' && action === 'kick') {
       const { teamId, targetMemberId } = req.body;
       const memberStr = await client.hGet(`scholar_team:${teamId}:members`, userId);
       if (!memberStr) return res.status(403).json({ error: 'Not member' });
       const member = JSON.parse(memberStr);
       if (!member.isCaptain) return res.status(403).json({ error: 'Only captain can banish members' });
       
       const targetStr = await client.hGet(`scholar_team:${teamId}:members`, targetMemberId);
       if (!targetStr) return res.status(404).json({ error: 'Target not found' });
       const targetMember = JSON.parse(targetStr);
       
       if (targetMember.isCaptain) return res.status(400).json({ error: 'Cannot banish the captain' });

       await client.hDel(`scholar_team:${teamId}:members`, targetMemberId);
       
       await client.lPush(`scholar_team:${teamId}:events`, JSON.stringify({
          id: crypto.randomUUID(), type: 'kick', content: `${member.name} banished ${targetMember.name} from the guild.`, timestamp: Date.now()
       }));
       
       return res.json({ success: true });
    }

    return res.status(404).json({ error: "Not found" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
