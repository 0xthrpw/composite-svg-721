'use strict';

// Imports.
const { ethers } = require('hardhat');
const fs = require('fs');

// These are the constants for the item contract.
const ITEM_NAME = 'Dual Blaster';
const ITEM_SYMBOL = 'sBLASTb';
const CAP = 300;
const SUBSTRATE_ADDRESS = '0xA9Da70d82668E503E7dEc5c3F8EbAa068F4B2143';
const SETTINGS = [500,100,200,700]
const ATTRIBUTES = `{
  "trait_type": "Type",
  "value": "Weapon"
},{
  "trait_type": "Class",
  "value": "Blaster"
},{
  "trait_type": "Burst",
  "value": "2"
},{
  "trait_type": "Count",
  "value": "2"
}`;

const DESCRIPTION = 'Dual blaster cannons that fire multiple round at a time.';


let SVG_DATA = 
`<rect fill="rgb(255,255,255)" width="350" height="45" x="40" y="5" />
<rect fill="rgb(179,179,179)" width="280" height="25" x="50" y="15" />
<rect fill="rgb(255,255,0)" width="40" height="25" x="340" y="15" />
<rect fill="rgb(255,255,0)" width="85" height="15" x="400" y="15" />
<rect fill="rgb(255,255,0)" width="15" height="45" x="25" y="5" />
<rect fill="rgb(255,255,255)" width="350" height="45" x="40" y="55" />
<rect fill="rgb(179,179,179)" width="280" height="25" x="50" y="65" />
<rect fill="rgb(255,255,0)" width="40" height="25" x="340" y="65" />
<rect fill="rgb(255,255,0)" width="85" height="15" x="400" y="75" />
<rect fill="rgb(255,255,0)" width="15" height="45" x="25" y="55" />
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
