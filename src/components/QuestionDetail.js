import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const QuestionDetail = () => {
  const { id: questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/questions/${questionId}`)
      .then(response => setQuestion(response.data))
      .catch(error => console.error('Error fetching question:', error));
  }, [questionId]);

  const handleAnswerSubmit = () => {
    if (answer.trim()) {
      axios.post(`http://localhost:5000/questions/${questionId}/answers`, { answer })
        .then(response => {
          setQuestion(prev => ({
            ...prev,
            answers: [...prev.answers, response.data]
          }));
          setAnswer('');
        })
        .catch(error => console.error('Error posting answer:', error));
    }
  };

  if (!question) return <div>Loading question...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem', background: '#fff', borderRadius: '8px' }}>
      <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>{question.title}</h2>
      <p style={{ marginBottom: '2rem' }}>{question.body}</p>

      <h3>Answers</h3>
      {question.answers.length === 0 ? (
        <p>No answers yet. Be the first to answer!</p>
      ) : (
        <ul style={{ paddingLeft: '1rem' }}>
          {question.answers.map((ans, index) => (
            <li key={index} style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
              {ans}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '2rem' }}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          rows="5"
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
        />
        <button
          onClick={handleAnswerSubmit}
          style={{
            marginTop: '1rem',
            padding: '10px 20px',
            backgroundColor: '#b92b27',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Post Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;
