'use strict';

// Imports.

const { ethers } = require('hardhat');
const { expect } = require('chai');
const { should } = require('chai').should();
const fs = require('fs');

/**
  Describe the contract testing suite, retrieve testing wallets, and create
  contract factories from the artifacts we are testing.
*/
describe('SVG General', function() {
    let alice, bob, carol, dev;
    let Composite721, MockERC721Receiver;
    before(async () => {
        const signers = await ethers.getSigners();
        const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));
        alice = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };
        bob = { provider: signers[1].provider, signer: signers[1], address: addresses[1] };
        carol = { provider: signers[2].provider, signer: signers[2], address: addresses[2] };
        dev = { provider: signers[3].provider, signer: signers[3], address: addresses[3] };

        Composite721 = await ethers.getContractFactory('Composite721');
    });

    // Deploy a fresh set of smart contracts, using these constants, for testing.

    let substrate721, composite721_1, composite721_2;
    beforeEach(async () => {
  
        // Deploy an instance of the Composite721 ERC-721 item contract.
        substrate721 = await Composite721.connect(alice.signer).deploy(
            "Substrate",
            "SUBSTR",
            555,
            [
                0,
                0,
                0,
                1000,
                1000
            ],
            ethers.constants.AddressZero
        );
        await substrate721.deployed();

        composite721_1 = await Composite721.connect(alice.signer).deploy(
            "C1",
            "C1",
            100,
            [
                250,
                250,
                1,
                500,
                500
            ],
            substrate721.address
        );
        await composite721_1.deployed();

        composite721_2 = await Composite721.connect(alice.signer).deploy(
            "C2",
            "C2",
            200,
            [
                250,
                250,
                2,
                100,
                100
            ],
            substrate721.address
        );
        await composite721_2.deployed();

        await substrate721.mint(bob.address, 1);

        await composite721_1.mint(bob.address, 1);

        await composite721_2.mint(bob.address, 1);
  
    });

    describe('reversion', async function() {

        it('generates SVG from composite', async function() {
            const svgDataBlue = '<svg width="400" height="110"><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /></svg>';
            const svgDataRed = '<svg width="400" height="110" x="200" y="200"><rect width="300" height="100" style="fill:rgb(255,0,0);stroke-width:3;stroke:rgb(0,255,0)" /></svg>';

            await composite721_1.connect(alice.signer).setComponent(svgDataBlue);
            await composite721_1.connect(alice.signer).toggleComponent(true);

            await substrate721.connect(alice.signer).updateGlobalLayer(
                1, 
                [
                    composite721_1.address,
                    1
                ]
            );

            await composite721_2.connect(alice.signer).setComponent(svgDataRed);
            await composite721_2.connect(alice.signer).toggleComponent(true);

            await substrate721.connect(alice.signer).updateGlobalLayer(
                2, 
                [
                    composite721_2.address,
                    1
                ]
            );

            // await substrate721.connect(bob.signer).addLayer(
            //     1, 
            //     [
            //         composite721_2.address,
            //         1
            //     ]
            // );

            const metadata = await substrate721.connect(bob.signer).tokenURI(1);
            const trimmedMeta = metadata.substring(29);
            const decodedMetadata = Buffer.from(trimmedMeta, 'base64');
            const stringMetadata = decodedMetadata.toString('ascii');

            //console.log("meta", metadata, stringMetadata);

            const parsedMeta = JSON.parse(stringMetadata);
            const imageData = parsedMeta.image.substring(26);
            const decodedImage = Buffer.from(imageData, 'base64');
            const imageString = decodedImage.toString('ascii');

            //console.log("decodedImage", imageString);

            fs.writeFileSync('test/token.svg', imageString);
        });
    });
});
