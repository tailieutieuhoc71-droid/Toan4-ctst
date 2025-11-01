
import React, { useState, useCallback } from 'react';
import { AppState, QuizData, UserAnswers } from './types';
import LessonSelector from './components/LessonSelector';
import LoadingSpinner from './components/LoadingSpinner';
import Quiz from './components/Quiz';
import ResultsScreen from './components/ResultsScreen';
import { generateQuiz } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SELECTING_LESSON);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [error, setError] = useState<string | null>(null);

  const handleSelectLesson = useCallback(async (lesson: string) => {
    setAppState(AppState.GENERATING_QUIZ);
    setError(null);
    try {
      const data = await generateQuiz(lesson, "Bạn nhỏ");
      setQuizData(data);
      setAppState(AppState.TAKING_QUIZ);
    } catch (err) {
      setError("Rất tiếc, Gia sư AI không thể tạo bài tập lúc này. Con hãy thử lại sau nhé!");
      setAppState(AppState.SELECTING_LESSON);
    }
  }, []);

  const handleSubmitQuiz = useCallback((answers: UserAnswers) => {
    setUserAnswers(answers);
    setAppState(AppState.VIEWING_RESULTS);
  }, []);

  const handleRestart = useCallback(() => {
    setQuizData(null);
    setUserAnswers({});
    setAppState(AppState.SELECTING_LESSON);
  }, []);
  
  const renderContent = () => {
    switch (appState) {
      case AppState.SELECTING_LESSON:
        return <LessonSelector onSelectLesson={handleSelectLesson} />;
      case AppState.GENERATING_QUIZ:
        return <LoadingSpinner />;
      case AppState.TAKING_QUIZ:
        if (quizData) {
          return <Quiz quizData={quizData} onSubmit={handleSubmitQuiz} />;
        }
        return null;
      case AppState.VIEWING_RESULTS:
        if (quizData) {
          return <ResultsScreen quizData={quizData} userAnswers={userAnswers} onRestart={handleRestart} />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-8">
      {error && (
        <div className="w-full max-w-4xl mx-auto p-4 mb-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          {error}
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default App;
