// When VITE_API_BASE_URL is not set the Vite dev-server proxy forwards /api → http://localhost:8000
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const getHeaders = (auth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
};

export const authAPI = {
  login: (email, password) =>
    fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  signup: (data) =>
    fetch(`${BASE_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  me: () =>
    fetch(`${BASE_URL}/api/v1/auth/me`, {
      headers: getHeaders(true),
    }).then(handleResponse),
};

export const usersAPI = {
  list: (skip = 0, limit = 100) =>
    fetch(`${BASE_URL}/api/v1/users/?skip=${skip}&limit=${limit}`, {
      headers: getHeaders(true),
    }).then(handleResponse),

  get: (id) =>
    fetch(`${BASE_URL}/api/v1/users/${id}`, {
      headers: getHeaders(true),
    }).then(handleResponse),

  create: (data) =>
    fetch(`${BASE_URL}/api/v1/users/`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${BASE_URL}/api/v1/users/${id}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
};

export const examsAPI = {
  create: (data) =>
    fetch(`${BASE_URL}/api/v1/exam/create`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  list: (skip = 0, limit = 100) =>
    fetch(`${BASE_URL}/api/v1/exam/list?skip=${skip}&limit=${limit}`, {
      headers: getHeaders(true),
    }).then(handleResponse),

  get: (examId) =>
    fetch(`${BASE_URL}/api/v1/exam/${examId}`, {
      headers: getHeaders(true),
    }).then(handleResponse),

  update: (examId, data) =>
    fetch(`${BASE_URL}/api/v1/exam/${examId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (examId) =>
    fetch(`${BASE_URL}/api/v1/exam/${examId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    }),

  getQuestions: (examId, skip = 0, limit = 100) =>
    fetch(`${BASE_URL}/api/v1/exam/${examId}/questions?skip=${skip}&limit=${limit}`, {
      headers: getHeaders(true),
    }).then(handleResponse),

  addQuestion: (examId, data) =>
    fetch(`${BASE_URL}/api/v1/exam/${examId}/questions`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateQuestion: (examId, questionId, data) =>
    fetch(`${BASE_URL}/api/v1/exam/${examId}/questions/${questionId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteQuestion: (examId, questionId) =>
    fetch(`${BASE_URL}/api/v1/exam/${examId}/questions/${questionId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    }),

  submit: (examId, data) =>
    fetch(`${BASE_URL}/api/v1/exam/${examId}/submit`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
};

export default {
  authAPI,
  usersAPI,
  examsAPI,
};
