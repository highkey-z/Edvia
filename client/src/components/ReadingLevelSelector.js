import React from 'react';
import { LeafIcon, GraduationIcon } from './icons';

const readingLevels = [
  {
    value: 'grade3',
    label: '3rd Grade',
    description: 'Simple sentences, basic words',
    icon: LeafIcon,
    color: 'green'
  },
  {
    value: 'middle-school',
    label: 'Middle School',
    description: 'Clear explanations, moderate complexity',
    icon: LeafIcon,
    color: 'blue'
  },
  {
    value: 'high-school',
    label: 'High School',
    description: 'More sophisticated language',
    icon: LeafIcon,
    color: 'purple'
  },
  {
    value: 'college',
    label: 'College',
    description: 'Academic language, specialized terms',
    icon: GraduationIcon,
    color: 'indigo'
  }
];

const ReadingLevelSelector = ({ value, onChange }) => {
  return (
    <div className="form-group">
      <label className="form-label">
        Reading Level
      </label>
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {readingLevels.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label} - {level.description}
          </option>
        ))}
      </select>
      
              {/* Show selected level details */}
              <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-100">
                {(() => {
                  const selectedLevel = readingLevels.find(l => l.value === value);
                  if (!selectedLevel) return null;
                  const IconComponent = selectedLevel.icon;
                  return (
                    <div className="text-sm">
                      <div className="font-semibold text-primary flex items-center space-x-2 mb-2">
                        <IconComponent size={16} />
                        <span>{selectedLevel.label}</span>
                      </div>
                      <div className="text-secondary leading-relaxed">
                        {selectedLevel.description}
                      </div>
                    </div>
                  );
                })()}
              </div>
    </div>
  );
};

export default ReadingLevelSelector;


