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
        '0xFb6c7CC444366655fb57301A6AFcA531abd2f591',
        '0xA87611B03963e0e137D8DCb18B2CcF82Aaff7104',
        '0x30497f7bb16b128ACEe78c351A8eBC3865541958',
        '0xCD46d419a9D92fD67A1E5D4b7D50D70a173dbdFA',
        '0x7fD0f09153663D87C984af921c95B9C92dCaA4fe',
        '0xb9602bD697b28745E370C00346c2516375c89367',
        '0xc8Ea805be9BA8E21FA3C0Ad72fB9f1351360b8f8',
        '0xeE22C5A689cFa34D5BfB0A21d1aBD42c4CdC7391',
        '0x7DF91b90f38CFbb481eE7693C168834bEfF1e808',
        '0xC05E8e5eEcc478c772579A373DB69cA536Ca15a4',
        '0x4C5abb9e0c1da2A7cDb6eb44354251C54363c790',
        '0x57eB72D124fC6f3fa56EB23fC539F55E1c23a5F1',
        '0xb9D4AabcB73A863E7F4b6efE866Ce1729fbB6466',
        '0x2caF0a780e26969F1210209610ceD3a26798C0e4',
        '0x3d3B94b8e4bebc2814dec6e9C449E8132b0E218a'
    ]

    let totalGasCost = ethers.utils.parseEther('0');

    const signers = await ethers.getSigners();
    const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

    const MULTIMINTSHOP_ADDRESS = '0x207E032d9A0D403036080FC3E15d8D0b6a6AE2ED';

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
