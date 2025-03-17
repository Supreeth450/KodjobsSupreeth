import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  CloudUpload as CloudUploadIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface AcademicDetails {
  instituteName: string;
  cgpa: string;
  yearOfPassing: string;
}

interface UserDetails {
  id?: string;
  name: string;
  email: string;
  bio?: string;
  skills?: string;
  academicDetails?: AcademicDetails;
  profilePicture?: string;
  resume?: string | null;
  lastLogin?: string;
  registeredAt?: string;
  isBlocked?: boolean;
}

interface VisitorData {
  timestamp: string;
  page: string;
  userAgent: string;
  id: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [responseText, setResponseText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);

  useEffect(() => {
    // Check admin authentication
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
    
    if (!isAdmin) {
      // Use React Router navigation instead of direct browser navigation
      navigate('/adminlogin');
      return;
    }

    // Initial load
    loadUsers();
    loadQueries();

    // Set up polling for real-time updates
    const pollingInterval = setInterval(() => {
      loadUsers();
      loadQueries();
    }, 5000); // Poll every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(pollingInterval);
  }, [navigate]);

  useEffect(() => {
    // Load visitor data from localStorage
    const loadVisitorData = () => {
      const storedVisitors = JSON.parse(localStorage.getItem('siteVisitors') || '[]');
      setVisitors(storedVisitors);
      
      // Calculate total visits
      setTotalVisits(storedVisitors.length);
      
      // Calculate unique visitors based on unique IDs
      const uniqueIds = new Set(storedVisitors.map((visitor: VisitorData) => visitor.id));
      setUniqueVisitors(uniqueIds.size);
    };

    // Initial load
    loadVisitorData();

    // Set up event listener for real-time updates
    const handleVisitorUpdate = () => {
      loadVisitorData();
    };

    window.addEventListener('visitorUpdated', handleVisitorUpdate);

    // Clean up
    return () => {
      window.removeEventListener('visitorUpdated', handleVisitorUpdate);
    };
  }, []);

  // Track current visit
  useEffect(() => {
    // Generate a visitor ID if not exists
    const getVisitorId = () => {
      let visitorId = localStorage.getItem('visitorId');
      if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('visitorId', visitorId);
      }
      return visitorId;
    };

    // Record this admin panel visit
    const recordVisit = () => {
      const visitorId = getVisitorId();
      const newVisit: VisitorData = {
        timestamp: new Date().toISOString(),
        page: '/admin/dashboard',
        userAgent: navigator.userAgent,
        id: visitorId
      };

      const currentVisitors = JSON.parse(localStorage.getItem('siteVisitors') || '[]');
      const updatedVisitors = [...currentVisitors, newVisit];
      localStorage.setItem('siteVisitors', JSON.stringify(updatedVisitors));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('visitorUpdated'));
    };

