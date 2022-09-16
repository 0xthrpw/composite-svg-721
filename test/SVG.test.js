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

    let substrate721, composite721_1, composite721_2, composite721_3, composite721_4, composite721_5;
    beforeEach(async () => {
  
        // Deploy an instance of the Composite721 ERC-721 item contract.
        substrate721 = await Composite721.connect(alice.signer).deploy(
            "Substrate",
            "SUBSTR",
            555,
            ethers.constants.AddressZero
        );
        await substrate721.deployed();

        composite721_1 = await Composite721.connect(alice.signer).deploy(
            "C1",
            "C1",
            100,
            substrate721.address
        );
        await composite721_1.deployed();

        composite721_2 = await Composite721.connect(alice.signer).deploy(
            "C2",
            "C2",
            200,
            substrate721.address
        );
                
        await composite721_2.deployed();

        composite721_3 = await Composite721.connect(alice.signer).deploy(
            "C3",
            "C3",
            300,
            substrate721.address
        );
        await composite721_3.deployed();

        composite721_4 = await Composite721.connect(alice.signer).deploy(
            "C4",
            "C4",
            300,
            substrate721.address
        );
        await composite721_4.deployed();

        composite721_5 = await Composite721.connect(alice.signer).deploy(
            "C5",
            "C45",
            300,
            substrate721.address
        );
        await composite721_5.deployed();

        await substrate721.mint(bob.address, 1);
        await composite721_1.mint(bob.address, 1);
        await composite721_2.mint(bob.address, 1);
        await composite721_3.mint(bob.address, 1);
        await composite721_4.mint(bob.address, 1);
        await composite721_5.mint(bob.address, 1);

  
    });

    describe('reversion', async function() {

        it('generates SVG from composite', async function() {




            const svgGrid = `
                <svg width="1000" height="1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="1000" height="1000" x="0" y="0" style="fill:rgb(0,0,0);"/>
                    <rect width="4" height="800" x="100" y="100" style="fill:rgb(255,255,255);"/>
                    <rect width="4" height="800" x="200" y="100" style="fill:rgb(255,255,255);"/>
                    <rect width="4" height="800" x="300" y="100" style="fill:rgb(255,255,255);"/>
                    <rect width="4" height="800" x="400" y="100" style="fill:rgb(255,255,255);"/>
                    <rect width="4" height="800" x="500" y="100" style="fill:rgb(255,255,255);"/>
                    <rect width="4" height="800" x="600" y="100" style="fill:rgb(255,255,255);"/>
                    <rect width="4" height="800" x="700" y="100" style="fill:rgb(255,255,255);"/>
                    <rect width="4" height="800" x="800" y="100" style="fill:rgb(255,255,255);"/>
                    <rect width="4" height="800" x="900" y="100" style="fill:rgb(255,255,255);"/>

                    <rect width="800" height="4" x="100" y="100" style="fill:rgb(255,255,255);"/>
                    <rect width="800" height="4" x="100" y="200" style="fill:rgb(255,255,255);"/>
                    <rect width="800" height="4" x="100" y="300" style="fill:rgb(255,255,255);"/>
                    <rect width="800" height="4" x="100" y="400" style="fill:rgb(255,255,255);"/>
                    <rect width="800" height="4" x="100" y="500" style="fill:rgb(255,255,255);"/>
                    <rect width="800" height="4" x="100" y="600" style="fill:rgb(255,255,255);"/>
                    <rect width="800" height="4" x="100" y="700" style="fill:rgb(255,255,255);"/>
                    <rect width="800" height="4" x="100" y="800" style="fill:rgb(255,255,255);"/>
                    <rect width="800" height="4" x="100" y="900" style="fill:rgb(255,255,255);"/>
                `;

            await composite721_1.connect(alice.signer).setComponent(svgGrid);
            await composite721_1.connect(alice.signer).toggleComponent(true);

            await substrate721.connect(alice.signer).updateGlobalLayer(
                1, 
                [
                    composite721_1.address,
                    1
                ]
            );


            const svgDataRed = '<svg><rect width="96" height="96" x="104" y="104" style="fill:rgb(255,0,0);stroke-width:3;stroke:rgb(0,255,0)" /></svg>';

            await composite721_2.connect(alice.signer).setComponent(svgDataRed);
            await composite721_2.connect(alice.signer).toggleComponent(true);

            await substrate721.connect(bob.signer).addLayer(
                1, 
                [
                    composite721_2.address,
                    1
                ]
            );



            //const sdata = await substrate721.svgData(1);
            //console.log("sdata", sdata)

            const svgDataGreen = '<svg><rect width="96" height="96" x="204" y="204" style="fill:rgb(0,255,0);stroke-width:3;stroke:rgb(0,0,0)" /></svg>';

            await composite721_3.connect(alice.signer).setComponent(svgDataGreen);
            await composite721_3.connect(alice.signer).toggleComponent(true);
            await composite721_3.connect(alice.signer).updateSubstrate(composite721_5.address, true);

            await composite721_5.connect(bob.signer).addLayer(
                1, 
                [
                    composite721_3.address,
                    1
                ]
            );
            
            
            //await composite721_4.mint(bob.address, 1);
            const svgDataBlue = '<svg><rect width="96" height="96" x="304" y="304" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(255,0,0)" /></svg>';

            await composite721_4.connect(alice.signer).setComponent(svgDataBlue);
            await composite721_4.connect(alice.signer).toggleComponent(true);
            await composite721_4.connect(alice.signer).updateSubstrate(composite721_5.address, true);
            await composite721_5.connect(bob.signer).addLayer(
                1, 
                [
                    composite721_4.address,
                    1
                ]
            );

            //await composite721_5.connect(alice.signer).updateSubstrate(substrate721.address, true);
            
            await substrate721.connect(bob.signer).addLayer(
                1, 
                [
                    composite721_5.address,
                    1
                ]
            );
            

            const globalLayerCount = await substrate721.globalLayerCount();
            //console.log("globalLayerCount", globalLayerCount);

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

            fs.writeFileSync('test/svgflight.svg', imageString);
        });
    });
});
