import axios from 'axios';

const API_URL = 'http://localhost:5000/questions';

export const fetchQuestions = () => {
  return axios.get(API_URL)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching questions:', error);
      throw error;
    });
};

export const fetchQuestion = (id) => {
  return axios.get(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error fetching question with id ${id}:`, error);
      throw error;
    });
};

export const postQuestion = (question) => {
  return axios.post(API_URL, question)
    .then(response => response.data)
    .catch(error => {
      console.error('Error posting question:', error);
      throw error;
    });
};

export const postAnswer = (id, answer) => {
  return axios.post(`${API_URL}/${id}/answers`, { answer })
    .then(response => response.data)
    .catch(error => {
      console.error(`Error posting answer for question with id ${id}:`, error);
      throw error;
    });
};

// New API calls for likes and comments

export const likeQuestion = (id) => {
  return axios.post(`${API_URL}/${id}/like`)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error liking question with id ${id}:`, error);
      throw error;
    });
};

export const commentQuestion = (id, comment) => {
  return axios.post(`${API_URL}/${id}/comments`, { comment })
    .then(response => response.data)
    .catch(error => {
      console.error(`Error commenting on question with id ${id}:`, error);
      throw error;
    });
};

export const likeAnswer = (questionId, answerId) => {
  return axios.post(`${API_URL}/${questionId}/answers/${answerId}/like`)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error liking answer with id ${answerId} for question ${questionId}:`, error);
      throw error;
    });
};

export const commentAnswer = (questionId, answerId, comment) => {
  return axios.post(`${API_URL}/${questionId}/answers/${answerId}/comments`, { comment })
    .then(response => response.data)
    .catch(error => {
      console.error(`Error commenting on answer with id ${answerId} for question ${questionId}:`, error);
      throw error;
    });
};
