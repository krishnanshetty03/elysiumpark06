export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = req.body;
    
    // Ensure the access key is present from Vercel Environment Variables
    if (!process.env.WEB3FORMS_ACCESS_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'WEB3FORMS_ACCESS_KEY is not configured in Vercel Environment Variables.' 
      });
    }

    body.access_key = process.env.WEB3FORMS_ACCESS_KEY;
    
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error submitting to Web3Forms:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.',
      error: error.message 
    });
  }
}
