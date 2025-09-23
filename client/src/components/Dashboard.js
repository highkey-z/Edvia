import React, { useState } from 'react';
import TextInput from './TextInput';
import ReadingLevelSelector from './ReadingLevelSelector';
import LanguageSelector from './LanguageSelector';
import OutputDisplay from './OutputDisplay';
import TranslationDisplay from './TranslationDisplay';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon, GlobeIcon, DocumentIcon, HomeIcon } from './icons';
import { processText, translateText } from '../services/api';

const Dashboard = () => {
  const [text, setText] = useState('');
  const [readingLevel, setReadingLevel] = useState('middle-school');
  const [includeSummary, setIncludeSummary] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState('');
  const [result, setResult] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);

  const handleProcessText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await processText({ text, readingLevel, includeSummary });
      setResult(response);
      setTranslation(null); // Clear previous translation
    } catch (error) {
      setError(error.message || 'Failed to process text');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!text.trim() || !targetLanguage) return;

    setTranslating(true);
    setError(null);

    try {
      const response = await translateText({ text, targetLanguage, readingLevel });
      setTranslation(response);
      setResult(null); // Clear previous result
    } catch (error) {
      setError(error.message || 'Failed to translate text');
    } finally {
      setTranslating(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setTranslation(null);
    setError(null);
  };

  return (
    <main className="main-content">
      <div className="bg-layer-1"></div>
      <div className="bg-layer-2"></div>
      <div className="bg-layer-3"></div>
      <div className="bg-layer-4"></div>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div className="relative">
              <div className="text-center">
                <h1>
                  Text Simplification Dashboard
                </h1>
                <p>
                  Transform complex text into student-friendly content with AI-powered simplification. 
                  Choose your reading level and get instant results.
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="absolute top-0 right-0 btn btn-outline flex items-center space-x-2 px-4 py-2"
                title="Go back to home"
              >
                <HomeIcon size={20} />
                <span>Home</span>
              </button>
            </div>
          </div>

          {/* Input Section */}
          <div className="form-section mb-8">
            <h2 className="text-2xl font-bold mb-6 text-primary flex items-center space-x-3">
              <DocumentIcon size={28} />
              <span>Simplify Your Text</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <TextInput
                  value={text}
                  onChange={setText}
                  placeholder="Paste or type your text here. Edvia will simplify it to make it easier to understand..."
                />
              </div>
              
              <div className="space-y-8">
                <ReadingLevelSelector
                  value={readingLevel}
                  onChange={setReadingLevel}
                />
                
                <LanguageSelector
                  value={targetLanguage}
                  onChange={setTargetLanguage}
                  disabled={loading || translating}
                />
                
                <div className="form-group">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeSummary}
                      onChange={(e) => setIncludeSummary(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-secondary font-medium">
                      Include summary
                    </span>
                  </label>
                </div>
                
                <div className="space-y-6 mt-12">
                  <button
                    onClick={handleProcessText}
                    disabled={loading || translating || !text.trim()}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner />
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <SparklesIcon size={16} />
                        <span>Simplify Text</span>
                      </span>
                    )}
                  </button>
                  
                  {targetLanguage && (
                    <button
                      onClick={handleTranslate}
                      disabled={translating || loading || !text.trim()}
                      className="btn btn-outline btn-lg w-full"
                    >
                      {translating ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Translating...</span>
                        </>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <GlobeIcon size={16} />
                          <span>Translate Text</span>
                        </span>
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={handleClear}
                    disabled={loading || translating}
                    className="btn btn-outline w-full"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error fade-in">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results Section */}
          {result && (
            <OutputDisplay 
              result={result} 
              readingLevel={readingLevel}
              originalText={text}
            />
          )}

          {/* Translation Section */}
          {translation && (
            <div className="form-section fade-in">
              <TranslationDisplay 
                translation={translation}
                originalText={text}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
