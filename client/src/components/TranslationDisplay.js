import React from 'react';
import TextToSpeech from './TextToSpeech';
import { GlobeIcon } from './icons';

const TranslationDisplay = ({ translation, originalText }) => {
  if (!translation) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex justify-center mb-4">
          <GlobeIcon size={48} />
        </div>
        <p>No translation available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GlobeIcon size={28} />
          <h3 className="text-2xl font-bold text-neutral-800">
            Translation in {translation.languageName}
          </h3>
        </div>
        <TextToSpeech text={translation.translatedText} />
      </div>

      {/* Translation Stats */}
      <div className="bg-primary-50 border border-primary-100 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="text-center">
            <div className="font-semibold text-primary">Language</div>
            <div className="text-secondary font-medium">{translation.languageName}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-primary">Words</div>
            <div className="text-secondary font-medium">{translation.wordCount}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-primary">Characters</div>
            <div className="text-secondary font-medium">{translation.characterCount}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-primary">Reading Level</div>
            <div className="text-secondary font-medium">{translation.readingLevel}</div>
          </div>
        </div>
      </div>

      {/* Translated Text */}
      <div className="prose prose-lg max-w-none">
        <h4 className="font-semibold text-primary mb-4">Translated Text:</h4>
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 leading-relaxed text-primary whitespace-pre-wrap">
          {translation.translatedText}
        </div>
      </div>

      {/* Comparison with Original */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-semibold text-secondary hover:text-primary mb-6 transition-colors">
          Compare with Original Text
        </summary>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-neutral-50 rounded-lg">
            <h5 className="font-semibold text-primary mb-3">Original (English):</h5>
            <div className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
              {originalText}
            </div>
          </div>
          <div className="p-6 bg-primary-50 rounded-lg">
            <h5 className="font-semibold text-primary mb-3">Translated ({translation.languageName}):</h5>
            <div className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
              {translation.translatedText}
            </div>
          </div>
        </div>
      </details>

      {/* Translation Tips */}
      <div className="bg-success-50 border border-success-100 rounded-lg p-6">
        <h4 className="font-semibold text-success-700 mb-3 flex items-center space-x-2">
          <GlobeIcon size={18} />
          <span>Translation Tips:</span>
        </h4>
        <ul className="text-sm text-secondary space-y-2">
          <li>• The translation maintains the same reading level as the original</li>
          <li>• Cultural references have been adapted when appropriate</li>
          <li>• Use this translation to practice reading in another language</li>
          <li>• Compare with the original to improve language learning</li>
        </ul>
      </div>
    </div>
  );
};

export default TranslationDisplay;


