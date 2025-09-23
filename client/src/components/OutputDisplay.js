import React, { useState } from 'react';
import SimplifiedText from './SimplifiedText';
import VocabularyList from './VocabularyList';
import Summary from './Summary';
import TextToSpeech from './TextToSpeech';
import FlashcardGenerator from './FlashcardGenerator';
import InteractiveAnnotations from './InteractiveAnnotations';
import { DocumentIcon, VocabularyIcon, SummaryIcon, BookmarkIcon, HighlighterIcon } from './icons';

const OutputDisplay = ({ result, readingLevel, originalText }) => {
  const [activeTab, setActiveTab] = useState('simplified');

  const tabs = [
    { id: 'simplified', label: 'Simplified Text', icon: DocumentIcon },
    { id: 'vocabulary', label: 'Vocabulary', icon: VocabularyIcon },
    { id: 'summary', label: 'Summary', icon: SummaryIcon },
    { id: 'flashcards', label: 'Flashcards', icon: BookmarkIcon },
    { id: 'annotations', label: 'Annotations', icon: HighlighterIcon }
  ];

  return (
    <div className="content-card fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-primary">
                Your Simplified Text
              </h2>
              <TextToSpeech text={result.simplifiedText} />
            </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <nav className="tab-nav-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="flex items-center space-x-2">
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
        {activeTab === 'simplified' && (
          <SimplifiedText 
            text={result.simplifiedText} 
            readingLevel={readingLevel}
          />
        )}
        
        {activeTab === 'vocabulary' && (
          <VocabularyList vocabulary={result.vocabulary || []} />
        )}
        
        {activeTab === 'summary' && result.summary && (
          <Summary summary={result.summary} />
        )}
        
        {activeTab === 'summary' && !result.summary && (
          <div className="text-center py-12 text-gray-500">
            <div className="flex justify-center mb-4">
              <SummaryIcon size={48} />
            </div>
            <p>No summary was requested for this text.</p>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <FlashcardGenerator 
            vocabulary={result.vocabulary || []} 
          />
        )}

        {activeTab === 'annotations' && (
          <InteractiveAnnotations 
            text={result.simplifiedText} 
          />
        )}
      </div>

    </div>
  );
};

export default OutputDisplay;


