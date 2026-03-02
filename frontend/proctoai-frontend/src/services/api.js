const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const request = async (method, path, body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || `Request failed: ${res.status}`);
  return data;
};

// Auth
export const login = (email, password) =>
  request('POST', '/api/v1/auth/login', { email, password });

export const signup = (payload) =>
  request('POST', '/api/v1/auth/signup', payload);

export const getMe = (token) =>
  request('GET', '/api/v1/auth/me', null, token);

// Users
export const listUsers = (token, skip = 0, limit = 100) =>
  request('GET', `/api/v1/users/?skip=${skip}&limit=${limit}`, null, token);

export const getUser = (token, userId) =>
  request('GET', `/api/v1/users/${userId}`, null, token);

export const updateUser = (token, userId, payload) =>
  request('PATCH', `/api/v1/users/${userId}`, payload, token);

// Exams
export const createExam = (token, payload) =>
  request('POST', '/api/v1/exam/create', payload, token);

// Questions
export const listQuestions = (token, skip = 0, limit = 100) =>
  request('GET', `/api/v1/questions/?skip=${skip}&limit=${limit}`, null, token);

export const createQuestion = (token, payload) =>
  request('POST', '/api/v1/questions/', payload, token);

// Teachers / Tests
export const listTeachers = (token, skip = 0, limit = 100) =>
  request('GET', `/api/v1/teachers/?skip=${skip}&limit=${limit}`, null, token);

export const createTeacher = (token, payload) =>
  request('POST', '/api/v1/teachers/', payload, token);

// Proctoring logs
export const listProctoringLogs = (token, { email, testId, skip = 0, limit = 100 } = {}) => {
  const params = new URLSearchParams({ skip, limit });
  if (email) params.append('email', email);
  if (testId) params.append('test_id', testId);
  return request('GET', `/api/v1/proctoring/logs?${params}`, null, token);
};

export const createProctoringLog = (token, payload) =>
  request('POST', '/api/v1/proctoring/logs', payload, token);

// Window events
export const listWindowEvents = (token, { email, testId, skip = 0, limit = 100 } = {}) => {
  const params = new URLSearchParams({ skip, limit });
  if (email) params.append('email', email);
  if (testId) params.append('test_id', testId);
  return request('GET', `/api/v1/window-events/?${params}`, null, token);
};

export const createWindowEvent = (token, payload) =>
  request('POST', '/api/v1/window-events/', payload, token);
