import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  let origin = req.query.origin as string;
  
  if (!origin) {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    origin = `${protocol}://${host}`;
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const state = Buffer.from(JSON.stringify({ origin })).toString('base64');

  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/drive.appdata', // Google Drive appdata only
    access_type: 'offline', // For refresh token
    prompt: 'consent',
    state: state
  });
  
  res.status(200).json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
}
