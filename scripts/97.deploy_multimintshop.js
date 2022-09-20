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
  let multiMintShop = await MultiMintShop721.connect(alice.signer).deploy();
  let composite721Deployed = await multiMintShop.deployed();

  console.log('');
  console.log(`* Item collection deployed to: ${composite721.address}`);
  totalGasCost = totalGasCost.add(
    await logTransactionGas(composite721Deployed.deployTransaction)
  );

  // Log a verification command.
  console.log(`[VERIFY] npx hardhat verify --network rinkeby \
    ${composite721.address} --constructor-args scripts/args/composite-args.js`);

  const svgGrid = `
  <rect fill="rgb(0,0,0)" width="1000" height="1000" x="0" y="0" />
  <rect fill="rgb(204,204,204)" width="625" height="62" x="248" y="540" />
  <rect fill="rgb(236,236,236)" width="385" height="104" x="248" y="436" />
  <rect fill="rgb(0,255,255)" width="156" height="98" x="635" y="440" />
  <rect fill="rgb(236,236,236)" width="94" height="83" x="290" y="290" />
  <rect fill="rgb(204,204,204)" width="260" height="62" x="268" y="373" />
  <rect fill="rgb(204,204,204)" width="385" height="52" x="299" y="602" />
  <rect fill="rgb(179,179,179)" width="160" height="52" x="299" y="654" />
  <rect fill="rgb(102,102,102)" width="240" height="20" x="299" y="706" />
  <rect fill="rgb(102,102,102)" width="62" height="125" x="247" y="602" />
  <rect fill="rgb(102,102,102)" width="27" height="104" x="219" y="477" />`;

  const setBaseLayerTx = await composite721.connect(deployer.signer).setBaseLayer(svgGrid);
  console.log('');
  console.log(`* Base layer set successfully`);
  totalGasCost = totalGasCost.add(
    await logTransactionGas(setBaseLayerTx)
  );

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
