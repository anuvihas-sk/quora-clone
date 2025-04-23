import React, { useState, useEffect } from 'react';
import {
  fetchQuestion,
  postAnswer,
  likeQuestion,
  commentQuestion,
  likeAnswer,
  commentAnswer
} from '../api/api';
import { useParams } from 'react-router-dom';

const QuestionDetail = () => {
  const { id: questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answerComments, setAnswerComments] = useState({});
  const [questionComment, setQuestionComment] = useState('');

  useEffect(() => {
    fetchQuestion(questionId)
      .then(data => setQuestion(data))
      .catch(error => console.error('Error fetching question:', error));
  }, [questionId]);

  const handleAnswerSubmit = () => {
    if (answer.trim()) {
      postAnswer(questionId, answer)
        .then(newAnswer => {
          setQuestion(prev => ({
            ...prev,
            answers: [...prev.answers, newAnswer]
          }));
          setAnswer('');
        })
        .catch(error => console.error('Error posting answer:', error));
    }
  };

  const handleLikeQuestion = () => {
    likeQuestion(questionId)
      .then(data => {
        setQuestion(prev => ({
          ...prev,
          likes: data.likes
        }));
      })
      .catch(error => console.error('Error liking question:', error));
  };

  const handleCommentQuestion = () => {
    if (questionComment.trim()) {
      commentQuestion(questionId, questionComment)
        .then(data => {
          setQuestion(prev => ({
            ...prev,
            comments: data.comments
          }));
          setQuestionComment('');
        })
        .catch(error => console.error('Error commenting on question:', error));
    }
  };

  const handleLikeAnswer = (answerId) => {
    likeAnswer(questionId, answerId)
      .then(data => {
        setQuestion(prev => ({
          ...prev,
          answers: prev.answers.map(ans =>
            ans.id === answerId ? { ...ans, likes: data.likes } : ans
          )
        }));
      })
      .catch(error => console.error('Error liking answer:', error));
  };

  const handleCommentAnswer = (answerId) => {
    const comment = answerComments[answerId];
    if (comment && comment.trim()) {
      commentAnswer(questionId, answerId, comment)
        .then(data => {
          setQuestion(prev => ({
            ...prev,
            answers: prev.answers.map(ans =>
              ans.id === answerId ? { ...ans, comments: data.comments } : ans
            )
          }));
          setAnswerComments(prev => ({ ...prev, [answerId]: '' }));
        })
        .catch(error => console.error('Error commenting on answer:', error));
    }
  };

  if (!question) return <div>Loading question...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1.5rem 2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '0.75rem', fontSize: '1.8rem', fontWeight: '600', color: '#222' }}>{question.title}</h2>
      <p style={{ marginBottom: '1rem', fontSize: '1.1rem', lineHeight: '1.6', color: '#333' }}>{question.body}</p>
      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={handleLikeQuestion} style={{ marginRight: '1rem', backgroundColor: '#e7f3ff', border: '1px solid #a2c4ff', color: '#2a5db0', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
          Like ({question.likes})
        </button>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#444' }}>Comments</h4>
        {(question.comments?.length || 0) === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#666' }}>No comments yet.</p>
        ) : (
          <ul style={{ listStyleType: 'none', paddingLeft: '0', marginBottom: '0.75rem' }}>
            {question.comments?.map((cmt, idx) => (
              <li key={idx} style={{ padding: '6px 0', borderBottom: '1px solid #eee', color: '#555' }}>{cmt}</li>
            ))}
          </ul>
        )}
        <input
          type="text"
          value={questionComment}
          onChange={(e) => setQuestionComment(e.target.value)}
          placeholder="Add a comment"
          style={{ width: '100%', padding: '8px', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <button onClick={handleCommentQuestion} style={{ marginTop: '0.5rem', backgroundColor: '#b92b27', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
          Post Comment
        </button>
      </div>

      <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#222' }}>Answers</h3>
      {(question.answers?.length || 0) === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#666' }}>No answers yet. Be the first to answer!</p>
      ) : (
        <ul style={{ paddingLeft: '0', listStyleType: 'none' }}>
          {question.answers?.map((ans) => (
            <li key={ans.id} style={{ marginBottom: '1.5rem', lineHeight: '1.6', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <p style={{ fontSize: '1.05rem', color: '#333' }}>{ans.body}</p>
              <div>
                <button onClick={() => handleLikeAnswer(ans.id)} style={{ marginRight: '1rem', backgroundColor: '#e7f3ff', border: '1px solid #a2c4ff', color: '#2a5db0', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                  Like ({ans.likes})
                </button>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <h5 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#444' }}>Comments</h5>
                {(ans.comments?.length || 0) === 0 ? (
                  <p style={{ fontStyle: 'italic', color: '#666' }}>No comments yet.</p>
                ) : (
                  <ul style={{ listStyleType: 'none', paddingLeft: '0', marginBottom: '0.5rem' }}>
                    {ans.comments?.map((cmt, idx) => (
                      <li key={idx} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0', color: '#555' }}>{cmt}</li>
                    ))}
                  </ul>
                )}
                <input
                  type="text"
                  value={answerComments[ans.id] || ''}
                  onChange={(e) =>
                    setAnswerComments(prev => ({ ...prev, [ans.id]: e.target.value }))
                  }
                  placeholder="Add a comment"
                  style={{ width: '100%', padding: '6px', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                />
                <button onClick={() => handleCommentAnswer(ans.id)} style={{ marginTop: '0.5rem', backgroundColor: '#b92b27', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                  Post Comment
                </button>
              </div>
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
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical', fontSize: '1rem', lineHeight: '1.5' }}
        />
        <button
          onClick={handleAnswerSubmit}
          style={{
            marginTop: '1rem',
            padding: '12px 24px',
            backgroundColor: '#b92b27',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          Post Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;
