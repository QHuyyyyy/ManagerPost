import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './routes/Login'
import DashboardPage from './routes/dashboard/page';
import Layout from './routes/layout';
import { ThemeProvider } from './contexts/theme-context';

function App() {
  return (
    <ThemeProvider storageKey="theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            {/* Các routes khác */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;