import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

const questions = [
  {
    text: "What is a fundamental element of web development?",
    options: [
      { id: 1, text: "CSS Frameworks" },
      { id: 2, text: "Protocols in a web application" },
      { id: 3, text: "Graphic Design" },
      { id: 4, text: "Video Editing" },
    ],
    correctAnswerId: 2,
  },
  {
    text: "Which technology is essential for information representation in a web application?",
    options: [
      { id: 1, text: "Python" },
      { id: 2, text: "HTML" },
      { id: 3, text: "Swift" },
      { id: 4, text: "C++" },
    ],
    correctAnswerId: 2,
  },
  {
    text: "JSX in React is used to:",
    options: [
      { id: 1, text: "Define application state" },
      { id: 2, text: "Handle HTTP requests" },
      { id: 3, text: "Render UI components" },
      { id: 4, text: "Manage database connections" },
    ],
    correctAnswerId: 3,
  },
  {
    text: "Which hook in React is used for managing state within functional components?",
    options: [
      { id: 1, text: "useEffect" },
      { id: 2, text: "useState" },
      { id: 3, text: "useContext" },
      { id: 4, text: "useReducer" },
    ],
    correctAnswerId: 2,
  },
  {
    text: "React props are used to:",
    options: [
      { id: 1, text: "Style components" },
      { id: 2, text: "Pass data to components" },
      { id: 3, text: "Create server-side applications" },
      { id: 4, text: "Manage application routing" },
    ],
    correctAnswerId: 2,
  },
  {
    text: "Class components in React differ from functional components in that they:",
    options: [
      { id: 1, text: "Cannot have state" },
      { id: 2, text: "Are used for routing" },
      { id: 3, text: "Use the render method" },
      { id: 4, text: "Are faster in execution" },
    ],
    correctAnswerId: 3,
  },
  {
    text: "The useEffect hook in React is used for:",
    options: [
      { id: 1, text: "Managing component lifecycle" },
      { id: 2, text: "Styling components" },
      { id: 3, text: "Handling form submissions" },
      { id: 4, text: "Fetching CSS files" },
    ],
    correctAnswerId: 1,
  },
  {
    text: "A JSON server in a React application is used to",
    options: [
      { id: 1, text: "Serve HTML files" },
      { id: 2, text: "Handle user authentication" },
      { id: 3, text: "Store and retrieve data" },
      { id: 4, text: "Manage component styling" },
    ],
    correctAnswerId: 3,
  },
  {
    text: "To fetch data from a JSON server in React, you would use:",
    options: [
      { id: 1, text: "SQL queries" },
      { id: 2, text: "HTTP requests" },
      { id: 3, text: "FTP connections" },
      { id: 4, text: "WebSockets" },
    ],
    correctAnswerId: 2,
  }
];

const QuizModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [question, setQuestion] = useState(questions[0]);

  useEffect(() => {
    if (!isOpen) return;

    // randomly pick a question
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
    }, 500);  // close question ui after 0.5s
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