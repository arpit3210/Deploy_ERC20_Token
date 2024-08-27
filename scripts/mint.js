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