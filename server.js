const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Heroku MongoDB Atlas (MONGODB_URI) if exists.
// Otherwise, it will connect to the local MongoDB server's DB 'mongodb://localhost:27017/friends_social_network_db'
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/friends_social_network_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use this to log mongo queries being executed!
mongoose.set('debug', true);

app.use(require('./routes'));

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));