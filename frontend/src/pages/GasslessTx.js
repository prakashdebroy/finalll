import React, { useState } from "react";
import { getContract, getWeb3 } from "../utils/blockchain";
import Web3 from "web3";

const GaslessTx = () => {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    const sendGaslessTransaction = async () => {
        const web3 = getWeb3();
        const contract = getContract();
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];

        const nonce = await contract.methods.nonces(sender).call();
        const messageHash = Web3.utils.soliditySha3(sender, recipient, amount, nonce);
        const signedMessage = await web3.eth.personal.sign(messageHash, sender, "");

        await contract.methods.executeGaslessTransaction(sender, recipient, amount, nonce, signedMessage).send({ from: sender });

        alert("Transaction Sent!");
    };

    return (
        <div>
            <h2>Gasless Transaction</h2>
            <input type="text" placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            <input type="text" placeholder="Amount (ETH)" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={sendGaslessTransaction}>Send</button>
        </div>
    );
};

export default GaslessTx;
