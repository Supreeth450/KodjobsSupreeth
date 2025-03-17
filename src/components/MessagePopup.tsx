import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface Message {
  id: string;
  subject: string;
  message: string;
  response: string;
  timestamp: string;
  read: boolean;
}

interface MessagePopupProps {
  open: boolean;
  onClose: () => void;
}

const MessagePopup: React.FC<MessagePopupProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (open) {
      loadMessages();
      
      // Listen for updates to messages
      window.addEventListener('messagesUpdated', loadMessages);
      
      // Listen for storage changes from other tabs
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'contactQueries') {
          loadMessages();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('messagesUpdated', loadMessages);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [open, userEmail]);

  const loadMessages = () => {
    if (!userEmail) return;
    
    const allQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
    const userMessages = allQueries
      .filter((query: any) => 
        query.email === userEmail && 
        query.adminResponse && 
        query.status === 'resolved'
      )
      .map((query: any) => ({
        id: query.id.toString(),
        subject: query.subject || 'No Subject',
        message: query.message,
        response: query.adminResponse,
        timestamp: new Date(query.responseTimestamp || query.timestamp).toLocaleDateString(),
        read: query.read || false
      }));
    
    setMessages(userMessages);
  };

  const markAsRead = (id: string) => {
    const updatedMessages = messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    );
    setMessages(updatedMessages);
    
    // Update localStorage
    const allQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
    const updatedQueries = allQueries.map((query: any) => 
      query.id === id ? { ...query, read: true } : query
    );
    localStorage.setItem('contactQueries', JSON.stringify(updatedQueries));
    
    // Dispatch event to notify Navbar
    window.dispatchEvent(new Event('messagesUpdated'));
  };

  const markAllAsRead = () => {
    const updatedMessages = messages.map(msg => ({ ...msg, read: true }));
    setMessages(updatedMessages);
    
    // Update localStorage
    const allQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
    const updatedQueries = allQueries.map((query: any) => {
      if (query.email === userEmail && query.adminResponse) {
        return { ...query, read: true };
      }
      return query;
    });
    localStorage.setItem('contactQueries', JSON.stringify(updatedQueries));
    
    // Dispatch event to notify Navbar
    window.dispatchEvent(new Event('messagesUpdated'));
  };

  // Count unread messages
  const unreadCount = messages.filter(m => !m.read).length;

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: '400px',
          maxHeight: '500px',
          borderRadius: '10px',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#1a237e', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AdminPanelSettingsIcon sx={{ mr: 1 }} />
          Admin Responses
        </Box>
        <IconButton size="small" onClick={markAllAsRead} sx={{ color: 'white' }}>
          <DoneAllIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, overflow: 'auto' }}>
        {messages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">
              No responses from admin yet.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: message.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  onClick={() => markAsRead(message.id)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1a237e' }}>
                      <AdminPanelSettingsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="subtitle2"
                        color="text.primary"
                        sx={{ fontWeight: message.read ? 400 : 600 }}
                      >
                        Re: {message.subject}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {message.response}
                        </Typography>
                        <Typography
                          component="div"
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between' }}
                        >
                          <span>{message.timestamp}</span>
                          {!message.read && (
                            <Chip 
                              label="New" 
                              size="small" 
                              color="primary" 
                              sx={{ height: 16, fontSize: '0.6rem' }} 
                            />
                          )}
                        </Typography>
                      </>
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
  );
};

export default MessagePopup; 