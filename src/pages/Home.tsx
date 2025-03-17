import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Work, Person, Search, Edit, ArrowForward, CheckCircle } from '@mui/icons-material';
import ReviewsSection from '../components/ReviewsSection';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    // Check if user is logged in and if profile is completed
    const checkUserStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          // Check if user has completed profile by looking at users in localStorage
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const currentUser = users.find((u: any) => u.email === userEmail);
          
          // Consider profile completed if user has a name and at least one more field filled
          const hasCompletedProfile = currentUser && 
            currentUser.name && 
            (currentUser.bio || currentUser.skills || currentUser.resume || currentUser.profilePicture);
          
          setProfileCompleted(!!hasCompletedProfile);
        }
      }
    };

    // Initial check
    checkUserStatus();

    // Listen for logout events
    const handleLogout = () => {
      setIsLoggedIn(false);
      setProfileCompleted(false);
    };

    // Listen for login events
    const handleLogin = () => {
      setIsLoggedIn(true);
      // Check profile completion after login
      setTimeout(checkUserStatus, 100); // Small delay to ensure localStorage is updated
    };

    // Listen for storage changes (for cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn' || e.key === 'users' || e.key === 'userData') {
        checkUserStatus();
      }
    };

    // Listen for profile updates
    const handleProfileUpdate = () => {
      checkUserStatus();
    };

    // Add event listeners
    window.addEventListener('userLoggedOut', handleLogout);
    window.addEventListener('userLoggedIn', handleLogin);
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleStorageChange);

    // Clean up event listeners
    return () => {
      window.removeEventListener('userLoggedOut', handleLogout);
      window.removeEventListener('userLoggedIn', handleLogin);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Box>
      {/* Hero Section with Gradient Background */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          opacity: 0.05,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '15px 15px',
        }} />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="bold"
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                Find Your Dream Job Today
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 300,
                  opacity: 0.9,
                  maxWidth: '90%'
                }}
              >
                Connect with top employers and discover opportunities that match your skills and career goals.
              </Typography>
              
              {/* Action buttons based on user state */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {isLoggedIn ? (
                  profileCompleted ? (
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="large"
                      startIcon={<Search />}
                      href="/jobs"
                      sx={{ 
                        py: 1.5, 
                        px: 3, 
                        fontWeight: 'bold',
                        boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)'
                      }}
                    >
                      Browse Jobs
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="large"
                      startIcon={<Edit />}
                      href="/profile"
                      sx={{ 
                        py: 1.5, 
                        px: 3, 
                        fontWeight: 'bold',
                        boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)'
                      }}
                    >
                      Complete Your Profile
                    </Button>
                  )
                ) : (
                  <>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="large"
                      startIcon={<Person />}
                      href="/register"
                      sx={{ 
                        py: 1.5, 
                        px: 3, 
                        fontWeight: 'bold',
                        boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)'
                      }}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      href="/jobs"
                      sx={{ 
                        py: 1.5, 
                        px: 3, 
                        fontWeight: 'bold',
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Explore Jobs
                    </Button>
                  </>
                )}
              </Box>
              
              {/* Stats */}
              <Box sx={{ 
                mt: 6, 
                display: 'flex', 
                gap: { xs: 3, md: 5 },
                flexWrap: 'wrap'
              }}>
                {[
                  { number: '10,000+', label: 'Job Listings' },
                  { number: '5,000+', label: 'Companies' },
                  { number: '25,000+', label: 'Successful Hires' }
                ].map((stat, index) => (
                  <Box key={index}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                component="img"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Professional working on laptop"
                sx={{ 
                  width: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Trusted By Section */}
      <Box sx={{ py: 4, bgcolor: '#f5f7fa' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 3, fontWeight: 500 }}
          >
            TRUSTED BY TOP COMPANIES
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'IBM'].map((company, index) => (
              <Grid item key={index}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'text.secondary',
                    opacity: 0.7
                  }}
                >
                  {company}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              mb: 1
            }}
          >
            How KodJobs Works
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              mb: 6 
            }}
          >
            Our platform simplifies the job search process with these easy steps
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                icon: <Person sx={{ fontSize: 40 }} />,
                title: "Create Your Profile",
                description: "Sign up and build your professional profile with your skills, experience, and preferences."
              },
              {
                icon: <Search sx={{ fontSize: 40 }} />,
                title: "Discover Opportunities",
                description: "Browse through thousands of job listings or get personalized job recommendations."
              },
              {
                icon: <Work sx={{ fontSize: 40 }} />,
                title: "Apply With Ease",
                description: "Apply to jobs with just a few clicks and track your application status in real-time."
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      mb: 3
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Divider sx={{ my: 8 }} />
        
        {/* For Job Seekers and Employers Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Why Choose KodJobs?
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                KodJobs offers a range of benefits that make it the perfect platform for both job seekers and employers.
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  {
                    title: "Personalized Job Matches",
                    description: "Our platform connects you with opportunities that match your skills and preferences."
                  },
                  {
                    title: "Career Resources",
                    description: "Access tools and resources to help you advance in your professional journey."
                  },
                  {
                    title: "User-Friendly Interface",
                    description: "Navigate easily through our intuitive platform designed for a seamless experience."
                  }
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: 'primary.main', mr: 1.5, mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Our Platform Features
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                KodJobs provides powerful tools and features to help you succeed in your job search or hiring process.
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  {
                    title: "Advanced Search Filters",
                    description: "Find exactly what you're looking for with our comprehensive search filters by location, salary, and job type."
                  },
                  {
                    title: "One-Click Apply",
                    description: "Apply to multiple jobs quickly with your saved profile and resume, saving you time in your job search."
                  },
                  {
                    title: "Company Reviews",
                    description: "Read authentic reviews from current and former employees to make informed decisions about potential employers."
                  }
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: 'primary.main', mr: 1.5, mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* CTA Section */}
        <Box 
          sx={{ 
            mt: 8, 
            p: 6, 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 700, mx: 'auto', opacity: 0.9 }}>
            Join thousands of professionals who have found their dream jobs through KodJobs
          </Typography>
          
          {isLoggedIn ? (
            profileCompleted ? (
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                endIcon={<Person />}
                href="/profile"
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                  bgcolor: '#e91e63',
                  '&:hover': {
                    bgcolor: '#d81b60'
                  }
                }}
              >
                VIEW YOUR PROFILE
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                endIcon={<Edit />}
                href="/profile"
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                  bgcolor: '#e91e63',
                  '&:hover': {
                    bgcolor: '#d81b60'
                  }
                }}
              >
                COMPLETE YOUR PROFILE
              </Button>
            )
          ) : (
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              endIcon={<ArrowForward />}
              href="/register"
              sx={{ 
                py: 1.5, 
                px: 4, 
                fontWeight: 'bold',
                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                bgcolor: '#e91e63',
                '&:hover': {
                  bgcolor: '#d81b60'
                }
              }}
            >
              GET STARTED NOW
            </Button>
          )}
        </Box>
      </Container>
      
      {/* Reviews Section */}
      <ReviewsSection />
    </Box>
  );
};

export default Home;