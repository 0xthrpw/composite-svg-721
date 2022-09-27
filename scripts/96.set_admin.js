const hre = require("hardhat");
const ethers = hre.ethers;

async function logTransactionGas(transaction) {
    let transactionReceipt = await transaction.wait();
    let transactionGasCost = transactionReceipt.gasUsed;
    console.log(` -> Gas cost: ${transactionGasCost.toString()}`);
    return transactionGasCost;
}  

async function main() {

    let items = [   
        '0xA9Da70d82668E503E7dEc5c3F8EbAa068F4B2143', //sub
        '0x1385878782B0263E4A126deFAE72b3E204Ae7954', //drone
        '0x936069c48aBF53BE0E82Bf3cD1f42cc158e92C7F',
        '0x15C0D4691311bB9C8Bdc316fa5C048B60cC3cf72', //engine
        '0x78B6799b1F486CFb233036234e1427eF99924367',
        '0xE473EEc1d346D00e2810c64B76927A8E33F59CaA', 
        '0xb38Ad84533D75C994aCD9020E618443E78d088ae',
        '0x02Ee1d7b68239124Fbc542d8B42d8f0c08Ca4A50', //weapon
        '0x7ac2D0C383eff8cC30B5ec01f62A8A9181387392',
        '0xb63761f6FaB8dc8B867Ae05Aa3bEe9C3711f9aaA', //paint
        '0xEDF9883Dc7e0c8f170bb1793727Ce5D82e03e300',
        '0xEA6458D6Ee28C59bE02B65B0FafB054dE391C497',
        '0x8591bF4E504602ADdaD613d851930A89cb4dD78a',
        '0x5C9C5dD4F4Ef882F7f21FB91F6eBaC6014a0198b',
        '0x87E9B0bA043B90037D73E0eB67cFa2Fd29C9935b'
    ]

    let totalGasCost = ethers.utils.parseEther('0');

    const signers = await ethers.getSigners();
    const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

    const MULTIMINTSHOP_ADDRESS = '0x045a0963cebCE41ADA93A6C9DF1a49B5Cf97e3F3';

    const deployer = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };


    let Composite721 = await ethers.getContractFactory("Composite721");
    let composite721;
    let setAdminTx;
    for (let i = 0; i < items.length; i++){
        console.log(`Connecting to: ${items[i]}`);
        composite721 = await Composite721.attach(items[i]);
        setAdminTx = await composite721.connect(deployer.signer).setAdmin(MULTIMINTSHOP_ADDRESS, true);
        console.log('');
        console.log(`* Admin address set successfully`);
        totalGasCost = totalGasCost.add(
        await logTransactionGas(setAdminTx)
        );
    }

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
