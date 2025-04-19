import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions from the backend
    axios.get('http://localhost:5000/questions')
      .then(response => setQuestions(response.data))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  return (
    <div>
      <h2>Questions</h2>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            <a href={`/question/${question.id}`}>{question.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
