import BASE_URL from './Utils/baseUrl';
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    `${BASE_URL}`,
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    })
  );
};
