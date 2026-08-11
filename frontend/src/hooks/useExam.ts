import { useState } from 'react';
import { SubmitAnswerDto } from '../types/Result';

export const useExam = (durationMinutes: number, onTimeUp?: () => void) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  const selectAnswer = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const getFormattedAnswers = (): SubmitAnswerDto[] => {
    return Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
      questionId: Number(questionId),
      selectedAnswerId: answerId,
    }));
  };

  return {
    selectedAnswers,
    flaggedQuestions,
    selectAnswer,
    toggleFlag,
    getFormattedAnswers,
  };
};
