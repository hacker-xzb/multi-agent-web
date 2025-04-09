const express = require('express');
const path = require('path');
const app = express();

// 添加安全相关的响应头
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// 处理Unity文件的MIME类型
app.use((req, res, next) => {
  const url = req.url.toLowerCase();
  if (url.endsWith('.unityweb')) {
    if (url.endsWith('.data.unityweb')) {
      res.setHeader('Content-Type', 'application/octet-stream');
    } else if (url.endsWith('.wasm.unityweb')) {
      res.setHeader('Content-Type', 'application/wasm');
    } else if (url.endsWith('.js.unityweb')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  } else if (url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (url.endsWith('.wasm')) {
    res.setHeader('Content-Type', 'application/wasm');
  }
  next();
});

// 启用CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 服务静态文件
app.use(express.static(path.join(__dirname, 'build')));

// 专门处理Unity文件
app.use('/unity', express.static(path.join(__dirname, 'build', 'unity'), {
  setHeaders: function(res, filePath) {
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
    if (filePath.endsWith('.unityweb')) {
      if (filePath.endsWith('.data.unityweb')) {
        res.setHeader('Content-Type', 'application/octet-stream');
      } else if (filePath.endsWith('.wasm.unityweb')) {
        res.setHeader('Content-Type', 'application/wasm');
      } else if (filePath.endsWith('.js.unityweb')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
    // 添加缓存控制头
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// 处理所有其他请求
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Unity files should be accessible at http://localhost:${port}/unity/`);
}); 