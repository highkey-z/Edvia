const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Simplify this text for ${readingLevel} reading level. Return ONLY a JSON object with this exact structure:
{
  "simplifiedText": "simplified version here",
  "vocabulary": [
    {
      "word": "difficult word",
      "definition": "simple definition",
      "example": "example sentence",
      "difficulty": "basic|intermediate|advanced"
    }
  ]
}

Text to simplify: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    // Parse the JSON response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);

    res.json(parsedResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process text',
      message: error.message 
    });
  }
}