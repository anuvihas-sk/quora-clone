import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';
import AskQuestion from './components/AskQuestion';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <header className="navbar">
          <div className="navbar-container">
            <h1 className="logo">EduLearn</h1>
            <nav className="nav">
              <Link to="/">Home</Link>
              <Link to="/ask">Ask Question</Link>
            </nav>
          </div>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<QuestionList />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} EduLearn. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
