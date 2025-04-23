import React, { useState, useEffect } from 'react';
import { fetchQuestions, likeQuestion, commentQuestion, likeAnswer, commentAnswer } from '../api/api';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [questionComments, setQuestionComments] = useState({});
  const [answerComments, setAnswerComments] = useState({});

  useEffect(() => {
    fetchQuestions()
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const toggleExpand = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleLikeQuestion = (questionId) => {
    likeQuestion(questionId)
      .then(updated => {
        setQuestions(prev =>
          prev.map(q => (q.id === questionId ? { ...q, likes: updated.likes } : q))
        );
      })
      .catch(error => console.error('Error liking question:', error));
  };

  const handleLikeAnswer = (questionId, answerId) => {
    likeAnswer(questionId, answerId)
      .then(updated => {
        setQuestions(prev =>
          prev.map(q => {
            if (q.id === questionId) {
              return {
                ...q,
                answers: q.answers.map(a =>
                  a.id === answerId ? { ...a, likes: updated.likes } : a
                )
              };
            }
            return q;
          })
        );
      })
      .catch(error => console.error('Error liking answer:', error));
  };

  const handleCommentQuestion = (questionId) => {
    const comment = questionComments[questionId];
    if (comment && comment.trim()) {
      commentQuestion(questionId, comment)
        .then(updated => {
          setQuestions(prev =>
            prev.map(q => (q.id === questionId ? { ...q, comments: updated.comments } : q))
          );
          setQuestionComments(prev => ({ ...prev, [questionId]: '' }));
        })
        .catch(error => console.error('Error commenting on question:', error));
    }
  };

  const handleCommentAnswer = (questionId, answerId) => {
    const comment = answerComments[answerId];
    if (comment && comment.trim()) {
      commentAnswer(questionId, answerId, comment)
        .then(updated => {
          setQuestions(prev =>
            prev.map(q => {
              if (q.id === questionId) {
                return {
                  ...q,
                  answers: q.answers.map(a =>
                    a.id === answerId ? { ...a, comments: updated.comments } : a
                  )
                };
              }
              return q;
            })
          );
          setAnswerComments(prev => ({ ...prev, [answerId]: '' }));
        })
        .catch(error => console.error('Error commenting on answer:', error));
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#222', fontWeight: '700' }}>Questions</h2>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {questions.map(question => (
          <li key={question.id} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#b92b27', fontWeight: '700', fontSize: '1.25rem' }}>
              <a href={`/question/${question.id}`} style={{ textDecoration: 'none', color: '#b92b27' }}>{question.title}</a>
            </h3>
            {question.answers && question.answers.length > 0 ? (
              <>
                <p style={{ marginBottom: '0.5rem', color: '#333', fontSize: '1rem', lineHeight: '1.4' }}>{question.answers[0].body}</p>
                <button
                  onClick={() => toggleExpand(question.id)}
                  style={{ background: 'none', border: 'none', color: '#0077cc', cursor: 'pointer', padding: 0, fontSize: '0.9rem', marginBottom: '0.5rem' }}
                >
                  {expandedQuestions[question.id] ? 'Show less' : 'Read more'}
                </button>
                {expandedQuestions[question.id] && question.answers.slice(1).map(ans => (
                  <div key={ans.id} style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #eee' }}>
                    <p style={{ marginBottom: '0.25rem', color: '#555', fontSize: '0.95rem', lineHeight: '1.3' }}>{ans.body}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleLikeAnswer(question.id, ans.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#b92b27',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                        aria-label="Like answer"
                      >
                        ♥ {ans.likes || 0}
                      </button>
                      <input
                        type="text"
                        value={answerComments[ans.id] || ''}
                        onChange={(e) => setAnswerComments(prev => ({ ...prev, [ans.id]: e.target.value }))}
                        placeholder="Add a comment"
                        style={{ flexGrow: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                      />
                      <button
                        onClick={() => handleCommentAnswer(question.id, ans.id)}
                        style={{ backgroundColor: '#b92b27', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                      >
                        Comment
                      </button>
                    </div>
                    {ans.comments && ans.comments.length > 0 && (
                      <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                        {ans.comments.map((cmt, idx) => (
                          <li key={idx} style={{ borderBottom: '1px solid #eee', padding: '4px 0' }}>{cmt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <p style={{ fontStyle: 'italic', color: '#666' }}>No answers yet.</p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => handleLikeQuestion(question.id)}
                style={{ background: 'none', border: 'none', color: '#b92b27', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}
                aria-label="Like question"
              >
                ♥ {question.likes || 0}
              </button>
              <input
                type="text"
                value={questionComments[question.id] || ''}
                onChange={(e) => setQuestionComments(prev => ({ ...prev, [question.id]: e.target.value }))}
                placeholder="Add a comment"
                style={{ flexGrow: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.9rem' }}
              />
              <button
                onClick={() => handleCommentQuestion(question.id)}
                style={{ backgroundColor: '#b92b27', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
              >
                Comment
              </button>
            </div>
            {question.comments && question.comments.length > 0 && (
              <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                {question.comments.map((cmt, idx) => (
                  <li key={idx} style={{ borderBottom: '1px solid #eee', padding: '4px 0' }}>{cmt}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
