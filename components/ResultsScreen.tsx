import React from 'react';
import { QuizData, UserAnswers, Result, QuestionType } from '../types';

interface ResultsScreenProps {
  quizData: QuizData;
  userAnswers: UserAnswers;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ quizData, userAnswers, onRestart }) => {
  const results: Result[] = quizData.questions.map(q => {
    const userAnswer = userAnswers[q.id];
    let isCorrect = false;

    if (Array.isArray(userAnswer) && Array.isArray(q.correctAnswers)) {
      isCorrect = userAnswer.length === q.correctAnswers.length && [...userAnswer].sort().toString() === [...q.correctAnswers].sort().toString();
    } else {
      isCorrect = userAnswer === q.correctAnswers[0];
    }
    
    return { question: q, userAnswer, isCorrect };
  });

  const score = results.filter(r => r.isCorrect).length;
  const total = quizData.questions.length;

  const getAnswerString = (answer: any): string => {
    if (answer === undefined || answer === null || (Array.isArray(answer) && answer.length === 0) || answer === '') return 'Chưa trả lời';
    if (Array.isArray(answer)) return answer.join(', ');
    return answer?.toString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center mb-8">
        <h2 className="text-4xl font-bold text-green-700">Kết quả bài làm</h2>
        <p className="text-6xl font-bold text-blue-600 my-4">{score} / {total}</p>
        <p className="text-xl text-gray-600">
          {score > 8 ? 'Xuất sắc! Con làm rất tốt! 🏆' : score > 5 ? 'Làm tốt lắm! Cố gắng thêm chút nữa nhé. 👍' : 'Không sao cả, luyện tập thêm sẽ giỏi hơn. 💪'}
        </p>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Xem lại bài làm:</h3>

      {results.map((result, index) => (
        <div key={result.question.id} className={`p-6 rounded-xl shadow-md mb-6 border-l-4 ${result.isCorrect ? 'bg-green-50/70 border-green-500' : 'bg-red-50/70 border-red-500'}`}>
          <div className="text-lg font-semibold text-gray-800 mb-3">
             <p className="font-bold mb-2">Câu {index + 1}:</p>
             <div className="font-normal" dangerouslySetInnerHTML={{ __html: result.question.questionText }} />
          </div>
          {result.question.imageUrl && (
            <div className="my-3 flex justify-center">
              <img src={result.question.imageUrl} alt={`Minh hoạ cho câu ${index + 1}`} className="rounded-lg max-w-xs h-auto" />
            </div>
          )}
          <div className="text-base space-y-3 mt-4">
            <p className="text-gray-800">
              <strong>Câu trả lời của con:</strong> 
              <span className={`font-bold ml-2 ${result.isCorrect ? 'text-green-700' : 'text-red-800'}`}>{getAnswerString(result.userAnswer)}</span>
            </p>
            {!result.isCorrect && (
              <>
                <p className="text-gray-800">
                  <strong>Đáp án đúng:</strong> 
                  <span className="font-bold ml-2 text-green-800">{getAnswerString(result.question.correctAnswers)}</span>
                </p>
                <div className="mt-4 p-4 bg-yellow-100/60 rounded-lg border border-yellow-300">
                    <p className="font-semibold text-yellow-900">💡 Gợi ý sửa bài:</p>
                    <div className="text-yellow-800" dangerouslySetInnerHTML={{ __html: result.question.feedback }}/>
                </div>
              </>
            )}
             <div className="mt-4 p-4 bg-blue-100/50 rounded-lg border border-blue-200">
                <p className="font-semibold text-blue-900">📘 Hướng dẫn giải:</p>
                <div className="text-blue-800" dangerouslySetInnerHTML={{ __html: result.question.solution }} />
            </div>
          </div>
        </div>
      ))}

      <div className="text-center mt-10">
        <button
          onClick={onRestart}
          className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Làm bài khác
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;