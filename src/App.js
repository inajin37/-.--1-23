import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import CalendarPage from './pages/CalendarPage';
import ExercisesPage from './pages/ExercisesPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import PlanPage from './pages/PlanPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';

const PrivateRoute = ({ children, userId }) => {
  const location = useLocation();

  if (!userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null);
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const navigate = useNavigate();

  useEffect(() => {
    // Сохраняем данные при изменении
    if (userId && username) {
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
    }
  }, [userId, username]);

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/signup" element={<SignupPage setUserId={setUserId} setUsername={setUsername} />} />
      <Route path="/login" element={<LoginPage setUserId={setUserId} setUsername={setUsername} />} />
      
      {/* Приватные маршруты */}
      <Route
        path="/profile"
        element={
          <PrivateRoute userId={userId}>
            <ProfilePage userId={userId} setUserId={setUserId} setUsername={setUsername} />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute userId={userId}>
            <MainPage userId={userId} setUserId={setUserId} username={username} setUsername={setUsername} />
          </PrivateRoute>
        }
      />
      <Route
        path="/plan"
        element={
          <PrivateRoute userId={userId}>
            <PlanPage userId={userId} setUserId={setUserId} />
          </PrivateRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <PrivateRoute userId={userId}>
            <CalendarPage userId={userId} setUserId={setUserId} />
          </PrivateRoute>
        }
      />
      <Route
        path="/exercises"
        element={
          <PrivateRoute userId={userId}>
            <ExercisesPage userId={userId} setUserId={setUserId} />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;