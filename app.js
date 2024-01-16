require('dotenv').config();
const express = require('express');
const { VerifyDiscordRequest } = require('./helpers/utils');

// Create express app
const app = express();
// Get port from environment, or default to 3000
const port = process.env.PORT || 3000;

app.use(express.json({ verify: VerifyDiscordRequest }));

app.get('/', (req, res) => {
    res.send('hello world..');
});

app.listen(port, () => {
    console.log('server is running on port: ' + port);
});