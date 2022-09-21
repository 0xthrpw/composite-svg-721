'use strict';

// Imports.
const { ethers } = require('hardhat');

async function logTransactionGas(transaction) {
  let transactionReceipt = await transaction.wait();
  let transactionGasCost = transactionReceipt.gasUsed;
  console.log(` -> Gas cost: ${transactionGasCost.toString()}`);
  return transactionGasCost;
}

// Deploy using an Ethers signer to a network.
async function main() {
  const signers = await ethers.getSigners();
  const addresses = await Promise.all(
    signers.map(async signer => signer.getAddress())
  );
  const deployer = {
    provider: signers[0].provider,
    signer: signers[0],
    address: addresses[0]
  };
  console.log(`Deploying contracts from: ${deployer.address}`);

  // Retrieve the necessary contract factories.
  const MultiMintShop721 = await ethers.getContractFactory('MultiMintShop721');

  // Create a variable to track the total gas cost of deployment.
  let totalGasCost = ethers.utils.parseEther('0');

  // Deploy the testing Composite721 item contract.
  let multiMintShop = await MultiMintShop721.connect(deployer.signer).deploy();
  let multiMintShopDeployed = await multiMintShop.deployed();

  console.log('');
  console.log(`* Multi Mint Shop deployed to: ${multiMintShop.address}`);
  totalGasCost = totalGasCost.add(
    await logTransactionGas(multiMintShopDeployed.deployTransaction)
  );

  // Log a verification command.
  console.log(`[VERIFY] npx hardhat verify --network rinkeby \
    ${multiMintShop.address} --constructor-args scripts/args/composite-args.js`);

  // Log the final gas cost of deployment.
  console.log('');
  console.log(`=> Final gas cost of deployment: ${totalGasCost.toString()}`);
}

// Execute the script and catch errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
