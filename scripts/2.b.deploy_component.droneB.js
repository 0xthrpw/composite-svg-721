'use strict';

// Imports.
const { ethers } = require('hardhat');
const fs = require('fs');

// These are the constants for the item contract.
const ITEM_NAME = 'Drone B';
const ITEM_SYMBOL = 'drnB';
const CAP = 100;
const SUBSTRATE_ADDRESS = '0xfb6c7cc444366655fb57301a6afca531abd2f591';
const SETTINGS = [300,200,600,100]

let SVG_DATA = 
`<rect fill="rgb(255,255,0)" width="134" height="134" x="113" y="33" />
<rect fill="rgb(179,179,179)" width="25" height="100" x="95" y="49" />
<rect fill="rgb(255,255,255)" width="33" height="100" x="246" y="49" />
<rect fill="rgb(77,77,77)" width="50" height="83" x="45" y="58" />
<rect fill="rgb(0,255,255)" width="25" height="66" x="20" y="66" />`;
  

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


  // Deploy the testing Composite721 item contract.
  let composite721 = await Composite721.connect(deployer.signer).deploy(
    ITEM_NAME,
    ITEM_SYMBOL,
    CAP,
    SUBSTRATE_ADDRESS,
    SETTINGS
  );

  let composite721Deployed = await composite721.deployed();
  console.log('');
  console.log(`* Item collection deployed to: ${composite721.address}`);
  totalGasCost = totalGasCost.add(
    await logTransactionGas(composite721Deployed.deployTransaction)
  );

  let deploymentArgs = [
    ITEM_NAME,
    ITEM_SYMBOL,
    CAP,
    SUBSTRATE_ADDRESS,
    SETTINGS
  ];
  fs.writeFileSync('scripts/args/composite-args.js', `module.exports = ${JSON.stringify(deploymentArgs, null, 2)}`);

  // Log a verification command.
  console.log(`[VERIFY] npx hardhat verify --network rinkeby \
    ${composite721.address} --constructor-args scripts/args/composite-args.js`);
  
  console.log('');
  console.log(`* Minting item...`);
  let mintTx = await composite721.connect(deployer.signer).mint(deployer.address, 1);
  totalGasCost = totalGasCost.add(
     await logTransactionGas(mintTx)
  );

  console.log('');
  console.log(`* Item minted. Updating SVG data...`);
  let configTx = await composite721.setBaseLayer(SVG_DATA);
  totalGasCost = totalGasCost.add(
     await logTransactionGas(configTx)
  );
  console.log(`* SVG data updated. Setting component flag...`);

  let statusTx = await composite721.toggleComponent(true);
  totalGasCost = totalGasCost.add(
     await logTransactionGas(statusTx)
  );
  console.log(`* Component flag set.`);

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
