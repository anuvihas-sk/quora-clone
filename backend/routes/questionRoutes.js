const express = require('express');
const router = express.Router();
const { questions } = require('../data');
const { Question, Answer } = require('../models/Question');

// Get all questions
router.get('/', (req, res) => {
  res.json(questions);
});

// Get a single question by ID
router.get('/:id', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (!question) return res.status(404).send('Question not found');
  res.json(question);
});

// Post a new question
router.post('/', (req, res) => {
  const { title, body } = req.body;
  const newQuestion = new Question(questions.length + 1, title, body);
  questions.push(newQuestion);
  res.status(201).json(newQuestion);
});

// Post an answer to a question
router.post('/:id/answers', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (!question) return res.status(404).send('Question not found');

  const { answer } = req.body;
  const newAnswer = new Answer(question.answers.length + 1, answer);
  question.answers.push(newAnswer);
  res.status(201).json(newAnswer);
});

// Like a question
router.post('/:id/like', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (!question) return res.status(404).send('Question not found');

  question.likes += 1;
  res.json({ likes: question.likes });
});

// Add comment to question
router.post('/:id/comments', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (!question) return res.status(404).send('Question not found');

  const { comment } = req.body;
  question.comments.push(comment);
  res.status(201).json({ comments: question.comments });
});

// Like an answer
router.post('/:id/answers/:answerId/like', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (!question) return res.status(404).send('Question not found');

  const answer = question.answers.find(a => a.id === parseInt(req.params.answerId));
  if (!answer) return res.status(404).send('Answer not found');

  answer.likes += 1;
  res.json({ likes: answer.likes });
});

// Add comment to answer
router.post('/:id/answers/:answerId/comments', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (!question) return res.status(404).send('Question not found');

  const answer = question.answers.find(a => a.id === parseInt(req.params.answerId));
  if (!answer) return res.status(404).send('Answer not found');

  const { comment } = req.body;
  answer.comments.push(comment);
  res.status(201).json({ comments: answer.comments });
});

module.exports = router;
