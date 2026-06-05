import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = req.query.code as string;
  const stateParam = req.query.state as string;

  let origin = '';
  try {
    if (stateParam) {
      const decoded = JSON.parse(Buffer.from(stateParam, 'base64').toString('utf-8'));
      origin = decoded.origin;
    }
  } catch (e) {
    console.error("Failed to decode state:", e);
  }

  if (!origin) {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    origin = `${protocol}://${host}`;
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  if (!code) {
    return res.status(400).send('<html><body><p>Authentication failed: No code provided.</p></body></html>');
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.OAUTH_CLIENT_ID || '',
        client_secret: process.env.OAUTH_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }).toString()
    });

    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || tokens.error || 'Failed to exchange token');
    }

    res.status(200).send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_OAUTH_SUCCESS', tokens: JSON.parse('${JSON.stringify(tokens)}') }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error("OAuth error:", error);
    res.status(500).send(`<html><body><p>Authentication failed: ${error.message}</p></body></html>`);
  }
}
