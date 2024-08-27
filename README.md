## Swisstronik: Minting ERC-20 Tokens with Hardhat (README.md)

This guide explains how to mint ERC-20 tokens using Hardhat, the OpenZeppelin Contracts Wizard, and deploy them on the Swisstronik blockchain.

### Prerequisites

* Node.js and npm installed
* Basic understanding of Solidity and smart contracts
* MetaMask wallet
* Swisstronik Testnet 2 account

### Setting Up the Project

1. **Create a project directory:**

   ```bash
   mkdir MyERC20Token
   cd MyERC20Token
   ```

2. **Install Hardhat:**

   ```bash
   npm install --save-dev hardhat
   ```

3. **Initialize a Hardhat project:**

   ```bash
   npx hardhat init
   ```

   Follow the prompts to create a JavaScript project.

4. **Open the project in your code editor:**

   ```bash
   code .
   ```

5. **Delete unnecessary files:**

   - Delete `Lock.sol` in the `contracts` folder
   - Delete any other irrelevant files (e.g., Ignition File)

6. **Set your private key:**

   - Obtain your private key from MetaMask (Account Details > Show Private Key)
   - Set the variable using the following command:

     ```bash
     npx hardhat vars set PRIVATE_KEY

     Paste private key
     ```

7. **Configure the Swisstronik network:**

   - Open `hardhat.config.js` and add the following code:

   ```javascript
   require("@nomicfoundation/hardhat-toolbox");

   const PRIVATE_KEY = vars.get("PRIVATE_KEY");

   module.exports = {
     defaultNetwork: "swisstronik",
     solidity: "0.8.20",
     networks: {
       swisstronik: {
         url: "https://json-rpc.testnet.swisstronik.com/",
         accounts: [`0x${PRIVATE_KEY}`],
       },
     },
   };
   ```

### Creating the ERC-20 Smart Contract

1. **Use the OpenZeppelin Contracts Wizard:**
   - Search for "OpenZeppelin Contracts Wizard" online.
2. **Choose ERC-20:**
   - Set your token name, symbol, initial supply, and enable the "mintable" option.
3. **Copy and paste the generated Solidity code:**
   - Create a new file named `Token.sol` in the `contracts` folder.
   - Paste the copied solidity code into the file.


Token.sol
//solidity code
```solidity


// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("TestToken", "TTS")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}




```


4. **Install OpenZeppelin library:**

   ```bash
   npm install @openzeppelin/contracts
   ```

### Deploying the Smart Contract

1. **Create a deployment script (`deploy.js`):**

   ```javascript
   // scripts/deploy.js

   const { ethers } = require("hardhat");

   async function main() {
     const [deployer] = await ethers.getSigners();
     console.log("Deploying contracts with the account:", deployer.address);

     const TokenContract = await ethers.getContractFactory("TestToken");
     const initialOwner = deployer.address;
     const myToken = await TokenContract.deploy(initialOwner);

     console.log("Token address:", myToken.target);
   }

   main()
     .then(() => process.exit(0))
     .catch((error) => {
       console.error(error);
       process.exit(1);
     });
   ```

2. **Deploy the contract:**

   ```bash
   npx hardhat run scripts/deploy.js --network swisstronik
   ```

   Copy the deployed contract address for later use.

### Minting 100 ERC-20 Tokens

1. **Install SwisstronikJS:**

   ```bash
   npm install @swisstronik/utils
   ```

