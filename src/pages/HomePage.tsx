import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        width: '100vw', // 让宽度占满整个视口
        height: '100vh', // 让高度占满整个视口
        backgroundColor: '#ffffff', // 设置背景颜色为白色
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // 将内容放置在顶部
        color: 'black', // 设置文本颜色为黑色
        paddingTop: '10rem', // 调整顶部填充以向下移动标题
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          position: 'absolute',
          top: 0,
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        }}
      >
        <Button
          href="https://gitee.com/l1ament023/super_king" // 替换为实际的Gitee仓库链接
          sx={{
            fontSize: '17px',
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: 'rgba(255, 255, 255, 0.7)',
            paddingLeft: '15px',
            paddingRight: '15px',
            textDecoration: 'none',
            '&:hover': {
              color: '#a7a9b8',
            },
          }}
        >
          Repository
        </Button>
        <Button
          href="https://your-documents-link" // 替换为实际的文档链接
          sx={{
            fontSize: '17px',
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: 'rgba(255, 255, 255, 0.7)',
            paddingLeft: '15px',
            paddingRight: '15px',
            textDecoration: 'none',
            '&:hover': {
              color: '#a7a9b8',
            },
          }}
        >
          Documents
        </Button>
      </Box>

      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontSize: '70px',
          lineHeight: '1.1em',
          fontWeight: 'bold',
          letterSpacing: '-0.4px',
          color: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'Poppins, sans-serif',
          textAlign: 'center',
          marginBottom: '2rem', // 增加底部间距
        }}
      >
        Multi-Agent Office Simulation System
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '1600px', // 放大宽度
          height: '60vh', // 适当缩短高度，避免占满整个视口
          backgroundImage: 'url(/image.gif)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mt: 2, // 缩小与标题的间距
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      />

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/simulation')}
        sx={{
          mt: 3, // 增加顶部间距以确保按钮可见
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // 按钮背景颜色为黑色
          color: '#fff', // 按钮字体颜色为白色
          fontSize: '1.2rem', // 增大字体大小
          padding: '0.8rem 2rem', // 增大按钮的内边距
          borderRadius: '12px', // 设置圆角
          '&:hover': {
            backgroundColor: '#808080', // 鼠标悬停时背景颜色变为灰色
          },
        }}
      >
        Enter Simulation
      </Button>
    </Container>
  );
};

export default HomePage; 