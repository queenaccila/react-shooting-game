import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

const questions = [
  {
    text: "1+1=？",
    options: [
      { id: 1, text: "1" },
      { id: 2, text: "2" },
      { id: 3, text: "3" },
      { id: 4, text: "4" },
    ],
    correctAnswerId: 2,
  },
  {
    text: "2+3=？",
    options: [
      { id: 1, text: "2" },
      { id: 2, text: "5" },
      { id: 3, text: "4" },
      { id: 4, text: "6" },
    ],
    correctAnswerId: 2,
  },
  {
    text: "4+5=？",
    options: [
      { id: 1, text: "9" },
      { id: 2, text: "10" },
      { id: 3, text: "dont know" },
      { id: 4, text: "3" },
    ],
    correctAnswerId: 1,
  },
  {
    text: "just choose 3",
    options: [
      { id: 1, text: "4" },
      { id: 2, text: "4" },
      { id: 3, text: "3" },
      { id: 4, text: "6" },
    ],
    correctAnswerId: 3,
  },
  {
    text: "i dont have questions",
    options: [
      { id: 1, text: "2" },
      { id: 2, text: "2" },
      { id: 3, text: "3" },
      { id: 4, text: "choose this" },
    ],
    correctAnswerId: 4,
  },
];

const QuizModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [question, setQuestion] = useState(questions[0]);

  useEffect(() => {
    if (!isOpen) return;

    // 随机选择一个问题
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setQuestion(randomQuestion);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          resetQuiz();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const handleAnswer = (optionId) => {
    const correct = optionId === question.correctAnswerId;
    setSelectedAnswer(optionId);
    setIsCorrect(correct);
    setTimeout(() => {
      if (correct) {
        onSuccess();
      }
      onClose();
      resetQuiz();
    }, 500);  // 半秒后关闭弹窗
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(5);
  };

  if (!isOpen) return null;

  return (
    <Html center>
      <div className="quiz-modal">
        <div className="quiz-content">
          <h2>{question.text}</h2>
          <div className="options">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={selectedAnswer === option.id ? (isCorrect ? "correct" : "incorrect") : ""}
                disabled={selectedAnswer !== null}
              >
                {option.text}
              </button>
            ))}
          </div>
          <p>Time left: {timeLeft}s</p>
        </div>
      </div>
    </Html>
  );
};

export default QuizModal;
