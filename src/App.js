import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import "tailwindcss/tailwind.css";

const EyeTrackingExam = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [screenFocus, setScreenFocus] = useState(true);
  const [examEnded, setExamEnded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const questions = [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "High Tech Markup Language"], answer: 0 },
    { question: "What is CSS used for?", options: ["Styling web pages", "Structuring web pages", "Programming web pages", "Connecting databases"], answer: 0 },
    { question: "What does SQL stand for?", options: ["Structured Query Language", "Structured Question Language", "Simple Query Language", "System Query Language"], answer: 0 },
    { question: "What is React?", options: ["A JavaScript library", "A CSS framework", "A programming language", "A database"], answer: 0 },
    { question: "What is Bootstrap?", options: ["A CSS framework", "A JavaScript library", "A database", "A text editor"], answer: 0 },
    { question: "What is the use of Node.js?", options: ["Backend development", "Frontend development", "Database management", "Styling"], answer: 0 },
    { question: "What is an API?", options: ["Application Programming Interface", "Application Process Integration", "Application Protocol Interface", "Advanced Programming Interface"], answer: 0 },
    { question: "What is the purpose of Git?", options: ["Version control", "Database management", "Web hosting", "Frontend development"], answer: 0 },
    { question: "What is a database?", options: ["A collection of data", "A programming language", "A type of software", "A network"], answer: 0 },
    { question: "What is JavaScript used for?", options: ["Making web pages interactive", "Styling web pages", "Structuring web pages", "Database management"], answer: 0 },
  ];

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endExam("Time's up");
    }
  }, [examStarted, timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setScreenFocus(false);
        handleCheating("Screen change detected");
      } else {
        setScreenFocus(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleCheating = (reason) => {
    setWarnings((prev) => prev + 1);
    setCheatingDetected(true);
    alert(`Cheating detected: ${reason}`);
    if (warnings + 1 >= 5) {
      endExam("Cheating limit exceeded");
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore((prev) => prev + 1);
    }
    setSelectedOption(null);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      endExam("Exam completed");
    }
  };

  const endExam = (reason) => {
    alert(reason);
    setExamStarted(false);
    setExamEnded(true);
    setScreenFocus(false);
    setCheatingDetected(false);
  };

  const startExam = () => {
    setExamStarted(true);
    setExamEnded(false);
    setCurrentQuestion(0);
    setScore(0);
    setWarnings(0);
    setTimeLeft(600);
    setCheatingDetected(false);
    setSelectedOption(null);
    alert("Screen sharing has started. Please stay focused on the exam.");
  };

  const backgroundColor =
  !examStarted && !examEnded
      ? "bg-gray-100"
      : examStarted
      ? "bg-gray-200"
      : examEnded
      ? "bg-gray-200"
      : warnings >= 3
      ? "bg-red-100"
      : "bg-green-100";


  return (
    <div className={`min-h-screen flex items-center justify-center ${backgroundColor} text-gray-900`}>
      {!examStarted && !examEnded && (
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-6 text-blue-600">🎓 Proctoring Examination</h1>
          <button
            onClick={startExam}
            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-400 focus:ring-4 focus:ring-blue-200 transition"
          >
            🏁 Start Examination
          </button>
        </div>
        
      )}

      {examStarted && (
        <div className="relative w-full h-screen flex flex-col md:flex-row">
          <div className="absolute top-4 right-4 border-4 border-blue-500 rounded-lg overflow-hidden shadow-lg">
            <Webcam className="w-40 h-30 border-blue-400 rounded-md" />
          </div>

          <div className="w-full md:w-2/3 p-6 md:p-10 rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">📖 Proctoring Examination</h1>
            <h2 className="text-lg mb-2 font-semibold">⏳ Time Left:  {Math.floor(timeLeft / 60)}:{timeLeft % 60}</h2>
            <h3 className="text-lg mb-4 font-semibold text-red-600">⚠️ Warnings: {warnings}/ 5</h3>

            <div className="p-6 bg-gray-50 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-4">Que {currentQuestion + 1}: {questions[currentQuestion].question}</h3>
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  className={`block w-full text-left px-4 py-2 rounded mb-3 border transition ${
                    selectedOption === index ? "bg-blue-200" : "hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
                
                ))}
                <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`mt-5 px-5 py-2 rounded text-white transition ${
                  selectedOption !== null ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Submit Answer
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {examEnded && (
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-red-600 mb-4 animate-pulse">📢 Examination Ended</h2>
          <h3
            className={`text-3xl font-bold ${
              warnings > 3 || score < 3 ? "text-red-600" : "text-green-600"
            }`}
          >
            {warnings > 3 || score < 3 ? "❌ Result: Failed" : "✅ Result: Passed"}
          </h3>
          <p className="text-xl font-medium text-gray-700 mt-2">
            Score: {score} / {questions.length}
          </p>
          {warnings > 5 && <p className="text-red-500 text-lg">⚠️ Reason: Too many warnings (cheating detected)</p>}
          {score < 3 && <p className="text-red-500 text-lg mt-2">⚠️ Reason: Low Score</p>}
        </div>
      )}
    </div>
  );
};

export default EyeTrackingExam;




