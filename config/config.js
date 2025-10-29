require('dotenv').config();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/flipcart'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: '24h'
  },
  server: {
    port: process.env.PORT || 8080
  }
};
