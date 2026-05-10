import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, username, password, method, body } = req.body;

  if (!url || !username || !password || !method) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    
    // Check if the URL is valid
    new URL(url);

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Authorization': authHeader,
      },
    };

    if (body && ['POST', 'PUT'].includes(method)) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
      };
    }

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      if (response.status === 404 && method === 'GET') {
          return res.status(200).json({ data: null, is404: true });
      }
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText || `WebDAV server returned ${response.status}` });
    }

    if (method === 'GET') {
      const data = await response.json();
      return res.status(200).json({ data });
    }

    return res.status(200).json({ success: true });
    
  } catch (error: any) {
    console.error("WebDAV Proxy Error:", error);
    return res.status(500).json({ error: error.message || 'Unknown proxy error' });
  }
}
