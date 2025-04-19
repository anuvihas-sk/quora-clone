import React, { useState } from 'react';
import axios from 'axios';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = { title, body };

    axios.post('http://localhost:5000/questions', newQuestion)
      .then(response => {
        alert('Question posted!');
        setTitle('');
        setBody('');
      })
      .catch(error => console.error('Error posting question:', error));
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Question Title" 
          required 
        />
        <textarea 
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
          placeholder="Question Body" 
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AskQuestion;
