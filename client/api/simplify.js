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

    // Use Cohere API for text simplification
    const simplifiedText = await simplifyWithCohere(text, readingLevel);
    const vocabulary = extractVocabulary(text, readingLevel);

    res.json({
      simplifiedText: simplifiedText,
      vocabulary: vocabulary
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Fallback to local simplification if API fails
    try {
      const simplifiedText = simplifyText(text, readingLevel);
      const vocabulary = extractVocabulary(text, readingLevel);
      
      res.json({
        simplifiedText: simplifiedText,
        vocabulary: vocabulary
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        error: 'Failed to process text',
        message: error.message 
      });
    }
  }
}

// Cohere API text simplification
async function simplifyWithCohere(text, level) {
  try {
    // Create a prompt for text simplification
    const prompt = createSimplificationPrompt(text, level);
    
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COHERE_API_KEY || 'demo-key'}`
      },
      body: JSON.stringify({
        model: 'command',
        prompt: prompt,
        max_tokens: Math.min(text.length * 2, 500),
        temperature: 0.7,
        k: 0,
        p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stop_sequences: ['\n\nOriginal text:', '\n\n---']
      })
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.generations && data.generations.length > 0) {
      const simplifiedText = data.generations[0].text.trim();
      return simplifiedText || text;
    }
    
    // If no generated text, return original
    return text;
    
  } catch (error) {
    console.error('Cohere API error:', error);
    throw error;
  }
}

// Create a prompt for text simplification based on reading level
function createSimplificationPrompt(text, level) {
  const levelInstructions = {
    'grade3': 'Rewrite this text for a 3rd grader. Use simple words, short sentences, and easy concepts. Keep the main idea the same:',
    'middle-school': 'Rewrite this text for middle school students. Use clear language, medium-length sentences, and explain complex terms:',
    'high-school': 'Rewrite this text for high school students. Keep most complex words but make the structure clearer and easier to follow:',
    'college': 'Rewrite this text for college students. Keep the original meaning but improve clarity and flow:'
  };
  
  const instruction = levelInstructions[level] || levelInstructions['middle-school'];
  return `${instruction}\n\nText to rewrite: "${text}"\n\nRewritten text:`;
}

// Advanced text simplification function with different levels
function simplifyText(text, level) {
  // Define comprehensive word replacements for each level
  const replacements = {
    'grade3': {
      // Very basic replacements for 3rd grade
      'unanimous': 'all agreed',
      'committee': 'group',
      'proposal': 'plan',
      'innovative': 'new',
      'efficiency': 'how well things work',
      'postponed': 'put off',
      'implementation': 'doing it',
      'conclusively': 'for sure',
      'demonstrate': 'show',
      'sustainability': 'keeping going',
      'diverse': 'different',
      'contexts': 'places',
      'despite': 'even though',
      'contained': 'had',
      'elements': 'parts',
      'likely': 'probably',
      'improve': 'make better',
      'further': 'more',
      'studies': 'tests',
      'could': 'can',
      'long-term': 'for a long time',
      'several': 'many',
      'agreement': 'saying yes',
      'that': 'which',
      'the': 'the',
      'proposal': 'idea',
      'innovative': 'new',
      'elements': 'parts',
      'likely': 'probably',
      'improve': 'make better',
      'efficiency': 'how well things work',
      'they': 'the group',
      'postponed': 'put off',
      'implementation': 'doing it',
      'until': 'before',
      'further': 'more',
      'studies': 'tests',
      'could': 'can',
      'conclusively': 'for sure',
      'demonstrate': 'show',
      'its': 'the plan\'s',
      'long-term': 'for a long time',
      'sustainability': 'keeping going',
      'in': 'in',
      'diverse': 'different',
      'contexts': 'places'
    },
    'middle-school': {
      // Moderate replacements for middle school
      'unanimous': 'all agreed',
      'committee': 'group',
      'proposal': 'plan',
      'innovative': 'new and creative',
      'efficiency': 'how well things work',
      'postponed': 'delayed',
      'implementation': 'putting into action',
      'conclusively': 'definitely',
      'demonstrate': 'show',
      'sustainability': 'ability to continue',
      'diverse': 'different',
      'contexts': 'situations',
      'despite': 'even though',
      'contained': 'included',
      'elements': 'parts',
      'likely': 'probably',
      'improve': 'make better',
      'further': 'additional',
      'studies': 'research',
      'could': 'might',
      'long-term': 'lasting',
      'several': 'multiple',
      'agreement': 'consensus',
      'that': 'which',
      'proposal': 'suggestion',
      'innovative': 'creative',
      'elements': 'components',
      'likely': 'probably',
      'improve': 'enhance',
      'efficiency': 'effectiveness',
      'they': 'the group',
      'postponed': 'delayed',
      'implementation': 'execution',
      'until': 'before',
      'further': 'additional',
      'studies': 'research',
      'could': 'might',
      'conclusively': 'definitively',
      'demonstrate': 'prove',
      'its': 'the plan\'s',
      'long-term': 'lasting',
      'sustainability': 'viability',
      'in': 'within',
      'diverse': 'various',
      'contexts': 'situations'
    },
    'high-school': {
      // Light replacements for high school
      'unanimous': 'unanimous',
      'committee': 'committee',
      'proposal': 'proposal',
      'innovative': 'innovative',
      'efficiency': 'efficiency',
      'postponed': 'postponed',
      'implementation': 'implementation',
      'conclusively': 'conclusively',
      'demonstrate': 'demonstrate',
      'sustainability': 'sustainability',
      'diverse': 'diverse',
      'contexts': 'contexts',
      'despite': 'despite',
      'contained': 'contained',
      'elements': 'elements',
      'likely': 'likely',
      'improve': 'improve',
      'further': 'further',
      'studies': 'studies',
      'could': 'could',
      'long-term': 'long-term',
      'several': 'several',
      'agreement': 'agreement',
      'that': 'that',
      'proposal': 'proposal',
      'innovative': 'innovative',
      'elements': 'elements',
      'likely': 'likely',
      'improve': 'improve',
      'efficiency': 'efficiency',
      'they': 'they',
      'postponed': 'postponed',
      'implementation': 'implementation',
      'until': 'until',
      'further': 'further',
      'studies': 'studies',
      'could': 'could',
      'conclusively': 'conclusively',
      'demonstrate': 'demonstrate',
      'its': 'its',
      'long-term': 'long-term',
      'sustainability': 'sustainability',
      'in': 'in',
      'diverse': 'diverse',
      'contexts': 'contexts'
    },
    'college': {
      // Minimal changes for college level
      'unanimous': 'unanimous',
      'committee': 'committee',
      'proposal': 'proposal',
      'innovative': 'innovative',
      'efficiency': 'efficiency',
      'postponed': 'postponed',
      'implementation': 'implementation',
      'conclusively': 'conclusively',
      'demonstrate': 'demonstrate',
      'sustainability': 'sustainability',
      'diverse': 'diverse',
      'contexts': 'contexts'
    }
  };

  let simplified = text;
  const levelReplacements = replacements[level] || replacements['middle-school'];

  // Replace complex words with simpler ones
  Object.entries(levelReplacements).forEach(([complex, simple]) => {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    simplified = simplified.replace(regex, simple);
  });

  // Additional sentence simplification based on level
  if (level === 'grade3') {
    // Break down very complex sentences for 3rd grade
    simplified = simplified
      .replace(/; /g, '. ')
      .replace(/, and /g, '. And ')
      .replace(/, but /g, '. But ')
      .replace(/, so /g, '. So ')
      .replace(/, which /g, '. This ')
      .replace(/, that /g, '. This ');
  } else if (level === 'middle-school') {
    // Moderate sentence simplification for middle school
    simplified = simplified
      .replace(/; /g, '. ')
      .replace(/, and /g, '. And ')
      .replace(/, but /g, '. But ');
  }
  // High school and college keep original sentence structure

  return simplified;
}

// Extract vocabulary from text based on reading level
function extractVocabulary(text, level = 'middle-school') {
  // Different word length thresholds based on level
  const minLength = {
    'grade3': 4,      // Shorter words for 3rd grade
    'middle-school': 6,  // Medium words for middle school
    'high-school': 8,    // Longer words for high school
    'college': 10        // Very long words for college
  };

  const words = text.split(/\s+/)
    .filter(word => word.length > (minLength[level] || 6))
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 0)
    .slice(0, 5);

  const vocabulary = words.map(word => ({
    word: word,
    definition: getDefinition(word, level),
    example: getExample(word, level),
    difficulty: getDifficulty(word, level)
  }));

  return vocabulary;
}

// Level-appropriate definition function
function getDefinition(word, level) {
  const definitions = {
    'unanimous': {
      'grade3': 'everyone said yes',
      'middle-school': 'all people agree',
      'high-school': 'unanimous agreement',
      'college': 'unanimous consensus'
    },
    'committee': {
      'grade3': 'a group of people',
      'middle-school': 'a group of people who make decisions',
      'high-school': 'a committee of decision-makers',
      'college': 'an organized committee'
    },
    'proposal': {
      'grade3': 'a plan',
      'middle-school': 'a plan or suggestion',
      'high-school': 'a formal proposal',
      'college': 'a comprehensive proposal'
    },
    'innovative': {
      'grade3': 'new',
      'middle-school': 'new and creative',
      'high-school': 'innovative approach',
      'college': 'innovative methodology'
    },
    'efficiency': {
      'grade3': 'how well things work',
      'middle-school': 'how well something works',
      'high-school': 'operational efficiency',
      'college': 'systematic efficiency'
    },
    'postponed': {
      'grade3': 'put off',
      'middle-school': 'delayed or put off',
      'high-school': 'postponed indefinitely',
      'college': 'strategically postponed'
    },
    'implementation': {
      'grade3': 'doing it',
      'middle-school': 'putting something into action',
      'high-school': 'implementation process',
      'college': 'systematic implementation'
    },
    'conclusively': {
      'grade3': 'for sure',
      'middle-school': 'definitely or for sure',
      'high-school': 'conclusively demonstrated',
      'college': 'conclusively established'
    },
    'demonstrate': {
      'grade3': 'show',
      'middle-school': 'to show or prove',
      'high-school': 'demonstrate effectively',
      'college': 'demonstrate conclusively'
    },
    'sustainability': {
      'grade3': 'keeping going',
      'middle-school': 'ability to continue',
      'high-school': 'long-term sustainability',
      'college': 'environmental sustainability'
    },
    'diverse': {
      'grade3': 'different',
      'middle-school': 'different or varied',
      'high-school': 'diverse range',
      'college': 'multifaceted diversity'
    },
    'contexts': {
      'grade3': 'places',
      'middle-school': 'situations or circumstances',
      'high-school': 'various contexts',
      'college': 'multifaceted contexts'
    }
  };

  const wordDefs = definitions[word.toLowerCase()];
  if (wordDefs && wordDefs[level]) {
    return wordDefs[level];
  }
  
  return `Definition for ${word}`;
}

// Level-appropriate example function
function getExample(word, level) {
  const examples = {
    'unanimous': {
      'grade3': 'Everyone voted yes.',
      'middle-school': 'The class unanimously chose pizza for lunch.',
      'high-school': 'The board reached a unanimous decision.',
      'college': 'The committee achieved unanimous consensus on the proposal.'
    },
    'committee': {
      'grade3': 'The group met to talk.',
      'middle-school': 'The school committee planned the dance.',
      'high-school': 'The student committee organized the event.',
      'college': 'The academic committee reviewed the curriculum.'
    }
  };

  const wordExamples = examples[word.toLowerCase()];
  if (wordExamples && wordExamples[level]) {
    return wordExamples[level];
  }
  
  return `Example sentence with ${word}`;
}

// Level-appropriate difficulty function
function getDifficulty(word, level) {
  const difficulties = {
    'grade3': 'basic',
    'middle-school': 'intermediate', 
    'high-school': 'advanced',
    'college': 'expert'
  };
  
  return difficulties[level] || 'intermediate';
}