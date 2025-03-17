import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Email, Phone, LocationOn, Send } from '@mui/icons-material';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  read: boolean;
}

const ContactUs = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get logged in user data
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Pre-fill user data
    setFormData(prev => ({
      ...prev,
      name: userName || '',
      email: userEmail || ''
    }));
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.subject || !formData.message) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    try {
      // Get existing queries
      const existingQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
      
      // Create new query
      const newQuery: ContactQuery = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        message: `${formData.subject}\n\n${formData.message}`,
        timestamp: new Date().toISOString(),
        status: 'pending',
        read: false
      };

      // Save to localStorage
      localStorage.setItem('contactQueries', JSON.stringify([...existingQueries, newQuery]));

      // Show success message and reset form
      setSuccess('Thank you for your message. We will get back to you soon!');
      setError('');
      setFormData(prev => ({
        ...prev,
        subject: '',
        message: '',
      }));
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Failed to save contact query:', err);
    }
  };

  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh', 
      pt: 10, 
      pb: 8 
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold" 
            color="primary.dark"
            sx={{ mb: 2 }}
          >
            Contact Us
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Browse through hundreds of opportunities and take the next step in your career
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Info Cards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4
              }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  borderRadius: '50%', 
                  p: 2, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64
                }}>
                  <Email sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Email Us
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  support@kodjobs.com
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4
              }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  borderRadius: '50%', 
                  p: 2, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64
                }}>
                  <Phone sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Call Us
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  +91 9353578573
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4
              }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  borderRadius: '50%', 
                  p: 2, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64
                }}>
                  <LocationOn sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Visit Us
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Bangalore, India
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Contact Form */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'white',
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.dark">
                Send Us a Message
              </Typography>
              <Divider sx={{ mb: 4 }} />
              
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="name"
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      disabled
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 1 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      disabled
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 1 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="subject"
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 1 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="message"
                      label="Message"
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 1 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ 
                        mt: 2,
                        py: 1.5,
                        px: 4,
                        borderRadius: 1,
                        bgcolor: '#ff5722',
                        '&:hover': { bgcolor: '#e64a19' },
                        boxShadow: '0 4px 12px rgba(255, 87, 34, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                      endIcon={<Send />}
                    >
                      SEND MESSAGE
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs; 