require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const nacl = require('tweetnacl');

function VerifyDiscordRequest(req, res, buf, encoding) {
    // Get headers from interaction
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    const isVerified = VerifyDiscordSignature(buf, signature, timestamp, process.env.PUBLIC_KEY);
    console.log(`\nisVerified: ${isVerified}\n`);
    if (!isVerified) {
        res.status(401).end('Bad request signature');
        throw new Error('invalid request signature');
    }
}

/**
 * Validates a payload from Discord against its signature and key
 * @version 1.0
 * @param {Uint8Array|ArrayBuffer|Buffer|string} rawBody - The raw body of the request
 * @param {Uint8Array|ArrayBuffer|Buffer|string} signature - The signature from the 'X-Signature-Ed25519' header
 * @param {Uint8Array|ArrayBuffer|Buffer|string} timestamp - The timestamp from the 'X-Signature-Timestamp' header
 * @param {Uint8Array|ArrayBuffer|Buffer|string} clientPublicKey - The public key from the Discord developer dashboard
 * @returns {boolean} - Whether the signature is valid
 */
function VerifyDiscordSignature(rawBody, signature, timestamp, clientPublicKey) {
    try {
        const timestampData = valueToUint8Array(timestamp);
        const bodyData = valueToUint8Array(rawBody);
        const message = concatUint8Arrays(timestampData, bodyData);

        const signatureData = valueToUint8Array(signature, 'hex');
        const publicKeyData = valueToUint8Array(clientPublicKey, 'hex');
        return nacl.sign.detached.verify(message, signatureData, publicKeyData);
    } catch (error) {
        return false;
    }
}

/**
 * Merges two arrays
 * @version 1.0
 * @param {Uint8Array} arr1 - First array to concat
 * @param {Uint8Array} arr2 - Second array to concat
 * @returns Concatenated arrays
 */
function concatUint8Arrays(arr1, arr2) {
    const merged = new Uint8Array(arr1.length + arr2.length);
    merged.set(arr1);
    merged.set(arr2, arr1.length);
    return merged;
}

/**
 * @version 1.0
 * @param {Uint8Array|ArrayBuffer|Buffer|string} value - Value to convert. Strings are parsed as hex.
 * @param {string} [format] - Format of the value. Valid options: 'hex'. Defaults to 'utf-8'.
 * @returns 
 */
function valueToUint8Array(value, format) {
    if (value === null) {
        return new Uint8Array();
    }

    if (typeof value === 'string') {
        if (format === 'hex') {
            const matches = value.match(/.{1,2}/g);
            if (matches === null) {
                throw new Error('Value is not a valid hex string');
            }
            const hexVal = matches.map(byte => parseInt(byte, 16));
            return new Uint8Array(hexVal);
        } else {
            return new TextEncoder().encode(value);
        }
    }
    // Handle Buffer
    try {
        if (Buffer.isBuffer(value)) {
            return new Uint8Array(value);
        }
    } catch (error) {
        // Runtime doesn't have Buffer
    }
    if (value instanceof ArrayBuffer) {
        return new Uint8Array(value);
    }
    if (value instanceof Uint8Array) {
        return value;
    }
    throw new Error('Could not convert value to Uint8Array');
}

/**
 * 
 * @param {string} endpoint - The endpoint to send the request to
 * @param {string} options - Request options
 * @param {string} options.method - The request method
 */
async function DiscordRequest(endpoint, options) {
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

async function InstallGlobalCommands(appId, commands) {
    // API endpoint to overwrite global commands
    const endpoint = `applications/${appId}/commands`;

    try {
        // Bulk overwrite Global Application commands: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
        await DiscordRequest(endpoint, { method: 'put', body: commands });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    VerifyDiscordRequest,
    InstallGlobalCommands,
    DiscordRequest,
};