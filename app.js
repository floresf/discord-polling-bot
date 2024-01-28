require('dotenv').config();
const express = require('express');
const { VerifyDiscordRequest } = require('./helpers/utils');
// Import Discord constants
const { InteractionType, InteractionResponseType, MessageComponentType } = require('./constants/index');

// Create express app
const app = express();
// Get port from environment, or default to 3000
const port = process.env.PORT || 3000;

app.use(express.json({ verify: VerifyDiscordRequest }));

app.get('/', (req, res) => {
    res.send('hello world..');
});

const activePolls = {};

app.post('/interactions', async (req, res) => {
    console.log('req.body:', req.body);
    const { type, id, data } = req.body;

    try {
        if (type === InteractionType.PING) {
            // Acknowledge a ping event
            return res.send({ type: InteractionResponseType.PONG });

        } else if (type === InteractionType.APPLICATION_COMMAND) {
            const { name } = data;
            if (name === 'poll' && id) {
                console.log('\n\npoll command received...');
                const userId = req.body.member.user.id;
                console.log('userId:', userId);
                // return res.send({
                //     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                //     data: {
                //         content: `Let's create a poll! Please follow the prompts.\n\nWhat is the title of your poll?`,
                //     }
                // });

                // Modal...
                return res.send({
                    type: InteractionResponseType.MODAL,
                    // Modal Response
                    data: {
                        "title": "My Cool Modal",
                        "custom_id": "cool_modal",
                        "components": [{
                            "type": 1,
                            "components": [{
                                "type": 4,
                                "custom_id": "name",
                                "label": "Name",
                                "style": 1,
                                "min_length": 1,
                                "max_length": 4000,
                                "placeholder": "John",
                                "required": true
                            }]
                        }]
                    },
                });
            }

        } else {
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Gotcha...'
                }
            });
        }
    } catch (error) {
        console.log('response error:', error);

    }
});

app.listen(port, () => {
    console.log('server is running on port: ' + port);
});