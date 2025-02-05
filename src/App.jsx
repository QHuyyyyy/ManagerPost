import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './routes/Login'
import DashboardPage from './routes/dashboard/page';
import PostManagement from './routes/PostList';
import Layout from './routes/layout';
import { ThemeProvider } from './contexts/theme-context';
import { AuthContextProvider } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider storageKey="theme">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="posts" element={<PostManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default App;