import React from 'react';
import { Container, Paper, Typography, Box, Link, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const SimpleContact = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ 
            mb: 3, 
            color: 'primary.main',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            justifyContent: 'flex-start',
            pl: 0
          }}
        >
          Back
        </Button>
        
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get in touch with the KodJobs team
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            <BusinessIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="h6">Company Address</Typography>
              <Typography variant="body1">
                KodJobs Inc.<br />
                123 Tech Avenue<br />
                BTM Layout, Bengaluru 560076
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            <EmailIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="h6">Email</Typography>
              <Link href="mailto:info@kodjobs.com" underline="hover" color="primary.main">
                info@kodjobs.com
              </Link>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <PhoneIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="h6">Phone</Typography>
              <Link href="tel:+91-80-4567-8901" underline="hover" color="primary.main">
                +91 80 4567 8901
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SimpleContact; 