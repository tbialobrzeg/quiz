export interface QuizData {
  [key: string]: Question[];
}

export interface Question {
  content: string;
  answers: string[],
  correctAnswerID: number,
  userAnswer ?: number
}