const express = require('express');
const router = express.Router();
const { processTextWithGemini } = require('../services/geminiProcessor');

// Validate API key
if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
  console.warn('⚠️  No AI API key found. Please set GEMINI_API_KEY or OPENAI_API_KEY in your .env file');
  console.log('💡 Get a free Gemini API key at: https://makersuite.google.com/app/apikey');
}

// POST /api/text/process - Main text processing endpoint
router.post('/process', async (req, res) => {
  try {
    const { text, readingLevel, includeSummary } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Text is required and must be a string' 
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({ 
        error: 'Text is too long. Maximum 10,000 characters allowed.' 
      });
    }

    const validReadingLevels = ['grade3', 'middle-school', 'high-school', 'college'];
    const level = readingLevel && validReadingLevels.includes(readingLevel) 
      ? readingLevel 
      : 'middle-school';

    // Process the text using Gemini
    const result = await processTextWithGemini(text, level, includeSummary);

    res.json(result);
  } catch (error) {
    console.error('Text processing error:', error);
    
    // Handle Gemini quota exceeded with friendly message
    if (error.message && (error.message.includes('quota') || error.message.includes('rate') || error.message.includes('429') || error.message.includes('403'))) {
      return res.status(503).json({ 
        error: 'Sorry, Gemini is in free tier at the moment so simplifications are limited. Stay tuned for when an advanced tier is implemented!',
        simplifiedText: text, // Return original text as fallback
        vocabulary: []
      });
    }
    
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
      error: 'Failed to process text',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/text/vocabulary - Extract vocabulary only
router.post('/vocabulary', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Text is required and must be a string' 
      });
    }

    const result = await processTextWithGemini(text, 'middle-school', false, true);
    
    res.json({
      vocabulary: result.vocabulary
    });
  } catch (error) {
    console.error('Vocabulary extraction error:', error);
    res.status(500).json({ 
      error: 'Failed to extract vocabulary',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;


