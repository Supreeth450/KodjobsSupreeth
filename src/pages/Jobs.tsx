import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  Link,
  Pagination,
  Tooltip,
  MenuItem,
  FormControl,
  Select,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  SelectChangeEvent,
} from '@mui/material';
import { Search, LocationOn, Business, AccessTime, LockOutlined } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';

// Job interface
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type?: string;
  link: string;
  snippet: string;
  updated: string;
  source?: string;
}

// The Muse API response interfaces
interface MuseJob {
  id: number;
  name: string;
  type: string;
  publication_date: string;
  short_name: string;
  model_type: string;
  company: {
    id: number;
    short_name: string;
    name: string;
  };
  locations: {
    name: string;
  }[];
  levels: {
    name: string;
    short_name: string;
  }[];
  contents: string;
  refs: {
    landing_page: string;
  };
}

interface MuseApiResponse {
  results: MuseJob[];
  page_count: number;
}

// Job categories
const categories = [
  'All Categories',
  'Development',
  'Design',
  'Marketing',
  'Sales',
  'Customer Service',
  'Finance',
  'Healthcare',
  'Education',
];

// Job types
const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Remote'];

// Locations
const locations = [
  'All Locations',
  'New York, NY',
  'San Francisco, CA',
  'Remote',
  'Boston, MA',
  'Chicago, IL',
  'Austin, TX',
];

