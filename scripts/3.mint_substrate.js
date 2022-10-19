const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const signers = await ethers.getSigners();
  const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

  const TOKEN_INSTANCE = '0x73342Eba6bF8013EE5d5EBFA44223d93c72Dc0a1';
  const RECEIVER = '0x2425124064f82bF68C6844fec4515B071D4B821a';

  const deployer = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };
  console.log(`Connecting to: ${TOKEN_INSTANCE}`);

  let Composite721 = await ethers.getContractFactory("Composite721");
  let composite721 = await Composite721.attach(TOKEN_INSTANCE);
  let numberOfTokens = 5;

  let mintTx = await composite721.connect(deployer.signer).mint(RECEIVER, numberOfTokens);
  let mintTxReceipt = await mintTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
