import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Link,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Work from '@mui/icons-material/Work';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetStep, setResetStep] = useState(1); // Step 1: Email verification, Step 2: New password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // In a real app, you would validate against a backend
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === formData.email);
    
    if (user && user.password === formData.password) {
      if (user.isBlocked) {
        setError('Your account has been blocked. Please contact support.');
        return;
      }
      
      // Update last login time
      const updatedUsers = users.map((u: any) => {
        if (u.email === formData.email) {
          return {
            ...u,
            lastLogin: new Date().toISOString()
          };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Clear any existing admin state
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminEmail');

      // Set user state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', user.name || formData.email.split('@')[0]);
      localStorage.setItem('userEmail', formData.email);
      
      // Dispatch a custom event to notify other components about the login
      window.dispatchEvent(new CustomEvent('userLoggedIn'));
      
      // Special case for admin
      if (formData.email === 'admin@kodjobs.com' && formData.password === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', formData.email);
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError('Invalid email or password');
      // Clear password field on error
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setResetStep(1);
    setResetEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setResetSuccess(false);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setResetStep(1);
    setResetEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setResetSuccess(false);
  };

  const handleVerifyEmail = () => {
    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }

    // Check if email exists in users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((user: any) => user.email === resetEmail);

    if (!userExists) {
      setResetError('No account found with this email address');
      return;
    }

    // Email verified, proceed to password reset step
    setResetStep(2);
    setResetError('');
  };

  const handleResetPassword = () => {
    // Validate passwords
    if (!newPassword) {
      setResetError('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    // Update the password
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => {
      if (user.email === resetEmail) {
        return { ...user, password: newPassword };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setResetSuccess(true);
    
    // Close dialog after 3 seconds
    setTimeout(() => {
      handleForgotPasswordClose();
    }, 3000);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        bgcolor: '#f5f5f5',
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            flex: '1',
            background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            p: 4,
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Professional workspace"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4,
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Find your dream job with KodJobs
            </Typography>
            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "KodJobs helped me find the perfect position that matched my skills and career goals."
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                — Sarah Johnson, Software Developer
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          p: 4,
          bgcolor: '#ffffff',
          overflowY: 'auto',
          maxHeight: '100vh',
          height: '100vh',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 60,
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#1a237e',
            }}
          >
            <Work 
              sx={{ 
                fontSize: '54px',
                mr: 1,
                color: '#fff'
              }} 
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h5"
                component="span"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: '42px',
                }}
              >
                KOD
              </Typography>
              <Typography
                variant="h5"
                component="span"
                sx={{
                  fontWeight: 700,
                  color: '#FF5722',
                  fontSize: '42px',
                }}
              >
                JOBS
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box
          sx={{
            maxWidth: 400,
            mx: 'auto',
            width: '100%',
            pb: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Enter your credentials to access your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <Box sx={{ textAlign: 'right', mb: 2 }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ 
                  cursor: 'pointer',
                  textAlign: 'right',
                  mt: 1,
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={handleForgotPasswordOpen}
              >
                Forgot password?
              </Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                bgcolor: '#1a237e',
                borderRadius: 2,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#283593',
                },
                boxShadow: '0 4px 8px rgba(26, 35, 126, 0.2)',
              }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" variant="body2" color="primary" fontWeight="bold">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog 
        open={forgotPasswordOpen} 
        onClose={handleForgotPasswordClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {resetSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Password has been reset successfully! You can now login with your new password.
            </Alert>
          ) : resetStep === 1 ? (
            <>
              <Typography variant="body1" sx={{ mb: 2, mt: 1 }}>
                Enter your email address to reset your password.
              </Typography>
              {resetError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {resetError}
                </Alert>
              )}
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2, mt: 1 }}>
                Create a new password for your account.
              </Typography>
              {resetError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {resetError}
                </Alert>
              )}
              <TextField
                margin="dense"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowNewPassword}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="dense"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordClose} color="primary">
            Cancel
          </Button>
          {!resetSuccess && (
            <Button 
              onClick={resetStep === 1 ? handleVerifyEmail : handleResetPassword} 
              color="primary" 
              variant="contained"
            >
              {resetStep === 1 ? 'Continue' : 'Reset Password'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login; 