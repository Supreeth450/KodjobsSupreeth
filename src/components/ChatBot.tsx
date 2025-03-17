import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Fab,
  Zoom,
  Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  open: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Hello! I\'m KodJobs Assistant. How can I help you today?',
    sender: 'bot',
    timestamp: new Date()
  }
];

const ChatBot: React.FC<ChatBotProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = getBotResponse(newMessage);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return 'Hello! How can I assist you with your job search today?';
    } else if (lowerCaseMessage.includes('job')) {
      return 'We have many job opportunities available. You can browse them in the Jobs section or tell me what kind of position you\'re looking for.';
    } else if (lowerCaseMessage.includes('resume') || lowerCaseMessage.includes('cv')) {
      return 'You can upload your resume in your profile section. We\'ll use it to match you with suitable job opportunities.';
    } else if (lowerCaseMessage.includes('interview')) {
      return 'Preparing for an interview? Make sure to research the company, practice common questions, and prepare questions to ask the interviewer.';
    } else if (lowerCaseMessage.includes('salary')) {
      return 'Salary information is typically listed in the job details. If not specified, you can ask during the interview process.';
    } else if (lowerCaseMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else {
      return 'I\'m here to help with your job search. You can ask me about job listings, resume tips, interview preparation, or anything else related to finding your dream job!';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!open) return null;

  return (
    <Fade in={open}>
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 350,
          height: 500,
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 1300,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: '#1a237e',
            color: 'white',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            <Typography variant="h6">KodJobs Assistant</Typography>
          </Box>
          <IconButton size="small" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            height: 'calc(100% - 120px)',
            overflowY: 'auto',
            p: 2,
            bgcolor: '#f5f5f5',
          }}
        >
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{
                      bgcolor: message.sender === 'user' ? '#1a237e' : '#FF5722',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {message.sender === 'user' ? 'U' : <SmartToyIcon fontSize="small" />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        maxWidth: '80%',
                        display: 'inline-block',
                        bgcolor: message.sender === 'user' ? '#e3f2fd' : 'white',
                        ml: message.sender === 'user' ? 'auto' : 0,
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Paper>
                  }
                  sx={{ margin: 0 }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'white',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            placeholder="Type a message..."
            variant="outlined"
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            inputRef={inputRef}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Fade>
  );
};

export default ChatBot;
