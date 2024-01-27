require('dotenv').config();
const express = require('express');
const { VerifyDiscordRequest } = require('./helpers/utils');
// Import Discord constants
const { InteractionType, InteractionResponseType } = require('./helpers/constants');

// Create express app
const app = express();
// Get port from environment, or default to 3000
const port = process.env.PORT || 3000;

app.use(express.json({ verify: VerifyDiscordRequest }));

app.get('/', (req, res) => {
    res.send('hello world..');
});

app.post('/interactions', async (req, res) => {
    console.log('req.body:', req.body);
    const { type, id, data } = req.body;

    if (type === InteractionType.PING) {
        // Acknowledge a ping event
        return res.send({ type: InteractionResponseType.PONG });
    }

    res.send({
        type: 1,
        data: {
            content: 'Gotcha...'
        }
    });

});

app.listen(port, () => {
    console.log('server is running on port: ' + port);
});