'use strict';

// Imports.
const { ethers } = require('hardhat');

// These are the constants for the item contract.
const ITEM_NAME = 'Component 1';
const ITEM_SYMBOL = 'C1';
const CAP = 100;
SUBSTRATE_ADDRESS = '0x1FE2853c71006F03A6eA0a4EEeD97507C6e3A6f9';

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
  const Composite721 = await ethers.getContractFactory('Composite721');

  // Create a variable to track the total gas cost of deployment.
  let totalGasCost = ethers.utils.parseEther('0');

  const SETTINGS = {
    x: 250,
    y: 250,
    z: 1,
    w: 500,
    h: 500
  }

  // Deploy the testing Composite721 item contract.
  let composite721 = await Composite721.connect(deployer.signer).deploy(
    ITEM_NAME,
    ITEM_SYMBOL,
    CAP,
    SETTINGS,
    SUBSTRATE_ADDRESS
  );

  let composite721Deployed = await composite721.deployed();
  console.log('');
  console.log(`* Item collection deployed to: ${composite721.address}`);
  totalGasCost = totalGasCost.add(
    await logTransactionGas(composite721Deployed.deployTransaction)
  );

  let svgData = '<rect width="500" height="500" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />';
  let configTx = await composite721.setComponent(svgData);

  let statusTx = await composite721.toggleComponent(true);

  // Log a verification command.
  console.log(`[VERIFY] npx hardhat verify --network rinkeby \
    ${composite721.address} --constructor-args scripts/args/composite-args.js`);

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
