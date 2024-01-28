require('dotenv').config();
const { InstallGlobalCommands } = require('./helpers/utils');
const { ApplicationCommandType } = require('./constants/index');


// Simple hello world command
const HELLO_WORLD = {
    name: 'hello',
    type: ApplicationCommandType.CHAT_INPUT,
    description: 'Hello world command'
};

const POLL_COMMAND = {
    name: 'poll',
    type: ApplicationCommandType.CHAT_INPUT,
    description: 'Create a poll for others to vote on'
};

const allCommands = [HELLO_WORLD, POLL_COMMAND];

InstallGlobalCommands(process.env.APP_ID, allCommands);