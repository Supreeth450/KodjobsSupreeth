import React from 'react';
import { Box, Typography } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

interface LogoProps {
  width?: number | string;
  height?: number | string;
}

const Logo: React.FC<LogoProps> = ({ width = 'auto', height = 40 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: height,
        width: width,
      }}
    >
      <WorkOutlineIcon 
        sx={{ 
          color: '#FF5722',
          fontSize: height ? `${Number(height) * 0.9}px` : '36px',
          mr: 1
        }} 
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="h5"
          component="span"
          sx={{
            fontWeight: 700,
            color: '#1a237e',
            fontSize: height ? `${Number(height) * 0.7}px` : '28px',
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
            fontSize: height ? `${Number(height) * 0.7}px` : '28px',
          }}
        >
          JOBS
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo; 