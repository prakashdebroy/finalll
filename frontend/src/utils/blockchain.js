import Web3 from "web3";
import GaslessTransaction from "../contracts/GaslessTransaction.json";

let web3;
let contract;
let selectedAccount;

/**
 * Initializes the blockchain connection and contract.
 */
export const initializeBlockchain = async () => {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      selectedAccount = accounts[0];

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GaslessTransaction.networks[networkId];

      if (!deployedNetwork) {
        throw new Error("Contract not deployed on the current network");
      }

      contract = new web3.eth.Contract(GaslessTransaction.abi, deployedNetwork.address);
      console.log("Contract initialized at:", deployedNetwork.address);
    } else {
      throw new Error("MetaMask not detected. Please install MetaMask.");
    }
  } catch (error) {
    console.error("Error initializing blockchain:", error);
  }
};

/**
 * Logs in with MetaMask.
 */
export const loginWithMetaMask = async () => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not installed.");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    selectedAccount = accounts[0];

    console.log("Logged in with MetaMask:", selectedAccount);
    return selectedAccount;
  } catch (error) {
    console.error("MetaMask login failed:", error);
    return null;
  }
};

/**
 * Logs in using a private key (Ganache local development).
 * @param {string} privateKey - The private key to use for login.
 */
export const loginWithPrivateKey = async (privateKey) => {
  try {
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Ganache RPC

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    selectedAccount = account.address;

    console.log("Logged in with Private Key:", selectedAccount);
    return selectedAccount;
  } catch (error) {
    console.error("Private Key login failed:", error);
    return null;
  }
};

/**
 * Sends a gasless transaction.
 * @param {string} to - The recipient address.
 * @param {number} amount - The amount to send (in Wei).
 */
export const sendGaslessTransaction = async (to, amount) => {
  try {
    if (!contract) throw new Error("Contract not initialized");

    const gaslessTx = await contract.methods.transfer(to, amount, "0x").send({
      from: selectedAccount,
      gas: 1000000,
    });

    console.log("Transaction successful:", gaslessTx.transactionHash);
    return gaslessTx;
  } catch (error) {
    console.error("Error sending gasless transaction:", error);
    return null;
  }
};