const Jobs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [keywords, setKeywords] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Filter states
  const [category, setCategory] = useState('All Categories');
  const [jobType, setJobType] = useState('All Types');
  const [location, setLocation] = useState('All Locations');
  const [showFilters, setShowFilters] = useState(!isMobile);

  // Fetch jobs when page or search term changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchJobs = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Build the API URL
        const url = `https://www.themuse.com/api/public/jobs?page=${currentPage}&descending=true`;
        
        console.log('Fetching jobs from:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json() as MuseApiResponse;
        
        if (!isMounted) return;
        
        setTotalPages(data.page_count);
        
        // Transform API response to our Job interface
        let transformedJobs = data.results.map(job => ({
          id: job.id.toString(),
          title: job.name || 'Job Title Not Available',
          company: job.company.name || 'Company Not Available',
          location: job.locations.length > 0 ? job.locations[0].name : 'Location Not Available',
          type: job.type || 'Full-time',
          link: job.refs.landing_page || '#',
          snippet: job.contents ? 
            (job.contents.substring(0, 200).replace(/<[^>]*>/g, '') + '...') : 
            'No description available',
          updated: job.publication_date || new Date().toISOString(),
          source: 'The Muse'
        }));
        
        // Filter jobs if search term exists
        if (searchTerm && searchTerm.trim() !== '') {
          const terms = searchTerm.toLowerCase().trim().split(/\s+/);
          
          transformedJobs = transformedJobs.filter(job => {
            const jobTitle = job.title.toLowerCase();
            const jobCompany = job.company.toLowerCase();
            const jobSnippet = job.snippet.toLowerCase();
            
            return terms.some(term => 
              jobTitle.includes(term) || 
              jobCompany.includes(term) || 
              jobSnippet.includes(term)
            );
          });
        }
        
        // Apply additional filters
        if (category !== 'All Categories') {
          // This is a mock filter since the API doesn't provide categories
          // In a real app, you would filter by actual categories from the API
        }
        
        if (jobType !== 'All Types') {
          transformedJobs = transformedJobs.filter(job => 
            job.type?.toLowerCase() === jobType.toLowerCase()
          );
        }
        
        if (location !== 'All Locations') {
          transformedJobs = transformedJobs.filter(job => 
            job.location?.includes(location)
          );
        }
        
        if (!isMounted) return;
        
        setJobs(transformedJobs);
        
        // Show error if no jobs found
        if (transformedJobs.length === 0) {
          if (searchTerm || category !== 'All Categories' || jobType !== 'All Types' || location !== 'All Locations') {
            setError(`No jobs found matching your criteria. Try different filters.`);
          } else {
            setError(`No jobs found. Please try different search criteria.`);
          }
        }
        
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching jobs:', error);
        setError('Unable to fetch job listings. Please try again later.');
        
        // Set hardcoded jobs when API fails
        const hardcodedJobs: Job[] = [
          {
            id: '1001',
            title: 'Frontend Developer',
            company: 'Wipro',
            location: 'Manila, Philippines',
            type: 'Full-time',
            salary: '$80,000 - $100,000',
            link: '#',
            snippet: 'We are looking for a skilled Frontend Developer with experience in React, TypeScript, and Material-UI to join our team.',
            updated: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'The Muse'
          },
          {
            id: '1002',
            title: 'Snowflake Data Engineer',
            company: 'EPAM Systems',
            location: 'Bangalore, India',
            type: 'Full-time',
            link: '#',
            snippet: 'Join our team as a Snowflake Data Engineer to design and implement data solutions using Snowflake, SQL, and Python.',
            updated: new Date(Date.now() - 101 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'The Muse'
          },
          {
            id: '1003',
            title: 'Legal Counsel - Cyber & Product Security',
            company: 'Schneider Electric',
            location: 'Puteaux, France',
            type: 'Full-time',
            link: '#',
            snippet: 'We are seeking a Legal Counsel specialized in Cyber & Product Security to join our legal team in Europe.',
            updated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'The Muse'
          },
          {
            id: '1004',
            title: 'UX/UI Designer',
            company: 'Google',
            location: 'Mountain View, CA',
            type: 'Full-time',
            link: '#',
            snippet: 'Design user experiences for Google products that are simple, useful, and delightful.',
            updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'The Muse'
          },
          {
            id: '1005',
            title: 'Data Scientist',
            company: 'Microsoft',
            location: 'Redmond, WA',
            type: 'Full-time',
            link: '#',
            snippet: 'Apply machine learning and statistical techniques to solve complex business problems.',
            updated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'The Muse'
          },
          {
            id: '1006',
            title: 'DevOps Engineer',
            company: 'Amazon',
            location: 'Seattle, WA',
            type: 'Full-time',
            link: '#',
            snippet: 'Build and maintain infrastructure for high-traffic web services using AWS technologies.',
            updated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'The Muse'
          }
        ];
        
        setJobs(hardcodedJobs);
        setTotalPages(1);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchJobs();
    
    return () => {
      isMounted = false;
    };
  }, [currentPage, searchTerm, category, jobType, location]);

  // Check if user is logged in
  useEffect(() => {
    // Check for isLoggedIn flag in localStorage
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      console.log('Login status check:', isLoggedIn);
      setIsLoggedIn(isLoggedIn);
    };
    
    // Check on mount
    checkLoginStatus();
    
    // Set up event listener for login/logout events
    const handleLoginEvent = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('userLoggedIn', handleLoginEvent);
    window.addEventListener('userLoggedOut', handleLoginEvent);
    window.addEventListener('storage', handleLoginEvent);
    
    // Clean up
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginEvent);
      window.removeEventListener('userLoggedOut', handleLoginEvent);
      window.removeEventListener('storage', handleLoginEvent);
    };
  }, []);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(keywords.trim());
    setCurrentPage(1);
  };

  // Clear search
  const handleClearSearch = () => {
    setKeywords('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle category change
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    setCurrentPage(1);
  };

  // Handle job type change
  const handleJobTypeChange = (event: SelectChangeEvent) => {
    setJobType(event.target.value);
    setCurrentPage(1);
  };

  // Handle location change
  const handleLocationChange = (event: SelectChangeEvent) => {
    setLocation(event.target.value);
    setCurrentPage(1);
  };

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInMs = now.getTime() - posted.getTime();
    
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };

  // Clear all filters
  const clearAllFilters = () => {
    setKeywords('');
    setSearchTerm('');
    setCategory('All Categories');
    setJobType('All Types');
    setLocation('All Locations');
    setCurrentPage(1);
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pt: 10, pb: 8 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            mt: -1 // Reduce top margin to move heading closer to navbar
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold" 
            color="primary.dark"
            sx={{ mb: 2 }}
          >
            Find Your Dream Job
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Browse through hundreds of opportunities and take the next step in your career
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          }}
        >
          <form onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  placeholder="Search jobs, keywords, companies..."
                  value={keywords}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    endAdornment: keywords && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClearSearch}
                          size="small"
                          edge="end"
                          aria-label="clear search"
                          sx={{
                            color: 'rgba(0, 0, 0, 0.54)',
                            '&:hover': {
                              color: 'rgba(0, 0, 0, 0.87)',
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { 
                      bgcolor: 'white', 
                      borderRadius: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{ 
                    height: '56px', 
                    bgcolor: '#ff5722', 
                    color: 'white',
                    '&:hover': { bgcolor: '#e64a19' },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(255, 87, 34, 0.7)',
                      color: 'white',
                      opacity: 1
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'SEARCH JOBS'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Grid container spacing={3}>
          {/* Job Listings */}
          <Grid item xs={12}>
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {error}
              </Alert>
            ) : jobs.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No jobs found. Please try different keywords.
              </Alert>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
                    {searchTerm && ` matching "${searchTerm}"`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Page {currentPage} of {totalPages}
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {jobs.map((job) => (
                    <Grid item xs={12} md={6} lg={4} key={job.id}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        }
                      }}>
                        {/* Colored gradient header - different for each card */}
                        <Box sx={{ 
                          height: '8px', 
                          background: (() => {
                            // Generate different gradients based on job ID
                            const id = parseInt(job.id) % 5; // Use modulo to get 5 different styles
                            
                            switch(id) {
                              case 0:
                                return 'linear-gradient(90deg, #66c2ff 0%, #3366ff 100%)'; // Blue
                              case 1:
                                return 'linear-gradient(90deg, #ff6b6b 0%, #cc0000 100%)'; // Red
                              case 2:
                                return 'linear-gradient(90deg, #52c41a 0%, #237804 100%)'; // Green
                              case 3:
                                return 'linear-gradient(90deg, #faad14 0%, #ad6800 100%)'; // Orange/Yellow
                              case 4:
                                return 'linear-gradient(90deg, #722ed1 0%, #391085 100%)'; // Purple
                              default:
                                return 'linear-gradient(90deg, #66c2ff 0%, #3366ff 100%)'; // Default blue
                            }
                          })(),
                          width: '100%'
                        }} />
                        
                        <CardContent sx={{ pb: 1, flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box 
                                sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  bgcolor: 'black', 
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 2
                                }}
                              >
                                <Business sx={{ color: 'white' }} />
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                                  {job.company}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LocationOn sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {job.location}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold', mb: 1, mt: 1, height: '3.5rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {job.title}
                          </Typography>
                          
                          {/* Skills tags */}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, minHeight: '28px' }}>
                            <Chip 
                              label="External" 
                              size="small" 
                              sx={{ 
                                height: 24, 
                                fontSize: '0.75rem', 
                                bgcolor: 'rgba(33, 150, 243, 0.1)',
                                color: '#2196f3',
                                border: '1px solid rgba(33, 150, 243, 0.3)'
                              }} 
                            />
                            <Chip 
                              label={job.source} 
                              size="small" 
                              sx={{ 
                                height: 24, 
                                fontSize: '0.75rem', 
                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                color: '#4caf50',
                                border: '1px solid rgba(76, 175, 80, 0.3)'
                              }} 
                            />
                          </Box>
                          
                          <Box sx={{ 
                            borderBottom: '1px solid #aaa', 
                            width: '100%',
                            mb: 1.5
                          }} />
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            mb: 1
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTime sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                Posted {formatRelativeTime(job.updated)}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                        
                        <CardActions sx={{ pt: 0, justifyContent: 'flex-end', alignItems: 'center' }}>
                          {isLoggedIn ? (
                            <Button 
                              size="small" 
                              variant="contained"
                              sx={{ 
                                bgcolor: '#1a237e', 
                                color: 'white',
                                '&:hover': { 
                                  bgcolor: '#283593'
                                },
                                textTransform: 'uppercase',
                                borderRadius: 1,
                                fontWeight: 'bold',
                                px: 2
                              }}
                              component={Link}
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              CHECK DETAILS
                            </Button>
                          ) : (
                            <Button 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                bgcolor: '#f0f0f0',
                                color: '#999',
                                border: 'none',
                                '&:hover': { 
                                  bgcolor: '#e0e0e0',
                                  border: 'none'
                                },
                                textTransform: 'uppercase',
                                borderRadius: 1,
                                boxShadow: 'none',
                                fontWeight: 'bold',
                                px: 2
                              }}
                              onClick={() => window.location.href = '/login'}
                            >
                              <LockOutlined sx={{ fontSize: 16, mr: 0.5, color: '#999' }} />
                              LOGIN TO VIEW
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination 
                      count={totalPages} 
                      page={currentPage} 
                      onChange={handlePageChange} 
                      color="primary" 
                      size={isMobile ? "medium" : "large"}
                      disabled={loading}
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Jobs; 