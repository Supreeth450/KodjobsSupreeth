import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { Mail as MailIcon } from '@mui/icons-material';

interface Query {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  response?: string;
  read?: boolean;
}

const UserMailbox = () => {
  const [open, setOpen] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const userEmail = localStorage.getItem('userEmail');

  const loadQueries = () => {
    const allQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
    const userQueries = allQueries.filter((q: Query) => q.email === userEmail);
    setQueries(userQueries);
  };

  // Mark messages as read when dialog opens
  const handleOpenDialog = () => {
    const allQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
    const updatedQueries = allQueries.map((q: Query) => {
      if (q.email === userEmail && q.status === 'resolved' && !q.read) {
        return { ...q, read: true };
      }
      return q;
    });
    
    localStorage.setItem('contactQueries', JSON.stringify(updatedQueries));
    setOpen(true);
    loadQueries(); // Reload queries to update the badge count
  };

  // Handle dialog close and refresh data
  const handleCloseDialog = () => {
    setOpen(false);
    loadQueries(); // Reload queries when dialog closes
  };

  useEffect(() => {
    if (userEmail) {
      loadQueries();
      // Set up polling for real-time updates
      const interval = setInterval(loadQueries, 2000); // Poll every 2 seconds
      return () => clearInterval(interval);
    }
  }, [userEmail]);

  const unreadCount = queries.filter(q => q.status === 'resolved' && !q.read).length;

  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={handleOpenDialog}
        sx={{
          animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
            },
            '50%': {
              transform: 'scale(1.1)',
            },
            '100%': {
              transform: 'scale(1)',
            },
          },
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              animation: unreadCount > 0 ? 'bounce 1s infinite' : 'none',
            },
            '@keyframes bounce': {
              '0%, 100%': {
                transform: 'scale(1)',
              },
              '50%': {
                transform: 'scale(1.2)',
              },
            },
          }}
        >
          <MailIcon />
        </Badge>
      </IconButton>

      <Dialog 
        open={open} 
        onClose={handleCloseDialog}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <MailIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Your Messages</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {queries.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
              No messages yet
            </Typography>
          ) : (
            <List>
              {queries.map((query) => (
                <React.Fragment key={query.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{
                      bgcolor: !query.read && query.status === 'resolved' ? 'action.hover' : 'transparent',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography
                            component="div"
                            variant="subtitle1"
                            color="text.primary"
                            sx={{ fontWeight: !query.read && query.status === 'resolved' ? 'bold' : 'normal' }}
                          >
                            {query.message.split('\n')[0]}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {new Date(query.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            component="div"
                            variant="body2"
                            color="text.secondary"
                          >
                            Your message: {query.message.split('\n\n')[1]}
                          </Typography>
                          {query.response && (
                            <Box
                              sx={{
                                mt: 1,
                                p: 1.5,
                                borderRadius: 1,
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                boxShadow: 1
                              }}
                            >
                              <Typography
                                component="div"
                                variant="body2"
                              >
                                Response: {query.response}
                              </Typography>
                            </Box>
                          )}
                          <Typography
                            variant="caption"
                            color={query.status === 'pending' ? 'warning.main' : 'success.main'}
                            sx={{ 
                              mt: 1, 
                              display: 'block',
                              fontWeight: 'medium'
                            }}
                          >
                            Status: {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMailbox; 