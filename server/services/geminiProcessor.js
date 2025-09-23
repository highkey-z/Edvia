const { GoogleGenerativeAI } = require('@google/generative-ai');

// Reading level configurations
const readingLevelConfigs = {
  'grade3': {
    grade: '3rd grade',
    description: 'Simple sentences, common words',
    maxSentenceLength: 15,
    vocabularyLevel: 'basic'
  },
  'middle-school': {
    grade: '6th-8th grade',
    description: 'Clear explanations, moderate complexity',
    maxSentenceLength: 25,
    vocabularyLevel: 'intermediate'
  },
  'high-school': {
    grade: '9th-12th grade',
    description: 'More sophisticated language, complex concepts',
    maxSentenceLength: 35,
    vocabularyLevel: 'advanced'
  },
  'college': {
    grade: 'College level',
    description: 'Academic language, specialized terms',
    maxSentenceLength: 50,
    vocabularyLevel: 'expert'
  }
};

/**
 * Process text using Google Gemini API
 */
async function processTextWithGemini(text, readingLevel = 'middle-school', includeSummary = true, vocabularyOnly = false) {
  const config = readingLevelConfigs[readingLevel];
  
  if (!config) {
    throw new Error(`Invalid reading level: ${readingLevel}`);
  }

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt based on what we need
    let prompt;
    
    if (vocabularyOnly) {
      prompt = `You are an educational assistant that extracts and explains difficult vocabulary from text. 
      Provide clear, simple definitions that a ${config.grade} student would understand.

Extract the most important vocabulary words from this text and provide simple definitions:

"${text}"

Please return a JSON object with this structure:
{
  "vocabulary": [
    {
      "word": "word",
      "definition": "simple definition",
      "example": "example sentence using the word",
      "difficulty": "basic|intermediate|advanced"
    }
  ]
}`;
    } else {
      prompt = `You are an educational assistant that helps students understand complex text. 
      Your task is to simplify text to a ${config.grade} reading level (${config.description}).
      
      Guidelines:
      - Use simple, clear language appropriate for ${config.grade} students
      - Break down complex sentences into shorter ones (max ${config.maxSentenceLength} words)
      - Replace difficult words with simpler alternatives
      - Maintain the original meaning and key concepts
      - Use active voice when possible
      - Provide clear explanations for important concepts

Please simplify this text for ${config.grade} students and extract key vocabulary:

"${text}"

Return a JSON object with this structure:
{
  "simplifiedText": "simplified version of the text",
  "vocabulary": [
    {
      "word": "difficult word",
      "definition": "simple definition",
      "example": "example sentence",
      "difficulty": "basic|intermediate|advanced"
    }
  ]${includeSummary ? ',\n  "summary": "brief 2-3 sentence summary of the main points"' : ''}
}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    try {
      // Clean the response text (remove markdown formatting if present)
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const result = JSON.parse(cleanedResponse);
      
      // Validate the response structure
      if (!result.vocabulary || !Array.isArray(result.vocabulary)) {
        throw new Error('Invalid response format: missing vocabulary array');
      }
      
      if (!vocabularyOnly && !result.simplifiedText) {
        throw new Error('Invalid response format: missing simplified text');
      }
      
      // Clean up and validate vocabulary entries
      result.vocabulary = result.vocabulary.map(item => ({
        word: item.word || '',
        definition: item.definition || '',
        example: item.example || '',
        difficulty: ['basic', 'intermediate', 'advanced'].includes(item.difficulty) 
          ? item.difficulty 
          : 'intermediate'
      })).filter(item => item.word && item.definition);

      return result;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', responseText);
      
      // Fallback response if JSON parsing fails
      return {
        simplifiedText: vocabularyOnly ? '' : text,
        vocabulary: [],
        summary: includeSummary ? 'Unable to generate summary due to processing error.' : undefined,
        error: 'Response parsing failed'
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API key. Please check your configuration.');
    }
    
    if (error.message?.includes('QUOTA_EXCEEDED')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    }

    throw error;
  }
}

/**
 * Translate text using Gemini
 */
async function translateTextWithGemini(text, targetLanguage, readingLevel = 'middle-school') {
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

  const languageName = supportedLanguages[targetLanguage];
  if (!languageName) {
    throw new Error(`Unsupported language: ${targetLanguage}`);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a professional translator and educational assistant. 
    Your task is to translate text to ${languageName} while maintaining the appropriate reading level (${readingLevel}).
    
    Guidelines:
    - Provide accurate translation to ${languageName}
    - Maintain the same reading level complexity as the original
    - Keep the meaning and context intact
    - Use natural, fluent language in ${languageName}
    - If there are cultural references, adapt them appropriately for ${languageName} speakers

Please translate this text to ${languageName} while maintaining ${readingLevel} reading level:

"${text}"

Return a JSON object with this structure:
{
  "originalText": "original text",
  "translatedText": "translated text in ${languageName}",
  "targetLanguage": "${targetLanguage}",
  "languageName": "${languageName}",
  "readingLevel": "${readingLevel}"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    try {
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const result = JSON.parse(cleanedResponse);
      
      if (!result.translatedText) {
        throw new Error('Invalid response format: missing translated text');
      }
      
      // Add metadata
      result.originalLanguage = 'english';
      result.characterCount = result.translatedText.length;
      result.wordCount = result.translatedText.split(' ').length;

      return result;
    } catch (parseError) {
      console.error('Failed to parse Gemini translation response:', parseError);
      throw new Error('Translation parsing failed');
    }
  } catch (error) {
    console.error('Gemini translation error:', error);
    throw error;
  }
}

module.exports = {
  processTextWithGemini,
  translateTextWithGemini,
  readingLevelConfigs
};
