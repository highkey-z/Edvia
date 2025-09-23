import React, { useState } from 'react';
import { VocabularyIcon, StarIcon, CheckIcon, AlertIcon } from './icons';

const VocabularyList = ({ vocabulary }) => {
  const [filterDifficulty, setFilterDifficulty] = useState('all');


  const getDifficultyIcon = (difficulty) => {
    const icons = {
      basic: CheckIcon,
      intermediate: StarIcon,
      advanced: AlertIcon
    };
    const IconComponent = icons[difficulty] || StarIcon;
    return <IconComponent size={12} />;
  };

  const filteredVocabulary = filterDifficulty === 'all' 
    ? vocabulary 
    : vocabulary.filter(word => word.difficulty === filterDifficulty);

  if (vocabulary.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <div className="flex justify-center mb-4">
          <VocabularyIcon size={48} className="text-neutral-400" />
        </div>
        <p className="text-lg font-medium">No vocabulary words found in this text.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center space-x-3">
          <label className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Filter by difficulty:</label>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="form-select text-sm"
          >
            <option value="all">All ({vocabulary.length})</option>
            <option value="basic">Basic ({vocabulary.filter(w => w.difficulty === 'basic').length})</option>
            <option value="intermediate">Intermediate ({vocabulary.filter(w => w.difficulty === 'intermediate').length})</option>
            <option value="advanced">Advanced ({vocabulary.filter(w => w.difficulty === 'advanced').length})</option>
          </select>
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVocabulary.map((word, index) => {
          
          return (
            <div
              key={index}
              className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 hover:shadow-md transition-all duration-200 bg-white dark:bg-neutral-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                      {word.word}
                    </h4>
                    <span className={`badge badge-${word.difficulty === 'basic' ? 'success' : word.difficulty === 'intermediate' ? 'primary' : 'warning'} flex items-center space-x-1`}>
                      <span>{getDifficultyIcon(word.difficulty)}</span>
                      <span>{word.difficulty}</span>
                    </span>
                  </div>
                  
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                    {word.definition}
                  </p>
                  
                  {word.example && (
                    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
                      <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100">Example:</span> {word.example}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Study Tips */}
      <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 mt-8">
        <h4 className="font-semibold text-primary mb-3 flex items-center space-x-2">
          <StarIcon size={18} />
          <span>Vocabulary Study Tips:</span>
        </h4>
        <ul className="text-sm text-secondary space-y-2">
          <li>• Try to use each word in a sentence of your own</li>
          <li>• Look for these words in other texts you read</li>
          <li>• Practice saying the words out loud</li>
          <li>• Create flashcards for words you want to remember</li>
        </ul>
      </div>
    </div>
  );
};

export default VocabularyList;


