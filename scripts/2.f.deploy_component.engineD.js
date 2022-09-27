'use strict';

// Imports.
const { ethers } = require('hardhat');
const fs = require('fs');

// These are the constants for the item contract.
const ITEM_NAME = 'Hybrid Warp Light Drive';
const ITEM_SYMBOL = 'sDRIVEd';
const CAP = 200;
const SUBSTRATE_ADDRESS = '0xA9Da70d82668E503E7dEc5c3F8EbAa068F4B2143';
const SETTINGS = [200,300,50,400]

const ATTRIBUTES = `{
  "trait_type": "Type",
  "value": "Engine"
},{
  "trait_type": "Class",
  "value": "Hybrid Warp Drive"
},{
  "trait_type": "Speed",
  "value": "14"
}`;

const DESCRIPTION = 'A dual warp and light drive package that will leave your enemies in the dust.';


let SVG_DATA = 
`<rect fill="rgb(179,179,179)" width="18" height="146" x="126" y="18" />
<rect fill="rgb(128,128,128)" width="36" height="161" x="89" y="24" />
<rect fill="rgb(102,102,102)" width="35" height="243" x="145" y="6" />

<rect fill="rgb(240,128,255)" width="24" height="130" x="65" y="30" />
<rect fill="rgb(240,200,255)" width="30" height="100" x="10" y="45" />

<rect fill="rgb(255,180,255)" width="15" height="130" x="45" y="30" />

<rect fill="rgb(255,230,128)" width="15" height="50" x="45" y="180" />
<rect fill="rgb(255,238,170)" width="10" height="50" x="30" y="180" />
<rect fill="rgb(255,246,213)" width="5" height="50" x="20" y="180" />
<rect fill="rgb(179,179,179)" width="18" height="74" x="127" y="170" />
<rect fill="rgb(128,128,128)" width="37" height="62" x="90" y="174" />
<rect fill="rgb(255,204,0)" width="25" height="49" x="65" y="180" />
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
