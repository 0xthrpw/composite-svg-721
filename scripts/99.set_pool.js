const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
    const signers = await ethers.getSigners();
    const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

    const MINTSHOP_INSTANCE = '';
    const ITEM_ADDRESS = '';
    const PRICE = ethers.utils.parseEther(".01");
    const CAP = 555;
    const SELLCOUNT = 0;
    const POOL_ID = null;

    const POOL_DATA = [
        PRICE,
        CAP,
        SELLCOUNT,
        ITEM_ADDRESS
    ];

    const deployer = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };
    console.log(`Connecting to: ${MINTSHOP_INSTANCE}`);

    let MultiMintShop721 = await ethers.getContractFactory("MultiMintShop721");
    let multiMintShop721 = await MultiMintShop721.attach(MINTSHOP_INSTANCE);
    
    let currentIndex;

    if(POOL_ID){
        currentIndex = POOL_ID;
    }else{
        currentIndex = await multiMintShop721.connect(deployer.signer).poolCount();
    }

    let setPoolTx = await multiMintShop721.connect(deployer.signer).setPool(
        currentIndex,
        POOL_DATA
    );  
    
    console.log('');
    console.log(`* Pool data set successfully`);
    totalGasCost = totalGasCost.add(
      await logTransactionGas(setPoolTx)
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
