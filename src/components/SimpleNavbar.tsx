import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Container,
  Typography,
} from '@mui/material';
import Work from '@mui/icons-material/Work';

const SimpleNavbar = () => {
  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 40,
                  padding: '4px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#1a237e',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }
                }}
              >
                <Work 
                  sx={{ 
                    fontSize: '32px',
                    mr: 1,
                    color: '#fff'
                  }} 
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      fontWeight: 700,
                      color: '#fff',
                      fontSize: '1.2rem',
                    }}
                  >
                    KOD
                  </Typography>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      fontWeight: 700,
                      color: '#FF5722',
                      fontSize: '1.2rem',
                    }}
                  >
                    JOBS
                  </Typography>
                </Box>
              </Box>
            </RouterLink>
          </Box>

          {/* Contact Us Link */}
          <Box>
            <RouterLink to="/simple-contact" style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  color: 'text.primary',
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Contact Us
              </Button>
            </RouterLink>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default SimpleNavbar; 