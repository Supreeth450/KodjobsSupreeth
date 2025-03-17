import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  Alert,
  Grid,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';

interface AcademicDetails {
  instituteName: string;
  cgpa: string;
  yearOfPassing: string;
  puCollegeName: string;
  puPercentage: string;
}

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  skills: string;
  academicDetails: AcademicDetails;
  profilePicture: string;
  resume: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    email: '',
    bio: '',
    skills: '',
    academicDetails: {
      instituteName: '',
      cgpa: '',
      yearOfPassing: '',
      puCollegeName: '',
      puPercentage: '',
    },
    profilePicture: '',
    resume: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');

    if (!isLoggedIn || !userEmail) {
      navigate('/login');
      return;
    }

    // Load user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find((u: any) => u.email === userEmail);

    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        skills: currentUser.skills || '',
        academicDetails: currentUser.academicDetails || {
          instituteName: '',
          cgpa: '',
          yearOfPassing: '',
          puCollegeName: '',
          puPercentage: '',
        },
        profilePicture: currentUser.profilePicture || '',
        resume: currentUser.resume || null,
      });
    }
  }, [navigate]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          profilePicture: base64String
        }));
        updateUserData({ profilePicture: base64String });
        setSuccess('Profile picture updated successfully');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          resume: base64String
        }));
        updateUserData({ resume: base64String });
        setSuccess('Resume uploaded successfully');
      };

      reader.readAsDataURL(file);
    }
  };

  const updateUserData = (updates: Partial<ProfileData>) => {
    // Get current user data
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find((user: any) => user.email === userEmail);
      
      if (currentUser) {
        // Merge updates with current user data
        const updatedUser = { ...currentUser, ...updates };
        
        // Update in users array
        const updatedUsers = users.map((user: any) => {
          if (user.email === userEmail) {
            return updatedUser;
          }
          return user;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Dispatch a custom event to notify other components about the profile update
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        
        // Dispatch a custom event for the Navbar to update the profile picture
        window.dispatchEvent(new CustomEvent('localStorageUpdated'));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Name is required');
      return;
    }

    try {
      updateUserData(formData);
      localStorage.setItem('userName', formData.name);
      setSuccess('Profile updated successfully');
      setError('');
    } catch (err) {
      setError('Failed to update profile');
      setSuccess('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('academic.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        academicDetails: {
          ...prev.academicDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
            My Profile
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Manage your personal information and career details
          </Typography>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'white',
            mb: 4
          }}
        >
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
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: 5 
            }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={formData.profilePicture}
                  sx={{
                    width: 150,
                    height: 150,
                    border: '4px solid white',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  }}
                >
                  {formData.name.charAt(0).toUpperCase()}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="icon-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 5,
                      right: 5,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': { 
                        backgroundColor: 'primary.dark',
                      },
                      width: 40,
                      height: 40,
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PersonIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" fontWeight="bold" color="primary.dark">
                        Personal Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
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
                          fullWidth
                          label="Bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          multiline
                          rows={4}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Skills"
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          placeholder="e.g. Java, React, Python"
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                          helperText="Separate skills with commas"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <SchoolIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" fontWeight="bold" color="primary.dark">
                        Academic Details
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Institute Name"
                          name="academic.instituteName"
                          value={formData.academicDetails.instituteName}
                          onChange={handleChange}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="CGPA"
                          name="academic.cgpa"
                          value={formData.academicDetails.cgpa}
                          onChange={handleChange}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Year of Passing"
                          name="academic.yearOfPassing"
                          value={formData.academicDetails.yearOfPassing}
                          onChange={handleChange}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" fontWeight="medium" color="primary.dark" sx={{ mb: 2 }}>
                          Pre-University Details
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="PU College Name"
                          name="academic.puCollegeName"
                          value={formData.academicDetails.puCollegeName}
                          onChange={handleChange}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="PU Percentage"
                          name="academic.puPercentage"
                          value={formData.academicDetails.puPercentage}
                          onChange={handleChange}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                          placeholder="e.g. 85.5%"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <DescriptionIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" fontWeight="bold" color="primary.dark">
                        Resume
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      <input
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        style={{ display: 'none' }}
                        id="resume-upload"
                        type="file"
                        onChange={handleResumeUpload}
                      />
                      <label htmlFor="resume-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          sx={{ 
                            borderRadius: 1,
                            py: 1,
                            px: 2,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              backgroundColor: 'rgba(26, 35, 126, 0.04)',
                            }
                          }}
                        >
                          UPLOAD RESUME
                        </Button>
                      </label>
                      <Typography variant="body2" color="text.secondary">
                        {formData.resume ? 'Resume uploaded' : 'No resume uploaded yet'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                sx={{ 
                  py: 1.5,
                  px: 4,
                  borderRadius: 1,
                  bgcolor: '#ff5722',
                  '&:hover': { bgcolor: '#e64a19' },
                  boxShadow: '0 4px 12px rgba(255, 87, 34, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                SAVE CHANGES
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile; 