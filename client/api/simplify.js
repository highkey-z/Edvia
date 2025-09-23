export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, readingLevel = 'middle-school', includeSummary = false } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Use Hugging Face Inference API (free, no API key needed for basic usage)
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Simplify this text for ${readingLevel} reading level: "${text}"`,
        parameters: {
          max_length: 200,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract simplified text from response
    let simplifiedText = text; // fallback
    if (data && data.length > 0 && data[0].generated_text) {
      simplifiedText = data[0].generated_text.replace(`Simplify this text for ${readingLevel} reading level: "${text}"`, '').trim();
    }

    // Simple vocabulary extraction (you can enhance this)
    const words = text.split(/\s+/).filter(word => word.length > 6);
    const vocabulary = words.slice(0, 5).map(word => ({
      word: word.replace(/[^\w]/g, ''),
      definition: `Definition for ${word}`,
      example: `Example sentence with ${word}`,
      difficulty: 'intermediate'
    }));

    res.json({
      simplifiedText: simplifiedText || text,
      vocabulary: vocabulary
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Fallback response if API fails
    const words = req.body.text.split(/\s+/).filter(word => word.length > 6);
    const vocabulary = words.slice(0, 5).map(word => ({
      word: word.replace(/[^\w]/g, ''),
      definition: `Definition for ${word}`,
      example: `Example sentence with ${word}`,
      difficulty: 'intermediate'
    }));

    res.json({
      simplifiedText: req.body.text,
      vocabulary: vocabulary
    });
  }
}