2. **Create a minting script (`mint.js`):**

 ```javascript
   // scripts/mint.js

  // Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

// Function to send a shielded transaction using the provided signer, destination, data, and value
const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpcLink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
    const replace_contractAddress = "<  replace_contractAddress  >";
    const [signer] = await hre.ethers.getSigners();
    const replace_contractFactory = await hre.ethers.getContractFactory("TestToken");
    const contract = replace_contractFactory.attach(replace_contractAddress);
  
    const replace_functionName = "mint";
    const replace_functionArgs = ["0x8Ab77353aC866B7Ab690890e620c249A8D3e92D0","100000000000000000000"]; // 100 tokens with 18 decimal places
    
    const amountMinted = hre.ethers.formatEther(replace_functionArgs[1]); // Converts to human-readable format (100 tokens)
    console.log(`Minting ${amountMinted} tokens...`);
  
    try {
        const transaction = await sendShieldedTransaction(signer, replace_contractAddress, contract.interface.encodeFunctionData(replace_functionName, replace_functionArgs), 0);
        console.log(`Transaction submitted! Transaction hash: ${transaction.hash}`);
        await transaction.wait();
    
        console.log(`Transaction completed successfully! ${amountMinted} tokens minted to ${replace_functionArgs[0]}.`);
        console.log(`Transaction hash: ${transaction.hash}`);
      } catch (error) {
        console.error(`Transaction failed! Could not mint ${amountMinted} tokens.`);
        console.error(`Transaction hash: ${error.transactionHash ? error.transactionHash : 'N/A'}`);
        console.error(error);
      }
  }
  
// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Running the Script

To execute this script and mint 100 ERC-20 tokens, run the following command in your terminal:

```bash
npx hardhat run scripts/mint.js --network swisstronik
```

If successful, you'll see a confirmation message indicating the tokens were minted and the recipient address.

### Transferring 1 ERC-20 Token

**Here's the `transfer.js` script:**

```javascript
// scripts/transfer.js

// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

// Function to send a shielded transaction using the provided signer, destination, data, and value
const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpcLink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  // Address of the deployed contract
  const replace_contractAddress = "<  replace_contractAddress  >";

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Create a contract instance
  const replace_contractFactory = await hre.ethers.getContractFactory("TestToken");
  const contract = replace_contractFactory.attach(replace_contractAddress);

  // Send a shielded transaction to execute a transaction in the contract
  const replace_functionName = "transfer";
  const replace_functionArgs = ["0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1", "1000000000000000000"]; // 1 token with 18 decimal places
  
  const amountTransferred = hre.ethers.formatEther(replace_functionArgs[1]); // Converts to human-readable format (1 token)
  console.log(`Transferring ${amountTransferred} tokens to ${replace_functionArgs[0]}...`);

  try {
    const transaction = await sendShieldedTransaction(signer, replace_contractAddress, contract.interface.encodeFunctionData(replace_functionName, replace_functionArgs), 0);
    console.log(`Transaction submitted! Transaction hash: ${transaction.hash}`);
    await transaction.wait();

    console.log(`Transaction completed successfully! ${amountTransferred} tokens transferred to ${replace_functionArgs[0]}.`);
    console.log(`Transaction hash: ${transaction.hash}`);

  } catch (error) {
    console.error(`Transaction failed! Could not transfer ${amountTransferred} tokens to ${replace_functionArgs[0]}.`);
    console.error(`Transaction hash: ${error.transactionHash ? error.transactionHash : 'N/A'}`);
    console.error(error);
  }
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

```

**Running the Script:**

```bash
npx hardhat run scripts/transfer.js --network swisstronik
```

This will transfer 1 ERC-20 token to the specified address.

### Publishing Your Code to GitHub

1. Create a new GitHub repository.
2. Push your project files to the repository:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your_repository_url>
   git push -u origin main
   ```

### Submitting Task Details to Swisstronik Testnet 2 Dashboard

1. Copy the deployed contract address from your terminal.
2. Copy the GitHub repository URL.
3. Find the transaction link for the token transfer on the Swisstronik Testnet Explorer.
4. Paste the required information into the Swisstronik Testnet 2 Dashboard task card.
5. Submit your task.

**Congratulations!** You've successfully minted and transferred ERC-20 tokens, deployed a smart contract using Hardhat, and completed the task on Swisstronik.
