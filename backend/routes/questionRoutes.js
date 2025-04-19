const express = require('express');
const router = express.Router();
const { questions } = require('../data');

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
  const newQuestion = {
    id: questions.length + 1,
    title,
    body,
    answers: []
  };
  questions.push(newQuestion);
  res.status(201).json(newQuestion);
});

// Post an answer to a question
router.post('/:id/answers', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (!question) return res.status(404).send('Question not found');

  const { answer } = req.body;
  question.answers.push(answer);
  res.status(201).json(answer);
});

module.exports = router;
