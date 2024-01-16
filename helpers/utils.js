import 'dotenv/config'
import axios from 'axios'
import crypto from 'crypto'

export function VerifyDiscordRequest(req, res, buf, encoding) {
    // Get headers from interaction
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    const isVerified = VerifySignature(signature, timestamp, buf.toString());
    console.log('isVerified:', isVerified);
    if (!isVerified) {
        res.status(401).end('Bad request signature');
        throw new Error('invalid request signature');
    }
}

function VerifySignature(signature, timestamp, body) {
    const publicKey = process.env.PUBLIC_KEY;
    const verifier = crypto.createVerify('SHA256');
    verifier.update(timestamp + body);
    verifier.end();

    return verifier.verify(publicKey, signature, 'hex');
}

/**
 * 
 * @param {string} endpoint - The endpoint to send the request to
 * @param {string} options - Request options
 * @param {string} options.method - The request method
 */
export async function DiscordRequest(endpoint, options) {
    // Base url for Discord API
    const url = `https://discord.com/api/v10/${endpoint}`;
    // Stringify payload
    const response = await axios({
        method: options.method,
        url: url,
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
        data: options.body || null,
    });

    console.log('\n\nResponse.data:', response.data);
}

export async function InstallGlobalCommands(appId, commands) {
    // API endpoint to overwrite global commands
    const endpoint = `applications/${appId}/commands`;

    try {
        // Bulk overwrite Global Application commands: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
        await DiscordRequest(endpoint, { method: 'put', body: commands });
    } catch (error) {
        console.error(error);
    }
}