
import { GoogleGenAI, Type } from "@google/genai";
import { QuizData, QuestionType } from "../types";

const createQuizPrompt = (lessonTitle: string, studentName: string): string => `
Act as a professional, creative, and dedicated 4th Grade Math Tutor in Vietnam. Your name is 'Gia sư AI'.

Your task is to create a personalized 10-question math worksheet for a student named '${studentName}'. The worksheet must be based on the lesson titled: "${lessonTitle}" from the Vietnamese 'Toán 4 - Chân trời sáng tạo' textbook.

Follow these instructions precisely:
1.  **Worksheet Structure**: The worksheet must contain exactly 10 questions.
2.  **Difficulty Distribution**:
    *   40% Recognition (4 questions): Basic recall of facts and concepts.
    *   40% Comprehension (4 questions): Applying concepts to simple problems.
    *   20% Application (2 questions): Solving more complex, multi-step, or word problems.
3.  **Question Type Diversity**: You MUST include a variety of question types as specified below:
    *   **2-3 questions** of type \`multiple_choice_single\`.
    *   **2-3 questions** of type \`multiple_choice_multi\`.
    *   **1-2 questions** of type \`true_false\`.
    *   **1-2 questions** of type \`fill_in_the_blank\`.
    *   **1-2 questions** of type \`open_ended\` (word problems requiring a step-by-step solution).
4.  **Language**: All content (questions, options, solutions, feedback) MUST be in Vietnamese.
5.  **Tone**: The tone should be encouraging, friendly, and suitable for a 4th-grade student.
6.  **Formatting and Content Rules**:
    *   **HTML for Rich Text**: The 'questionText', 'solution', and 'feedback' fields MUST be formatted with HTML tags (like \`<p>\`, \`<ul>\`, \`<li>\`, \`<strong>\`, \`<em>\`) for proper rendering of paragraphs, lists, and emphasis.
    *   **HTML Tables**: Where a table is needed (e.g., for statistics, data comparison), you MUST format it as an HTML \`<table>\` with specific Tailwind CSS classes. **DO NOT use markdown tables.**
        *   Use this exact structure: \`<table class="w-full my-4 text-sm text-left border-collapse border border-slate-400"><thead><tr class="bg-slate-100"><th class="p-2 border border-slate-300 font-semibold text-slate-700">...</th>...</tr></thead><tbody><tr><td class="p-2 border border-slate-300 text-slate-800">...</td>...</tr>...</tbody></table>\`
    *   **Generating Charts**: If a question requires a bar chart (biểu đồ cột), you MUST generate it using an image chart generation service. Construct a URL for the chart. For example, using Image-Charts: \`https://image-charts.com/chart?cht=bvg&chd=t:<data>&chxt=x,y&chxl=0:|<labels>&chs=400x250&chtt=<title>\`. Replace <data> (e.g., '10,20,15'), <labels> (e.g., 'Lớp 4A|Lớp 4B|Lớp 4C'), and <title> (e.g., 'Số học sinh giỏi') with URL-encoded values. Provide this complete URL in the 'imageUrl' field. **Do not use text placeholders like '[Image: ...]' in the questionText.**
    *   **IMPORTANT UI CONSTRAINT**: Questions are displayed one at a time. If multiple questions refer to the same table, image, or context, you MUST repeat that entire context (the full HTML table, the full \`imageUrl\`, etc.) within EACH relevant question's JSON object. Do not write "Dựa vào biểu đồ ở câu trên".

The output MUST be a valid JSON object.
`;

export const generateQuiz = async (lessonTitle: string, studentName: string): Promise<QuizData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createQuizPrompt(lessonTitle, studentName),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  questionText: { type: Type.STRING },
                  imageUrl: {
                    type: Type.STRING,
                    description: "Optional URL for a relevant, royalty-free illustrative image.",
                    nullable: true
                  },
                  type: {
                    type: Type.STRING,
                    enum: Object.values(QuestionType)
                  },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Options for multiple choice questions."
                  },
                  correctAnswers: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "An array of correct answers. For true/false, use 'Đúng' or 'Sai'."
                  },
                  solution: {
                    type: Type.STRING,
                    description: "Detailed, step-by-step solution in Vietnamese, formatted with HTML."
                  },
                  feedback: {
                    type: Type.STRING,
                    description: "Short, encouraging feedback for an incorrect answer, explaining the common mistake, formatted with HTML."
                  }
                },
                required: ["id", "questionText", "type", "correctAnswers", "solution", "feedback"]
              }
            }
          },
          required: ["title", "questions"]
        }
      }
    });

    const jsonString = response.text.trim();
    const quizData = JSON.parse(jsonString) as QuizData;
    
    // Ensure we have exactly 10 questions
    if (quizData.questions.length !== 10) {
        throw new Error("Generated quiz does not have 10 questions.");
    }

    return quizData;

  } catch (error) {
    console.error("Error generating quiz from Gemini API:", error);
    throw new Error("Failed to generate quiz. Please check the API key and prompt.");
  }
};
