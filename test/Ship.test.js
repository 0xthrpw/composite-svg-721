'use strict';

// Imports.

const { ethers } = require('hardhat');
const { expect } = require('chai');
const { should } = require('chai').should();
const fs = require('fs');

const generateImage = async function( metadata, filename ) {
    const trimmedMeta = metadata.substring(29);
    const decodedMetadata = Buffer.from(trimmedMeta, 'base64');
    const stringMetadata = decodedMetadata.toString('ascii');

    //console.log("meta", metadata, stringMetadata);

    const parsedMeta = JSON.parse(stringMetadata);
    const imageData = parsedMeta.image.substring(26);
    const decodedImage = Buffer.from(imageData, 'base64');
    const imageString = decodedImage.toString('ascii');

    //console.log("decodedImage", imageString);

    fs.writeFileSync(`test/${filename}.svg`, imageString);
}

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
            ethers.constants.AddressZero,
            [1000,1000,0,0]
        );
        await substrate721.deployed();

        composite721_1 = await Composite721.connect(alice.signer).deploy(
            "Drone721",
            "DRONE721",
            100,
            substrate721.address,
            [300,200,600,100]
        );
        await composite721_1.deployed();

        composite721_2 = await Composite721.connect(alice.signer).deploy(
            "Motor721",
            "MOTOR721",
            200,
            substrate721.address,
            [200,200,50,400]
        );
                
        await composite721_2.deployed();

        composite721_3 = await Composite721.connect(alice.signer).deploy(
            "WeaponA721",
            "WEAPONA721",
            300,
            substrate721.address,
            [500,100,200,700]
        );
        await composite721_3.deployed();

        composite721_4 = await Composite721.connect(alice.signer).deploy(
            "WeaponB721",
            "WEAPONB721",
            300,
            substrate721.address,
            [500,100,200,700]
        );
        await composite721_4.deployed();

        composite721_5 = await Composite721.connect(alice.signer).deploy(
            "C5",
            "C45",
            300,
            substrate721.address,
            [100,100,0,0]
        );
        await composite721_5.deployed();

        await substrate721.mint(bob.address, 2);
        await composite721_1.mint(bob.address, 2);
        await composite721_2.mint(bob.address, 1);
        await composite721_3.mint(bob.address, 1);
        await composite721_4.mint(bob.address, 1);
        await composite721_5.mint(bob.address, 1);

  
    });

    describe('reversion', async function() {

        it('generates SVG from composite', async function() {

            const svgGrid = `
    <rect fill="rgb(0,0,0)" width="1000" height="1000" x="0" y="0" />
    <rect fill="rgb(204,204,204)" width="625" height="62" x="248" y="540" />
    <rect fill="rgb(236,236,236)" width="385" height="104" x="248" y="436" />
    <rect fill="rgb(0,255,255)" width="156" height="98" x="635" y="440" />
    <rect fill="rgb(236,236,236)" width="94" height="83" x="290" y="290" />
    <rect fill="rgb(204,204,204)" width="260" height="62" x="268" y="373" />
    <rect fill="rgb(204,204,204)" width="385" height="52" x="299" y="602" />
    <rect fill="rgb(179,179,179)" width="160" height="52" x="299" y="654" />
    <rect fill="rgb(102,102,102)" width="240" height="20" x="299" y="706" />
    <rect fill="rgb(102,102,102)" width="62" height="125" x="247" y="602" />
    <rect fill="rgb(102,102,102)" width="27" height="104" x="219" y="477" />`;

            await substrate721.connect(alice.signer).setBaseLayer(svgGrid);
            // await composite721_1.connect(alice.signer).toggleComponent(true);

            // await substrate721.connect(alice.signer).updateGlobalLayer(
            //     1, 
            //     [
            //         composite721_1.address,
            //         1
            //     ]
            // );


            const drone_A = `
            
        <rect fill="rgb(236,236,236)" width="134" height="134" x="113" y="33" />
        <rect fill="rgb(179,179,179)" width="25" height="100" x="95" y="49" />
        <rect fill="rgb(0,255,255)" width="33" height="100" x="246" y="49" />
        <rect fill="rgb(77,77,77)" width="50" height="83" x="45" y="58" />
        <rect fill="rgb(0,255,255)" width="25" height="66" x="20" y="66" />
        `;

            // const svgDataRed = '<svg><rect width="96" height="96" x="104" y="104" style="fill:rgb(255,0,0);stroke-width:3;stroke:rgb(0,255,0)" /></svg>';

            await composite721_1.connect(alice.signer).setBaseLayer(drone_A);
            await composite721_1.connect(alice.signer).toggleComponent(true);

            await substrate721.connect(bob.signer).setLayer(
                1,
                0, 
                [
                    composite721_1.address,
                    1
                ]
            );

            // const drone_B = `
            
            // <rect fill="rgb(255,255,0)" width="134" height="134" x="113" y="33" />
            // <rect fill="rgb(179,179,179)" width="25" height="100" x="95" y="49" />
            // <rect fill="rgb(255,255,255)" width="33" height="100" x="246" y="49" />
            // <rect fill="rgb(77,77,77)" width="50" height="83" x="45" y="58" />
            // <rect fill="rgb(0,255,255)" width="25" height="66" x="20" y="66" />
            // `;

            const motor_A = `
    <rect fill="rgb(102,102,102)" width="35" height="183" x="145" y="6" />
    <rect fill="rgb(179,179,179)" width="18" height="73" x="126" y="18" />
    <rect fill="rgb(128,128,128)" width="36" height="61" x="89" y="24" />
    <rect fill="rgb(0,255,255)" width="45" height="49" x="44" y="30" />
    <rect fill="rgb(0,255,255)" width="23" height="47" x="9" y="30" />
    <rect fill="rgb(0,255,255)" width="23" height="47" x="9" y="1071" />
    <rect fill="rgb(179,179,179)" width="18" height="73" x="126" y="93" />
    <rect fill="rgb(128,128,128)" width="36" height="61" x="89" y="100" />
    <rect fill="rgb(0,255,255)" width="45" height="49" x="44" y="106" />
       `;
    
                // const svgDataRed = '<svg><rect width="96" height="96" x="104" y="104" style="fill:rgb(255,0,0);stroke-width:3;stroke:rgb(0,255,0)" /></svg>';
    
                await composite721_2.connect(alice.signer).setBaseLayer(motor_A);
                await composite721_2.connect(alice.signer).toggleComponent(true);
    
                await substrate721.connect(bob.signer).setLayer(
                    1, 
                    1,
                    [
                        composite721_2.address,
                        1
                    ]
                );

            //const sdata = await substrate721.svgData(1);
            //console.log("sdata", sdata)

            // const svgDataGreen = '<svg><rect width="96" height="96" x="204" y="204" style="fill:rgb(0,255,0);stroke-width:3;stroke:rgb(0,0,0)" /></svg>';

            const weapon_A = `
    <rect fill="rgb(102,102,102)" width="350" height="45" x="40" y="25" />
    <rect fill="rgb(179,179,179)" width="280" height="25" x="50" y="35" />
    <rect fill="rgb(0,255,255)" width="40" height="25" x="340" y="35" />
    <rect fill="rgb(0,255,255)" width="85" height="25" x="400" y="35" />
    <rect fill="rgb(0,255,255)" width="15" height="45" x="25" y="25" />
            `;

            await composite721_3.connect(alice.signer).setBaseLayer(weapon_A);
            await composite721_3.connect(alice.signer).toggleComponent(true);
            // await composite721_3.connect(alice.signer).updateSubstrate(composite721_5.address, true);

            await substrate721.connect(bob.signer).setLayer(
                1,
                2, 
                [
                    composite721_3.address,
                    1
                ]
            );
            
            const weapon_B = `
            <rect fill="rgb(255,255,255)" width="350" height="45" x="40" y="5" />
            <rect fill="rgb(179,179,179)" width="280" height="25" x="50" y="15" />
            <rect fill="rgb(255,255,0)" width="40" height="25" x="340" y="15" />
            <rect fill="rgb(255,255,0)" width="85" height="15" x="400" y="15" />
            <rect fill="rgb(255,255,0)" width="15" height="45" x="25" y="5" />
            <rect fill="rgb(255,255,255)" width="350" height="45" x="40" y="55" />
            <rect fill="rgb(179,179,179)" width="280" height="25" x="50" y="65" />
            <rect fill="rgb(255,255,0)" width="40" height="25" x="340" y="65" />
            <rect fill="rgb(255,255,0)" width="85" height="15" x="400" y="75" />
            <rect fill="rgb(255,255,0)" width="15" height="45" x="25" y="55" />
            `;

            await composite721_4.connect(alice.signer).setBaseLayer(weapon_B);
            await composite721_4.connect(alice.signer).toggleComponent(true);
            // await composite721_3.connect(alice.signer).updateSubstrate(composite721_5.address, true);

            await substrate721.connect(bob.signer).setLayer(
                1, 
                3,
                [
                    composite721_4.address,
                    1
                ]
            );
        
            // const svgDataBlue = '<svg><rect width="96" height="96" x="304" y="304" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(255,0,0)" /></svg>';

            // await composite721_4.connect(alice.signer).setBaseLayer(svgDataBlue);
            // await composite721_4.connect(alice.signer).toggleComponent(true);
            // await composite721_4.connect(alice.signer).updateSubstrate(composite721_5.address, true);
            await substrate721.connect(bob.signer).setLayer(
                2, 
                0,
                [
                    composite721_1.address,
                    2
                ]
            );

        
            // await substrate721.connect(bob.signer).addLayer(
            //     1, 
            //     [
            //         composite721_5.address,
            //         1
            //     ]
            // );
            

            const globalLayerCount = await substrate721.globalLayerCount();
            //console.log("globalLayerCount", globalLayerCount);

            let metadata = await substrate721.connect(bob.signer).tokenURI(1);
            await generateImage(metadata, "ship");

            metadata = await substrate721.connect(bob.signer).tokenURI(2);
            await generateImage(metadata, "ship2");

            metadata = await composite721_1.connect(bob.signer).tokenURI(1);
            await generateImage(metadata, "c1");

            metadata = await composite721_1.connect(bob.signer).tokenURI(2);
            await generateImage(metadata, "c2");

        });
    });
});
