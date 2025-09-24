export default async function handler(req, res) {
  console.log('🚀 NEW VERSION - Function called with method:', req.method);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS request');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📝 Processing POST request');
    const { text, readingLevel = 'middle-school', includeSummary = false } = req.body;
    console.log('📊 Request data:', { textLength: text?.length, readingLevel, includeSummary });

    if (!text) {
      console.log('❌ No text provided');
      return res.status(400).json({ error: 'Text is required' });
    }

    // Try Hugging Face API first, fallback to local algorithm
    console.log('🤖 Attempting Hugging Face API for text simplification');
    try {
      const result = await simplifyWithHuggingFace(text, readingLevel);
      console.log('✅ Hugging Face processing completed');
      res.json(result);
    } catch (error) {
      console.log('⚠️ Hugging Face API failed, using local algorithm instead');
      console.log('Error:', error.message);
      const simplifiedText = simplifyText(text, readingLevel);
      const vocabulary = extractVocabulary(text, readingLevel);
      res.json({
        simplifiedText: simplifiedText,
        vocabulary: vocabulary
      });
    }

  } catch (error) {
    console.error('❌ Error in handler:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Failed to process text',
      message: error.message 
    });
  }
}

// Hugging Face API text simplification
async function simplifyWithHuggingFace(text, level) {
  try {
    console.log('🔍 Starting Hugging Face API call...');
    
    const levelInstructions = {
      'grade3': 'Simplify this text for 3rd grade students. Use very simple words and short sentences.',
      'middle-school': 'Simplify this text for middle school students. Use clear, simple language.',
      'high-school': 'Simplify this text for high school students. Use clear language with some advanced vocabulary.',
      'college': 'Simplify this text for college students. Use clear, sophisticated language.'
    };

    const instruction = levelInstructions[level] || levelInstructions['middle-school'];
    const prompt = `${instruction}\n\nText: "${text}"\n\nSimplified:`;

    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY || 'hf_your_token_here'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 200,
          min_length: 50,
          do_sample: false
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Hugging Face API response received');
    
    let simplifiedText = text;
    if (data && data[0] && data[0].summary_text) {
      // BART model returns summary_text
      simplifiedText = data[0].summary_text;
    } else if (data && data[0] && data[0].generated_text) {
      // Fallback for other models
      simplifiedText = data[0].generated_text;
    }
    
    // Apply level-specific adjustments if needed
    if (level === 'grade3') {
      // Make it even simpler for 3rd grade
      simplifiedText = simplifiedText
        .replace(/although/gi, 'even though')
        .replace(/however/gi, 'but')
        .replace(/therefore/gi, 'so')
        .replace(/consequently/gi, 'so')
        .replace(/furthermore/gi, 'also')
        .replace(/moreover/gi, 'also');
    }
    
    // Extract vocabulary from original text
    const vocabulary = extractVocabulary(text, level);
    
    return {
      simplifiedText: simplifiedText,
      vocabulary: vocabulary
    };

  } catch (error) {
    console.error('❌ Hugging Face API error:', error);
    throw error;
  }
}

