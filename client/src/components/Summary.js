import React from 'react';
import { SummaryIcon, StarIcon, LightbulbIcon } from './icons';

const Summary = ({ summary }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <SummaryIcon size={28} />
        <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Text Summary
        </h3>
      </div>

      <div className="bg-primary-50 dark:bg-neutral-800 border border-primary-100 dark:border-neutral-700 rounded-lg p-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-primary dark:text-neutral-200 leading-relaxed text-lg">
            {summary}
          </p>
        </div>
      </div>

      <div className="bg-success-50 dark:bg-neutral-800 border border-success-100 dark:border-neutral-700 rounded-lg p-6">
        <h4 className="font-semibold text-success-700 dark:text-success-400 mb-3 flex items-center space-x-2">
          <StarIcon size={18} />
          <span>Summary Benefits:</span>
        </h4>
        <ul className="text-sm text-secondary dark:text-neutral-300 space-y-2">
          <li>• Helps you understand the main ideas quickly</li>
          <li>• Makes it easier to remember key points</li>
          <li>• Useful for studying and reviewing material</li>
          <li>• Good starting point before reading the full text</li>
        </ul>
      </div>

      <div className="bg-warning-50 dark:bg-neutral-800 border border-warning-100 dark:border-neutral-700 rounded-lg p-6">
        <h4 className="font-semibold text-warning-700 dark:text-warning-400 mb-3 flex items-center space-x-2">
          <LightbulbIcon size={18} />
          <span>How to Use This Summary:</span>
        </h4>
        <ul className="text-sm text-secondary dark:text-neutral-300 space-y-2">
          <li>• Read the summary first to get an overview</li>
          <li>• Then read the simplified text for details</li>
          <li>• Try to connect the summary points to the full text</li>
          <li>• Use it to check your understanding after reading</li>
        </ul>
      </div>
    </div>
  );
};

export default Summary;


