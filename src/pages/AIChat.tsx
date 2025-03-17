import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import { Send, SmartToy, Person } from '@mui/icons-material';

// Message interface
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Sample responses for job-related questions
const jobResponses: Record<string, string> = {
  'resume': 'To create an effective resume, focus on highlighting your relevant skills and achievements. Use bullet points, keep it concise (1-2 pages), and tailor it to each job application. Include your contact information, work experience, education, skills, and relevant certifications.',
  'interview': 'Prepare for job interviews by researching the company, practicing common questions, preparing examples of your achievements, and having questions ready to ask the interviewer. Dress professionally, arrive early, and follow up with a thank-you note.',
  'salary': 'When negotiating salary, research industry standards for your role and location. Consider your experience level and the company size. Wait for the employer to bring up compensation first, then aim slightly higher than your target to leave room for negotiation.',
  'career': 'For career advancement, continuously develop your skills, seek mentorship, network within your industry, take on challenging projects, and regularly update your resume and online profiles. Set clear goals and create a plan to achieve them.',
  'skills': 'In-demand job skills currently include programming (Python, JavaScript), data analysis, digital marketing, project management, UX/UI design, cloud computing, artificial intelligence, and soft skills like communication, adaptability, and problem-solving.',
  'remote': 'To find remote jobs, use specialized job boards like Remote.co, We Work Remotely, and FlexJobs. Update your LinkedIn profile to indicate you\'re open to remote work, and highlight any previous remote work experience in your applications.',
  'linkedin': 'Optimize your LinkedIn profile by using a professional photo, writing a compelling headline and summary, detailing your work experience, requesting recommendations, and regularly sharing industry-relevant content. Complete all sections and use keywords relevant to your target roles.',
  'cover letter': 'A strong cover letter should be personalized for each application, address the hiring manager by name if possible, highlight relevant achievements, explain why you\'re interested in the role and company, and include a clear call to action.',
  'network': 'Build your professional network by attending industry events, joining professional associations, participating in online communities, connecting with alumni, and reaching out for informational interviews. Be genuine and focus on building relationships, not just asking for favors.',
  'career change': 'When changing careers, identify transferable skills, gain relevant qualifications if needed, update your resume to highlight applicable experience, network in your target industry, and consider starting with volunteer work or internships to build experience.'
};

const AIChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I\'m your job search assistant. Ask me anything about resumes, interviews, career advice, or job searching!',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Check for keywords in the query
    for (const [keyword, response] of Object.entries(jobResponses)) {
      if (lowerQuery.includes(keyword)) {
        return response;
      }
    }

    // Default responses if no keywords match
    if (lowerQuery.includes('job') || lowerQuery.includes('work') || lowerQuery.includes('employ')) {
      return 'When looking for jobs, make sure your resume is updated, set up job alerts on major job boards, leverage your network, and prepare thoroughly for interviews. Tailor your applications to each position you apply for.';
    }
    
    if (lowerQuery.includes('thank') || lowerQuery.includes('thanks')) {
      return 'You\'re welcome! Feel free to ask if you have any other questions about job searching or career development.';
    }
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return 'Hello! How can I help with your job search or career questions today?';
    }

    // Fallback response
    return 'I\'m not sure I understand your question. Could you try rephrasing it? I can help with resume tips, interview preparation, job search strategies, and career advice.';
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI Career Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Ask me anything about job searching, resume writing, interviews, or career advice.
        </Typography>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          height: '60vh', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 2,
            backgroundColor: '#f5f5f5'
          }}
        >
          <List>
            {messages.map((message) => (
              <ListItem 
                key={message.id} 
                sx={{ 
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    maxWidth: '80%'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                      ml: message.sender === 'user' ? 1 : 0,
                      mr: message.sender === 'user' ? 0 : 1
                    }}
                  >
                    {message.sender === 'user' ? <Person /> : <SmartToy />}
                  </Avatar>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: message.sender === 'user' ? 'primary.light' : 'white',
                      color: message.sender === 'user' ? 'white' : 'text.primary'
                    }}
                  >
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={message.sender === 'user' ? 'white' : 'text.secondary'}
                      sx={{ display: 'block', mt: 1, textAlign: 'right' }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </Box>
              </ListItem>
            ))}
            {isTyping && (
              <ListItem sx={{ justifyContent: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
                    <SmartToy />
                  </Avatar>
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2">Typing...</Typography>
                    </Box>
                  </Paper>
                </Box>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              placeholder="Ask about resumes, interviews, job search tips..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              multiline
              maxRows={3}
              disabled={isTyping}
            />
            <IconButton 
              color="primary" 
              onClick={handleSend} 
              disabled={isTyping || input.trim() === ''}
              sx={{ ml: 1 }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          This AI assistant provides job search and career advice based on common questions.
          Your conversations are not stored permanently.
        </Typography>
      </Box>
    </Container>
  );
};

export default AIChat; 