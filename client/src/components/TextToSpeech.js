import React, { useState, useRef } from 'react';
import { VolumeIcon, StopIcon } from './icons';

const TextToSpeech = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('google-us');
  const speechRef = useRef(null);

  const speak = () => {
    if (!text || text.trim().length === 0) {
      alert('No text available to read aloud.');
      return;
    }

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    // Stop any current speech
    if (speechRef.current) {
      speechRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure speech settings
    utterance.rate = 0.8; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use the selected Google voice
    const voices = speechSynthesis.getVoices();
    let preferredVoice = null;
    
    // Voice selection based on user preference
    switch (selectedVoice) {
      case 'google-us':
        preferredVoice = voices.find(voice => 
          voice.name.includes('Google US English') || 
          voice.name.includes('Google en-US')
        );
        break;
      case 'google-uk-female':
        preferredVoice = voices.find(voice => 
          voice.name.includes('Google UK English Female') || 
          (voice.name.includes('Google en-GB') && voice.name.includes('Female'))
        );
        break;
      case 'google-uk-male':
        preferredVoice = voices.find(voice => 
          voice.name.includes('Google UK English Male') || 
          (voice.name.includes('Google en-GB') && voice.name.includes('Male'))
        );
        break;
      default:
        // Fallback to any Google English voice
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.includes('Google')
        );
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      speechRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      speechRef.current = null;
      alert('Error playing text. Please try again.');
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    try {
      // Stop all speech synthesis
      speechSynthesis.cancel();
      setIsPlaying(false);
      speechRef.current = null;
    } catch (error) {
      console.error('Error stopping speech:', error);
      setIsPlaying(false);
      speechRef.current = null;
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Voice Selector */}
      <select
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
        className="form-select text-sm py-1 px-2"
        disabled={isPlaying}
      >
        <option value="google-us">Google US English</option>
        <option value="google-uk-female">Google UK English (Female)</option>
        <option value="google-uk-male">Google UK English (Male)</option>
      </select>
      
      {/* Play/Stop Button */}
      {!isPlaying ? (
        <button
          onClick={speak}
          className="btn btn-success flex items-center space-x-2 px-4 py-2"
          title="Read text aloud"
        >
          <VolumeIcon size={16} />
          <span>Listen</span>
        </button>
      ) : (
        <button
          onClick={stop}
          className="btn flex items-center space-x-2 px-4 py-2 bg-error-600 hover:bg-error-700 text-white"
          title="Stop reading"
        >
          <StopIcon size={16} />
          <span>Stop</span>
        </button>
      )}
    </div>
  );
};

export default TextToSpeech;


