const hre = require("hardhat");
const ethers = hre.ethers;

async function logTransactionGas(transaction) {
    let transactionReceipt = await transaction.wait();
    let transactionGasCost = transactionReceipt.gasUsed;
    console.log(` -> Gas cost: ${transactionGasCost.toString()}`);
    return transactionGasCost;
}  

async function main() {
    const signers = await ethers.getSigners();
    const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

    const COMPOSITE721_INSTANCE = '';
    const MULTIMINTSHOP_ADDRESS = '';

    const deployer = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };
    console.log(`Connecting to: ${TOKEN_INSTANCE}`);

    let Composite721 = await ethers.getContractFactory("Composite721");
    let composite721 = await Composite721.attach(COMPOSITE721_INSTANCE);

    let setAdminTx = await composite721.connect(deployer.signer).setAdmin(MULTIMINTSHOP_ADDRESS, true);

    console.log('');
    console.log(`* Base layer set successfully`);
    totalGasCost = totalGasCost.add(
      await logTransactionGas(setAdminTx)
    );

    // Log the final gas cost of deployment.
    console.log('');
    console.log(`=> Final gas cost of deployment: ${totalGasCost.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
