// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GaslessTransaction {
    mapping(address => uint256) public nonces;

    event TransactionExecuted(address indexed sender, address recipient, uint256 amount);

    function executeGaslessTransaction(
        address sender,
        address recipient,
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    ) public {
        require(nonce == nonces[sender], "Invalid nonce");

        bytes32 messageHash = keccak256(abi.encodePacked(sender, recipient, amount, nonce));
        bytes32 ethSignedMessageHash = prefixed(messageHash);

        require(recoverSigner(ethSignedMessageHash, signature) == sender, "Invalid signature");

        nonces[sender]++;
        payable(recipient).transfer(amount);

        emit TransactionExecuted(sender, recipient, amount);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function recoverSigner(bytes32 hash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature version");

        return ecrecover(hash, v, r, s);
    }

    receive() external payable {} // Allow contract to receive ETH
}
