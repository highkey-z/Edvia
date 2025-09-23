# Lexia - Demo Guide 🚀

## Quick Start Demo

### 1. Setup (Already Done!)
The application is already set up and running. Both servers are active:
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

### 2. Demo the Core Features

#### Text Simplification
1. **Open** http://localhost:3000 in your browser
2. **Enter sample text** (try this example):
   ```
   The implementation of quantum computing algorithms necessitates a comprehensive understanding of quantum mechanical principles, including superposition, entanglement, and quantum interference phenomena. These fundamental concepts enable quantum computers to process information in ways that classical computers cannot, potentially revolutionizing fields such as cryptography, drug discovery, and optimization problems.
   ```
3. **Select reading level**: Choose "Middle School"
4. **Click "Simplify Text"**
5. **View results**: Check the simplified text, vocabulary, and summary tabs

#### Translation Feature
1. **Select a language** from the dropdown (e.g., Spanish 🇪🇸)
2. **Click "Translate Text"** 
3. **Compare** original vs translated text

#### Text-to-Speech
1. **Click the 🔊 "Listen" button** next to any simplified text
2. **Hear** the text read aloud in your browser

### 3. Sample Texts for Testing

#### Easy Text
```
The sun rises in the east and sets in the west. Plants need sunlight to grow. Animals eat plants or other animals to survive.
```

#### Medium Text
```
Photosynthesis is the process by which plants convert sunlight into energy. This process occurs in the chloroplasts of plant cells and involves the absorption of light energy to convert carbon dioxide and water into glucose and oxygen.
```

#### Complex Text
```
The theoretical framework underlying quantum field theory posits that fundamental particles emerge as quantized excitations of underlying fields that permeate spacetime. This mathematical formalism reconciles quantum mechanics with special relativity, enabling predictions about particle interactions at energy scales approaching the Planck length.
```

### 4. API Testing

#### Test the API directly:
```bash
# Health check
curl http://localhost:3001/api/health

# Get supported languages
curl http://localhost:3001/api/translation/languages

# Process text (requires OpenAI API key)
curl -X POST http://localhost:3001/api/text/process \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","readingLevel":"middle-school","includeSummary":true}'
```

### 5. Key Features Demonstrated

✅ **Text Simplification**: Complex → Simple language  
✅ **Reading Levels**: 3rd grade to college level  
✅ **Vocabulary Extraction**: Word definitions with examples  
✅ **Smart Summarization**: Key points extraction  
✅ **Multilingual Translation**: 15+ languages supported  
✅ **Text-to-Speech**: Browser-based audio playback  
✅ **Clean UI**: Student-friendly interface  
✅ **Real-time Processing**: Fast AI responses  

### 6. Technical Stack Shown

- **Frontend**: React 18 with modern hooks
- **Backend**: Node.js + Express
- **AI**: OpenAI GPT-3.5-turbo
- **Styling**: Custom CSS with utility classes
- **API**: RESTful with comprehensive error handling

### 7. Next Steps for Production

1. **Add OpenAI API Key**: Edit `server/.env` with your key
2. **Deploy**: Use services like Heroku, Vercel, or AWS
3. **Customize**: Modify reading levels, languages, or UI
4. **Scale**: Add user accounts, save history, etc.

---

**🎉 Demo Complete!** Lexia is ready for students to simplify complex text and learn new vocabulary in multiple languages.


