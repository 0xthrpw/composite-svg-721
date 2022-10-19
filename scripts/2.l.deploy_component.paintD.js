'use strict';

// Imports.
const { ethers } = require('hardhat');
const fs = require('fs');

// These are the constants for the item contract.
const ITEM_NAME = 'Yellow Paint';
const ITEM_SYMBOL = 'sPAINTd';
const CAP = 300;
const SUBSTRATE_ADDRESS = '0x73342Eba6bF8013EE5d5EBFA44223d93c72Dc0a1';
const SETTINGS = [700,450,206,279];
const ATTRIBUTES = `{
  "trait_type": "Type",
  "value": "Cosmetic"
},{
  "trait_type": "Color",
  "value": "Yellow"
}`;

const DESCRIPTION = 'Super paint job for a super space ship';


let SVG_DATA = 
`<rect fill="rgb(170,170,0)" width="625" height="62.5" x="42" y="260" />
<rect fill="rgb(212,212,0)" width="385" height="104" x="42" y="156" />
<rect fill="rgb(212,212,0)" width="93.75" height="83" x="84" y="10" />
<rect fill="rgb(170,170,0)" width="260" height="62.5" x="63" y="93" />
<rect fill="rgb(170,170,0)" width="385" height="52" x="94" y="322.5" />
<rect fill="rgb(128,128,0)" width="160" height="52" x="94" y="374" />
<rect fill="rgb(0,0,255)" width="157" height="98" x="427" y="162" />
`;
  

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
    SETTINGS,
    ATTRIBUTES,
    DESCRIPTION
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
    SETTINGS,
    ATTRIBUTES,
    DESCRIPTION
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
