import React, { useState, useRef, useEffect } from 'react';
import { 
  HighlighterIcon, 
  NoteIcon, 
  TrashIcon, 
  EyeIcon,
  EyeOffIcon
} from './icons';

const InteractiveAnnotations = ({ text }) => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [annotationType, setAnnotationType] = useState('highlight');
  const [annotationNote, setAnnotationNote] = useState('');
  const textRef = useRef(null);

  // Save annotations to localStorage
  const saveAnnotations = React.useCallback(() => {
    localStorage.setItem('reading-annotations', JSON.stringify(annotations));
  }, [annotations]);

  // Load annotations from localStorage
  useEffect(() => {
    const savedAnnotations = localStorage.getItem('reading-annotations');
    if (savedAnnotations) {
      try {
        setAnnotations(JSON.parse(savedAnnotations));
      } catch (error) {
        console.error('Error loading annotations:', error);
      }
    }
  }, []);

  // Save annotations when they change
  useEffect(() => {
    saveAnnotations();
  }, [saveAnnotations]);

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
      setSelectedText(selectedText);
      setShowAnnotationForm(true);
    }
  };

  // Add annotation
  const handleAddAnnotation = () => {
    if (!selectedText || !text) return;

    const newAnnotation = {
      id: Date.now(),
      text: selectedText,
      type: annotationType,
      note: annotationNote,
      timestamp: new Date().toLocaleDateString(),
      visible: true
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setSelectedText('');
    setAnnotationNote('');
    setShowAnnotationForm(false);
    
    // Clear selection
    window.getSelection().removeAllRanges();
  };

  // Edit annotation
  const handleEditAnnotation = (id) => {
    const annotation = annotations.find(a => a.id === id);
    setSelectedAnnotation(annotation);
    setAnnotationNote(annotation.note);
    setShowAnnotationForm(true);
  };

  // Update annotation
  const handleUpdateAnnotation = () => {
    if (!selectedAnnotation) return;

    setAnnotations(prev => 
      prev.map(annotation => 
        annotation.id === selectedAnnotation.id 
          ? { ...annotation, note: annotationNote }
          : annotation
      )
    );
    
    setSelectedAnnotation(null);
    setAnnotationNote('');
    setShowAnnotationForm(false);
  };

  // Delete annotation
  const handleDeleteAnnotation = (id) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== id));
    setSelectedAnnotation(null);
  };

  // Render annotated text
  const renderAnnotatedText = () => {
    if (!text) return text;

    let annotatedText = text;
    const sortedAnnotations = [...annotations].sort((a, b) => b.text.length - a.text.length);

    sortedAnnotations.forEach(annotation => {
      if (annotation.visible && showAnnotations) {
        const highlightClass = annotation.type === 'highlight' 
          ? 'annotation-highlight bg-yellow-200 dark:bg-yellow-900/30' 
          : 'annotation-note bg-blue-200 dark:bg-blue-900/30';
        
        annotatedText = annotatedText.replace(
          annotation.text,
          `<span class="${highlightClass}" data-annotation-id="${annotation.id}">${annotation.text}</span>`
        );
      }
    });

    return annotatedText;
  };

  // Handle annotation click
  const handleAnnotationClick = (e) => {
    const annotationId = e.target.getAttribute('data-annotation-id');
    if (annotationId) {
      const annotation = annotations.find(a => a.id === parseInt(annotationId));
      setSelectedAnnotation(annotation);
    }
  };

  return (
    <div className="annotations-container p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">Interactive Annotations</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-neutral-400">
            {annotations.length} annotations • Select text to highlight or add notes
          </span>
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="btn-outline flex items-center space-x-2"
          >
            {showAnnotations ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            <span>{showAnnotations ? 'Hide' : 'Show'} Annotations</span>
          </button>
        </div>
      </div>

      {/* Annotated Text */}
      <div className="mb-6">
        <div
          ref={textRef}
          className="annotation-text p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600 min-h-32 text-gray-800 dark:text-neutral-200 leading-relaxed"
          onMouseUp={handleTextSelection}
          onClick={handleAnnotationClick}
          dangerouslySetInnerHTML={{ __html: renderAnnotatedText() }}
        />
      </div>

      {/* Annotation Form */}
      {showAnnotationForm && (
        <div className="annotation-form mb-6 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
          <h4 className="text-lg font-medium text-gray-800 dark:text-neutral-200 mb-4">
            {selectedAnnotation ? 'Edit Annotation' : 'Add Annotation'}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Selected Text
              </label>
              <p className="text-sm text-gray-600 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-600 p-2 rounded">
                "{selectedText}"
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Type
              </label>
              <select
                value={annotationType}
                onChange={(e) => setAnnotationType(e.target.value)}
                className="form-select w-full"
                disabled={!!selectedAnnotation}
              >
                <option value="highlight">Highlight</option>
                <option value="note">Note</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Note (optional)
              </label>
              <textarea
                value={annotationNote}
                onChange={(e) => setAnnotationNote(e.target.value)}
                placeholder="Add a note about this text..."
                className="form-textarea w-full"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAnnotationForm(false);
                  setSelectedAnnotation(null);
                  setAnnotationNote('');
                  setSelectedText('');
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={selectedAnnotation ? handleUpdateAnnotation : handleAddAnnotation}
                className="btn-primary"
              >
                {selectedAnnotation ? 'Update' : 'Add'} Annotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Annotations List */}
      {annotations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 dark:text-neutral-200 mb-4">Your Annotations</h4>
          <div className="space-y-3">
            {annotations.map(annotation => (
              <div
                key={annotation.id}
                className="annotation-card p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        annotation.type === 'highlight' 
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      }`}>
                        {annotation.type === 'highlight' ? 'Highlight' : 'Note'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-neutral-400">
                        {annotation.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">
                      "{annotation.text}"
                    </p>
                    {annotation.note && (
                      <p className="text-sm text-gray-700 dark:text-neutral-300">
                        {annotation.note}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditAnnotation(annotation.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300"
                    >
                      <NoteIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnotation(annotation.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Use */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">How to Use Annotations</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Select any text to highlight or add notes</li>
          <li>• Choose different colors for different types of information</li>
          <li>• Add personal notes to remember important points</li>
          <li>• Click on highlighted text to view your annotations</li>
        </ul>
      </div>
    </div>
  );
};

export default InteractiveAnnotations;