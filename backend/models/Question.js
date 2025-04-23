class Question {
  constructor(id, title, body) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.likes = 0;
    this.comments = [];
    this.answers = [];
  }
}

class Answer {
  constructor(id, body) {
    this.id = id;
    this.body = body;
    this.likes = 0;
    this.comments = [];
  }
}

module.exports = { Question, Answer };
  