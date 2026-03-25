import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CreateExam from './pages/CreateExam';
import ExamList from './pages/ExamList';
import AddQuestions from './pages/AddQuestions';
import StudentExams from './pages/StudentExams';
import TakeExam from './pages/TakeExam';
import ExamReports from './pages/ExamReports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <ProtectedRoute adminOnly>
                <ExamList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/create"
            element={
              <ProtectedRoute adminOnly>
                <CreateExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/:examId/questions"
            element={
              <ProtectedRoute adminOnly>
                <AddQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/exams"
            element={
              <ProtectedRoute>
                <StudentExams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/exams/:examId/take"
            element={
              <ProtectedRoute>
                <TakeExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ExamReports />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
