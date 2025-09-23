export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { text } = req.body;
  
    // Example simplification logic
    const simplifiedText = text.toLowerCase(); // replace with your real logic
  
    return res.status(200).json({ simplifiedText });
  }
  