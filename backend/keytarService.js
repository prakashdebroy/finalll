const keytar = require("keytar");

const SERVICE_NAME = "GaslessTxApp"; // Service name to store keys

// Store private key securely
async function savePrivateKey(username, privateKey) {
    try {
        await keytar.setPassword(SERVICE_NAME, username, privateKey);
        console.log("Private key stored successfully!");
    } catch (error) {
        console.error("Error storing private key:", error);
    }
}

// Retrieve stored private key
async function getPrivateKey(username) {
    try {
        const privateKey = await keytar.getPassword(SERVICE_NAME, username);
        return privateKey || null;
    } catch (error) {
        console.error("Error retrieving private key:", error);
        return null;
    }
}

// Delete stored private key (on logout)
async function removePrivateKey(username) {
    try {
        await keytar.deletePassword(SERVICE_NAME, username);
        console.log("Private key removed successfully!");
    } catch (error) {
        console.error("Error deleting private key:", error);
    }
}

module.exports = { savePrivateKey, getPrivateKey, removePrivateKey };
