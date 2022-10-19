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
        // '0x73342Eba6bF8013EE5d5EBFA44223d93c72Dc0a1', //sub
        // '0x58a1d81fc6146CB423E4020F078643d31eAA6E6c', //drone
        // '0x724B14ceF14D12d975f847336fB623Ce0F0b4775',
        // '0xba93d60999C97754da15669cd38426Fa03FfE3Ee', //engine
        // '0x28bB701ECe0D8850689cba2B157A74fA41f77c04',
        // '0x6617D3494B4a0C82FadE8bfE53025423C00D628d', 
        '0xfD59029F34755D13CB3Ae9D568525221C9c87165',
        '0xBd0e344ECCF11EC3d835ad10aeD73F0BF5e604e1', //weapon
        '0xB79d34e990600AdcA5d8cE7ebeae3C6E36AA1a81',
        '0x81202ad29C317CD586Eb81B15E77FF47197FE517', //paint
        '0xf3aA14A78e3F23798B5858dc172aF24E257F64bC',
        '0x14a466E1AFC635D50b46D3D8D11aE82AC2CF83Fe',
        '0x067472a4A7a22aCa9bF3E26623f81FB4FcC7D0bC',
        '0x8417ff653d62be8fd846CC7Cd11C9666F283e459',
        '0x38c9eE7e0d824A7FcB5CDE850466Bd248F4faa28'
    ]

    let totalGasCost = ethers.utils.parseEther('0');

    const signers = await ethers.getSigners();
    const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

    const MULTIMINTSHOP_ADDRESS = '0x166bd36c6A103F471d1C7b3e63e77004f542900a';

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
