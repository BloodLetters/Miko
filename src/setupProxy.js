const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/komiku',
    createProxyMiddleware({
      target: 'https://komiku.id',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api\/komiku/, ''),
    })
  );

  app.use(
    '/api/komiku-api',
    createProxyMiddleware({
      target: 'https://api.komiku.id',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api\/komiku-api/, ''),
    })
  );

  app.use(
    '/api/comic',
    createProxyMiddleware({
      target: 'https://komiku-api.fly.dev',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api\/comic/, '/api/fly'),
    })
  );
};
