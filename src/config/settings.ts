export default {
  environment: process.env.NODE_ENV,
  prod: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT || '8080'),
  httpLogging: (process.env.HTTP_LOGGING || (process.env.NODE_ENV === 'development' ? 'true' : 'false')) === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
  logFolder: process.env.LOG_FOLDER || './logs',
  server: process.env.SERVER === 'true',
  client: process.env.CLIENT === 'true',
  wsURL: process.env.WS_URL || 'ws://localhost:8080',
  serverURL: process.env.SERVER_URL || 'https://quotes.sttrs.com',
};
