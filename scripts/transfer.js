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
