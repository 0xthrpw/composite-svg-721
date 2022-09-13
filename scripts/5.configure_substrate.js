const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const signers = await ethers.getSigners();
  const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

  const SUBSTRATE_INSTANCE = '0x1FE2853c71006F03A6eA0a4EEeD97507C6e3A6f9';
  const COMPONENT_INSTANCE = '';

  const deployer = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };
  console.log(`Connecting to: ${TOKEN_INSTANCE}`);

  let Composite721 = await ethers.getContractFactory("Composite721");
  let composite721 = await Composite721.attach(TOKEN_INSTANCE);

  let layer = {
    item: COMPONENT_INSTANCE,
    id: 1
  }

  await composite721.addLayer(1, layer);

//   let numberOfTokens = 10;

//   let mintTx = await composite721.connect(deployer.signer).mint(RECEIVER, numberOfTokens);
//   let mintTxReceipt = await mintTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
