const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const signers = await ethers.getSigners();
  const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

  const SUBSTRATE_INSTANCE = '0xA9Da70d82668E503E7dEc5c3F8EbAa068F4B2143';
  const COMPONENT_INSTANCE = '';

  const deployer = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };
  console.log(`Connecting to: ${SUBSTRATE_INSTANCE}`);

  let Composite721 = await ethers.getContractFactory("Composite721");
  let composite721 = await Composite721.attach(SUBSTRATE_INSTANCE);

  // let layer = {
  //   item: COMPONENT_INSTANCE,
  //   id: 1
  // }

  // await composite721.addLayer(1, layer);

  const svgGrid = `
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
  // totalGasCost = totalGasCost.add(
  //   await logTransactionGas(setBaseLayerTx)
  // );

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
