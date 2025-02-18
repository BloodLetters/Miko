const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const onProxyRes = (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  };

  app.use(
    '/api/komiku',
    createProxyMiddleware({
      target: 'https://komiku.id',
      changeOrigin: true,
      pathRewrite: { '^/api/komiku(/|$)': '' },
      headers: {
        Accept: 'application/json',
      },
      onProxyRes,
      onProxyReq: (proxyReq, req) => {
        console.log('Original URL:', req.url);
        console.log('Proxied URL:', proxyReq.path);
      }
    })
  );
  
  app.use(
    '/api/info',
    createProxyMiddleware({
      target: 'https://komiku.id',
      changeOrigin: true,
      pathRewrite: { '^/api/info(/|$)': '' },
      headers: {
        Accept: 'application/json',
      },
      onProxyRes,
      onProxyReq: (proxyReq, req) => {
        console.log('Original URL:', req.url);
        console.log('Proxied URL:', proxyReq.path);
      }
    })
  );

  app.use(
    '/api/komiku-api',
    createProxyMiddleware({
      target: 'https://api.komiku.id',
      changeOrigin: true,
      pathRewrite: { '^/api/komiku-api': '' },
      headers: {
        Accept: 'application/json',
      },
      onProxyRes,
      onProxyReq: (proxyReq, req) => {
        console.log('Original URL:', req.url);
        console.log('Proxied URL:', proxyReq.path);
      }
    })
  );

  app.use(
    '/api/comic',
    createProxyMiddleware({
      target: 'https://komiku-api.fly.dev',
      changeOrigin: true,
      pathRewrite: { '^/api/comic': '/api/comic/info' },
      secure: false,
      onProxyRes,
      onProxyReq: (proxyReq, req) => {
        console.log('Original URL:', req.url);
        console.log('Proxied URL:', proxyReq.path);
      },
    })
  );
};