    // Record the visit
    recordVisit();
  }, []);

  const loadUsers = () => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(usersData);
  };

  const loadQueries = () => {
    const queriesData = JSON.parse(localStorage.getItem('contactQueries') || '[]');
    setQueries(queriesData);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    // Use React Router navigation instead of direct browser navigation
    navigate('/adminlogin');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBlockUser = (email: string) => {
    const updatedUsers = users.map(user => {
      if (user.email === email) {
        return { ...user, isBlocked: !user.isBlocked };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (email: string) => {
    if (email === 'admin@kodjobs.com') {
      return; // Prevent admin deletion
    }
    const updatedUsers = users.filter(user => user.email !== email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleQueryClick = (query: any) => {
    setSelectedQuery(query);
    setResponseText('');
    setDialogOpen(true);
  };

  const handleQueryResponse = () => {
    const updatedQueries = queries.map(q => {
      if (q.id === selectedQuery.id) {
        return { 
          ...q, 
          status: 'resolved', 
          adminResponse: responseText,
          responseTimestamp: new Date().toISOString(),
          read: false // Mark as unread when admin responds
        };
      }
      return q;
    });
    localStorage.setItem('contactQueries', JSON.stringify(updatedQueries));
    setQueries(updatedQueries);
    setDialogOpen(false);
  };

  const handleViewUserDetails = (user: UserDetails) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
  };

  const handleDownloadResume = (resume: string, userName: string) => {
    const link = document.createElement('a');
    link.href = resume;
    link.download = `${userName.replace(/\s+/g, '_')}_resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCurrentlyLoggedInUsers = () => {
    return users.filter(user => 
      user.lastLogin && 
      new Date(user.lastLogin).toDateString() === new Date().toDateString() &&
      !user.isBlocked
    ).length;
  };

  const getTodayRegistrations = () => {
    return users.filter(user => 
      user.registeredAt && 
      new Date(user.registeredAt).toDateString() === new Date().toDateString()
    ).length;
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa' }}>
      <AppBar position="fixed" sx={{ 
        bgcolor: '#1a237e', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 40,
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: '#1a237e',
                border: '1px solid #000',
              }}
            >
              <WorkIcon 
                sx={{ 
                  color: '#fff',
                  fontSize: '36px',
                  mr: 1
                }} 
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: '#fff',
                    fontSize: '28px',
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
                    fontSize: '28px',
                  }}
                >
                  JOBS
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold', letterSpacing: '0.5px' }}>
              Admin Panel
            </Typography>
          </Box>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ 
              borderRadius: 1,
              px: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                bgcolor: '#4285f4',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(66, 133, 244, 0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 25px rgba(66, 133, 244, 0.2)',
                }
              }}
            >
              <Typography variant="h2" fontWeight="bold">{users.length}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>Total Users</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                bgcolor: '#34a853',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(52, 168, 83, 0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 25px rgba(52, 168, 83, 0.2)',
                }
              }}
            >
              <Typography variant="h2" fontWeight="bold">{getCurrentlyLoggedInUsers()}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>Active Today</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                bgcolor: '#fbbc05',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(251, 188, 5, 0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 25px rgba(251, 188, 5, 0.2)',
                }
              }}
            >
              <Typography variant="h2" fontWeight="bold">{getTodayRegistrations()}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>New Today</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                bgcolor: '#ea4335',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(234, 67, 53, 0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 25px rgba(234, 67, 53, 0.2)',
                }
              }}
            >
              <Typography variant="h2" fontWeight="bold">
                {users.filter(u => u.isBlocked).length}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>Blocked Users</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Visitor Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                bgcolor: '#673ab7',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(103, 58, 183, 0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 25px rgba(103, 58, 183, 0.2)',
                }
              }}
            >
              <Typography variant="h2" fontWeight="bold">{totalVisits}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>Total Page Visits</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                bgcolor: '#009688',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 150, 136, 0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 25px rgba(0, 150, 136, 0.2)',
                }
              }}
            >
              <Typography variant="h2" fontWeight="bold">{uniqueVisitors}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>Unique Visitors</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ 
          width: '100%', 
          mb: 2, 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            sx={{
              bgcolor: '#f5f5f5',
              '& .MuiTab-root': {
                fontWeight: 600,
                py: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.04)'
                }
              },
              '& .Mui-selected': {
                color: '#1a237e !important'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1a237e',
                height: 3
              }
            }}
          >
            <Tab label="Users" />
            <Tab label="Queries" />
            <Tab label="Visitors" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Registration Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Last Login</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user.email}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={user.profilePicture}
                            sx={{ 
                              width: 40, 
                              height: 40,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          >
                            {user.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography fontWeight="medium">{user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.isBlocked ? 'Blocked' : 'Active'} 
                          color={user.isBlocked ? 'error' : 'success'} 
                          size="small"
                          sx={{ 
                            fontWeight: 'medium',
                            borderRadius: '4px'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewUserDetails(user)}
                          sx={{ 
                            mr: 1, 
                            borderRadius: '4px',
                            borderColor: '#1a237e',
                            color: '#1a237e',
                            '&:hover': {
                              borderColor: '#0d1642',
                              bgcolor: 'rgba(26, 35, 126, 0.04)'
                            }
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color={user.isBlocked ? 'success' : 'warning'}
                          onClick={() => handleBlockUser(user.email)}
                          sx={{ 
                            mr: 1,
                            borderRadius: '4px'
                          }}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteUser(user.email)}
                          sx={{ borderRadius: '4px' }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queries.map((query) => (
                    <TableRow 
                      key={query.id}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        {new Date(query.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">{query.name}</Typography>
                      </TableCell>
                      <TableCell>{query.email}</TableCell>
                      <TableCell>
                        <Typography noWrap sx={{ maxWidth: 250 }}>
                          {query.message.length > 50
                            ? `${query.message.substring(0, 50)}...`
                            : query.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={query.status}
                          color={query.status === 'resolved' ? 'success' : 'warning'}
                          size="small"
                          sx={{ 
                            fontWeight: 'medium',
                            borderRadius: '4px'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleQueryClick(query)}
                          sx={{ 
                            borderRadius: '4px',
                            borderColor: query.status === 'resolved' ? '#34a853' : '#1a237e',
                            color: query.status === 'resolved' ? '#34a853' : '#1a237e',
                            '&:hover': {
                              borderColor: query.status === 'resolved' ? '#2e7d32' : '#0d1642',
                              bgcolor: query.status === 'resolved' 
                                ? 'rgba(52, 168, 83, 0.04)' 
                                : 'rgba(26, 35, 126, 0.04)'
                            }
                          }}
                        >
                          {query.status === 'resolved' ? 'View' : 'Respond'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Page</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Visitor ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Browser</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visitors.slice().reverse().map((visitor, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        {new Date(visitor.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">{visitor.page}</Typography>
                      </TableCell>
                      <TableCell>{visitor.id}</TableCell>
                      <TableCell>
                        {visitor.userAgent.includes('Chrome') ? 'Chrome' : 
                         visitor.userAgent.includes('Firefox') ? 'Firefox' : 
                         visitor.userAgent.includes('Safari') ? 'Safari' : 
                         visitor.userAgent.includes('Edge') ? 'Edge' : 'Other'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>

        {/* User Details Dialog */}
        <Dialog
          open={userDetailsOpen}
          onClose={() => setUserDetailsOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          {selectedUser && (
            <>
              <DialogTitle sx={{ 
                bgcolor: '#f8f9fa', 
                borderBottom: '1px solid #eee',
                px: 3,
                py: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={selectedUser.profilePicture}
                    sx={{ 
                      width: 56, 
                      height: 56,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{selectedUser.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Bio
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2">
                        {selectedUser.bio || 'No bio provided'}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Skills
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      {selectedUser.skills ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {selectedUser.skills.split(',').map((skill, index) => (
                            <Chip 
                              key={index} 
                              label={skill.trim()} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2">No skills listed</Typography>
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Academic Details
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      {selectedUser.academicDetails ? (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Institute
                            </Typography>
                            <Typography variant="body1">
                              {selectedUser.academicDetails.instituteName || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              CGPA
                            </Typography>
                            <Typography variant="body1">
                              {selectedUser.academicDetails.cgpa || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Year of Passing
                            </Typography>
                            <Typography variant="body1">
                              {selectedUser.academicDetails.yearOfPassing || 'Not specified'}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : (
                        <Typography variant="body2">No academic details provided</Typography>
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Resume
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      {selectedUser.resume ? (
                        <Button
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          onClick={() => handleDownloadResume(selectedUser.resume!, selectedUser.name)}
                        >
                          Download Resume
                        </Button>
                      ) : (
                        <Typography variant="body2">No resume uploaded</Typography>
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Registered: {selectedUser.registeredAt ? new Date(selectedUser.registeredAt).toLocaleString() : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Login: {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setUserDetailsOpen(false)}>Close</Button>
                <Button
                  color={selectedUser.isBlocked ? 'success' : 'warning'}
                  onClick={() => {
                    handleBlockUser(selectedUser.email);
                    setUserDetailsOpen(false);
                  }}
                >
                  {selectedUser.isBlocked ? 'Unblock User' : 'Block User'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Query Response Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          {selectedQuery && (
            <>
              <DialogTitle sx={{ 
                bgcolor: '#f8f9fa', 
                borderBottom: '1px solid #eee',
                px: 3,
                py: 2
              }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedQuery.status === 'resolved' ? 'View Response' : 'Respond to Query'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    From: {selectedQuery.name} ({selectedQuery.email})
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      Query
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: '#f8f9fa',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body1">
                        {selectedQuery.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Submitted on {new Date(selectedQuery.timestamp).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>

                  {selectedQuery.status === 'resolved' ? (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                        Response
                      </Typography>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          bgcolor: '#f1f8e9',
                          borderRadius: 1,
                          borderColor: '#c5e1a5'
                        }}
                      >
                        <Typography variant="body1">
                          {selectedQuery.adminResponse}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Responded on {new Date(selectedQuery.responseTimestamp).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                        Your Response
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response here..."
                        variant="outlined"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1
                          }
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button 
                  onClick={() => setDialogOpen(false)}
                  sx={{ 
                    borderRadius: 1,
                    color: 'text.secondary'
                  }}
                >
                  Close
                </Button>
                {selectedQuery.status !== 'resolved' && (
                  <Button
                    variant="contained"
                    onClick={handleQueryResponse}
                    disabled={!responseText.trim()}
                    sx={{ 
                      borderRadius: 1,
                      bgcolor: '#1a237e',
                      '&:hover': { bgcolor: '#0d1642' },
                      px: 3
                    }}
                  >
                    Send Response
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Admin; 