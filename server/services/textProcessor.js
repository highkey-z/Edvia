const OpenAI = require('openai');

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
 * Process text using OpenAI API
 */
async function processText(openai, text, readingLevel = 'middle-school', includeSummary = true, vocabularyOnly = false) {
  const config = readingLevelConfigs[readingLevel];
  
  if (!config) {
    throw new Error(`Invalid reading level: ${readingLevel}`);
  }

  try {
    // Prepare the prompt based on what we need
    let systemPrompt, userPrompt;
    
    if (vocabularyOnly) {
      systemPrompt = `You are an educational assistant that extracts and explains difficult vocabulary from text. 
      Provide clear, simple definitions that a ${config.grade} student would understand.`;
      
      userPrompt = `Extract the most important vocabulary words from this text and provide simple definitions:

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
      systemPrompt = `You are an educational assistant that helps students understand complex text. 
      Your task is to simplify text to a ${config.grade} reading level (${config.description}).
      
      Guidelines:
      - Use simple, clear language appropriate for ${config.grade} students
      - Break down complex sentences into shorter ones (max ${config.maxSentenceLength} words)
      - Replace difficult words with simpler alternatives
      - Maintain the original meaning and key concepts
      - Use active voice when possible
      - Provide clear explanations for important concepts`;
      
      userPrompt = `Please simplify this text for ${config.grade} students and extract key vocabulary:

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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: vocabularyOnly ? 1000 : 2000,
    });

    const responseText = completion.choices[0].message.content;
    
    try {
      const result = JSON.parse(responseText);
      
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
      console.error('Failed to parse OpenAI response:', parseError);
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
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Generate text-to-speech compatible text
 */
function prepareForTTS(text) {
  return text
    .replace(/[^\w\s.,!?;:'"-]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

module.exports = {
  processText,
  prepareForTTS,
  readingLevelConfigs
};



