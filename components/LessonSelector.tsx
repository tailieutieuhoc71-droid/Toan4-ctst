
import React from 'react';
import { LESSONS } from '../constants';

interface LessonSelectorProps {
  onSelectLesson: (lesson: string) => void;
}

const LessonSelector: React.FC<LessonSelectorProps> = ({ onSelectLesson }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800">Chào mừng đến với Gia sư Toán 4! 👋</h1>
        <p className="text-lg text-gray-600 mt-2">Hãy chọn một bài học để bắt đầu ôn tập nhé.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LESSONS.map((lesson, index) => (
          <button
            key={index}
            onClick={() => onSelectLesson(lesson)}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-green-100 transition-all duration-300 text-left text-gray-700 font-semibold text-base transform hover:-translate-y-1"
          >
            {lesson}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonSelector;