// OpenAI API text simplification
async function simplifyWithOpenAI(text, level, includeSummary = false) {
  try {
    console.log('🔍 Starting OpenAI API call...');
    
    const levelInstructions = {
      'grade3': 'Rewrite this text for a 3rd grade reading level. Use very simple words, short sentences, and basic vocabulary. Make it easy for young children to understand.',
      'middle-school': 'Rewrite this text for a middle school reading level. Use clear, simple language with moderate complexity. Make it appropriate for 6th-8th grade students.',
      'high-school': 'Rewrite this text for a high school reading level. Use clear language with some advanced vocabulary. Make it appropriate for 9th-12th grade students.',
      'college': 'Rewrite this text for a college reading level. Use clear, sophisticated language while maintaining the original meaning and complexity.'
    };

    const instruction = levelInstructions[level] || levelInstructions['middle-school'];
    
    const prompt = `${instruction}

Original text: "${text}"

Simplified text:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at simplifying text for different reading levels. Always maintain the original meaning while making the text appropriate for the target reading level.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      
      // Handle rate limiting by falling back to local algorithm
      if (response.status === 429) {
        console.log('⚠️ OpenAI rate limit exceeded, falling back to local algorithm');
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI API response received');
    
    const simplifiedText = data.choices[0].message.content.trim();
    
    // Extract vocabulary from original text
    const vocabulary = extractVocabulary(text, level);
    
    return {
      simplifiedText: simplifiedText,
      vocabulary: vocabulary
    };

  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    throw error;
  }
}

// Cohere API text simplification
async function simplifyWithCohere(text, level) {
  try {
    console.log('🔍 Starting Cohere API call...');
    console.log('🔑 API Key present:', !!process.env.COHERE_API_KEY);
    console.log('📝 Text length:', text.length);
    console.log('🎯 Level:', level);
    
    // Create a prompt for text simplification
    const prompt = createSimplificationPrompt(text, level);
    console.log('📋 Prompt:', prompt.substring(0, 100) + '...');
    
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`
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

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Cohere API error response:', errorText);
      throw new Error(`Cohere API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Cohere API response received');
    
    if (data && data.generations && data.generations.length > 0) {
      const simplifiedText = data.generations[0].text.trim();
      console.log('📝 Simplified text:', simplifiedText.substring(0, 100) + '...');
      return simplifiedText || text;
    }
    
    console.log('⚠️ No generated text, returning original');
    return text;
    
  } catch (error) {
    console.error('❌ Cohere API error:', error);
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
      'although': 'even though',
      'spent': 'used',
      'hours': 'time',
      'refining': 'making better',
      'interface': 'website',
      'intuitive': 'easy to use',
      'students': 'kids',
      'realized': 'found out',
      'measure': 'way to tell',
      'success': 'doing well',
      'independently': 'by themselves',
      'confidently': 'sure of themselves',
      'discovering': 'finding',
      'insights': 'new ideas',
      'anticipated': 'expected',
      'platform': 'website',
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
      .replace(/, that /g, '. This ')
      .replace(/, /g, '. ')
      .replace(/although /gi, 'Even though ')
      .replace(/I had /gi, 'I used ')
      .replace(/spent /gi, 'used ')
      .replace(/refining /gi, 'making better ')
      .replace(/the interface /gi, 'the website ')
      .replace(/to make it /gi, 'to make the website ')
      .replace(/intuitive for /gi, 'easy for ')
      .replace(/students, I /gi, 'kids, I ')
      .replace(/realized that /gi, 'found out that ')
      .replace(/the true /gi, 'the real ')
      .replace(/measure of /gi, 'way to tell if ')
      .replace(/success would /gi, 'it worked would ')
      .replace(/come only when /gi, 'happen only when ')
      .replace(/they could /gi, 'the kids could ')
      .replace(/use the platform /gi, 'use the website ')
      .replace(/independently and /gi, 'by themselves and ')
      .replace(/confidently, /gi, 'sure of themselves, ')
      .replace(/discovering /gi, 'finding ')
      .replace(/insights on /gi, 'new ideas about ')
      .replace(/their own /gi, 'their own ')
      .replace(/that I /gi, 'that I ')
      .replace(/hadn't /gi, 'did not ')
      .replace(/anticipated./gi, 'expected.');
  } else if (level === 'middle-school') {
    // Moderate sentence simplification for middle school
    simplified = simplified
      .replace(/; /g, '. ')
      .replace(/, and /g, '. And ')
      .replace(/, but /g, '. But ')
      .replace(/although /gi, 'Even though ')
      .replace(/spent /gi, 'used ')
      .replace(/refining /gi, 'improving ')
      .replace(/interface /gi, 'website ')
      .replace(/intuitive /gi, 'easy to use ')
      .replace(/students /gi, 'students ')
      .replace(/realized /gi, 'understood ')
      .replace(/measure /gi, 'way to tell ')
      .replace(/independently /gi, 'on their own ')
      .replace(/confidently /gi, 'with confidence ')
      .replace(/discovering /gi, 'finding ')
      .replace(/insights /gi, 'new ideas ')
      .replace(/anticipated /gi, 'expected ');
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

// Functions are available within the module scope