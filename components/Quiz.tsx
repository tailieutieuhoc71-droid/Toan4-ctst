import React, { useState } from 'react';
import { QuizData, Question, QuestionType, UserAnswers, UserAnswer } from '../types';

interface QuizProps {
  quizData: QuizData;
  onSubmit: (answers: UserAnswers) => void;
}

const QuestionCard: React.FC<{
  question: Question;
  questionNumber: number;
  userAnswer: UserAnswer;
  onAnswerChange: (answer: UserAnswer) => void;
}> = ({ question, questionNumber, userAnswer, onAnswerChange }) => {

  const handleMultiChoiceChange = (option: string) => {
    if (question.type === QuestionType.MULTIPLE_CHOICE_SINGLE) {
      onAnswerChange(option);
    } else {
      const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(a => a !== option)
        : [...currentAnswers, option];
      onAnswerChange(newAnswers);
    }
  };
  
  const renderOptions = () => {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE_SINGLE:
        return question.options?.map((option, index) => (
          <label key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={userAnswer === option}
              onChange={() => onAnswerChange(option)}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="text-gray-800">{option}</span>
          </label>
        ));
      case QuestionType.MULTIPLE_CHOICE_MULTI:
        return question.options?.map((option, index) => (
          <label key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              value={option}
              checked={Array.isArray(userAnswer) && userAnswer.includes(option)}
              onChange={() => handleMultiChoiceChange(option)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span className="text-gray-800">{option}</span>
          </label>
        ));
      case QuestionType.TRUE_FALSE:
        return ['Đúng', 'Sai'].map((option, index) => (
            <label key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={userAnswer === option}
                onChange={() => onAnswerChange(option)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="text-gray-800">{option}</span>
            </label>
        ));
      case QuestionType.FILL_IN_THE_BLANK:
        return <input
            type="text"
            value={typeof userAnswer === 'string' ? userAnswer : ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            placeholder="Điền câu trả lời của con..."
        />
      case QuestionType.OPEN_ENDED:
          return <textarea
              value={typeof userAnswer === 'string' ? userAnswer : ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              rows={4}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Trình bày bài giải của con..."
          />
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
      <div className="text-lg font-semibold text-gray-800 mb-4">
        <p className="text-blue-600 font-bold mb-2">Câu {questionNumber}:</p>
        <div className="font-normal" dangerouslySetInnerHTML={{ __html: question.questionText }} />
      </div>
      {question.imageUrl && (
        <div className="my-4 flex justify-center">
          <img src={question.imageUrl} alt={`Minh hoạ cho câu ${questionNumber}`} className="rounded-lg max-w-full h-auto max-h-60" />
        </div>
      )}
      <div className="space-y-3">{renderOptions()}</div>
    </div>
  );
};


const Quiz: React.FC<QuizProps> = ({ quizData, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  const handleAnswerChange = (answer: UserAnswer) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    const currentAnswer = userAnswers[currentQuestion.id];
    const isAnswered = currentAnswer !== undefined && 
                       currentAnswer !== '' && 
                       (!Array.isArray(currentAnswer) || currentAnswer.length > 0);

    if (!isAnswered) {
      alert('Con hãy chọn một đáp án nhé!');
      return;
    }

    if (isLastQuestion) {
      onSubmit(userAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-2">{quizData.title}</h2>
      <p className="text-center text-gray-600 mb-4">Câu hỏi {currentQuestionIndex + 1}/{quizData.questions.length}</p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        userAnswer={userAnswers[currentQuestion.id] || (currentQuestion.type === QuestionType.MULTIPLE_CHOICE_MULTI ? [] : '')}
        onAnswerChange={handleAnswerChange}
      />
      
      <div className="text-center mt-8">
        <button 
          onClick={handleNext}
          className="bg-green-600 text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          {isLastQuestion ? 'Nộp bài' : 'Câu tiếp theo'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;