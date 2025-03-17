import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  Card,
  CardContent,
  Rating,
  Divider,
} from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

// Reviews data with a mixture of Indian and foreign names
const reviews = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Software Engineer',
    company: 'TechSolutions India',
    rating: 5,
    review: 'KodJobs helped me find my dream job at a top tech company. The platform is intuitive and the job recommendations were spot on for my skills and experience.'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'UX Designer',
    company: 'Creative Studios',
    rating: 5,
    review: 'After struggling to find design opportunities that matched my expertise, KodJobs connected me with companies that truly valued my skills. I received multiple offers within weeks!'
  },
  {
    id: 3,
    name: 'Ananya Patel',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'Data Scientist',
    company: 'Analytics Hub',
    rating: 4,
    review: 'The AI-powered job matching on KodJobs is impressive. It understood my specialized skills in data science and recommended positions that were perfect for my career growth.'
  },
  {
    id: 4,
    name: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    role: 'Product Manager',
    company: 'InnovateTech',
    rating: 5,
    review: 'KodJobs stands out from other job platforms with its personalized approach. I appreciated how easy it was to showcase my portfolio and connect with forward-thinking companies.'
  },
  {
    id: 5,
    name: 'Priya Desai',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    role: 'Marketing Specialist',
    company: 'Global Brands',
    rating: 4,
    review: 'Finding marketing roles that aligned with my career aspirations was challenging until I discovered KodJobs. The platform\'s focus on skill matching made all the difference.'
  },
  {
    id: 6,
    name: 'David Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    role: 'Full Stack Developer',
    company: 'WebSphere Solutions',
    rating: 5,
    review: 'As a developer looking for remote opportunities, KodJobs was the perfect platform. The filtering options helped me find exactly what I was looking for in terms of work arrangement and tech stack.'
  }
];

const ReviewsSection = () => {
  return (
    <Box sx={{ py: 8, bgcolor: '#f5f7fa' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            What Our Users Say
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 900, mx: 'auto' }}>
            Thousands of professionals have found their dream jobs through KodJobs. Here's what some of them have to say.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {reviews.map((review) => (
            <Grid item xs={12} md={6} lg={4} key={review.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                }
              }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Avatar 
                      src={review.avatar} 
                      alt={review.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" component="h3" fontWeight="bold">
                        {review.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.role} at {review.company}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ position: 'relative', flexGrow: 1 }}>
                    <FormatQuote 
                      sx={{ 
                        position: 'absolute', 
                        top: -10, 
                        left: -5, 
                        opacity: 0.1, 
                        fontSize: 40,
                        transform: 'rotate(180deg)'
                      }} 
                    />
                    <Typography variant="body1" sx={{ pl: 2, pr: 1 }}>
                      {review.review}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ReviewsSection; 