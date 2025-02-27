const fs = require("fs");

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
        },
    },
    compilers: {
        solc: {
            version: "0.8.20",
        },
    },
    afterCompile: async () => {
        const source = "./build/contracts/GaslessTransaction.json";
        const destination = "../frontend/src/contracts/GaslessTransaction.json";

        if (fs.existsSync(source)) {
            fs.copyFileSync(source, destination);
            console.log("ABI copied to frontend!");
        }
    },
};
