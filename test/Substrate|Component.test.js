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
describe('Composite721', function() {
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

    // Confirm that ownership is correctly tracked.
    describe('ownerOf', async function() {
        it('mint substrate', async function() {

            let ownerSubstrate = await substrate721.ownerOf(1);
            let ownerComponent = await composite721_1.ownerOf(1);

            //console.log("owners", ownerSubstrate, ownerComponent);
            //console.log("contracts", substrate721.address, composite721_1.address);

            await substrate721.connect(bob.signer).addLayer(
                1, 
                [
                    composite721_1.address,
                    1
                ]
            );

            await substrate721.connect(bob.signer).rmLayer(
                1,
                1  
            );

            await substrate721.connect(bob.signer).addLayer(
                1, 
                [
                    composite721_1.address,
                    1
                ]
            );
        });

        it('reverts when adding assigned layer', async function() {


            await substrate721.connect(bob.signer).addLayer(
                1, 
                [
                    composite721_1.address,
                    1
                ]
            );

            await expect(
                substrate721.connect(bob.signer).addLayer(
                    1, 
                    [
                        composite721_1.address,
                        1
                    ]
                )
            ).to.be.revertedWith('LayerInUse');

        });

        it('Components: reverts when adding assigned layer', async function() {
            const svgData = '<svg width="400" height="110"><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /></svg>';

            await expect(
                composite721_1.connect(bob.signer).setComponent(svgData)
            ).to.be.revertedWith('Ownable: caller is not the owner');

            await composite721_1.connect(alice.signer).setComponent(svgData);
            await composite721_1.connect(alice.signer).toggleComponent(true);

            // await expect(
            //     composite721_1.connect(bob.signer).addLayer(
            //         1, 
            //         [
            //             composite721_1.address,
            //             1
            //         ]
            //     )
            // ).to.be.revertedWith('RecursiveLayer');

            await substrate721.connect(bob.signer).addLayer(
                1, 
                [
                    composite721_1.address,
                    1
                ]
            );

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

            //fs.writeFileSync('test/token.svg', imageString);



            // await substrate721.connect(bob.signer).addLayer(
            //     1, 
            //     [
            //         composite721_1.address,
            //         1
            //     ]
            // );


        });
    
        // Because the zero address is a valid owner, we would like `ownerOf` to
        // revert on invalid tokens.

        // it('reverts for an invalid token', async function() {
        //     await expect(
        //     tiny721.connect(alice.signer).ownerOf(0)
        //     ).to.be.revertedWith('OwnerQueryForNonexistentToken');
        //     await expect(
        //     tiny721.connect(alice.signer).ownerOf(7)
        //     ).to.be.revertedWith('OwnerQueryForNonexistentToken');
        // });
    });
});
