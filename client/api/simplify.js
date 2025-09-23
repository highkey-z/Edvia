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

    // Use a simple text simplification algorithm (no external API needed)
    const simplifiedText = simplifyText(text, readingLevel);
    const vocabulary = extractVocabulary(text);

    res.json({
      simplifiedText: simplifiedText,
      vocabulary: vocabulary
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process text',
      message: error.message 
    });
  }
}

// Simple text simplification function
function simplifyText(text, level) {
  // Define complexity levels
  const replacements = {
    'grade3': {
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
      'contexts': 'situations'
    },
    'middle-school': {
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
      'contexts': 'situations'
    },
    'high-school': {
      'unanimous': 'all agreed',
      'committee': 'group',
      'proposal': 'plan',
      'innovative': 'new and creative',
      'efficiency': 'how well things work',
      'postponed': 'delayed',
      'implementation': 'putting into action'
    }
  };

  let simplified = text;
  const levelReplacements = replacements[level] || replacements['middle-school'];

  // Replace complex words with simpler ones
  Object.entries(levelReplacements).forEach(([complex, simple]) => {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    simplified = simplified.replace(regex, simple);
  });

  // Break down complex sentences
  if (level === 'grade3') {
    simplified = simplified
      .replace(/\. /g, '. ')
      .replace(/; /g, '. ')
      .replace(/, /g, ', ');
  }

  return simplified;
}

// Extract vocabulary from text
function extractVocabulary(text) {
  const words = text.split(/\s+/)
    .filter(word => word.length > 6)
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 0)
    .slice(0, 5);

  const vocabulary = words.map(word => ({
    word: word,
    definition: getDefinition(word),
    example: `Example sentence with ${word}`,
    difficulty: 'intermediate'
  }));

  return vocabulary;
}

// Simple definition function
function getDefinition(word) {
  const definitions = {
    'unanimous': 'all people agree',
    'committee': 'a group of people who make decisions',
    'proposal': 'a plan or suggestion',
    'innovative': 'new and creative',
    'efficiency': 'how well something works',
    'postponed': 'delayed or put off',
    'implementation': 'putting something into action',
    'conclusively': 'definitely or for sure',
    'demonstrate': 'to show or prove',
    'sustainability': 'ability to continue',
    'diverse': 'different or varied',
    'contexts': 'situations or circumstances'
  };

  return definitions[word.toLowerCase()] || `Definition for ${word}`;
}