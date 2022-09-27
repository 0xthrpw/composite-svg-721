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

    const MINTSHOP_INSTANCE = '0x045a0963cebCE41ADA93A6C9DF1a49B5Cf97e3F3';
    
    const SUBSTRATE_ADDRESS = '0xA9Da70d82668E503E7dEc5c3F8EbAa068F4B2143';

    const DRONE_A_ADDRESS = '0x1385878782B0263E4A126deFAE72b3E204Ae7954';
    const DRONE_B_ADDRESS = '0x936069c48aBF53BE0E82Bf3cD1f42cc158e92C7F';
    const DRONE_UPGRADE_ADDRESS = '';

    const ENGINE_A_ADDRESS = '0x15C0D4691311bB9C8Bdc316fa5C048B60cC3cf72';
    const ENGINE_B_ADDRESS = '0x78B6799b1F486CFb233036234e1427eF99924367';
    const ENGINE_C_ADDRESS = '0xE473EEc1d346D00e2810c64B76927A8E33F59CaA';
    const ENGINE_D_ADDRESS = '0xb38Ad84533D75C994aCD9020E618443E78d088ae';

    const WEAPON_A_ADDRESS = '0x02Ee1d7b68239124Fbc542d8B42d8f0c08Ca4A50';
    const WEAPON_B_ADDRESS = '0x7ac2D0C383eff8cC30B5ec01f62A8A9181387392';

    const BODY_RED_ADDRESS = '0xb63761f6FaB8dc8B867Ae05Aa3bEe9C3711f9aaA';
    const BODY_GREEN_ADDRESS = '0xEDF9883Dc7e0c8f170bb1793727Ce5D82e03e300';
    const BODY_BLUE_ADDRESS = '0xEA6458D6Ee28C59bE02B65B0FafB054dE391C497';
    const BODY_YELLOW_ADDRESS = '0x8591bF4E504602ADdaD613d851930A89cb4dD78a';
    const BODY_PURPLE_ADDRESS = '0x5C9C5dD4F4Ef882F7f21FB91F6eBaC6014a0198b';
    const BODY_CYAN_ADDRESS = '0x87E9B0bA043B90037D73E0eB67cFa2Fd29C9935b';

    const POOL_DATA = [
        [
            ethers.utils.parseEther(".01"), //price
            555,                            //cap
            0,                              //sellcount
            SUBSTRATE_ADDRESS               //collectionAddress
        ],
        [
            ethers.utils.parseEther(".0004"),
            100,
            0,
            DRONE_A_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0004"),
            100,
            0,
            DRONE_B_ADDRESS
        ],
        // [
        //     ethers.utils.parseEther(".0003"),
        //     200,
        //     0,
        //     DRONE_UPGRADE_ADDRESS
        // ],

        [
            ethers.utils.parseEther(".0002"),
            200,
            0,
            ENGINE_A_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0002"),
            200,
            0,
            ENGINE_B_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0004"),
            200,
            0,
            ENGINE_C_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0005"),
            50,
            0,
            ENGINE_D_ADDRESS
        ],

        [
            ethers.utils.parseEther(".0004"),
            300,
            0,
            WEAPON_A_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0006"),
            300,
            0,
            WEAPON_B_ADDRESS
        ],

        [
            ethers.utils.parseEther(".0008"),
            300,
            0,
            BODY_RED_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0008"),
            300,
            0,
            BODY_GREEN_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0008"),
            300,
            0,
            BODY_BLUE_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0008"),
            300,
            0,
            BODY_PURPLE_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0008"),
            300,
            0,
            BODY_YELLOW_ADDRESS
        ],
        [
            ethers.utils.parseEther(".0008"),
            300,
            0,
            BODY_CYAN_ADDRESS
        ]
    ];

    let totalGasCost = ethers.utils.parseEther('0');

    const deployer = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };
    console.log(`Connecting to: ${MINTSHOP_INSTANCE}`);

    let MultiMintShop721 = await ethers.getContractFactory("MultiMintShop721");
    let multiMintShop721 = await MultiMintShop721.attach(MINTSHOP_INSTANCE);

    let setPoolTx = await multiMintShop721.connect(deployer.signer).setPools(POOL_DATA);  
    
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
