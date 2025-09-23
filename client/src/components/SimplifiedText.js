import React from 'react';
import { BookIcon, LightbulbIcon } from './icons';

const SimplifiedText = ({ text, readingLevel }) => {
  const getReadingLevelInfo = (level) => {
    const levels = {
      'grade3': { name: '3rd Grade', color: 'success' },
      'middle-school': { name: 'Middle School', color: 'primary' },
      'high-school': { name: 'High School', color: 'accent' },
      'college': { name: 'College', color: 'primary' }
    };
    return levels[level] || { name: 'Unknown', color: 'neutral' };
  };

  const levelInfo = getReadingLevelInfo(readingLevel);

  return (
    <div className="space-y-4">
      {/* Reading Level Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className={`badge badge-${levelInfo.color} flex items-center space-x-2`}>
          <BookIcon size={16} />
          <span>Simplified for {levelInfo.name} Level</span>
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">
          {text.split(' ').length} words
        </div>
      </div>

      {/* Simplified Text */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 leading-relaxed text-primary dark:text-neutral-200 whitespace-pre-wrap">
          {text}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary-50 dark:bg-neutral-800 border border-primary-100 dark:border-neutral-700 rounded-lg p-6">
        <h4 className="font-semibold text-primary dark:text-primary-400 mb-3 flex items-center space-x-2">
          <LightbulbIcon size={18} />
          <span>Tips for Understanding:</span>
        </h4>
        <ul className="text-sm text-secondary dark:text-neutral-300 space-y-2">
          <li>• Read slowly and take your time</li>
          <li>• Look up any words you don't know</li>
          <li>• Try to explain what you read in your own words</li>
          <li>• Ask questions about parts that seem confusing</li>
          <li>• Break the text into smaller sections if it's long</li>
          <li>• Take notes on important points as you read</li>
          <li>• Try to connect new information to what you already know</li>
          <li>• Read the text multiple times to improve understanding</li>
          <li>• Discuss the text with others to gain different perspectives</li>
          <li>• Use the vocabulary section to learn new words</li>
        </ul>
      </div>
    </div>
  );
};

export default SimplifiedText;


