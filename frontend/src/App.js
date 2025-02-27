import React, { useState, useEffect } from "react";
import { initializeBlockchain, loginWithMetaMask, loginWithPrivateKey, sendGaslessTransaction } from "./utils/blockchain";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    initializeBlockchain();
  }, []);

  const handleMetaMaskLogin = async () => {
    const userAccount = await loginWithMetaMask();
    if (userAccount) {
      setAccount(userAccount);
    }
  };

  const handlePrivateKeyLogin = async () => {
    const privateKey = prompt("Enter your private key:");
    if (privateKey) {
      const userAccount = await loginWithPrivateKey(privateKey);
      if (userAccount) {
        setAccount(userAccount);
      }
    }
  };

  const handleSendTransaction = async () => {
    if (!recipient || !amount) {
      alert("Please enter recipient address and amount.");
      return;
    }

    const txReceipt = await sendGaslessTransaction(recipient, amount);
    if (txReceipt) {
      alert(`Transaction successful: ${txReceipt.transactionHash}`);
    } else {
      alert("Transaction failed.");
    }
  };

  return (
    <div className="App">
      <h1>Gasless Transactions</h1>

      {!account ? (
        <div>
          <button onClick={handleMetaMaskLogin}>Login with MetaMask</button>
          <button onClick={handlePrivateKeyLogin}>Login with Private Key</button>
        </div>
      ) : (
        <div>
          <h2>Logged in as: {account}</h2>

          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount (in Wei)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleSendTransaction}>Send Gasless Transaction</button>
        </div>
      )}
    </div>
  );
}

export default App;
