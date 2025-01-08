require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('📍 Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB 연결 에러:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
