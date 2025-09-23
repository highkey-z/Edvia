const express = require('express');
const router = express.Router();
const { translateTextWithGemini } = require('../services/geminiProcessor');

// Supported languages
const supportedLanguages = {
  'spanish': 'Spanish',
  'french': 'French',
  'german': 'German',
  'italian': 'Italian',
  'portuguese': 'Portuguese',
  'chinese': 'Chinese (Simplified)',
  'japanese': 'Japanese',
  'korean': 'Korean',
  'arabic': 'Arabic',
  'hindi': 'Hindi',
  'russian': 'Russian',
  'dutch': 'Dutch',
  'swedish': 'Swedish',
  'norwegian': 'Norwegian',
  'danish': 'Danish'
};

// GET /api/translation/languages - Get supported languages
router.get('/languages', (req, res) => {
  res.json({
    languages: supportedLanguages
  });
});

// POST /api/translation/translate - Translate text
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage, readingLevel = 'middle-school' } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Text is required and must be a string' 
      });
    }

    if (!targetLanguage || !supportedLanguages[targetLanguage]) {
      return res.status(400).json({ 
        error: `Unsupported language. Supported languages: ${Object.keys(supportedLanguages).join(', ')}` 
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({ 
        error: 'Text is too long for translation. Maximum 5,000 characters allowed.' 
      });
    }

    // Use Gemini for translation
    const result = await translateTextWithGemini(text, targetLanguage, readingLevel);
    
    res.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({ 
        error: 'API quota exceeded. Please check your OpenAI account.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenAI configuration.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to translate text',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;


