import { useState, useRef, useEffect, useCallback } from 'react';
import { StudyContext } from './studyCtx';
import { generateStudyMaterial, fetchStudyHistory, fetchStudySetById, deleteStudySetById } from '../services/api';

// This file exports ONLY a React component — Fast Refresh compliant.
export function StudyProvider({ children }) {
  const [studyData, setStudyData] = useState(() => {
    const saved = localStorage.getItem('study_current_set');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('study_active_tab') || 'home';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastTopic, setLastTopic] = useState('');

  const [historyList, setHistoryList] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [bookmarkedCardIds, setBookmarkedCardIds] = useState(() => {
    const saved = localStorage.getItem('study_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (studyData) {
      localStorage.setItem('study_current_set', JSON.stringify(studyData));
    } else {
      localStorage.removeItem('study_current_set');
    }
  }, [studyData]);

  useEffect(() => {
    localStorage.setItem('study_bookmarks', JSON.stringify(bookmarkedCardIds));
  }, [bookmarkedCardIds]);

  useEffect(() => {
    localStorage.setItem('study_active_tab', activeTab);
  }, [activeTab]);

  const refreshHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    const history = await fetchStudyHistory();
    setHistoryList(history);
    setIsHistoryLoading(false);
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const generateMaterial = async (input) => {
    if (!input || !input.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setLastTopic(input);

    try {
      const data = await generateStudyMaterial({ topic: input }, controller.signal);
      setStudyData(data);
      setCurrentCardIndex(0);
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setIsQuizSubmitted(false);
      setActiveTab('flashcards');
      refreshHistory();
    } catch (err) {
      if (err.isCancelled) return;
      setError(err.message || 'Failed to generate study content.');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const loadSetFromHistory = async (id) => {
    setIsLoading(true);
    try {
      const data = await fetchStudySetById(id);
      if (data) {
        setStudyData(data);
        setCurrentCardIndex(0);
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setIsQuizSubmitted(false);
        setActiveTab('flashcards');
      }
    } catch (err) {
      setError('Failed to load study set from database.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSetFromHistory = async (id) => {
    const success = await deleteStudySetById(id);
    if (success) {
      setHistoryList((prev) => prev.filter((item) => item._id !== id));
      if (studyData?._id === id) clearSession();
    }
  };

  const retryGeneration = () => {
    if (lastTopic) generateMaterial(lastTopic);
  };

  const toggleBookmark = (cardId) => {
    setBookmarkedCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  const selectQuizAnswer = (questionId, optionIndex) => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsQuizSubmitted(false);
  };

  const retryIncorrectQuiz = () => {
    if (!studyData?.quiz) return;
    const incorrect = studyData.quiz.filter((q) => {
      const selected = userAnswers[q.id];
      return selected === undefined || selected !== q.correctAnswer;
    });
    if (incorrect.length > 0) {
      setStudyData((prev) => ({ ...prev, quiz: incorrect }));
      resetQuiz();
      setActiveTab('quiz');
    }
  };

  const clearSession = () => {
    setStudyData(null);
    setUserAnswers({});
    setCurrentCardIndex(0);
    setCurrentQuestionIndex(0);
    setIsQuizSubmitted(false);
    setError(null);
    setActiveTab('home');
  };

  return (
    <StudyContext.Provider
      value={{
        studyData,
        activeTab,
        setActiveTab,
        isLoading,
        error,
        setError,
        generateMaterial,
        retryGeneration,
        currentCardIndex,
        setCurrentCardIndex,
        bookmarkedCardIds,
        toggleBookmark,
        userAnswers,
        selectQuizAnswer,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        isQuizSubmitted,
        setIsQuizSubmitted,
        resetQuiz,
        retryIncorrectQuiz,
        clearSession,
        historyList,
        isHistoryLoading,
        refreshHistory,
        loadSetFromHistory,
        deleteSetFromHistory,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}
