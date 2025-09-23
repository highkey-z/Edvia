# Lexia 📚

A web application that helps students understand complex text through AI-powered simplification, vocabulary extraction, and summarization.

## Features ✨

- **Text Simplification**: Converts complex text to different reading levels (3rd grade, middle school, high school, college)
- **Vocabulary Extraction**: Identifies difficult words with simple definitions and examples
- **Smart Summarization**: Generates concise summaries of the main points
- **Text-to-Speech**: Read simplified text aloud using browser speech synthesis
- **Clean UI**: Student-friendly interface with intuitive controls
- **Real-time Processing**: Fast AI-powered text analysis

## Tech Stack 🛠️

- **Frontend**: React 18 with modern hooks
- **Backend**: Node.js with Express
- **AI**: Google Gemini 1.5 Flash for text processing
- **Styling**: Custom CSS with utility classes
- **API**: RESTful API with error handling

## Quick Start 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key (free!)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd reading-companion
   npm run install-all
   ```

2. **Set up environment variables:**
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   NODE_ENV=development
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 3001) and frontend (port 3000).

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage 📖

1. **Enter Text**: Paste or type complex text in the input area
2. **Choose Reading Level**: Select your target reading level from the dropdown
3. **Configure Options**: Choose whether to include a summary
4. **Process**: Click "Simplify Text" to analyze your text
5. **Review Results**: View simplified text, vocabulary, and summary in organized tabs

## API Endpoints 🔌

### POST `/api/text/process`
Process text for simplification, vocabulary, and summarization.

**Request:**
```json
{
  "text": "Your complex text here...",
  "readingLevel": "middle-school",
  "includeSummary": true
}
```

**Response:**
```json
{
  "simplifiedText": "Simplified version...",
  "vocabulary": [
    {
      "word": "complex",
      "definition": "hard to understand",
      "example": "This is a complex problem.",
      "difficulty": "intermediate"
    }
  ],
  "summary": "Main points summary..."
}
```

### POST `/api/text/vocabulary`
Extract vocabulary only from text.

**Request:**
```json
{
  "text": "Your text here..."
}
```

## Reading Levels 📊

- **3rd Grade**: Simple sentences, basic words, short phrases
- **Middle School**: Clear explanations, moderate complexity
- **High School**: More sophisticated language, complex concepts
- **College**: Academic language, specialized terminology

## Project Structure 📁

```
lexia/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.js         # Main app component
├── server/                # Express backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── index.js          # Server entry point
└── package.json          # Root package.json
```

## Development 👨‍💻

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run build` - Build the frontend for production

### Adding Features

1. **New Components**: Add to `client/src/components/`
2. **API Endpoints**: Add to `server/routes/`
3. **Services**: Add business logic to `server/services/`

## Configuration ⚙️

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

### Customization

- **Reading Levels**: Modify `readingLevelConfigs` in `server/services/textProcessor.js`
- **Styling**: Update `client/src/App.css` and `client/src/index.css`
- **API Timeout**: Adjust timeout in `client/src/services/api.js`

## Troubleshooting 🔧

### Common Issues

1. **"API key not configured"**
   - Ensure your `.env` file has the correct `GEMINI_API_KEY`
   - Restart the server after adding the key

2. **"Unable to connect to server"**
   - Check that the backend is running on port 3001
   - Verify no firewall is blocking the connection

3. **Slow processing**
   - Large texts may take longer to process
   - Consider breaking long texts into smaller sections

### Error Handling

The app includes comprehensive error handling for:
- Network connectivity issues
- API quota limits
- Invalid input validation
- Server errors

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License 📄

MIT License - see LICENSE file for details.

## Support 💬

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue on GitHub

---

**Happy Reading with Lexia! 📚✨**


