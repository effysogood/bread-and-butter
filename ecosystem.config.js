module.exports = {
  apps: [
    {
      name: 'butter-and-better',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        MONGO_URI: 'your-mongodb-uri',
        SECRET_KEY: 'your-secret-key',
      },
    },
  ],
};
