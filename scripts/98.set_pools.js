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

    const MINTSHOP_INSTANCE = '0x166bd36c6A103F471d1C7b3e63e77004f542900a';
    
    const SUBSTRATE_ADDRESS = '0x73342Eba6bF8013EE5d5EBFA44223d93c72Dc0a1';

    const DRONE_A_ADDRESS = '0x58a1d81fc6146CB423E4020F078643d31eAA6E6c';
    const DRONE_B_ADDRESS = '0x724B14ceF14D12d975f847336fB623Ce0F0b4775';
    const DRONE_UPGRADE_ADDRESS = '';

    const ENGINE_A_ADDRESS = '0xba93d60999C97754da15669cd38426Fa03FfE3Ee';
    const ENGINE_B_ADDRESS = '0x28bB701ECe0D8850689cba2B157A74fA41f77c04';
    const ENGINE_C_ADDRESS = '0x6617D3494B4a0C82FadE8bfE53025423C00D628d';
    const ENGINE_D_ADDRESS = '0xfD59029F34755D13CB3Ae9D568525221C9c87165';

    const WEAPON_A_ADDRESS = '0xBd0e344ECCF11EC3d835ad10aeD73F0BF5e604e1';
    const WEAPON_B_ADDRESS = '0xB79d34e990600AdcA5d8cE7ebeae3C6E36AA1a81';

    const BODY_RED_ADDRESS = '0x81202ad29C317CD586Eb81B15E77FF47197FE517';
    const BODY_GREEN_ADDRESS = '0xf3aA14A78e3F23798B5858dc172aF24E257F64bC';
    const BODY_BLUE_ADDRESS = '0x14a466E1AFC635D50b46D3D8D11aE82AC2CF83Fe';
    const BODY_YELLOW_ADDRESS = '0x067472a4A7a22aCa9bF3E26623f81FB4FcC7D0bC';
    const BODY_PURPLE_ADDRESS = '0x8417ff653d62be8fd846CC7Cd11C9666F283e459';
    const BODY_CYAN_ADDRESS = '0x38c9eE7e0d824A7FcB5CDE850466Bd248F4faa28';

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
