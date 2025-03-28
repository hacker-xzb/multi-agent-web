import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Box, Paper, TextField, Button, Typography, Grid } from '@mui/material';

interface Message {
  type: 'user' | 'agent';
  content: string;
  timestamp: string;
}

const SimulationPage = (): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // 这里将来需要与Unity和Agent系统集成
    // 模拟Agent响应
    setTimeout(() => {
      const agentResponse: Message = {
        type: 'agent',
        content: '这是Agent的响应消息',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };

  // 保存消息到JSON文件
  useEffect(() => {
    const saveMessages = async () => {
      try {
        const response = await fetch('/api/save-messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messages),
        });
        if (!response.ok) {
          throw new Error('Failed to save messages');
        }
      } catch (error) {
        console.error('Error saving messages:', error);
      }
    };

    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  return (
    <Box sx={{ height: '100vh', p: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* 左侧对话框 */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              对话记录
            </Typography>
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  <Paper
                    sx={{
                      p: 1,
                      backgroundColor: message.type === 'user' ? 'primary.light' : 'grey.200',
                      color: message.type === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                placeholder="输入消息..."
                inputProps={{
                  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!input.trim()}
              >
                发送
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* 右侧Unity场景 */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Unity场景将在这里展示
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulationPage; 