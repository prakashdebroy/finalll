const GaslessTransaction = artifacts.require("GaslessTransaction");

module.exports = function (deployer) {
    deployer.deploy(GaslessTransaction);
};
