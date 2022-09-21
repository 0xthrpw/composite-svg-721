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

    const MINTSHOP_INSTANCE = '0x207E032d9A0D403036080FC3E15d8D0b6a6AE2ED';
    const SUBSTRATE_ADDRESS = '0xFb6c7CC444366655fb57301A6AFcA531abd2f591';
    const DRONE_A_ADDRESS = '0xA87611B03963e0e137D8DCb18B2CcF82Aaff7104';
    const DRONE_B_ADDRESS = '0x30497f7bb16b128ACEe78c351A8eBC3865541958';
    const DRONE_UPGRADE_ADDRESS = '';
    const ENGINE_A_ADDRESS = '0xCD46d419a9D92fD67A1E5D4b7D50D70a173dbdFA';
    const ENGINE_B_ADDRESS = '0x7fD0f09153663D87C984af921c95B9C92dCaA4fe';
    const ENGINE_C_ADDRESS = '0xb9602bD697b28745E370C00346c2516375c89367';
    const ENGINE_D_ADDRESS = '0xc8Ea805be9BA8E21FA3C0Ad72fB9f1351360b8f8';
    const WEAPON_A_ADDRESS = '0xeE22C5A689cFa34D5BfB0A21d1aBD42c4CdC7391';
    const WEAPON_B_ADDRESS = '0x7DF91b90f38CFbb481eE7693C168834bEfF1e808';
    const BODY_RED_ADDRESS = '0xC05E8e5eEcc478c772579A373DB69cA536Ca15a4';
    const BODY_GREEN_ADDRESS = '0x4C5abb9e0c1da2A7cDb6eb44354251C54363c790';
    const BODY_BLUE_ADDRESS = '0x57eB72D124fC6f3fa56EB23fC539F55E1c23a5F1';
    const BODY_YELLOW_ADDRESS = '0xb9D4AabcB73A863E7F4b6efE866Ce1729fbB6466';
    const BODY_PURPLE_ADDRESS = '0x2caF0a780e26969F1210209610ceD3a26798C0e4';
    const BODY_CYAN_ADDRESS = '0x3d3B94b8e4bebc2814dec6e9C449E8132b0E218a';

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
