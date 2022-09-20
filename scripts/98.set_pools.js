const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
    const signers = await ethers.getSigners();
    const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));

    const MINTSHOP_INSTANCE = '';
    const SUBSTRATE_ADDRESS = '0xFb6c7CC444366655fb57301A6AFcA531abd2f591';
    const DRONE_A_ADDRESS = '0xA87611B03963e0e137D8DCb18B2CcF82Aaff7104';
    const DRONE_B_ADDRESS = '0x30497f7bb16b128ACEe78c351A8eBC3865541958';
    const DRONE_UPGRADE_ADDRESS = '';
    const ENGINE_A_ADDRESS = '';
    const ENGINE_B_ADDRESS = '';
    const ENGINE_C_ADDRESS = '';
    const ENGINE_D_ADDRESS = '';
    const WEAPON_A_ADDRESS = '';
    const WEAPON_B_ADDRESS = '';
    const BODY_RED_ADDRESS = '';
    const BODY_GREEN_ADDRESS = '';
    const BODY_BLUE_ADDRESS = '';
    const BODY_YELLOW_ADDRESS = '';
    const BODY_PURPLE_ADDRESS = '';
    const BODY_CYAN_ADDRESS = '';

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
        [
            ethers.utils.parseEther(".0003"),
            200,
            0,
            DRONE_UPGRADE_ADDRESS
        ],

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
