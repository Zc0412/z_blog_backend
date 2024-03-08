export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PROT,
    secure: false,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS,
    },
  },
  redis: {
    type: 'single',
    url: process.env.UPSTASH_REDIS_URL,
  },
});
