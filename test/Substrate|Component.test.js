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
            ethers.constants.AddressZero,
            [1000,1000,0,0],
            '{ "trait_type": "Trait", "value": "Dummy" }',
            "description"
        );
        await substrate721.deployed();

        composite721_1 = await Composite721.connect(alice.signer).deploy(
            "C1",
            "C1",
            100,
            substrate721.address,
            [100,100,0,0],
            '{ "trait_type": "Trait", "value": "Dummy" }',
            "description"
        );
        await composite721_1.deployed();

        composite721_2 = await Composite721.connect(alice.signer).deploy(
            "C2",
            "C2",
            200,
            substrate721.address,
            [100,100,0,0],
            '{ "trait_type": "Trait", "value": "Dummy" }',
            "description"
        );
        await composite721_2.deployed();

        await substrate721.mint(bob.address, 1);

        await composite721_1.mint(bob.address, 1);

        await composite721_2.mint(bob.address, 1);
  
    });

    describe('reversion', async function() {
        it('mint substrate', async function() {

            // let ownerSubstrate = await substrate721.ownerOf(1);
            // let ownerComponent = await composite721_1.ownerOf(1);

            //console.log("owners", ownerSubstrate, ownerComponent);
            //console.log("contracts", substrate721.address, composite721_1.address);

            await substrate721.connect(bob.signer).setLayer(
                1,
                0, 
                [
                    composite721_1.address,
                    1
                ]
            );

            await substrate721.connect(bob.signer).rmLayer(
                1,
                0  
            );

            await substrate721.connect(bob.signer).setLayer(
                1,
                0, 
                [
                    composite721_1.address,
                    1
                ]
            );
        });

        it('generates SVG from composite', async function() {
            const svgDataBlue = '<svg width="400" height="110"><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /></svg>';
            const svgDataRed = '<svg width="400" height="110" x="200" y="200"><rect width="300" height="100" style="fill:rgb(255,0,0);stroke-width:3;stroke:rgb(0,255,0)" /></svg>';

            await composite721_1.connect(alice.signer).setBaseLayer(svgDataBlue);
            await composite721_1.connect(alice.signer).toggleComponent(true);

            await composite721_2.connect(alice.signer).setBaseLayer(svgDataRed);
            await composite721_2.connect(alice.signer).toggleComponent(true);

            await substrate721.connect(bob.signer).setLayer(
                1,
                0, 
                [
                    composite721_1.address,
                    1
                ]
            );

            await substrate721.connect(bob.signer).setLayer(
                1,
                1, 
                [
                    composite721_2.address,
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

            fs.writeFileSync('art/token.svg', imageString);
        });

        it('reverts for an recursive layer assignment', async function() {
            await expect(
                composite721_1.connect(bob.signer).setLayer(
                    1,
                    0, 
                    [
                        composite721_1.address,
                        1
                    ]
                )
            ).to.be.revertedWith('RecursiveLayer');
        });

        it('reverts on non-owner setting component', async function() {
            const svgData = '<svg width="400" height="110"><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /></svg>';
            await expect(
                composite721_1.connect(bob.signer).setBaseLayer(svgData)
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('reverts when adding assigned layer', async function() {
            await substrate721.connect(bob.signer).setLayer(
                1,
                0, 
                [
                    composite721_1.address,
                    1
                ]
            );

            await expect(
                substrate721.connect(bob.signer).setLayer(
                    1,
                    0, 
                    [
                        composite721_1.address,
                        1
                    ]
                )
            ).to.be.revertedWith('LayerInUse');
        });

        it('reverts on adding layer if caller is not layer owner', async function() {
            await composite721_1.connect(bob.signer).transferFrom(
                bob.address,
                carol.address,
                1
            );

            await expect(
                substrate721.connect(bob.signer).setLayer(
                    1,
                    0, 
                    [
                        composite721_1.address,
                        1
                    ]
                )
            ).to.be.revertedWith('LayerOwnerNotSender');
        });

        it('reverts for modifying layer to component', async function() {
            const svgDataBlue = '<svg width="400" height="110"><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /></svg>';
            
            await substrate721.connect(alice.signer).setBaseLayer(svgDataBlue);
            await substrate721.connect(alice.signer).toggleComponent(true);

            await expect(
                substrate721.connect(bob.signer).setLayer(
                    1,
                    0, 
                    [
                        composite721_1.address,
                        1
                    ]
                )
            ).to.be.revertedWith('NoLayersInComponent');

            await expect(
                substrate721.connect(bob.signer).rmLayer(
                    1, 
                    1
                )
            ).to.be.revertedWith('NoLayersInComponent');
        });

        it('reverts removing a layer that is not set', async function() {
            await expect(
                substrate721.connect(bob.signer).rmLayer(
                    1, 
                    1
                )
            ).to.be.revertedWith('ItemNotAssigned');
        });

        it('reverts removing a layer that is not owned by msg.sender', async function() {
            await substrate721.connect(bob.signer).setLayer(
                1,
                0, 
                [
                    composite721_1.address,
                    1
                ]
            );

            await composite721_1.connect(bob.signer).transferFrom(
                bob.address,
                carol.address,
                1
            );

            await expect(
                substrate721.connect(bob.signer).rmLayer(
                    1, 
                    0
                )
            ).to.be.revertedWith('LayerOwnerNotSender');
        });

        it('reverts when modifying layers if not token owner', async function() {
            await substrate721.connect(bob.signer).setLayer(
                1,
                0, 
                [
                    composite721_1.address,
                    1
                ]
            );

            await expect(
                substrate721.connect(carol.signer).rmLayer(
                    1, 
                    1
                )
            ).to.be.revertedWith('NotAnAdmin');

            await expect(
                substrate721.connect(carol.signer).setLayer(
                    1,
                    0, 
                    [
                        composite721_1.address,
                        1
                    ]
                )
            ).to.be.revertedWith('NotAnAdmin');
        });

        it('reverts for invalid substrate', async function() {
            await composite721_1.connect(alice.signer).updateSubstrate(substrate721.address, false);

            await expect(
                substrate721.connect(bob.signer).setLayer(
                    1,
                    0, 
                    [
                        composite721_1.address,
                        1
                    ]
                )
            ).to.be.revertedWith('NotAnAdmin');
        });

        it('self referential layers', async function() {
            await substrate721.mint(bob.address, 1);
  
            await substrate721.connect(bob.signer).setLayer(
                1,
                0, 
                [
                    substrate721.address,
                    2
                ]
            );

            await substrate721.mint(bob.address, 1);

            const layer10 = await substrate721.layers(1,0)
            const layer11 = await substrate721.layers(1,1)
            const layer12 = await substrate721.layers(1,2)
            const layer20 = await substrate721.layers(2,0)
            const layer21 = await substrate721.layers(2,1)

            const layerCounts = await substrate721.layerCounts(1)

            
            // console.log({
            //     layerCounts: layerCounts,
            //     layer10: layer10,
            //     layer11: layer11,
            //     layer12: layer12,
            //     layer20: layer20,
            //     layer21: layer21
            // });

            await substrate721.connect(bob.signer).rmLayer(
                1, 
                0
            );

            const metadata_1 = await substrate721.connect(bob.signer).tokenURI(1);
            //const metadata_2 = await substrate721.connect(bob.signer).tokenURI(2);
   
        });

        it('reverts for invalid substrate', async function() {

            await substrate721.connect(alice.signer).updateGlobalLayer(
                1,
                [
                    composite721_1.address, 
                    1
                ]
            );
        });

        // it('reverts for an invalid token', async function() {
            
        // });
    });
});
