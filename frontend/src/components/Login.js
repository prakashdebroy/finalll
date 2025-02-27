import React, { useState } from "react";
import { initializeBlockchain } from "../utils/blockchain";
import Web3 from "web3";

const Login = ({ onLogin }) => {
    const [privateKey, setPrivateKey] = useState("");

    const loginWithMetaMask = async () => {
        await initializeBlockchain();
        onLogin();
    };

    const loginWithPrivateKey = async () => {
        const web3 = new Web3("http://127.0.0.1:7545");
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        onLogin();
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={loginWithMetaMask}>Login with MetaMask</button>
            <input
                type="text"
                placeholder="Enter Private Key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
            />
            <button onClick={loginWithPrivateKey}>Login with Private Key</button>
        </div>
    );
};

export default Login;
