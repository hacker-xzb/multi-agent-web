import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Box, Paper, TextField, Button, Typography, Grid, CircularProgress } from '@mui/material';

interface Message {
  type: 'user' | 'agent';
  content: string;
  timestamp: string;
}

interface UnityConfig {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl: string;
  companyName: string;
  productName: string;
  productVersion: string;
}

declare global {
  interface Window {
    createUnityInstance: (
      canvas: HTMLCanvasElement,
      config: UnityConfig,
      onProgress?: (progress: number) => void
    ) => Promise<any>;
    unityInstance: any;
  }
}

const SimulationPage = (): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [unityError, setUnityError] = useState<string | null>(null);

  useEffect(() => {
    const loadUnityScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/unity/Build/v4.loader.js';
        script.async = false;
        script.onload = () => {
          // 等待Unity加载器初始化
          const checkUnityInstance = () => {
            if (typeof (window as any).createUnityInstance === 'function') {
              console.log('Unity loader script loaded and initialized');
              resolve();
            } else {
              console.log('Waiting for Unity loader to initialize...');
              setTimeout(checkUnityInstance, 100);
            }
          };
          checkUnityInstance();
        };
        script.onerror = (error) => {
          console.error('Error loading Unity loader script:', error);
          reject(new Error('Failed to load Unity loader script'));
        };
        document.body.appendChild(script);
      });
    };

    const initUnity = async () => {
      try {
        console.log('Starting Unity initialization...');
        await loadUnityScript();
        console.log('Unity loader script loaded, proceeding with initialization...');

        const canvas = document.querySelector("#unity-canvas") as HTMLCanvasElement;
        if (!canvas) {
          throw new Error("Cannot find Unity canvas element");
        }

        const config = {
          dataUrl: "/unity/Build/v4.data",
          frameworkUrl: "/unity/Build/v4.framework.js",
          codeUrl: "/unity/Build/v4.wasm",
          streamingAssetsUrl: "StreamingAssets",
          companyName: "DefaultCompany",
          productName: "fwwb_ai_agent",
          productVersion: "1.0",
          showBanner: (msg: string, type: string) => {
            console.log(`Unity Banner: ${msg} (${type})`);
          }
        };

        console.log('Unity configuration:', config);

        if (typeof (window as any).createUnityInstance !== 'function') {
          console.error('createUnityInstance is not available');
          throw new Error('Unity loader script did not properly initialize');
        }

        console.log('Creating Unity instance...');
        const unityInstance = await (window as any).createUnityInstance(
          canvas,
          config,
          (progress: number) => {
            console.log('Unity loading progress:', progress);
            setLoadingProgress(Math.round(progress * 100));
          }
        );

        console.log('Unity instance created successfully');
        (window as any).unityInstance = unityInstance;
        setUnityLoaded(true);
      } catch (error) {
        console.error('Unity initialization error:', error);
        setUnityError(error instanceof Error ? error.message : 'Failed to load Unity content');
      }
    };

    initUnity();

    return () => {
      if (window.unityInstance) {
        window.unityInstance.Quit();
      }
    };
  }, []);

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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1a1a1a',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {!unityLoaded && !unityError && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Unity加载中... {loadingProgress}%
                </Typography>
              </Box>
            )}
            {unityError && (
              <Typography variant="h6" color="error" align="center">
                {unityError}
              </Typography>
            )}
            <canvas
              id="unity-canvas"
              style={{
                width: '100%',
                height: '100%',
                display: unityLoaded ? 'block' : 'none',
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulationPage; 