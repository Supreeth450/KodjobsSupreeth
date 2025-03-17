import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  ListItemIcon,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EmailIcon from '@mui/icons-material/Email';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ChatBot from './ChatBot';
import MessagePopup from './MessagePopup';
import Work from '@mui/icons-material/Work';

// Hide on scroll function
function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [messagePopupOpen, setMessagePopupOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = 'primary-search-account-menu';
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Load profile picture and listen for changes
  React.useEffect(() => {
    const loadProfilePic = () => {
      if (isLoggedIn && userEmail) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === userEmail);
        if (user?.profilePicture) {
          setProfilePic(user.profilePicture);
        } else {
          setProfilePic(null);
        }
      }
    };

    // Initial load
    loadProfilePic();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'users') {
        loadProfilePic();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleCustomStorageChange = () => loadProfilePic();
    window.addEventListener('localStorageUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageChange);
    };
  }, [isLoggedIn, userEmail]);

  // Load unread message count and set up event listeners
  useEffect(() => {
    if (isLoggedIn && userEmail) {
      updateUnreadMessageCount();
      
      // Listen for updates to messages
      window.addEventListener('messagesUpdated', updateUnreadMessageCount);
      
      // Also listen for storage changes from other tabs
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'contactQueries') {
          updateUnreadMessageCount();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('messagesUpdated', updateUnreadMessageCount);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [isLoggedIn, userEmail]);

  const updateUnreadMessageCount = () => {
    if (!userEmail) return;
    
    // Get all contact queries from localStorage
    const allQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
    
    // Count unread responses for the current user
    const count = allQueries.filter(
      (query: any) => 
        query.email === userEmail && 
        query.adminResponse && 
        query.status === 'resolved' && 
        !query.read
    ).length;
    
    setUnreadMessageCount(count);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    
    navigate('/');
    handleClose();
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (path: string) => {
    setAnchorElNav(null);
    navigate(path);
  };

  const toggleChatBot = () => {
    setChatBotOpen(!chatBotOpen);
    if (messagePopupOpen) setMessagePopupOpen(false);
  };

  const toggleMessagePopup = () => {
    setMessagePopupOpen(!messagePopupOpen);
    if (chatBotOpen) setChatBotOpen(false);
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setMobileOpen(open);
  };

  // Navigation links
  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/jobs', label: 'JOBS' },
    { path: '/contact', label: 'CONTACT US' }
  ];

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          sx={{ 
            bgcolor: 'primary.main',
            backgroundImage: 'linear-gradient(to right, #1a237e, #283593)',
            boxShadow: 3
          }}
        >
          <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
            <Toolbar sx={{ minHeight: '70px', py: 0.5, px: 0, justifyContent: 'space-between' }}>
              {/* Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RouterLink to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#1a237e',
                      border: '1px solid #000',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      transition: 'box-shadow 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      }
                    }}
                  >
                    <Work sx={{ color: '#fff', fontSize: 32, mr: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{
                          fontWeight: 700,
                          color: 'white',
                          fontSize: '1.5rem',
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
                          fontSize: '1.5rem',
                        }}
                      >
                        JOBS
                      </Typography>
                    </Box>
                  </Box>
                </RouterLink>
              </Box>

              {/* Navigation Links - Desktop */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', flexGrow: 1 }}>
                <Button
                  component={RouterLink}
                  to="/"
                  sx={{
                    mx: 1.5,
                    color: 'white',
                    position: 'relative',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: location.pathname === '/' ? '100%' : '0%',
                      height: '2px',
                      bottom: 0,
                      left: 0,
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '100%'
                    }
                  }}
                >
                  HOME
                </Button>
                <Button
                  component={RouterLink}
                  to="/jobs"
                  sx={{
                    mx: 1.5,
                    color: 'white',
                    position: 'relative',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: location.pathname === '/jobs' ? '100%' : '0%',
                      height: '2px',
                      bottom: 0,
                      left: 0,
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '100%'
                    }
                  }}
                >
                  JOBS
                </Button>
                <Button
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    mx: 1.5,
                    color: 'white',
                    position: 'relative',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: location.pathname === '/contact' ? '100%' : '0%',
                      height: '2px',
                      bottom: 0,
                      left: 0,
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '100%'
                    }
                  }}
                >
                  CONTACT US
                </Button>
              </Box>

              {/* User Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                {isLoggedIn ? (
                  <>
                    <IconButton 
                      color="inherit" 
                      sx={{ 
                        mr: 1.5,
                        position: 'relative',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                      }}
                      onClick={toggleChatBot}
                    >
                      <SmartToyIcon />
                    </IconButton>
                    <IconButton 
                      color="inherit" 
                      sx={{ 
                        mr: 2,
                        position: 'relative',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                      }}
                      onClick={toggleMessagePopup}
                    >
                      {unreadMessageCount > 0 ? (
                        <Badge 
                          badgeContent={unreadMessageCount} 
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.7rem',
                              height: '18px',
                              minWidth: '18px',
                              fontWeight: 'bold'
                            }
                          }}
                        >
                          <EmailIcon />
                        </Badge>
                      ) : (
                        <EmailIcon />
                      )}
                    </IconButton>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                      sx={{ 
                        p: 0.5,
                        border: '2px solid white',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                      }}
                    >
                      <Avatar 
                        alt="User" 
                        src={profilePic || undefined}
                        sx={{ width: 32, height: 32 }}
                      />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      color="inherit"
                      sx={{ 
                        mr: 1,
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>

              {/* Mobile menu button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer(true)}
                sx={{ ml: 1, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': { 
            width: 280,
            boxSizing: 'border-box',
            bgcolor: '#f5f5f5'
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: 'primary.main' }}>
          <Work 
            sx={{ 
              color: '#fff',
              fontSize: 28,
              mr: 1
            }} 
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                color: 'white',
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
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={link.path}
                onClick={toggleDrawer(false)}
                sx={{
                  py: 1.5,
                  borderLeft: location.pathname === link.path ? '4px solid #1a237e' : '4px solid transparent',
                  bgcolor: location.pathname === link.path ? 'rgba(26, 35, 126, 0.08)' : 'transparent',
                }}
              >
                <ListItemText 
                  primary={link.label} 
                  primaryTypographyProps={{
                    fontWeight: location.pathname === link.path ? 700 : 400,
                    color: location.pathname === link.path ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          
          {isLoggedIn && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/profile"
                  onClick={toggleDrawer(false)}
                  sx={{
                    py: 1.5,
                    borderLeft: location.pathname === '/profile' ? '4px solid #1a237e' : '4px solid transparent',
                    bgcolor: location.pathname === '/profile' ? 'rgba(26, 35, 126, 0.08)' : 'transparent',
                  }}
                >
                  <ListItemText 
                    primary="Profile" 
                    primaryTypographyProps={{
                      fontWeight: location.pathname === '/profile' ? 700 : 400,
                      color: location.pathname === '/profile' ? 'primary.main' : 'text.primary',
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  sx={{ py: 1.5, color: 'error.main' }}
                >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      
      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        id={menuId}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            width: 220,
            overflow: 'visible',
            borderRadius: '8px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User info section */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ width: 40, height: 40, mr: 1.5 }}
            src={profilePic || undefined}
          >
            {!profilePic && userEmail?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {userName || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {userEmail}
            </Typography>
          </Box>
        </Box>
        <Divider />
        
        <MenuItem onClick={() => { handleClose(); navigate('/profile'); }} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: '#1a237e' }} />
          </ListItemIcon>
          <Typography>Profile</Typography>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#d32f2f' }} />
          </ListItemIcon>
          <Typography color="#d32f2f">Logout</Typography>
        </MenuItem>
      </Menu>
      
      {/* ChatBot Component */}
      <ChatBot open={chatBotOpen} onClose={() => setChatBotOpen(false)} />
      
      {/* Message Popup Component */}
      <MessagePopup open={messagePopupOpen} onClose={() => setMessagePopupOpen(false)} />
    </>
  );
};

export default Navbar; 