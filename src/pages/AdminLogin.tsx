import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  Avatar,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hide navbar when on admin login page
  useEffect(() => {
    // Hide navbar
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.display = 'none';
    }

    // Show navbar when component unmounts
    return () => {
      if (navbar) {
        navbar.style.display = 'flex';
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Check admin credentials
    if (email === 'admin@kodjobs.com' && password === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      // Use React Router navigation instead of direct browser navigation
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        py: 4,
        mt: -5 // Move everything up slightly
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={0} alignItems="center" justifyContent="center">
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              position: 'relative'
            }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <Box
                component="img"
                src="https://img.freepik.com/free-vector/recruitment-agency-searching-candidates_1262-19920.jpg"
                alt="Admin Dashboard"
                sx={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  mb: 4,
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              />
              <Typography 
                variant="h4" 
                color="primary.dark" 
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                KodJobs Admin Portal
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage job listings, user accounts, and site content from a single dashboard.
                Monitor application statistics and respond to user queries efficiently.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 },
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                maxWidth: 500,
                mx: 'auto',
                transform: 'translateY(-40px)' // Move the form up slightly
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  mb: 4
                }}
              >
                <Avatar 
                  sx={{ 
                    m: 1, 
                    bgcolor: 'primary.main',
                    width: 60,
                    height: 60
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography component="h1" variant="h4" fontWeight="bold" color="primary.dark">
                  Admin Login
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Admin Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Admin Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    py: 1.5,
                    borderRadius: 1,
                    bgcolor: '#1a237e',
                    '&:hover': { bgcolor: '#0d1642' },
                    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold'
                  }}
                >
                  SIGN IN AS ADMIN
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminLogin; 