const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const signers = await ethers.getSigners();
  const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

  const GLASS_INSTANCE = '0x6a9228eb0a6f3d211bd6cc18f7c7c16c0ab10cc6';
  const RECEIVER = '0xbe4f0cdf3834bd876813a1037137dcfad79acd99';

  const deployer = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };
  console.log(`Connecting to: ${GLASS_INSTANCE}`);

  let GLASS721 = await ethers.getContractFactory("Tiny721");
  let glass721 = await GLASS721.attach(GLASS_INSTANCE);
  let numberOfTokens = 10;

  let mintTx = await glass721.connect(deployer.signer).mint_Qgo(RECEIVER, numberOfTokens);
  let mintTxReceipt = await mintTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
