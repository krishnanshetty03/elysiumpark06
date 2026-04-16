export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Vercel's body parser should handle this, but let's be safe
    let body = req.body;
    
    // In some cases (like older runtimes), we might need to handle the body ourselves
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) {}
    }

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Request body is empty. Ensure you are sending JSON with Content-Type: application/json.' 
      });
    }

    // Ensure the access key is present from Vercel Environment Variables
    if (!process.env.WEB3FORMS_ACCESS_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'WEB3FORMS_ACCESS_KEY is not configured in Vercel Environment Variables.' 
      });
    }

    body.access_key = process.env.WEB3FORMS_ACCESS_KEY;
    
    // Check if fetch is available (Node 18+)
    if (typeof fetch === 'undefined') {
        throw new Error("The 'fetch' function is not available on this Node.js runtime. Please ensure your Vercel project is set to Node.js 18 or 20.");
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return res.status(response.status).json(data);
    } else {
        const text = await response.text();
        console.error('Web3Forms non-JSON response:', text);
        return res.status(response.status).json({
            success: false,
            message: `Web3Forms returned an unexpected response format. Status: ${response.status}`,
            error: text.substring(0, 200) // First 200 chars of the HTML
        });
    }
  } catch (error) {
    console.error('Error submitting to Web3Forms:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal processing error.',
      error: error.message || error.toString() || 'Unknown server error',
      type: error.name || 'Error'
    });
  }
}
