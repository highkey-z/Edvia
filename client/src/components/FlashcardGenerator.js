import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, BookmarkIcon } from './icons';

const FlashcardGenerator = ({ vocabulary = [] }) => {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Generate flashcards from vocabulary
  useEffect(() => {
    if (vocabulary.length > 0) {
      const generatedCards = vocabulary.map((word, index) => ({
        id: index,
        word: word.word,
        definition: word.definition,
        example: word.example || '',
        difficulty: word.difficulty || 'medium'
      }));
      setCards(generatedCards);
      setCurrentCard(0);
      setIsFlipped(false);
    }
  }, [vocabulary]);

  const currentCardData = cards[currentCard];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mb-6">
            <BookmarkIcon size={64} className="mx-auto text-gray-400 dark:text-neutral-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 mb-3">Flashcard Study</h3>
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            No vocabulary available. Simplify some text first to generate flashcards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <BookmarkIcon size={32} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">Flashcard Study</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-neutral-400">
            Card {currentCard + 1} of {cards.length}
          </div>
        </div>
      </div>

      {/* Flashcard */}
      {currentCardData && (
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="w-80 h-48" style={{ perspective: '1000px' }}>
              <div 
                className={`relative w-full h-full cursor-pointer transition-transform duration-500 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={handleFlip}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of card (word) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white dark:bg-neutral-700 border-4 border-gray-400 dark:border-neutral-500 rounded-xl shadow-xl flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div style={{
                    backgroundColor: '#374151',
                    border: '4px solid #6b7280',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                  }}>
                    <h4 style={{
                      color: '#f3f4f6',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      margin: 0
                    }}>
                      {currentCardData.word}
                    </h4>
                  </div>
                </div>

                {/* Back of card (definition) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white dark:bg-neutral-700 border-4 border-gray-400 dark:border-neutral-500 rounded-xl shadow-xl flex items-center justify-center"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <div className="text-center">
                      <div style={{
                        backgroundColor: '#374151',
                        border: '4px solid #6b7280',
                        borderRadius: '12px',
                        padding: '2px 40px',
                        marginBottom: '16px',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                        width: '100%',
                        maxWidth: '1000px',
                        margin: '0 auto 16px auto'
                      }}>
                        <h4 style={{
                          color: '#f3f4f6',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          marginBottom: '2px'
                        }}>
                          Definition
                        </h4>
                        <div style={{
                          backgroundColor: '#f9fafb',
                          border: '2px solid #9ca3af',
                          borderRadius: '8px',
                          padding: '2px 20px'
                        }}>
                          <p style={{
                            color: '#374151',
                            fontSize: '16px',
                            fontWeight: '600',
                            textAlign: 'center',
                            lineHeight: '1.1',
                            margin: 0
                          }}>
                            {currentCardData.definition}
                          </p>
                        </div>
                      </div>
                      {currentCardData.example && (
                        <div className="mt-3 p-2 bg-gray-100 dark:bg-neutral-600 rounded text-sm">
                          <p className="text-gray-600 dark:text-neutral-300 italic">
                            <span className="font-semibold">Example:</span> {currentCardData.example}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevious}
          disabled={currentCard === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <ArrowLeftIcon size={20} />
          <span>Previous</span>
        </button>
        
        
        <button
          onClick={handleNext}
          disabled={currentCard === cards.length - 1}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <span>Next</span>
          <ArrowRightIcon size={20} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardGenerator;