import { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  validateWebDavUrl, 
  validateWebDavMethod, 
  validateWebDavBodySize, 
  resolveAndValidateHostname 
} from '../shared/webdavSecurity';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const rawBody = req.body;
    let payload;
    try {
      payload = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : (rawBody || {});
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { url, username, password, method, body } = payload;

    if (!url || !username || !password || !method) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (typeof method !== 'string') {
      return res.status(400).json({ error: 'Method must be a string' });
    }

    const validatedMethod = validateWebDavMethod(method);
    if (typeof validatedMethod === 'object' && validatedMethod.error) {
      return res.status(405).json({ error: validatedMethod.error });
    }

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    
    // Check if the URL is valid and secure
    const validatedUrl = validateWebDavUrl(url);
    if ('error' in validatedUrl) {
      // Return 400 or 403 depending on the error message to keep similar behavior
      const isForbidden = validatedUrl.error.includes('forbidden');
      return res.status(isForbidden ? 403 : 400).json({ error: validatedUrl.error });
    }
    
    const parsedUrl = validatedUrl as URL;

    const resolveResult = await resolveAndValidateHostname(parsedUrl.hostname);
    if (resolveResult?.error) {
      const isForbidden = resolveResult.error.includes('forbidden');
      return res.status(isForbidden ? 403 : 400).json({ error: resolveResult.error });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const fetchOptions: RequestInit = {
      method: validatedMethod as string,
      headers: {
        'Authorization': authHeader,
      },
      signal: controller.signal,
    };

    if (body && ['PUT'].includes(validatedMethod as string)) {
      const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
      const sizeValidation = validateWebDavBodySize(validatedMethod as string, bodyString);
      if (sizeValidation?.error) {
        clearTimeout(timeoutId);
        return res.status(413).json({ error: sizeValidation.error });
      }
      fetchOptions.body = bodyString;
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/octet-stream',
      };
    } else if (body && ['PROPFIND'].includes(validatedMethod as string)) {
       const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
       const sizeValidation = validateWebDavBodySize(validatedMethod as string, bodyString);
       if (sizeValidation?.error) {
         clearTimeout(timeoutId);
         return res.status(413).json({ error: sizeValidation.error });
       }
       fetchOptions.body = bodyString;
       fetchOptions.headers = {
         ...fetchOptions.headers,
         'Content-Type': 'application/xml',
       };
    }

    const response = await fetch(parsedUrl.toString(), fetchOptions);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404 && method.toUpperCase() === 'GET') {
          return res.status(200).json({ data: null, is404: true });
      }
      // Do not forward upstream error text directly for security
      return res.status(response.status < 500 ? response.status : 502).json({ error: `WebDAV server returned status ${response.status}` });
    }

    if (method.toUpperCase() === 'GET') {
      const text = await response.text();
      if (!text.trim()) return res.status(200).json({ data: null });
      try {
        return res.status(200).json({ data: JSON.parse(text) });
      } catch {
        return res.status(502).json({ error: 'WebDAV save file is not valid JSON' });
      }
    }

    return res.status(200).json({ success: true });
    
  } catch (error: any) {
    console.error("WebDAV Proxy Error");
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'WebDAV proxy request timed out' });
    }
    return res.status(500).json({ error: 'An error occurred while connecting to the WebDAV server' });
  }
}

