import 'dotenv/config'
import { InstallGlobalCommands } from './helpers/utils';


// Simple hello world command
const HELLO_WORLD = {
    name: 'hello',
    type: 1,
    description: 'Hello world command'
};

const allCommands = [HELLO_WORLD];

InstallGlobalCommands(process.env.APP_ID, allCommands);