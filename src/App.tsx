import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import SimpleNavbar from './components/SimpleNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import ContactUs from './pages/ContactUs';
import SimpleContact from './pages/SimpleContact';
import ResetPassword from './pages/ResetPassword';
import Jobs from './pages/Jobs';
import AIChat from './pages/AIChat';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
  
  if (!isAdmin) {
    return <Navigate to="/adminlogin" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  // Track page visits
  useEffect(() => {
    // Generate a visitor ID if not exists
    const getVisitorId = () => {
      let visitorId = localStorage.getItem('visitorId');
      if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('visitorId', visitorId);
      }
      return visitorId;
    };

    // Record page visit
    const recordVisit = (path: string) => {
      const visitorId = getVisitorId();
      const newVisit = {
        timestamp: new Date().toISOString(),
        page: path,
        userAgent: navigator.userAgent,
        id: visitorId
      };

      const currentVisitors = JSON.parse(localStorage.getItem('siteVisitors') || '[]');
      const updatedVisitors = [...currentVisitors, newVisit];
      localStorage.setItem('siteVisitors', JSON.stringify(updatedVisitors));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('visitorUpdated'));
    };

    // Record initial visit
    recordVisit(window.location.pathname);

    // Set up listener for route changes
    const handleRouteChange = () => {
      recordVisit(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);

    // Clean up
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="/adminlogin" element={null} />
            <Route path="/login" element={<SimpleNavbar />} />
            <Route path="/register" element={<SimpleNavbar />} />
            <Route path="/simple-contact" element={<SimpleNavbar />} />
            <Route path="/reset-password" element={<SimpleNavbar />} />
            <Route path="*" element={<Navbar />} />
          </Routes>
          
          <main style={{ flexGrow: 1, padding: '20px', paddingTop: '84px' }}>
            <Routes>
              <Route path="/admin" element={<Navigate to="/adminlogin" replace />} />
              <Route path="/adminlogin" element={
                <>
                  <AdminLogin />
                </>
              } />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } 
              />
              <Route path="/" element={<Home />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/simple-contact" element={<SimpleContact />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
          
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="/adminlogin" element={null} />
            <Route path="/login" element={null} />
            <Route path="/register" element={null} />
            <Route path="/simple-contact" element={null} />
            <Route path="/reset-password" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
