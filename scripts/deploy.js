// scripts/deploy.js

const { ethers } = require("hardhat");

async function main() {
    // Get the ContractFactory and Signers here.
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // We get the contract to deploy
    const TokenContract = await ethers.getContractFactory("TestToken");
    
    // Deploy the contract and pass the initialOwner address
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
