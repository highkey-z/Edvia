import React from 'react';
import { GlobeIcon } from './icons';

const languages = {
  'spanish': { name: 'Spanish', code: 'ES' },
  'french': { name: 'French', code: 'FR' },
  'german': { name: 'German', code: 'DE' },
  'italian': { name: 'Italian', code: 'IT' },
  'portuguese': { name: 'Portuguese', code: 'PT' },
  'chinese': { name: 'Chinese (Simplified)', code: 'CN' },
  'japanese': { name: 'Japanese', code: 'JP' },
  'korean': { name: 'Korean', code: 'KR' },
  'arabic': { name: 'Arabic', code: 'SA' },
  'hindi': { name: 'Hindi', code: 'IN' },
  'russian': { name: 'Russian', code: 'RU' },
  'dutch': { name: 'Dutch', code: 'NL' },
  'swedish': { name: 'Swedish', code: 'SE' },
  'norwegian': { name: 'Norwegian', code: 'NO' },
  'danish': { name: 'Danish', code: 'DK' }
};

const LanguageSelector = ({ value, onChange, disabled = false }) => {
  return (
    <div className="form-group">
      <label className="form-label">
        Translate to
      </label>
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Select a language...</option>
        {Object.entries(languages).map(([code, lang]) => (
          <option key={code} value={code}>
            {lang.code} {lang.name}
          </option>
        ))}
      </select>
      
              {value && (
                <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-100">
                  <div className="text-sm">
                    <div className="font-semibold text-primary flex items-center space-x-2 mb-2">
                      <GlobeIcon size={16} />
                      <span>{languages[value]?.code} {languages[value]?.name}</span>
                    </div>
                    <div className="text-secondary leading-relaxed">
                      Text will be translated while maintaining reading level
                    </div>
                  </div>
                </div>
              )}
    </div>
  );
};

export default LanguageSelector;


