import React, { useState, useEffect, useRef, useCallback } from 'react';

// Main App Component
function App() {
  // State variables for UI and application logic
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || ''); // API key for Gemini/Imagen
  const [selectedApi, setSelectedApi] = useState('Gemini'); // Currently only Gemini is supported
  const [topicInput, setTopicInput] = useState(''); // User input for story topic
  const [targetLanguage, setTargetLanguage] = useState('de'); // Target language for learning (e.g., 'ar', 'en', 'fr', 'de')
  const [learningLevel, setLearningLevel] = useState('A1'); // Learning level (A1, A2, B1, B2, C1, C2)
  const [storyText, setStoryText] = useState(''); // Generated story text
  const [translatedStoryText, setTranslatedStoryText] = useState(''); // Translated story text (if translation is enabled)
  const [showTranslation, setShowTranslation] = useState(false); // Toggle for showing translation
  const [generatedImageUrl, setGeneratedImageUrl] = useState(''); // URL of the generated image
  const [isGeneratingStory, setIsGeneratingStory] = useState(false); // Loading state for story generation
  const [isGeneratingImage, setIsGeneratingImage] = useState(false); // Loading state for image generation
  const [isSpeaking, setIsSpeaking] = useState(false); // Speaking state for TTS
  const [speechRate, setSpeechRate] = useState(1); // Speech rate for TTS
  const [speechPitch, setSpeechPitch] = useState(1); // Speech pitch for TTS
  const [speechVoice, setSpeechVoice] = useState(null); // Selected voice for TTS
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1); // Index of the currently highlighted word
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode toggle
  const [showSettings, setShowSettings] = useState(false); // Settings modal visibility
  const [errorMessage, setErrorMessage] = useState(''); // Error message display
  const [showErrorModal, setShowErrorModal] = useState(false); // Error modal visibility

  // New state for vocabulary explainer
  const [selectedWordForExplanation, setSelectedWordForExplanation] = useState(null);
  const [wordExplanation, setWordExplanation] = useState(null); 
  const [isExplainingWord, setIsExplainingWord] = useState(false);

  // New state for quiz generator
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null); 
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // New state for sentence rephrasing
  const [sentenceToRephrase, setSentenceToRephrase] = useState('');
  const [rephrasedSentenceData, setRephrasedSentenceData] = useState(null); 
  const [isRephrasing, setIsRephrasing] = useState(false);
  const [showRephraseModal, setShowRephraseModal] = useState(false);

  // New state for grammar checker
  const [sentenceToCheckGrammar, setSentenceToCheckGrammar] = useState('');
  const [grammarAnalysis, setGrammarAnalysis] = useState(null); 
  const [isAnalyzingGrammar, setIsAnalyzingGrammar] = useState(false);
  const [showGrammarModal, setShowGrammarModal] = useState(false);

  // New state for sentence completion
  const [partialSentence, setPartialSentence] = useState('');
  const [sentenceCompletions, setSentenceCompletions] = useState([]);
  const [isCompletingSentence, setIsCompletingSentence] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // New state for cultural insights
  const [culturalInsight, setCulturalInsight] = useState(null); 
  const [isGettingCulturalInsight, setIsGettingCulturalInsight] = useState(false);
  const [showCulturalInsightModal, setShowCulturalInsightModal] = useState(false);

  // New states for summarization and vocabulary extraction
  const [storySummary, setStorySummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const [keyVocabulary, setKeyVocabulary] = useState([]); 
  const [isExtractingVocabulary, setIsExtractingVocabulary] = useState(false);
  const [showVocabularyModal, setShowVocabularyModal] = useState(false);

  // New states for Conversation Practice
  const [conversationHistory, setConversationHistory] = useState([]); 
  const [userDialogueInput, setUserDialogueInput] = useState('');
  const [isRespondingToDialogue, setIsRespondingToDialogue] = useState(false);
  const [showDialogueModal, setShowDialogueModal] = useState(false);

  // New states for Pronunciation Guide
  const [wordForPronunciation, setWordForPronunciation] = useState('');
  const [pronunciationGuide, setPronunciationGuide] = useState(null); 
  const [isGettingPronunciation, setIsGettingPronunciation] = useState(false);
  const [showPronunciationModal, setShowPronunciationModal] = useState(false);

  // New states for Role-Playing Scenarios
  const [selectedScenario, setSelectedScenario] = useState('');
  const [rolePlayHistory, setRolePlayHistory] = useState([]); 
  const [rolePlayUserInput, setRolePlayUserInput] = useState('');
  const [isRolePlayingResponding, setIsRolePlayingResponding] = useState(false);
  const [showRolePlayModal, setShowRolePlayModal] = useState(false);

  // New states for Flashcard Generator
  const [flashcardInput, setFlashcardInput] = useState('');
  const [flashcards, setFlashcards] = useState([]); 
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);


  // Refs for speech synthesis
  const utteranceRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const storySegmentsRef = useRef([]);

  // New refs for sentence-by-sentence speaking
  const globalSpeechOffsetRef = useRef(0);
  const sentenceQueueRef = useRef([]);

  // Ref for dialogue chat scroll
  const dialogueChatRef = useRef(null);
  const rolePlayChatRef = useRef(null);

  // State for modal resizing for all modals
  const [wordModalWidth, setWordModalWidth] = useState(512); 
  const [wordModalHeight, setWordModalHeight] = useState('auto');
  const [isWordModalResizing, setIsWordModalResizing] = useState(false);
  const [wordModalX, setWordModalX] = useState(0);
  const [wordModalY, setWordModalY] = useState(0);
  const [isWordModalDragging, setIsWordModalDragging] = useState(false);
  const wordModalRef = useRef(null);

  const [quizModalWidth, setQuizModalWidth] = useState(768); 
  const [quizModalHeight, setQuizModalHeight] = useState('auto');
  const [isQuizModalResizing, setIsQuizModalResizing] = useState(false);
  const [quizModalX, setQuizModalX] = useState(0);
  const [quizModalY, setQuizModalY] = useState(0);
  const [isQuizModalDragging, setIsQuizModalDragging] = useState(false);
  const quizModalRef = useRef(null);

  const [rephraseModalWidth, setRephraseModalWidth] = useState(512);
  const [rephraseModalHeight, setRephraseModalHeight] = useState('auto');
  const [isRephraseModalResizing, setIsRephraseModalResizing] = useState(false);
  const [rephraseModalX, setRephraseModalX] = useState(0);
  const [rephraseModalY, setRephraseModalY] = useState(0);
  const [isRephraseModalDragging, setIsRephraseModalDragging] = useState(false);
  const rephraseModalRef = useRef(null);

  const [grammarModalWidth, setGrammarModalWidth] = useState(512);
  const [grammarModalHeight, setGrammarModalHeight] = useState('auto');
  const [isGrammarModalResizing, setIsGrammarModalResizing] = useState(false);
  const [grammarModalX, setGrammarModalX] = useState(0);
  const [grammarModalY, setGrammarModalY] = useState(0);
  const [isGrammarModalDragging, setIsGrammarModalDragging] = useState(false);
  const grammarModalRef = useRef(null);

  const [completionModalWidth, setCompletionModalWidth] = useState(512);
  const [completionModalHeight, setCompletionModalHeight] = useState('auto');
  const [isCompletionModalResizing, setIsCompletionModalResizing] = useState(false);
  const [completionModalX, setCompletionModalX] = useState(0);
  const [completionModalY, setCompletionModalY] = useState(0);
  const [isCompletionModalDragging, setIsCompletionModalDragging] = useState(false);
  const completionModalRef = useRef(null);

  const [culturalModalWidth, setCulturalModalWidth] = useState(512);
  const [culturalModalHeight, setCulturalModalHeight] = useState('auto');
  const [isCulturalModalResizing, setIsCulturalModalResizing] = useState(false);
  const [culturalModalX, setCulturalModalX] = useState(0);
  const [culturalModalY, setCulturalModalY] = useState(0);
  const [isCulturalModalDragging, setIsCulturalModalDragging] = useState(false);
  const culturalModalRef = useRef(null);

  const [summaryModalWidth, setSummaryModalWidth] = useState(512);
  const [summaryModalHeight, setSummaryModalHeight] = useState('auto');
  const [isSummaryModalResizing, setIsSummaryModalResizing] = useState(false);
  const [summaryModalX, setSummaryModalX] = useState(0);
  const [summaryModalY, setSummaryModalY] = useState(0);
  const [isSummaryModalDragging, setIsSummaryModalDragging] = useState(false);
  const summaryModalRef = useRef(null);

  const [vocabularyModalWidth, setVocabularyModalWidth] = useState(512);
  const [vocabularyModalHeight, setVocabularyModalHeight] = useState('auto');
  const [isVocabularyModalResizing, setIsVocabularyModalResizing] = useState(false);
  const [vocabularyModalX, setVocabularyModalX] = useState(0);
  const [vocabularyModalY, setVocabularyModalY] = useState(0);
  const [isVocabularyModalDragging, setIsVocabularyModalDragging] = useState(false);
  const vocabularyModalRef = useRef(null);

  const [dialogueModalWidth, setDialogueModalWidth] = useState(512);
  const [dialogueModalHeight, setDialogueModalHeight] = useState(window.innerHeight * 0.75);
  const [isDialogueModalResizing, setIsDialogueModalResizing] = useState(false);
  const [dialogueModalX, setDialogueModalX] = useState(0);
  const [dialogueModalY, setDialogueModalY] = useState(0);
  const [isDialogueModalDragging, setIsDialogueModalDragging] = useState(false);
  const dialogueModalRef = useRef(null);

  const [settingsModalWidth, setSettingsModalWidth] = useState(512);
  const [settingsModalHeight, setSettingsModalHeight] = useState('auto');
  const [isSettingsModalResizing, setIsSettingsModalResizing] = useState(false);
  const [settingsModalX, setSettingsModalX] = useState(0);
  const [settingsModalY, setSettingsModalY] = useState(0);
  const [isSettingsModalDragging, setIsSettingsModalDragging] = useState(false);
  const settingsModalRef = useRef(null);

  const [errorModalWidth, setErrorModalWidth] = useState(384); 
  const [errorModalHeight, setErrorModalHeight] = useState('auto');
  const [isErrorModalResizing, setIsErrorModalResizing] = useState(false);
  const [errorModalX, setErrorModalX] = useState(0);
  const [errorModalY, setErrorModalY] = useState(0);
  const [isErrorModalDragging, setIsErrorModalDragging] = useState(false);
  const errorModalRef = useRef(null);

  const [pronunciationModalWidth, setPronunciationModalWidth] = useState(512);
  const [pronunciationModalHeight, setPronunciationModalHeight] = useState('auto');
  const [isPronunciationModalResizing, setIsPronunciationModalResizing] = useState(false);
  const [pronunciationModalX, setPronunciationModalX] = useState(0);
  const [pronunciationModalY, setPronunciationModalY] = useState(0);
  const [isPronunciationModalDragging, setIsPronunciationModalDragging] = useState(false);
  const pronunciationModalRef = useRef(null);

  const [rolePlayModalWidth, setRolePlayModalWidth] = useState(512);
  const [rolePlayModalHeight, setRolePlayModalHeight] = useState(window.innerHeight * 0.75);
  const [isRolePlayModalResizing, setIsRolePlayModalResizing] = useState(false);
  const [rolePlayModalX, setRolePlayModalX] = useState(0);
  const [rolePlayModalY, setRolePlayModalY] = useState(0);
  const [isRolePlayModalDragging, setIsRolePlayModalDragging] = useState(false);
  const rolePlayModalRef = useRef(null);

  const [flashcardModalWidth, setFlashcardModalWidth] = useState(600);
  const [flashcardModalHeight, setFlashcardModalHeight] = useState('auto');
  const [isFlashcardModalResizing, setIsFlashcardModalResizing] = useState(false);
  const [flashcardModalX, setFlashcardModalX] = useState(0);
  const [flashcardModalY, setFlashcardModalY] = useState(0);
  const [isFlashcardModalDragging, setIsFlashcardModalDragging] = useState(false);
  const flashcardModalRef = useRef(null);

  const languageMap = {
    'ar': 'Arabic',
    'en': 'English',
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German'
  };


  // Function to get available voices and select a default one
  const updateVoicesAndSetDefault = () => {
    const voices = speechSynthesisRef.current.getVoices();
    if (voices.length > 0) {
      let preferredVoice = voices.find(voice => voice.lang.toLowerCase() === targetLanguage.toLowerCase() || voice.lang.toLowerCase().startsWith(targetLanguage.toLowerCase() + '-'));
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => voice.lang.toLowerCase().startsWith(targetLanguage.toLowerCase()));
      }
      if (!preferredVoice) {
        preferredVoice = voices[0];
        showError(`لا يوجد صوت متاح للغة ${languageMap[targetLanguage] || targetLanguage}. سيتم استخدام صوت افتراضي. قد لا يكون النطق دقيقًا. يرجى التحقق من إعدادات المتصفح وحزم اللغة المثبتة.`);
      }
      setSpeechVoice(preferredVoice);
    } else {
      setSpeechVoice(null); 
    }
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    const handleVoicesChanged = () => {
      updateVoicesAndSetDefault();
    };
    speechSynthesisRef.current.onvoiceschanged = handleVoicesChanged;
    updateVoicesAndSetDefault(); 
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel(); 
        speechSynthesisRef.current.onvoiceschanged = null; 
      }
    };
  }, [targetLanguage]); 

  useEffect(() => {
    if (dialogueChatRef.current) {
      dialogueChatRef.current.scrollTop = dialogueChatRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  useEffect(() => {
    if (rolePlayChatRef.current) {
      rolePlayChatRef.current.scrollTop = rolePlayChatRef.current.scrollHeight;
    }
  }, [rolePlayHistory]);

  const useModalInteractionHooks = (
    setWidth,
    setHeight,
    setX,
    setY,
    isResizingState,
    setIsResizingState,
    isDraggingState,
    setIsDraggingState,
    modalRef,
    minWidth,
    minHeight,
    defaultWidth,
    defaultHeight 
  ) => {
    const offsetX = useRef(0);
    const offsetY = useRef(0);

    const startResize = useCallback((e) => {
      setIsResizingState(true);
      e.preventDefault();
    }, [setIsResizingState]);

    const startDrag = useCallback((e) => {
      // Ensure dragging only starts if the mousedown event originated from the drag handle
      if (modalRef.current && e.target.classList.contains('modal-drag-handle')) {
        const modalRect = modalRef.current.getBoundingClientRect();
        offsetX.current = e.clientX - modalRect.left;
        offsetY.current = e.clientY - modalRect.top;
        setIsDraggingState(true);
        e.preventDefault();
      }
    }, [setIsDraggingState, modalRef]);

    const handleInteraction = useCallback((e) => {
      if (isResizingState && modalRef.current) {
        const modalRect = modalRef.current.getBoundingClientRect();
        const newWidth = Math.max(minWidth, e.clientX - modalRect.left);
        const newHeight = Math.max(minHeight, e.clientY - modalRect.top);
        setWidth(newWidth);
        setHeight(newHeight);
      } else if (isDraggingState && modalRef.current) {
        let newX = e.clientX - offsetX.current;
        let newY = e.clientY - offsetY.current;
        const modalRect = modalRef.current.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - modalRect.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - modalRect.height));
        setX(newX);
        setY(newY);
      }
    }, [isResizingState, isDraggingState, modalRef, minWidth, minHeight, setWidth, setHeight, setX, setY]);

    const stopInteraction = useCallback(() => {
      setIsResizingState(false);
      setIsDraggingState(false);
    }, [setIsResizingState, setIsDraggingState]);

    useEffect(() => {
      const initialPositioning = () => {
        if (modalRef.current) {
          const currentModalRect = modalRef.current.getBoundingClientRect();
          const effectiveWidth = defaultWidth === 'auto' ? currentModalRect.width : defaultWidth;
          // For 'auto' height, we might need to rely on a brief render cycle or a sensible default for initial centering
          const tempDefaultHeight = 400; // A sensible default if actual height isn't known yet
          const effectiveHeight = defaultHeight === 'auto' ? (currentModalRect.height > 50 ? currentModalRect.height : tempDefaultHeight) : defaultHeight;


          if ((modalRef.current.style.left === '' && modalRef.current.style.top === '') ||
              (parseFloat(modalRef.current.style.left) === 0 && parseFloat(modalRef.current.style.top) === 0)) {
             setX(Math.max(0, (window.innerWidth - effectiveWidth) / 2));
             setY(Math.max(0, (window.innerHeight - effectiveHeight) / 2));
          }
        }
      };
      const timeoutId = setTimeout(initialPositioning, 50);
      if (isResizingState || isDraggingState) {
        window.addEventListener('mousemove', handleInteraction);
        window.addEventListener('mouseup', stopInteraction);
      } else {
        window.removeEventListener('mousemove', handleInteraction);
        window.removeEventListener('mouseup', stopInteraction);
      }
      return () => {
        clearTimeout(timeoutId); 
        window.removeEventListener('mousemove', handleInteraction);
        window.removeEventListener('mouseup', stopInteraction);
      };
    }, [isResizingState, isDraggingState, handleInteraction, stopInteraction, setX, setY, defaultWidth, defaultHeight, modalRef]);

    return { startResize, startDrag };
  };

  const { startResize: startWordModalResize, startDrag: startWordModalDrag } = useModalInteractionHooks(setWordModalWidth, setWordModalHeight, setWordModalX, setWordModalY, isWordModalResizing, setIsWordModalResizing, isWordModalDragging, setIsWordModalDragging, wordModalRef, 300, 250, 512, 'auto');
  const { startResize: startQuizModalResize, startDrag: startQuizModalDrag } = useModalInteractionHooks(setQuizModalWidth, setQuizModalHeight, setQuizModalX, setQuizModalY, isQuizModalResizing, setIsQuizModalResizing, isQuizModalDragging, setIsQuizModalDragging, quizModalRef, 400, 350, 768, 'auto');
  const { startResize: startRephraseModalResize, startDrag: startRephraseModalDrag } = useModalInteractionHooks(setRephraseModalWidth, setRephraseModalHeight, setRephraseModalX, setRephraseModalY, isRephraseModalResizing, setIsRephraseModalResizing, isRephraseModalDragging, setIsRephraseModalDragging, rephraseModalRef, 300, 200, 512, 'auto');
  const { startResize: startGrammarModalResize, startDrag: startGrammarModalDrag } = useModalInteractionHooks(setGrammarModalWidth, setGrammarModalHeight, setGrammarModalX, setGrammarModalY, isGrammarModalResizing, setIsGrammarModalResizing, isGrammarModalDragging, setIsGrammarModalDragging, grammarModalRef, 300, 250, 512, 'auto');
  const { startResize: startCompletionModalResize, startDrag: startCompletionModalDrag } = useModalInteractionHooks(setCompletionModalWidth, setCompletionModalHeight, setCompletionModalX, setCompletionModalY, isCompletionModalResizing, setIsCompletionModalResizing, isCompletionModalDragging, setIsCompletionModalDragging, completionModalRef, 300, 200, 512, 'auto');
  const { startResize: startCulturalModalResize, startDrag: startCulturalModalDrag } = useModalInteractionHooks(setCulturalModalWidth, setCulturalModalHeight, setCulturalModalX, setCulturalModalY, isCulturalModalResizing, setIsCulturalModalResizing, isCulturalModalDragging, setIsCulturalModalDragging, culturalModalRef, 300, 200, 512, 'auto');
  const { startResize: startSummaryModalResize, startDrag: startSummaryModalDrag } = useModalInteractionHooks(setSummaryModalWidth, setSummaryModalHeight, setSummaryModalX, setSummaryModalY, isSummarizing, setIsSummarizing, isSummaryModalDragging, setIsSummaryModalDragging, summaryModalRef, 300, 200, 512, 'auto');
  const { startResize: startVocabularyModalResize, startDrag: startVocabularyModalDrag } = useModalInteractionHooks(setVocabularyModalWidth, setVocabularyModalHeight, setVocabularyModalX, setVocabularyModalY, isVocabularyModalResizing, setIsVocabularyModalResizing, isVocabularyModalDragging, setIsVocabularyModalDragging, vocabularyModalRef, 300, 250, 512, 'auto');
  const { startResize: startDialogueModalResize, startDrag: startDialogueModalDrag } = useModalInteractionHooks(setDialogueModalWidth, setDialogueModalHeight, setDialogueModalX, setDialogueModalY, isDialogueModalResizing, setIsDialogueModalResizing, isDialogueModalDragging, setIsDialogueModalDragging, dialogueModalRef, 300, 300, 512, window.innerHeight * 0.75);
  const { startResize: startSettingsModalResize, startDrag: startSettingsModalDrag } = useModalInteractionHooks(setSettingsModalWidth, setSettingsModalHeight, setSettingsModalX, setSettingsModalY, isSettingsModalResizing, setIsSettingsModalResizing, isSettingsModalDragging, setIsSettingsModalDragging, settingsModalRef, 300, 250, 512, 'auto');
  const { startResize: startErrorModalResize, startDrag: startErrorModalDrag } = useModalInteractionHooks(setErrorModalWidth, setErrorModalHeight, setErrorModalX, setErrorModalY, isErrorModalResizing, setIsErrorModalResizing, isErrorModalDragging, setIsErrorModalDragging, errorModalRef, 250, 150, 384, 'auto');
  const { startResize: startPronunciationModalResize, startDrag: startPronunciationModalDrag } = useModalInteractionHooks(setPronunciationModalWidth, setPronunciationModalHeight, setPronunciationModalX, setPronunciationModalY, isPronunciationModalResizing, setIsPronunciationModalResizing, isPronunciationModalDragging, setIsPronunciationModalDragging, pronunciationModalRef, 300, 250, 512, 'auto');
  const { startResize: startRolePlayModalResize, startDrag: startRolePlayModalDrag } = useModalInteractionHooks(setRolePlayModalWidth, setRolePlayModalHeight, setRolePlayModalX, setRolePlayModalY, isRolePlayModalResizing, setIsRolePlayModalResizing, isRolePlayModalDragging, setIsRolePlayModalDragging, rolePlayModalRef, 300, 300, 512, window.innerHeight * 0.75);
  const { startResize: startFlashcardModalResize, startDrag: startFlashcardModalDrag } = useModalInteractionHooks(setFlashcardModalWidth, setFlashcardModalHeight, setFlashcardModalX, setFlashcardModalY, isFlashcardModalResizing, setIsFlashcardModalResizing, isFlashcardModalDragging, setIsFlashcardModalDragging, flashcardModalRef, 400, 300, 600, 'auto');


  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
    setErrorModalWidth(384);
    setErrorModalHeight('auto');
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const saveApiKey = () => {
    localStorage.setItem('geminiApiKey', apiKey);
    setShowSettings(false); 
    showError('تم حفظ مفتاح الـ API بنجاح!');
  };

  const generateStory = async () => {
    setIsGeneratingStory(true);
    setStoryText('');
    setTranslatedStoryText('');
    setGeneratedImageUrl('');
    setHighlightedWordIndex(-1);
    setIsSpeaking(false);
    speechSynthesisRef.current.cancel(); 

    if (!apiKey) {
      showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات.');
      setIsGeneratingStory(false);
      return;
    }
    if (!topicInput) {
      showError('الرجاء إدخال موضوع للقصة.');
      setIsGeneratingStory(false);
      return;
    }
    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Write a short, well-structured story with clear paragraphs and cohesive sentences. The story must be entirely in ${currentTargetLanguageName}, suitable for ${learningLevel} level. The story should be about: "${topicInput}". Do not use any single or double quotes in the text. Ensure to use line breaks (like two newlines for a new paragraph) to create separate paragraphs and make the text easy to read.`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; 
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const text = result.candidates[0].content.parts[0].text.replace(/['"]/g, '').trim();
        setStoryText(text);
        const segments = [];
        const wordAndSpaceRegex = /(\S+)(\s*)/g;
        let match;
        while ((match = wordAndSpaceRegex.exec(text)) !== null) {
          segments.push({ type: 'word', content: match[1], startIndex: match.index, endIndex: match.index + match[1].length });
          if (match[2]?.length > 0) {
            segments.push({ type: 'space', content: match[2], startIndex: match.index + match[1].length, endIndex: match.index + match[1].length + match[2].length });
          }
        }
        storySegmentsRef.current = segments;
        if (targetLanguage !== 'ar') await generateTranslation(text, 'ar');
      } else {
        showError('فشل في توليد القصة. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API response error:', result);
      }
    } catch (error) {
      console.error('Error generating story:', error);
      showError('حدث خطأ أثناء توليد القصة. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const generateTranslation = async (text, targetLangCode) => {
    if (!apiKey) {
      showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين الترجمة.');
      return;
    }
    const targetLanguageName = languageMap[targetLangCode] || targetLangCode;
    const prompt = `Translate the following text into ${targetLanguageName}: "${text}". Do not use any single or double quotes in the translated text.`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        setTranslatedStoryText(result.candidates[0].content.parts[0].text.replace(/['"]/g, '').trim());
      } else {
        console.error('Gemini API translation error:', result);
      }
    } catch (error) {
      console.error('Error generating translation:', error);
    }
  };

  const generateImage = async () => {
    setIsGeneratingImage(true);
    setGeneratedImageUrl('');
    if (!apiKey) {
      showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين توليد الصور.');
      setIsGeneratingImage(false);
      return;
    }
    if (!storyText) {
      showError('الرجاء توليد القصة أولاً قبل توليد الصورة.');
      setIsGeneratingImage(false);
      return;
    }
    const imagePrompt = `Artistic cartoon style image illustrating the theme of the story: "${storyText.substring(0, 100)}..."`;
    try {
      const payload = { instances: { prompt: imagePrompt }, parameters: { "sampleCount": 1} };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        setGeneratedImageUrl(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
      } else {
        showError('فشل في توليد الصورة. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Imagen API response error:', result);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      showError('حدث خطأ أثناء توليد الصورة. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleWordClick = async (word) => {
    setSelectedWordForExplanation(word);
    setWordExplanation(null); 
    setIsExplainingWord(true);
    setShowErrorModal(false); 
    setShowPronunciationModal(false); 
    setShowRolePlayModal(false);
    setShowFlashcardModal(false);
    setWordModalWidth(512);
    setWordModalHeight('auto'); 

    if (!apiKey) {
      showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين شرح الكلمات.');
      setIsExplainingWord(false);
      return;
    }
    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Provide a detailed explanation for the word '${word}' in ${currentTargetLanguageName} (this will be 'explanation_target_lang'). Also provide an Arabic translation of this explanation (this will be 'explanation_ar'). Then, list synonyms for '${word}' in ${currentTargetLanguageName} (as 'synonyms_target_lang'), antonyms for '${word}' in ${currentTargetLanguageName} (as 'antonyms_target_lang'), three example sentences using '${word}' in ${currentTargetLanguageName} (as 'examples_target_lang', an array of strings), and finally the Arabic translation of the word '${word}' itself (as 'word_translation_ar'). Format the response as a JSON object.`;

    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              explanation_target_lang: { type: "STRING" },
              explanation_ar: { type: "STRING" },
              synonyms_target_lang: { type: "STRING" },
              antonyms_target_lang: { type: "STRING" },
              examples_target_lang: { type: "ARRAY", items: { type: "STRING" } },
              word_translation_ar: { type: "STRING" }
            },
             propertyOrdering: ["explanation_target_lang", "explanation_ar", "synonyms_target_lang", "antonyms_target_lang", "examples_target_lang", "word_translation_ar"]
          }
        }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        const parsedExplanation = JSON.parse(jsonText);
        setWordExplanation(parsedExplanation);
      } else {
        showError('فشل في الحصول على شرح الكلمة. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API word explanation error:', result);
      }
    } catch (error) {
      console.error('Error fetching word explanation:', error);
      showError('حدث خطأ أثناء جلب شرح الكلمة. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsExplainingWord(false);
    }
  };

  const generateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setQuizQuestions([]);
    setUserAnswers({});
    setQuizResults(null);
    setShowErrorModal(false); 
    setShowPronunciationModal(false); 
    setShowRolePlayModal(false);
    setShowFlashcardModal(false);
    setQuizModalWidth(768);
    setQuizModalHeight('auto');

    if (!apiKey) {
      showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين توليد الاختبارات.');
      setIsGeneratingQuiz(false);
      return;
    }
    if (!storyText) {
      showError('الرجاء توليد قصة أولاً لإنشاء اختبار.');
      setIsGeneratingQuiz(false);
      return;
    }
    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Generate 3 multiple-choice questions based on the following story in ${currentTargetLanguageName} for ${learningLevel} level. For each question, provide 4 options (A, B, C, D) and indicate the correct answer. Also, provide an Arabic translation for each question and its options.
    Format the response as a JSON array of objects. Each object should have:
    - 'question': The question text in ${currentTargetLanguageName}.
    - 'question_ar': The question text in Arabic.
    - 'options': An array of 4 strings (A, B, C, D) in ${currentTargetLanguageName}.
    - 'options_ar': An array of 4 strings (A, B, C, D) in Arabic.
    - 'correct_answer': The letter of the correct option (e.g., 'A', 'B').

    Story:
    "${storyText}"`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                question_ar: { type: "STRING" },
                options: { type: "ARRAY", items: { type: "STRING" } },
                options_ar: { type: "ARRAY", items: { type: "STRING" } },
                correct_answer: { type: "STRING" }
              },
            }
          }
        }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        const parsedQuiz = JSON.parse(jsonText);
        setQuizQuestions(parsedQuiz);
        setShowQuizModal(true); 
      } else {
        showError('فشل في توليد الاختبار. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API quiz generation error:', result);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      showError('حدث خطأ أثناء توليد الاختبار. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: selectedOption }));
  };

  const checkQuizAnswers = () => {
    let score = 0;
    quizQuestions.forEach((q, index) => { if (userAnswers[index] === q.correct_answer) score++; });
    setQuizResults({ score, total: quizQuestions.length, feedback: `لقد حصلت على ${score} من ${quizQuestions.length} إجابات صحيحة.` });
  };

  const rephraseSentence = async () => {
    setIsRephrasing(true);
    setRephrasedSentenceData(null);
    setShowErrorModal(false); setShowPronunciationModal(false); setShowRolePlayModal(false); setShowFlashcardModal(false);
    setRephraseModalWidth(512); setRephraseModalHeight('auto');

    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين إعادة صياغة الجمل.'); setIsRephrasing(false); return; }
    if (!sentenceToRephrase.trim()) { showError('الرجاء إدخال جملة لإعادة صياغتها.'); setIsRephrasing(false); return; }
    
    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Rephrase the following sentence in ${currentTargetLanguageName} for ${learningLevel} level, making it simpler or clearer if possible. Explain the changes made (explanation should be in Arabic). Provide output as a JSON object with keys: 'original' (in ${currentTargetLanguageName}), 'rephrased' (in ${currentTargetLanguageName}), and 'explanation' (in Arabic).\n\nSentence: "${sentenceToRephrase}"`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: { type: "OBJECT", properties: { original: { type: "STRING" }, rephrased: { type: "STRING" }, explanation: { type: "STRING" } } }
        }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const parsedData = JSON.parse(result.candidates[0].content.parts[0].text);
        setRephrasedSentenceData(parsedData);
        setShowRephraseModal(true);
      } else {
        showError('فشل في إعادة صياغة الجملة. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API rephrase error:', result);
      }
    } catch (error) {
      console.error('Error rephrasing sentence:', error);
      showError('حدث خطأ أثناء إعادة صياغة الجملة. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsRephrasing(false);
    }
  };

  const analyzeGrammar = async () => {
    setIsAnalyzingGrammar(true);
    setGrammarAnalysis(null);
    setShowErrorModal(false); setShowPronunciationModal(false); setShowRolePlayModal(false); setShowFlashcardModal(false);
    setGrammarModalWidth(512); setGrammarModalHeight('auto');

    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين فحص القواعد النحوية.'); setIsAnalyzingGrammar(false); return; }
    if (!sentenceToCheckGrammar.trim()) { showError('الرجاء إدخال جملة لفحص القواعد النحوية.'); setIsAnalyzingGrammar(false); return; }
    
    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Analyze the grammar of the following sentence in ${currentTargetLanguageName}. Identify any errors, provide the corrected sentence (in ${currentTargetLanguageName}), and explain the grammar rules violated for each error (explanation in Arabic). Provide output as a JSON object with keys: 'original' (in ${currentTargetLanguageName}), 'corrected' (in ${currentTargetLanguageName}), and 'errors' (an array of objects, each with 'error' in ${currentTargetLanguageName} and 'explanation' in Arabic).\n\nSentence: "${sentenceToCheckGrammar}"`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: { type: "OBJECT", properties: { original: { type: "STRING" }, corrected: { type: "STRING" }, errors: { type: "ARRAY", items: { type: "OBJECT", properties: { error: { type: "STRING" }, explanation: { type: "STRING" } } } } } }
        }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const parsedData = JSON.parse(result.candidates[0].content.parts[0].text);
        setGrammarAnalysis(parsedData);
        setShowGrammarModal(true);
      } else {
        showError('فشل في فحص القواعد النحوية. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API grammar error:', result);
      }
    } catch (error) {
      console.error('Error analyzing grammar:', error);
      showError('حدث خطأ أثناء فحص القواعد النحوية. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsAnalyzingGrammar(false);
    }
  };

  const getSentenceCompletions = async () => {
    setIsCompletingSentence(true);
    setSentenceCompletions([]);
    setShowErrorModal(false); setShowPronunciationModal(false); setShowRolePlayModal(false); setShowFlashcardModal(false);
    setCompletionModalWidth(512); setCompletionModalHeight('auto');

    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين إكمال الجمل.'); setIsCompletingSentence(false); return; }
    if (!partialSentence.trim()) { showError('الرجاء إدخال جملة جزئية للإكمال.'); setIsCompletingSentence(false); return; }

    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Given the partial sentence '${partialSentence}' in ${currentTargetLanguageName}, provide 3 natural and grammatically correct ways to complete it. Return as a JSON array of strings, where each string is a completion in ${currentTargetLanguageName}.`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: { responseMimeType: "application/json", responseSchema: { type: "ARRAY", items: { type: "STRING" } } }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const parsedCompletions = JSON.parse(result.candidates[0].content.parts[0].text);
        setSentenceCompletions(parsedCompletions);
        setShowCompletionModal(true);
      } else {
        showError('فشل في الحصول على إكمال الجملة. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API sentence completion error:', result);
      }
    } catch (error) {
      console.error('Error getting sentence completions:', error);
      showError('حدث خطأ أثناء جلب إكمال الجملة. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsCompletingSentence(false);
    }
  };

  const getCulturalInsights = async () => {
    setIsGettingCulturalInsight(true);
    setCulturalInsight(null);
    setShowErrorModal(false); setShowPronunciationModal(false); setShowRolePlayModal(false); setShowFlashcardModal(false);
    setCulturalModalWidth(512); setCulturalModalHeight('auto');
    
    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين الرؤى الثقافية.'); setIsGettingCulturalInsight(false); return; }
    
    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Provide a brief cultural insight related to the topic of '${topicInput || "general culture"}' or the overall theme of this story: '${storyText.substring(0, Math.min(storyText.length, 100)) || "language learning"}' relevant to ${currentTargetLanguageName}-speaking cultures for a language learner at ${learningLevel}. Focus on customs, traditions, or common social norms. The insight itself should be in ${currentTargetLanguageName}, and the title in Arabic. Return as a JSON object with keys: 'title' (in Arabic), 'insight' (in ${currentTargetLanguageName}).`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { title: { type: "STRING" }, insight: { type: "STRING" } } } }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const parsedInsight = JSON.parse(result.candidates[0].content.parts[0].text);
        setCulturalInsight(parsedInsight);
        setShowCulturalInsightModal(true);
      } else {
        showError('فشل في الحصول على رؤى ثقافية. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API cultural insight error:', result);
      }
    } catch (error) {
      console.error('Error getting cultural insights:', error);
      showError('حدث خطأ أثناء جلب رؤى ثقافية. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsGettingCulturalInsight(false);
    }
  };

  const summarizeStory = async () => {
    setIsSummarizing(true);
    setStorySummary('');
    setShowErrorModal(false); setShowPronunciationModal(false); setShowRolePlayModal(false); setShowFlashcardModal(false);
    setSummaryModalWidth(512); setSummaryModalHeight('auto');

    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين تلخيص القصة.'); setIsSummarizing(false); return; }
    if (!storyText) { showError('الرجاء توليد قصة أولاً لتلخيصها.'); setIsSummarizing(false); return; }

    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Summarize the following story in ${currentTargetLanguageName}. Keep the summary concise and focus on the main plot points.\n\nStory:\n"${storyText}"`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        setStorySummary(result.candidates[0].content.parts[0].text);
        setShowSummaryModal(true);
      } else {
        showError('فشل في تلخيص القصة. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API summarization error:', result);
      }
    } catch (error) {
      console.error('Error summarizing story:', error);
      showError('حدث خطأ أثناء تلخيص القصة. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const extractKeyVocabulary = async () => {
    setIsExtractingVocabulary(true);
    setKeyVocabulary([]);
    setShowErrorModal(false); setShowPronunciationModal(false); setShowRolePlayModal(false); setShowFlashcardModal(false);
    setVocabularyModalWidth(512); setVocabularyModalHeight('auto');

    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين استخراج المفردات.'); setIsExtractingVocabulary(false); return; }
    if (!storyText) { showError('الرجاء توليد قصة أولاً لاستخراج المفردات.'); setIsExtractingVocabulary(false); return; }

    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Extract 5-7 key vocabulary words from the following story in ${currentTargetLanguageName}. For each word, provide its translation to Arabic and a very brief explanation in Arabic. Return as a JSON array of objects. Each object should have keys: 'word' (in ${currentTargetLanguageName}), 'translation' (in Arabic), 'explanation' (in Arabic).\n\nStory:\n"${storyText}"`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: { responseMimeType: "application/json", responseSchema: { type: "ARRAY", items: { type: "OBJECT", properties: { word: { type: "STRING" }, translation: { type: "STRING" }, explanation: { type: "STRING" } } } } }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const parsedVocabulary = JSON.parse(result.candidates[0].content.parts[0].text);
        setKeyVocabulary(parsedVocabulary);
        setShowVocabularyModal(true);
      } else {
        showError('فشل في استخراج المفردات. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API vocabulary extraction error:', result);
      }
    } catch (error) {
      console.error('Error extracting vocabulary:', error);
      showError('حدث خطأ أثناء استخراج المفردات. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsExtractingVocabulary(false);
    }
  };

  const startDialoguePractice = async () => {
    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين ممارسة المحادثة.'); return; }
    setConversationHistory([]); setUserDialogueInput(''); setIsRespondingToDialogue(true); 
    setShowDialogueModal(true); setShowPronunciationModal(false); setShowRolePlayModal(false); setShowFlashcardModal(false);
    setDialogueModalWidth(512); setDialogueModalHeight(window.innerHeight * 0.75);

    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const dialogueTopic = topicInput ? `about the story topic: "${topicInput}"` : 'general language practice';
    const initialGreetingPrompt = `You are a friendly language tutor. Start a conversation with the user in ${currentTargetLanguageName} at an ${learningLevel} level. The topic can be ${dialogueTopic}. Your first message should be an engaging opening line entirely in ${currentTargetLanguageName}. Do not use any English or other languages in your response, only ${currentTargetLanguageName}. Do not use any single or double quotes in your responses.`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: initialGreetingPrompt }] }];
      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const aiInitialMessage = result.candidates[0].content.parts[0].text.replace(/['"]/g, '').trim();
        setConversationHistory([{ role: 'model', text: aiInitialMessage }]);
      } else {
        let fallbackInitialPrompt = `Hello! Let's start our conversation in ${currentTargetLanguageName}. What would you like to talk about today?`;
        if (currentTargetLanguageName === "German") fallbackInitialPrompt = "Hallo! Beginnen wir unser Gespräch. Worüber möchten Sie heute sprechen?";
        setConversationHistory([{ role: 'model', text: fallbackInitialPrompt }]);
        showError('لم يتمكن الذكاء الاصطناعي من إنشاء رسالة بدء مناسبة، سيتم استخدام رسالة افتراضية.');
        console.error("Gemini API error for initial dialogue prompt:", result);
      }
    } catch (error) {
      console.error('Error starting dialogue practice with AI generated prompt:', error);
      let fallbackInitialPrompt = `Error starting. Let's begin our conversation in ${currentTargetLanguageName}.`;
      if (currentTargetLanguageName === "German") fallbackInitialPrompt = "Hallo! Beginnen wir unser Gespräch. Worüber möchten Sie heute sprechen?";
      setConversationHistory([{ role: 'model', text: fallbackInitialPrompt }]);
      showError('حدث خطأ أثناء بدء ممارسة المحادثة. سيتم استخدام رسالة افتراضية.');
    } finally {
      setIsRespondingToDialogue(false); 
    }
};

  const sendDialogueMessage = async () => {
    if (!userDialogueInput.trim() || isRespondingToDialogue) return;
    const newUserMessage = { role: 'user', text: userDialogueInput.trim() };
    setConversationHistory(prev => [...prev, newUserMessage]);
    setUserDialogueInput('');
    setIsRespondingToDialogue(true);

    const currentChatHistory = [...conversationHistory, newUserMessage].map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const dialogueTopic = topicInput ? `about the story topic: "${topicInput}"` : 'general language practice';
    const systemPrompt = `You are a friendly and helpful language tutor. Your goal is to help the user practice their ${currentTargetLanguageName} skills at an ${learningLevel} level. Engage in a natural conversation with the user in ${currentTargetLanguageName}. The conversation can be ${dialogueTopic}. Keep your responses concise and encourage the user to speak. Do not use any single or double quotes in your responses.`;
    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }, ...currentChatHistory],
        generationConfig: { temperature: 0.7 }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const aiResponseText = result.candidates[0].content.parts[0].text.replace(/['"]/g, '').trim();
        setConversationHistory(prev => [...prev, { role: 'model', text: aiResponseText }]);
      } else {
        showError('فشل في الحصول على رد. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API dialogue error:', result);
        setConversationHistory(prev => [...prev, { role: 'model', text: `عذراً، حدث خطأ. هل يمكنك المحاولة مرة أخرى؟ (In ${currentTargetLanguageName})` }]);
      }
    } catch (error) {
      console.error('Error sending dialogue message:', error);
      showError('حدث خطأ أثناء إرسال الرسالة. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
      setConversationHistory(prev => [...prev, { role: 'model', text: `عذراً، حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت. (In ${currentTargetLanguageName})` }]);
    } finally {
      setIsRespondingToDialogue(false);
    }
  };

  const getPronunciationGuide = async () => {
    setIsGettingPronunciation(true);
    setPronunciationGuide(null);
    setShowErrorModal(false); setShowPronunciationModal(true); setShowRolePlayModal(false); setShowFlashcardModal(false);
    setPronunciationModalWidth(512); setPronunciationModalHeight('auto');

    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين دليل النطق.'); setIsGettingPronunciation(false); return; }
    if (!wordForPronunciation.trim()) { showError('الرجاء إدخال كلمة أو عبارة للحصول على دليل النطق.'); setIsGettingPronunciation(false); return; }

    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Provide a phonetic pronunciation guide for the word/phrase '${wordForPronunciation}' in ${currentTargetLanguageName}. Provide pronunciation tips in Arabic. Include common difficulties for Arabic speakers if applicable when learning ${currentTargetLanguageName}. Provide an example sentence using the word/phrase in ${currentTargetLanguageName} and its Arabic translation. Format as a JSON object with keys: 'phonetic' (in ${currentTargetLanguageName}), 'tips' (in Arabic), 'exampleSentence' (in ${currentTargetLanguageName}), 'exampleSentenceTranslation' (in Arabic).`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { phonetic: { type: "STRING" }, tips: { type: "STRING" }, exampleSentence: { type: "STRING" }, exampleSentenceTranslation: { type: "STRING" } } } }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const parsedGuide = JSON.parse(result.candidates[0].content.parts[0].text);
        setPronunciationGuide(parsedGuide);
      } else {
        showError('فشل في الحصول على دليل النطق. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API pronunciation guide error:', result);
      }
    } catch (error) {
      console.error('Error getting pronunciation guide:', error);
      showError('حدث خطأ أثناء جلب دليل النطق. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsGettingPronunciation(false);
    }
  };

  const startRolePlayScenario = async () => {
    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين سيناريوهات لعب الأدوار.'); return; }
    if (!selectedScenario) { showError('الرجاء اختيار سيناريو لبدء لعب الأدوار.'); return; }
    setRolePlayHistory([]); setRolePlayUserInput(''); setIsRolePlayingResponding(true); 
    setShowRolePlayModal(true); setShowPronunciationModal(false); setShowFlashcardModal(false);
    setRolePlayModalWidth(512); setRolePlayModalHeight(window.innerHeight * 0.75);

    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const systemPersonaPrompt = `You are a helpful assistant for a role-playing scenario. The user wants to practice ${currentTargetLanguageName} at an ${learningLevel} level. The scenario is: '${selectedScenario}'. Your first message should be an engaging opening line for this scenario, entirely in ${currentTargetLanguageName}. Do not use any English or other languages in your response, only ${currentTargetLanguageName}. Do not use any single or double quotes in your responses.`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: systemPersonaPrompt }] }];
      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const aiInitialMessage = result.candidates[0].content.parts[0].text.replace(/['"]/g, '').trim();
        setRolePlayHistory([{ role: 'model', text: aiInitialMessage }]);
      } else {
        let fallbackInitialPrompt = `Hello! Let's start the '${selectedScenario}' scenario in ${currentTargetLanguageName}.`;
        if (currentTargetLanguageName === "German") { 
            if (selectedScenario === "restaurant") fallbackInitialPrompt = "Hallo! Willkommen im Restaurant. Was kann ich für Sie tun?";
            else if (selectedScenario === "directions") fallbackInitialPrompt = "Hallo! Kann ich Ihnen helfen, den Weg zu finden?";
            else if (selectedScenario === "shopping") fallbackInitialPrompt = "Hallo! Suchen Sie etwas Bestimmtes?";
            else fallbackInitialPrompt = `Hallo! Beginnen wir das Szenario '${selectedScenario}'.`;
        }
        setRolePlayHistory([{ role: 'model', text: fallbackInitialPrompt }]);
        showError('لم يتمكن الذكاء الاصطناعي من إنشاء رسالة بدء مناسبة، سيتم استخدام رسالة افتراضية.');
        console.error("Gemini API error for initial role-play prompt:", result);
      }
    } catch (error) {
      console.error('Error starting role-play scenario with AI generated prompt:', error);
      let fallbackInitialPrompt = `Error starting. Let's begin the '${selectedScenario}' scenario in ${currentTargetLanguageName}.`;
       if (currentTargetLanguageName === "German") {
          if (selectedScenario === "restaurant") fallbackInitialPrompt = "Hallo! Willkommen im Restaurant. Was kann ich für Sie tun?";
          else if (selectedScenario === "directions") fallbackInitialPrompt = "Hallo! Kann ich Ihnen helfen, den Weg zu finden?";
          else if (selectedScenario === "shopping") fallbackInitialPrompt = "Hallo! Suchen Sie etwas Bestimmtes?";
          else fallbackInitialPrompt = `Hallo! Beginnen wir das Szenario '${selectedScenario}'.`;
      }
      setRolePlayHistory([{ role: 'model', text: fallbackInitialPrompt }]);
      showError('حدث خطأ أثناء بدء سيناريو لعب الأدوار. سيتم استخدام رسالة افتراضية.');
    } finally {
      setIsRolePlayingResponding(false); 
    }
};

  const sendRolePlayMessage = async () => {
    if (!rolePlayUserInput.trim() || isRolePlayingResponding) return;
    const newUserMessage = { role: 'user', text: rolePlayUserInput.trim() };
    setRolePlayHistory(prev => [...prev, newUserMessage]);
    setRolePlayUserInput('');
    setIsRolePlayingResponding(true);

    const currentChatHistory = [...rolePlayHistory, newUserMessage].map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    let persona = '';
    switch (selectedScenario) {
      case 'restaurant': persona = `A waiter in a restaurant (speaking ${currentTargetLanguageName})`; break;
      case 'directions': persona = `A helpful local giving directions (speaking ${currentTargetLanguageName})`; break;
      case 'shopping': persona = `A shop assistant in a clothing store (speaking ${currentTargetLanguageName})`; break;
      default: persona = `A friendly person (speaking ${currentTargetLanguageName})`;
    }
    const systemPrompt = `You are ${persona}. Your goal is to engage in a natural conversation with the user in ${currentTargetLanguageName} at an ${learningLevel} level, simulating the '${selectedScenario}' scenario. Keep your responses concise and relevant to the scenario. Do not use any single or double quotes in your responses. Always respond in ${currentTargetLanguageName}.`;
    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }, ...currentChatHistory],
        generationConfig: { temperature: 0.7 }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const aiResponseText = result.candidates[0].content.parts[0].text.replace(/['"]/g, '').trim();
        setRolePlayHistory(prev => [...prev, { role: 'model', text: aiResponseText }]);
      } else {
        showError('فشل في الحصول على رد. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API role play error:', result);
        setRolePlayHistory(prev => [...prev, { role: 'model', text: `عذراً، حدث خطأ. هل يمكنك المحاولة مرة أخرى؟ (In ${currentTargetLanguageName})` }]);
      }
    } catch (error) {
      console.error('Error sending role play message:', error);
      showError('حدث خطأ أثناء إرسال الرسالة. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
      setRolePlayHistory(prev => [...prev, { role: 'model', text: `عذراً، حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت. (In ${currentTargetLanguageName})` }]);
    } finally {
      setIsRolePlayingResponding(false);
    }
  };

  const generateFlashcards = async () => {
    setIsGeneratingFlashcards(true);
    setFlashcards([]); setCurrentFlashcardIndex(0); setShowFlashcardAnswer(false);
    setShowErrorModal(false); setShowPronunciationModal(false); setShowRolePlayModal(false);
    setFlashcardModalWidth(600); setFlashcardModalHeight('auto');

    if (!apiKey) { showError('الرجاء إدخال مفتاح الـ API الخاص بك في الإعدادات لتمكين توليد البطاقات التعليمية.'); setIsGeneratingFlashcards(false); return; }
    const wordsToGenerate = flashcardInput.trim() || (keyVocabulary.length > 0 ? keyVocabulary.map(item => item.word).join(', ') : '');
    if (!wordsToGenerate) { showError('الرجاء إدخال كلمات لتوليد البطاقات التعليمية، أو توليد قصة أولاً لاستخراج المفردات.'); setIsGeneratingFlashcards(false); return; }

    const currentTargetLanguageName = languageMap[targetLanguage] || targetLanguage;
    const prompt = `Generate flashcards for the following words/phrases: "${wordsToGenerate}". For each, provide the word/phrase in ${currentTargetLanguageName}, its translation to Arabic, a concise definition in ${currentTargetLanguageName}, and an example sentence in ${currentTargetLanguageName}. Format as a JSON array of objects, each with keys: 'word' (in ${currentTargetLanguageName}), 'translation' (in Arabic), 'definition' (in ${currentTargetLanguageName}), 'exampleSentence' (in ${currentTargetLanguageName}).`;
    try {
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: { responseMimeType: "application/json", responseSchema: { type: "ARRAY", items: { type: "OBJECT", properties: { word: { type: "STRING" }, translation: { type: "STRING" }, definition: { type: "STRING" }, exampleSentence: { type: "STRING" } } } } }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.length > 0) {
        const parsedFlashcards = JSON.parse(result.candidates[0].content.parts[0].text);
        setFlashcards(parsedFlashcards);
        setShowFlashcardModal(true);
      } else {
        showError('فشل في توليد البطاقات التعليمية. قد تكون المشكلة في مفتاح الـ API أو في استجابة النموذج.');
        console.error('Gemini API flashcard generation error:', result);
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      showError('حدث خطأ أثناء توليد البطاقات التعليمية. يرجى التحقق من اتصالك بالإنترنت ومفتاح الـ API.');
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const nextFlashcard = () => { setShowFlashcardAnswer(false); setCurrentFlashcardIndex((prevIndex) => (prevIndex + 1) % flashcards.length); };
  const prevFlashcard = () => { setShowFlashcardAnswer(false); setCurrentFlashcardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length); };

  const handleSpeakStory = () => {
    if (!storyText) { showError('لا توجد قصة لتشغيلها.'); return; }
    if (!speechSynthesisRef.current) { showError('واجهة برمجة تطبيقات تحويل النص إلى كلام (SpeechSynthesis) غير متاحة في هذا المتصفح.'); return; }
    if (!speechVoice) { showError(`لا يوجد صوت متاح للغة ${languageMap[targetLanguage] || targetLanguage}. يرجى التحقق من إعدادات المتصفح أو تثبيت حزم اللغة.`); return; }

    speechSynthesisRef.current.cancel(); setIsSpeaking(true); setHighlightedWordIndex(-1); globalSpeechOffsetRef.current = 0; 
    const sentences = storyText.match(/[^.!?]+[.!?]|\S+$/g) || [];
    sentenceQueueRef.current = [...sentences]; 
    const speakNextSentence = () => {
      if (sentenceQueueRef.current.length > 0) {
        const currentSentence = sentenceQueueRef.current[0].trim(); 
        if (!currentSentence) { sentenceQueueRef.current.shift(); speakNextSentence(); return; }
        const actualSentenceStartIndex = storyText.indexOf(currentSentence, globalSpeechOffsetRef.current);
        if (actualSentenceStartIndex === -1) { console.warn("Could not find current sentence. Skipping."); sentenceQueueRef.current.shift(); speakNextSentence(); return; }
        globalSpeechOffsetRef.current = actualSentenceStartIndex; 
        const utterance = new SpeechSynthesisUtterance(currentSentence);
        utterance.rate = speechRate; utterance.pitch = speechPitch; utterance.lang = speechVoice.lang;
        utteranceRef.current = utterance; 
        utterance.onend = () => {
          sentenceQueueRef.current.shift(); 
          globalSpeechOffsetRef.current = actualSentenceStartIndex + currentSentence.length;
          const remainingText = storyText.substring(globalSpeechOffsetRef.current);
          const leadingWhitespaceMatch = remainingText.match(/^\s+/);
          if (leadingWhitespaceMatch) globalSpeechOffsetRef.current += leadingWhitespaceMatch[0].length;
          setHighlightedWordIndex(-1); speakNextSentence(); 
        };
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            const globalCharIndex = globalSpeechOffsetRef.current + event.charIndex;
            let newHighlightedIndex = -1;
            for (let i = 0; i < storySegmentsRef.current.length; i++) {
              const segment = storySegmentsRef.current[i];
              if (segment.type === 'word' && globalCharIndex >= segment.startIndex && globalCharIndex < segment.endIndex) { newHighlightedIndex = i; break; }
            }
            setHighlightedWordIndex(newHighlightedIndex);
          }
        };
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event); setIsSpeaking(false); setHighlightedWordIndex(-1);
          showError('حدث خطأ أثناء تحويل النص إلى كلام.'); sentenceQueueRef.current = []; 
        };
        speechSynthesisRef.current.speak(utterance);
      } else {
        setIsSpeaking(false); setHighlightedWordIndex(-1);
      }
    };
    speakNextSentence();
  };

  const handleStopSpeaking = () => {
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel(); setIsSpeaking(false); setHighlightedWordIndex(-1); sentenceQueueRef.current = []; 
    }
  };

  const getVoices = () => speechSynthesisRef.current ? speechSynthesisRef.current.getVoices() : [];
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const handleApiSelection = (api) => setSelectedApi(api);
  const analyzeErrorsAndSuggestExercises = () => showError('محرّك التكيّف الذكي قيد التطوير.');

  // Modal generic structure component
  const ModalContainer = ({ modalRef, width, height, x, y, startDrag, startResize, title, children, onClose, isDarkMode }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div
            ref={modalRef}
            className={`absolute rounded-xl shadow-2xl flex flex-col overflow-hidden ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
            style={{
                width: width,
                height: height,
                minWidth: modalRef === quizModalRef || modalRef === flashcardModalRef ? '400px' : '300px', 
                minHeight: modalRef === quizModalRef || modalRef === flashcardModalRef || modalRef === dialogueModalRef || modalRef === rolePlayModalRef ? '300px' : '250px', // Adjusted minHeight for word explainer
                maxWidth: '90vw',
                maxHeight: '90vh',
                left: x,
                top: y,
                zIndex: 50,
            }}
        >
            <div onMouseDown={startDrag} className={`modal-drag-handle p-4 flex-shrink-0 cursor-grab border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-xl font-bold text-indigo-600" dir="rtl">{title}</h2>
            </div>
            <div className="overflow-y-auto flex-grow p-6">
                {children}
            </div>
            <div className={`flex justify-end p-4 flex-shrink-0 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                    onClick={onClose}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    إغلاق
                </button>
            </div>
             <div
                onMouseDown={startResize}
                className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-700 opacity-50 hover:opacity-100 cursor-nwse-resize rounded-br-lg"
                style={{ zIndex: 60 }} 
            ></div>
        </div>
    </div>
  );


  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">تعلم اللغات بالذكاء الاصطناعي</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {isDarkMode ? (
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 4a1 1 0 011 1v1a1 1 0 11-2 0V7a1 1 0 011-1zM4 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1zm3 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm0-4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm7-4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4-4a1 1 0 011 1v1a1 1 0 11-2 0V7a1 1 0 011-1zM10 9a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm0 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"></path></svg>
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              الإعدادات
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Input and Controls Section */}
        <section className={`p-6 rounded-xl shadow-lg mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">توليد قصة جديدة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium mb-1">الموضوع:</label>
              <input
                type="text"
                id="topic"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="أدخل موضوع القصة (مثال: رحلة إلى الفضاء)"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              />
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-1">اللغة المستهدفة:</label>
              <select
                id="language"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              >
                <option value="ar">العربية</option>
                <option value="en">الإنجليزية</option>
                <option value="fr">الفرنسية</option>
                <option value="es">الإسبانية</option>
                <option value="de">الألمانية</option>
              </select>
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-1">مستوى التعلم:</label>
              <select
                id="level"
                value={learningLevel}
                onChange={(e) => setLearningLevel(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              >
                <option value="A1">A1 (مبتدئ)</option>
                <option value="A2">A2 (مبتدئ متقدم)</option>
                <option value="B1">B1 (متوسط)</option>
                <option value="B2">B2 (متوسط متقدم)</option>
                <option value="C1">C1 (متقدم)</option>
                <option value="C2">C2 (متقن)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <button
              onClick={generateStory}
              disabled={isGeneratingStory || isGeneratingImage}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingStory ? 'جاري توليد القصة...' : 'توليد القصة'}
            </button>
            <button
              onClick={generateImage}
              disabled={!storyText || isGeneratingImage || isGeneratingStory}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingImage ? 'جاري توليد الصورة...' : 'توليد الصورة'}
            </button>
            <button
              onClick={generateQuiz}
              disabled={!storyText || isGeneratingQuiz || isGeneratingStory || isGeneratingImage}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingQuiz ? 'جاري توليد الاختبار...' : 'توليد الاختبار ✨'}
            </button>
          </div>
        </section>

        {/* Story and Image Display Section */}
        {(storyText || generatedImageUrl) && (
          <section className={`p-6 rounded-xl shadow-lg mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">القصة والصورة</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {generatedImageUrl ? (
                <div className="md:w-1/3 flex-shrink-0">
                  {isGeneratingImage ? (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg animate-pulse">
                      <p className="text-gray-500">جاري تحميل الصورة...</p>
                    </div>
                  ) : (
                    <img
                      src={generatedImageUrl}
                      alt="صورة القصة المولدة"
                      className="w-full h-auto rounded-lg shadow-md object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/cccccc/333333?text=خطأ+في+تحميل+الصورة"; }}
                    />
                  )}
                </div>
              ) : null}
              <div className={`flex-grow ${generatedImageUrl ? 'md:w-2/3' : 'md:w-full'}`}>
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} mb-4`}>
                  {/* Story text with RTL direction */}
                  <p className="text-lg leading-relaxed whitespace-pre-wrap" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {storySegmentsRef.current.map((segment, index) => {
                      if (segment.type === 'word') {
                        const isHighlighted = highlightedWordIndex === index;
                        return (
                          <span
                            key={index}
                            className={`${isHighlighted ? 'bg-yellow-300 text-gray-900 rounded px-1' : ''} ${storyText ? 'cursor-pointer hover:underline' : ''}`}
                            onClick={() => storyText && handleWordClick(segment.content)}
                          >
                            {segment.content}
                          </span>
                        );
                      } else {
                        // Render spaces as plain text (no span, no click)
                        return <React.Fragment key={index}>{segment.content}</React.Fragment>;
                      }
                    })}
                  </p>
                </div>
                {translatedStoryText ? (
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="showTranslation"
                      checked={showTranslation}
                      onChange={() => setShowTranslation(!showTranslation)}
                      className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                    />
                    <label htmlFor="showTranslation" className="ml-2 text-sm font-medium">عرض الترجمة (العربية)</label>
                  </div>
                ) : null}
                {showTranslation && translatedStoryText ? (
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    {/* Translated story text with RTL direction */}
                    <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray-500" dir="rtl">
                      {translatedStoryText}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        )}

        {/* Interactive Reading Controls */}
        {storyText ? (
          <section className={`p-6 rounded-xl shadow-lg mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">القراءة التفاعلية</h2>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <button
                onClick={handleSpeakStory}
                disabled={!storyText}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSpeaking ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
                    إيقاف مؤقت
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                    تشغيل
                  </>
                )}
              </button>
              <button
                onClick={handleStopSpeaking}
                disabled={!isSpeaking}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 000 2h4a1 1 0 100-2H8z" clipRule="evenodd"></path></svg>
                إيقاف
              </button>

              <div>
                <label htmlFor="rate" className="block text-sm font-medium mb-1">السرعة:</label>
                <input
                  type="range"
                  id="rate"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-32 accent-indigo-500"
                />
                <span className="ml-2 text-sm">{speechRate.toFixed(1)}x</span>
              </div>
              <div>
                <label htmlFor="pitch" className="block text-sm font-medium mb-1">الحدة:</label>
                <input
                  type="range"
                  id="pitch"
                  min="0"
                  max="2"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-32 accent-indigo-500"
                />
                <span className="ml-2 text-sm">{speechPitch.toFixed(1)}x</span>
              </div>
              <div>
                <label htmlFor="voice" className="block text-sm font-medium mb-1">الصوت:</label>
                <select
                  id="voice"
                  value={speechVoice ? speechVoice.name : ''}
                  onChange={(e) => {
                    const selected = getVoices().find(voice => voice.name === e.target.value);
                    setSpeechVoice(selected);
                  }}
                  className={`p-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                >
                  {getVoices().filter(voice => voice.lang.toLowerCase().startsWith(targetLanguage.toLowerCase())).map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        ) : null}

        {/* Smart Language Tools Section */}
        <section className={`p-6 rounded-xl shadow-lg mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">أدوات اللغة الذكية</h2>

          {/* New LLM Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <button
              onClick={summarizeStory}
              disabled={!storyText || isSummarizing}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSummarizing ? 'جاري التلخيص...' : 'تلخيص القصة ✨'}
            </button>
            <button
              onClick={extractKeyVocabulary}
              disabled={!storyText || isExtractingVocabulary}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExtractingVocabulary ? 'جاري الاستخراج...' : 'استخراج المفردات الرئيسية ✨'}
            </button>
            <button
              onClick={startDialoguePractice}
              disabled={isRespondingToDialogue}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRespondingToDialogue ? 'جاري التحميل...' : 'ممارسة المحادثة ✨'}
            </button>
            <button
              onClick={() => setShowPronunciationModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
            >
              دليل النطق ✨
            </button>
            <button
              onClick={() => setShowRolePlayModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
            >
              لعب الأدوار ✨
            </button>
            <button
              onClick={() => setShowFlashcardModal(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
            >
              مولد البطاقات التعليمية ✨
            </button>
          </div>

          {/* Sentence Rephraser */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-indigo-500">إعادة صياغة الجملة ✨</h3>
            <textarea
              value={sentenceToRephrase}
              onChange={(e) => setSentenceToRephrase(e.target.value)}
              placeholder="أدخل الجملة لإعادة صياغتها..."
              rows="3"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} // Dynamic direction
            ></textarea>
            <button
              onClick={rephraseSentence}
              disabled={isRephrasing}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRephrasing ? 'جاري إعادة الصياغة...' : 'إعادة صياغة الجملة'}
            </button>
          </div>

          {/* Grammar Checker */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-indigo-500">فحص القواعد النحوية ✨</h3>
            <textarea
              value={sentenceToCheckGrammar}
              onChange={(e) => setSentenceToCheckGrammar(e.target.value)}
              placeholder="أدخل الجملة لفحص القواعد النحوية..."
              rows="3"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} // Dynamic direction
            ></textarea>
            <button
              onClick={analyzeGrammar}
              disabled={isAnalyzingGrammar}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzingGrammar ? 'جاري الفحص...' : 'فحص القواعد النحوية'}
            </button>
          </div>

          {/* Sentence Completion */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-indigo-500">إكمال الجملة ✨</h3>
            <input
              type="text"
              value={partialSentence}
              onChange={(e) => setPartialSentence(e.target.value)}
              placeholder="أدخل جملة جزئية للإكمال..."
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} // Dynamic direction
            />
            <button
              onClick={getSentenceCompletions}
              disabled={isCompletingSentence}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompletingSentence ? 'جاري الإكمال...' : 'إكمال الجملة'}
            </button>
          </div>

          {/* Cultural Insights */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-500">رؤى ثقافية ✨</h3>
            <button
              onClick={getCulturalInsights}
              disabled={isGettingCulturalInsight}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGettingCulturalInsight ? 'جاري جلب الرؤى...' : 'رؤى ثقافية'}
            </button>
          </div>
        </section>

        {/* Learning Adaptation Section (Placeholder) */}
        <section className={`p-6 rounded-xl shadow-lg mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">الذكاء التعليمي والتكيّف</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            هذا القسم سيحتوي على محرك التكيّف الذكي لتحليل الأخطاء الشائعة وتقديم تمارين مخصصة.
            (الميزات الكاملة قيد التطوير).
          </p>
          <button
            onClick={analyzeErrorsAndSuggestExercises}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
          >
            تحليل الأخطاء واقتراح تمارين (قيد التطوير)
          </button>
        </section>

        {/* Performance and Cost Control Section (Placeholder) */}
        <section className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">الأداء والتحكم في التكاليف</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            لتحسين الأداء والتحكم في التكاليف، يمكن تطبيق تقنيات مثل:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li><span className="font-semibold">Rate Limiting:</span> تقييد عدد الطلبات اليومية لكل مستخدم (يتطلب دعمًا من الواجهة الخلفية).</li>
            <li><span className="font-semibold">Model Quantization:</span> تقليل استهلاك الـ API وحجم النموذج لسرعة الاستجابة (يتطلب دعمًا من النموذج أو الواجهة الخلفية).</li>
            <li><span className="font-semibold">WebAssembly (WASM):</span> لمعالجة النصوص وتحليل الأداء بكفاءة عالية (تطبيق متقدم).</li>
            <li><span className="font-semibold">Virtualization:</span> لعرض قوائم المفردات الطويلة بكفاءة (لتجارب المستخدم التي تتضمن قوائم كبيرة).</li>
          </ul>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            (هذه الميزات تتطلب تطويرًا إضافيًا على مستوى الواجهة الخلفية أو تكاملًا أعمق).
          </p>
        </section>
      </main>

      {/* Word Explanation Modal */}
      {selectedWordForExplanation && (
          <ModalContainer
              modalRef={wordModalRef}
              width={wordModalWidth}
              height={wordModalHeight}
              x={wordModalX}
              y={wordModalY}
              startDrag={startWordModalDrag}
              startResize={startWordModalResize}
              title={`شرح الكلمة: ${selectedWordForExplanation}`}
              onClose={() => setSelectedWordForExplanation(null)}
              isDarkMode={isDarkMode}
          >
              {isExplainingWord ? (
                  <div className="flex items-center justify-center py-8" dir="rtl">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                      <p className="ml-4">جاري جلب الشرح...</p>
                  </div>
              ) : wordExplanation ? (
                  <>
                      <p className="mb-1 font-semibold" dir="rtl">الشرح ({languageMap[targetLanguage] || targetLanguage}):</p>
                      <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {wordExplanation.explanation_target_lang}
                      </p>
                      
                      <p className="mb-1 font-semibold" dir="rtl">الشرح (العربية):</p>
                      <p dir="rtl" className="mb-3 text-right text-gray-500 dark:text-gray-400">
                          {wordExplanation.explanation_ar}
                      </p>

                      <p className="mb-1 font-semibold" dir="rtl">المرادفات ({languageMap[targetLanguage] || targetLanguage}):</p>
                      <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {wordExplanation.synonyms_target_lang}
                      </p>

                      <p className="mb-1 font-semibold" dir="rtl">المتضادات ({languageMap[targetLanguage] || targetLanguage}):</p>
                      <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {wordExplanation.antonyms_target_lang}
                      </p>

                      <p className="mb-1 font-semibold" dir="rtl">الترجمة العربية للكلمة:</p>
                      <p dir="rtl" className="mb-3 text-right">{wordExplanation.word_translation_ar}</p>
                      
                      <p className="font-semibold mt-3 mb-1" dir="rtl">أمثلة ({languageMap[targetLanguage] || targetLanguage}):</p>
                      <ul className={`list-disc list-outside ${targetLanguage === 'ar' ? 'mr-5 pr-0' : 'ml-5 pl-0'}`} dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          {wordExplanation.examples_target_lang && wordExplanation.examples_target_lang.map((example, idx) => (
                              <li key={idx} className={`mb-1 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                                  {example}
                              </li>
                          ))}
                      </ul>
                  </>
              ) : (
                  <p dir="rtl">لا يوجد شرح متاح لهذه الكلمة.</p>
              )}
          </ModalContainer>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
          <ModalContainer
              modalRef={quizModalRef}
              width={quizModalWidth}
              height={quizModalHeight}
              x={quizModalX}
              y={quizModalY}
              startDrag={startQuizModalDrag}
              startResize={startQuizModalResize}
              title="اختبار القصة"
              onClose={() => { setShowQuizModal(false); setQuizQuestions([]); setUserAnswers({}); setQuizResults(null); }}
              isDarkMode={isDarkMode}
          >
              {quizQuestions.length > 0 ? (
                <>
                  {quizQuestions.map((q, qIndex) => (
                    <div key={qIndex} className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`} dir="rtl">
                      <p className="font-semibold mb-2 text-lg">
                        <span dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>{q.question}</span> (بالعربية: <span dir="rtl">{q.question_ar}</span>)
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options.map((option, oIndex) => (
                          <button
                            key={oIndex}
                            onClick={() => handleAnswerSelect(qIndex, String.fromCharCode(65 + oIndex))}
                            className={`block w-full text-left p-3 border rounded-lg transition-colors duration-200
                              ${userAnswers[qIndex] === String.fromCharCode(65 + oIndex)
                                ? (quizResults && q.correct_answer === String.fromCharCode(65 + oIndex) ? 'bg-green-200 dark:bg-green-700' : quizResults ? 'bg-red-200 dark:bg-red-700' : 'bg-indigo-200 dark:bg-indigo-700')
                                : (quizResults && q.correct_answer === String.fromCharCode(65 + oIndex) ? 'bg-green-100 dark:bg-green-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600')
                              }
                              ${isDarkMode ? 'border-gray-600 text-gray-100' : 'border-gray-300 text-gray-900'}
                              ${quizResults ? 'cursor-not-allowed' : ''}
                              flex flex-col items-start
                            `}
                            disabled={quizResults !== null}
                          >
                            <span dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`flex items-center w-full ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                              <span className="mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                              <span>{option}</span>
                            </span>
                            <span dir="rtl" className="w-full text-right text-gray-500 dark:text-gray-400 text-sm mt-1">
                              (بالعربية: {q.options_ar[oIndex]})
                            </span>
                          </button>
                        ))}
                      </div>
                      {quizResults && userAnswers[qIndex] !== q.correct_answer && (
                          <p className="text-red-500 text-sm mt-2" dir="rtl">الإجابة الصحيحة: <span dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>{q.correct_answer}</span></p>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-center mt-6 space-x-4">
                    {!quizResults && (
                      <button
                        onClick={checkQuizAnswers}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={Object.keys(userAnswers).length !== quizQuestions.length}
                      >
                        تحقق من الإجابات
                      </button>
                    )}
                    {quizResults && (
                      <div className="text-center" dir="rtl">
                        <p className="text-xl font-bold text-indigo-600 mb-2">{quizResults.feedback}</p>
                        <button
                          onClick={() => { setShowQuizModal(false); setQuizQuestions([]); setUserAnswers({}); setQuizResults(null); }}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                        >
                          إغلاق الاختبار
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p dir="rtl">لا توجد أسئلة اختبار متاحة. الرجاء توليد اختبار أولاً.</p>
              )}
          </ModalContainer>
      )}

      {/* Rephrase Sentence Modal */}
      {showRephraseModal && (
          <ModalContainer
            modalRef={rephraseModalRef} width={rephraseModalWidth} height={rephraseModalHeight} x={rephraseModalX} y={rephraseModalY}
            startDrag={startRephraseModalDrag} startResize={startRephraseModalResize}
            title="إعادة صياغة الجملة" onClose={() => setShowRephraseModal(false)} isDarkMode={isDarkMode}
          >
            {isRephrasing ? ( <div className="flex items-center justify-center py-8" dir="rtl"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div><p className="ml-4">جاري إعادة الصياغة...</p></div>
            ) : rephrasedSentenceData ? (
              <>
                <p className="mb-1 font-semibold" dir="rtl">الجملة الأصلية ({languageMap[targetLanguage] || targetLanguage}):</p>
                <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{rephrasedSentenceData.original}</p>
                <p className="mb-1 font-semibold" dir="rtl">الجملة المعاد صياغتها ({languageMap[targetLanguage] || targetLanguage}):</p>
                <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{rephrasedSentenceData.rephrased}</p>
                <p className="mb-1 font-semibold" dir="rtl">الشرح (بالعربية):</p>
                <p dir="rtl" className="text-right">{rephrasedSentenceData.explanation}</p>
              </>
            ) : (<p dir="rtl">لا توجد بيانات إعادة صياغة متاحة.</p>)}
          </ModalContainer>
      )}

      {/* Grammar Analysis Modal */}
      {showGrammarModal && (
          <ModalContainer
            modalRef={grammarModalRef} width={grammarModalWidth} height={grammarModalHeight} x={grammarModalX} y={grammarModalY}
            startDrag={startGrammarModalDrag} startResize={startGrammarModalResize}
            title="فحص القواعد النحوية" onClose={() => setShowGrammarModal(false)} isDarkMode={isDarkMode}
          >
            {isAnalyzingGrammar ? (<div className="flex items-center justify-center py-8" dir="rtl"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div><p className="ml-4">جاري الفحص...</p></div>
            ) : grammarAnalysis ? (
              <>
                <p className="mb-1 font-semibold" dir="rtl">الجملة الأصلية ({languageMap[targetLanguage] || targetLanguage}):</p>
                <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{grammarAnalysis.original}</p>
                <p className="mb-1 font-semibold" dir="rtl">الجملة المصححة ({languageMap[targetLanguage] || targetLanguage}):</p>
                <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{grammarAnalysis.corrected}</p>
                <p className="font-semibold mt-3 mb-1" dir="rtl">الأخطاء والشرح:</p>
                {grammarAnalysis.errors && grammarAnalysis.errors.length > 0 ? (
                  <ul className="list-disc list-outside ml-5">
                    {grammarAnalysis.errors.map((err, idx) => (
                      <li key={idx} className="mb-2">
                        <span className="font-semibold text-red-500 dark:text-red-400" dir="rtl">الخطأ ({languageMap[targetLanguage] || targetLanguage}):</span>
                        <span dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`block ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{err.error}</span>
                        <span className="font-semibold text-gray-600 dark:text-gray-400" dir="rtl">الشرح (بالعربية):</span>
                        <span dir="rtl" className="block text-right">{err.explanation}</span>
                      </li>
                    ))}
                  </ul>
                ) : (<p dir="rtl">لا توجد أخطاء نحوية تم العثور عليها.</p>)}
              </>
            ) : (<p dir="rtl">لا توجد بيانات تحليل نحوي متاحة.</p>)}
          </ModalContainer>
      )}

      {/* Sentence Completion Modal */}
      {showCompletionModal && (
          <ModalContainer
            modalRef={completionModalRef} width={completionModalWidth} height={completionModalHeight} x={completionModalX} y={completionModalY}
            startDrag={startCompletionModalDrag} startResize={startCompletionModalResize}
            title="إكمال الجملة" onClose={() => setShowCompletionModal(false)} isDarkMode={isDarkMode}
          >
            {isCompletingSentence ? (<div className="flex items-center justify-center py-8" dir="rtl"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div><p className="ml-4">جاري جلب الاقتراحات...</p></div>
            ) : sentenceCompletions.length > 0 ? (
              <>
                <p className="mb-1 font-semibold" dir="rtl">الجملة الجزئية ({languageMap[targetLanguage] || targetLanguage}):</p>
                <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{partialSentence}</p>
                <p className="font-semibold mt-3 mb-1" dir="rtl">الاقتراحات ({languageMap[targetLanguage] || targetLanguage}):</p>
                <ul className={`list-disc list-outside ${targetLanguage === 'ar' ? 'mr-5' : 'ml-5'}`}>
                  {sentenceCompletions.map((completion, idx) => (
                    <li key={idx} dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={targetLanguage === 'ar' ? 'text-right' : 'text-left'}>{completion}</li>
                  ))}
                </ul>
              </>
            ) : (<p dir="rtl">لا توجد اقتراحات إكمال متاحة.</p>)}
          </ModalContainer>
      )}

      {/* Cultural Insight Modal */}
      {showCulturalInsightModal && (
          <ModalContainer
            modalRef={culturalModalRef} width={culturalModalWidth} height={culturalModalHeight} x={culturalModalX} y={culturalModalY}
            startDrag={startCulturalModalDrag} startResize={startCulturalModalResize}
            title={culturalInsight?.title || 'رؤى ثقافية'} onClose={() => setShowCulturalInsightModal(false)} isDarkMode={isDarkMode}
          >
            {isGettingCulturalInsight ? (<div className="flex items-center justify-center py-8" dir="rtl"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div><p className="ml-4">جاري جلب الرؤى...</p></div>
            ) : culturalInsight ? (
              <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={targetLanguage === 'ar' ? 'text-right' : 'text-left'}>{culturalInsight.insight}</p>
            ) : (<p dir="rtl">لا توجد رؤى ثقافية متاحة.</p>)}
          </ModalContainer>
      )}
      
      {/* Story Summary Modal */}
      {showSummaryModal && (
          <ModalContainer
            modalRef={summaryModalRef} width={summaryModalWidth} height={summaryModalHeight} x={summaryModalX} y={summaryModalY}
            startDrag={startSummaryModalDrag} startResize={startSummaryModalResize}
            title="ملخص القصة" onClose={() => setShowSummaryModal(false)} isDarkMode={isDarkMode}
          >
            {isSummarizing ? (<div className="flex items-center justify-center py-8" dir="rtl"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div><p className="ml-4">جاري التلخيص...</p></div>
            ) : storySummary ? (
              <p className="whitespace-pre-wrap" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>{storySummary}</p>
            ) : (<p dir="rtl">لا يوجد ملخص متاح.</p>)}
          </ModalContainer>
      )}

      {/* Key Vocabulary Modal */}
      {showVocabularyModal && (
          <ModalContainer
            modalRef={vocabularyModalRef} width={vocabularyModalWidth} height={vocabularyModalHeight} x={vocabularyModalX} y={vocabularyModalY}
            startDrag={startVocabularyModalDrag} startResize={startVocabularyModalResize}
            title="المفردات الرئيسية" onClose={() => setShowVocabularyModal(false)} isDarkMode={isDarkMode}
          >
            {isExtractingVocabulary ? (<div className="flex items-center justify-center py-8" dir="rtl"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div><p className="ml-4">جاري استخراج المفردات...</p></div>
            ) : keyVocabulary.length > 0 ? (
              <div className="space-y-4">
                {keyVocabulary.map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="font-semibold text-lg" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>{item.word}</p>
                    <p className="text-gray-600 dark:text-gray-300" dir="rtl">الترجمة: <span dir="rtl">{item.translation}</span></p>
                    <p className="text-gray-600 dark:text-gray-300" dir="rtl">الشرح: <span dir="rtl">{item.explanation}</span></p>
                  </div>
                ))}
              </div>
            ) : (<p dir="rtl">لا توجد مفردات رئيسية متاحة.</p>)}
          </ModalContainer>
      )}

      {/* Conversation Practice Modal */}
      {showDialogueModal && (
          <ModalContainer
            modalRef={dialogueModalRef} width={dialogueModalWidth} height={dialogueModalHeight} x={dialogueModalX} y={dialogueModalY}
            startDrag={startDialogueModalDrag} startResize={startDialogueModalResize}
            title="ممارسة المحادثة ✨" onClose={() => setShowDialogueModal(false)} isDarkMode={isDarkMode}
          >
            <div ref={dialogueChatRef} className={`flex-grow overflow-y-auto p-2 mb-4 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              {/* Chat messages */}
              {isRespondingToDialogue && conversationHistory.length === 0 ? (
                 <div className="flex justify-start mb-3" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <div className={`p-3 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100 animate-pulse`}>...جاري بدء المحادثة</div>
                </div>
              ) : conversationHistory.length === 0 ? (
                <p className="text-center text-gray-500" dir="rtl">ابدأ المحادثة!</p>
              ) : (
                conversationHistory.map((msg, index) => (
                  <div key={index} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} dir={msg.role === 'user' ? (targetLanguage === 'ar' ? 'rtl' : 'ltr') : (targetLanguage === 'ar' ? 'rtl' : 'ltr')}>
                    <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100'}`}>{msg.text}</div>
                  </div>
                ))
              )}
              {isRespondingToDialogue && conversationHistory.length > 0 ? (
                <div className="flex justify-start mb-3" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}><div className={`p-3 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100 animate-pulse`}>...جاري الرد</div></div>
              ) : null}
            </div>
            <div className="flex mt-auto">
              <input type="text" value={userDialogueInput} onChange={(e) => setUserDialogueInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') sendDialogueMessage(); }} placeholder="اكتب رسالتك هنا..." className={`flex-grow p-3 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} disabled={isRespondingToDialogue} dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} />
              <button onClick={sendDialogueMessage} disabled={!userDialogueInput.trim() || isRespondingToDialogue} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-r-lg shadow-md transition-colors duration-200 disabled:opacity-50">إرسال</button>
            </div>
          </ModalContainer>
      )}

      {/* Pronunciation Guide Modal */}
      {showPronunciationModal && (
          <ModalContainer
            modalRef={pronunciationModalRef} width={pronunciationModalWidth} height={pronunciationModalHeight} x={pronunciationModalX} y={pronunciationModalY}
            startDrag={startPronunciationModalDrag} startResize={startPronunciationModalResize}
            title="دليل النطق" onClose={() => setShowPronunciationModal(false)} isDarkMode={isDarkMode}
          >
            <div className="mb-4">
              <label htmlFor="pronunciationWord" className="block text-sm font-medium mb-1">الكلمة/العبارة:</label>
              <input type="text" id="pronunciationWord" value={wordForPronunciation} onChange={(e) => setWordForPronunciation(e.target.value)} placeholder="أدخل كلمة أو عبارة" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} />
            </div>
            <button onClick={getPronunciationGuide} disabled={isGettingPronunciation || !wordForPronunciation.trim()} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 mb-4">
              {isGettingPronunciation ? 'جاري جلب الدليل...' : 'جلب دليل النطق'}
            </button>
            {isGettingPronunciation ? (<div className="flex items-center justify-center py-8" dir="rtl"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div><p className="ml-4">جاري جلب الدليل...</p></div>
            ) : pronunciationGuide ? (
              <>
                <p className="mb-1 font-semibold" dir="rtl">الصوتيات ({languageMap[targetLanguage] || targetLanguage}):</p>
                <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{pronunciationGuide.phonetic}</p>
                <p className="mb-1 font-semibold" dir="rtl">نصائح (بالعربية):</p>
                <p dir="rtl" className="mb-3 text-right">{pronunciationGuide.tips}</p>
                <p className="mb-1 font-semibold" dir="rtl">جملة مثال ({languageMap[targetLanguage] || targetLanguage}):</p>
                <p dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} className={`mb-3 ${targetLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{pronunciationGuide.exampleSentence}</p>
                <p className="mb-1 font-semibold" dir="rtl">ترجمة المثال (بالعربية):</p>
                <p dir="rtl" className="text-right">{pronunciationGuide.exampleSentenceTranslation}</p>
              </>
            ) : (<p dir="rtl">أدخل كلمة أو عبارة للحصول على دليل النطق.</p>)}
          </ModalContainer>
      )}

      {/* Role-Playing Scenario Modal */}
      {showRolePlayModal && (
          <ModalContainer
            modalRef={rolePlayModalRef} width={rolePlayModalWidth} height={rolePlayModalHeight} x={rolePlayModalX} y={rolePlayModalY}
            startDrag={startRolePlayModalDrag} startResize={startRolePlayModalResize}
            title="لعب الأدوار" onClose={() => setShowRolePlayModal(false)} isDarkMode={isDarkMode}
          >
            <div className="mb-4">
              <label htmlFor="scenarioSelect" className="block text-sm font-medium mb-1">اختر سيناريو:</label>
              <select id="scenarioSelect" value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} dir="rtl">
                <option value="">-- اختر --</option> <option value="restaurant">في المطعم</option> <option value="directions">طلب الاتجاهات</option> <option value="shopping">التسوق</option>
              </select>
            </div>
            <button onClick={startRolePlayScenario} disabled={!selectedScenario || isRolePlayingResponding} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 mb-4">
              {isRolePlayingResponding && rolePlayHistory.length === 0 ? 'جاري التحميل...' : 'بدء السيناريو'}
            </button>
            <div ref={rolePlayChatRef} className={`flex-grow overflow-y-auto p-2 mb-4 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              {/* Chat messages */}
              {isRolePlayingResponding && rolePlayHistory.length === 0 ? (
                 <div className="flex justify-start mb-3" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}><div className={`p-3 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100 animate-pulse`}>...جاري بدء السيناريو</div></div>
              ) : rolePlayHistory.length === 0 ? (
                <p className="text-center text-gray-500" dir="rtl">اختر سيناريو وبدء لعب الأدوار!</p>
              ) : (
                rolePlayHistory.map((msg, index) => (
                  <div key={index} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} dir={msg.role === 'user' ? (targetLanguage === 'ar' ? 'rtl' : 'ltr') : (targetLanguage === 'ar' ? 'rtl' : 'ltr')}><div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100'}`}>{msg.text}</div></div>
                ))
              )}
              {isRolePlayingResponding && rolePlayHistory.length > 0 ? (
                <div className="flex justify-start mb-3" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}><div className={`p-3 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100 animate-pulse`}>...جاري الرد</div></div>
              ) : null}
            </div>
            <div className="flex mt-auto">
              <input type="text" value={rolePlayUserInput} onChange={(e) => setRolePlayUserInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') sendRolePlayMessage(); }} placeholder="اكتب ردك هنا..." className={`flex-grow p-3 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} disabled={isRolePlayingResponding || !selectedScenario} dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} />
              <button onClick={sendRolePlayMessage} disabled={!rolePlayUserInput.trim() || isRolePlayingResponding || !selectedScenario} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-r-lg shadow-md transition-colors duration-200 disabled:opacity-50">إرسال</button>
            </div>
          </ModalContainer>
      )}

      {/* Flashcard Generator Modal */}
      {showFlashcardModal && (
          <ModalContainer
            modalRef={flashcardModalRef} width={flashcardModalWidth} height={flashcardModalHeight} x={flashcardModalX} y={flashcardModalY}
            startDrag={startFlashcardModalDrag} startResize={startFlashcardModalResize}
            title="مولد البطاقات التعليمية" onClose={() => setShowFlashcardModal(false)} isDarkMode={isDarkMode}
          >
            <div className="mb-4">
              <label htmlFor="flashcardWords" className="block text-sm font-medium mb-1">أدخل كلمات (مفصولة بفاصلة):</label>
              <input type="text" id="flashcardWords" value={flashcardInput} onChange={(e) => setFlashcardInput(e.target.value)} placeholder="مثال: hello, goodbye, thank you" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'} />
              <p className="text-sm text-gray-500 mt-1" dir="rtl">أو سيتم استخدام المفردات الرئيسية من القصة المولدة.</p>
            </div>
            <button onClick={generateFlashcards} disabled={isGeneratingFlashcards || (!flashcardInput.trim() && keyVocabulary.length === 0)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 mb-4">
              {isGeneratingFlashcards ? 'جاري التوليد...' : 'توليد البطاقات التعليمية'}
            </button>
            {isGeneratingFlashcards ? (<div className="flex items-center justify-center py-8" dir="rtl"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div><p className="ml-4">جاري توليد البطاقات...</p></div>
            ) : flashcards.length > 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-4 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 transition-all duration-300 relative overflow-hidden">
                <div className="text-center">
                  <p className="text-4xl font-bold text-indigo-600 mb-4" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>{flashcards[currentFlashcardIndex].word}</p>
                  {showFlashcardAnswer ? (
                    <div className="mt-4 text-lg">
                      <p className="mb-2" dir="rtl"><span className="font-semibold">الترجمة (بالعربية):</span> <span dir="rtl">{flashcards[currentFlashcardIndex].translation}</span></p>
                      <p className="mb-2" dir="rtl"><span className="font-semibold">التعريف ({languageMap[targetLanguage] || targetLanguage}):</span> <span dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>{flashcards[currentFlashcardIndex].definition}</span></p>
                      <p dir="rtl"><span className="font-semibold">مثال ({languageMap[targetLanguage] || targetLanguage}):</span> <span dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>{flashcards[currentFlashcardIndex].exampleSentence}</span></p>
                    </div>
                  ) : null}
                </div>
                <button onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)} className="mt-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
                  {showFlashcardAnswer ? 'إخفاء الإجابة' : 'عرض الإجابة'}
                </button>
                <div className="flex justify-between w-full mt-6">
                  <button onClick={prevFlashcard} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md">السابق</button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{currentFlashcardIndex + 1} / {flashcards.length}</span>
                  <button onClick={nextFlashcard} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md">التالي</button>
                </div>
              </div>
            ) : (<p dir="rtl">أدخل كلمات أو توليد قصة لاستخراج المفردات وإنشاء البطاقات التعليمية.</p>)}
          </ModalContainer>
      )}

      {/* Settings Modal */}
      {showSettings && (
          <ModalContainer
            modalRef={settingsModalRef} width={settingsModalWidth} height={settingsModalHeight} x={settingsModalX} y={settingsModalY}
            startDrag={startSettingsModalDrag} startResize={startSettingsModalResize}
            title="الإعدادات" onClose={() => setShowSettings(false)} isDarkMode={isDarkMode}
          >
            <div className="mb-6">
              <label htmlFor="apiType" className="block text-sm font-medium mb-2">نوع واجهة API:</label>
              <select id="apiType" value={selectedApi} onChange={(e) => handleApiSelection(e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} dir="rtl">
                <option value="Gemini">جيميني (Gemini)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1" dir="rtl">(حالياً، يتم دعم Gemini فقط.)</p>
            </div>
            <div className="mb-6">
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2">مفتاح API لـ {selectedApi}:</label>
              <input type="password" id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="أدخل مفتاح API" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} dir="ltr" />
              <p className="text-sm text-gray-500 mt-1" dir="rtl">سيتم حفظ المفتاح محلياً.</p>
            </div>
            <div className="flex justify-end space-x-4">
                <button onClick={() => setShowSettings(false)} className={`py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}>إلغاء</button>
                <button onClick={saveApiKey} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">حفظ المفتاح</button>
            </div>
          </ModalContainer>
      )}

      {/* Error Modal */}
      {showErrorModal && (
          <ModalContainer
            modalRef={errorModalRef} width={errorModalWidth} height={errorModalHeight} x={errorModalX} y={errorModalY}
            startDrag={startErrorModalDrag} startResize={startErrorModalResize}
            title="خطأ / تنبيه" onClose={closeErrorModal} isDarkMode={isDarkMode}
          >
            <p className="text-center" dir="rtl">{errorMessage}</p>
          </ModalContainer>
      )}
    </div>
  );
}

export default App;
