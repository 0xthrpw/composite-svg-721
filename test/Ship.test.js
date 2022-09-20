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

    const parsedMeta = JSON.parse(stringMetadata);
    const imageData = parsedMeta.image.substring(26);
    const decodedImage = Buffer.from(imageData, 'base64');
    const imageString = decodedImage.toString('ascii');

    fs.writeFileSync(`art/${filename}.svg`, imageString);
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

    let ship721, droneA, droneB, laserWeaponA, laserWeaponB, droneUpgrade;
    let motorA, motorB, motorC, motorD;
    let bodyRed, bodyGreen, bodyBlue, bodyYellow, bodyPurple, bodyCyan;

    beforeEach(async () => {
  
        // Deploy an instance of the Composite721 ERC-721 item contract.
        ship721 = await Composite721.connect(alice.signer).deploy(
            "Substrate",
            "SUBSTR",
            555,
            ethers.constants.AddressZero,
            [1000,1000,0,0]
        );
        await ship721.deployed();

        droneA = await Composite721.connect(alice.signer).deploy(
            "DroneA721",
            "DRONEA721",
            100,
            ship721.address,
            [300,200,600,100]
        );
        await droneA.deployed();

        droneB = await Composite721.connect(alice.signer).deploy(
            "DroneB721",
            "DRONEB721",
            100,
            ship721.address,
            [300,200,600,100]
        );
        await droneB.deployed();

        motorA = await Composite721.connect(alice.signer).deploy(
            "MotorA721",
            "MOTORA721",
            200,
            ship721.address,
            [200,300,50,400]
        );
                
        await motorA.deployed();

        motorB = await Composite721.connect(alice.signer).deploy(
            "MotorB721",
            "MOTORB721",
            200,
            ship721.address,
            [200,300,50,400]
        );
                
        await motorB.deployed();

        motorC = await Composite721.connect(alice.signer).deploy(
            "MotorC721",
            "MOTORC721",
            200,
            ship721.address,
            [200,300,50,400]
        );
                
        await motorC.deployed();

        motorD = await Composite721.connect(alice.signer).deploy(
            "MotorD721",
            "MOTORD721",
            200,
            ship721.address,
            [200,300,50,400]
        );
                
        await motorD.deployed();

        laserWeaponA = await Composite721.connect(alice.signer).deploy(
            "WeaponA721",
            "WEAPONA721",
            300,
            ship721.address,
            [500,100,200,700]
        );
        await laserWeaponA.deployed();

        laserWeaponB = await Composite721.connect(alice.signer).deploy(
            "WeaponB721",
            "WEAPONB721",
            300,
            ship721.address,
            [500,100,200,700]
        );
        await laserWeaponB.deployed();

        droneUpgrade = await Composite721.connect(alice.signer).deploy(
            "DroneUpgrade",
            "dUPG",
            300,
            droneA.address,
            [300,200,0,0]
        );
        await droneUpgrade.deployed();

        bodyRed = await Composite721.connect(alice.signer).deploy(
            "BodyRed",
            "bUPG",
            300,
            ship721.address,
            [700,450,206,279]
        );
        await bodyRed.deployed();

        bodyGreen = await Composite721.connect(alice.signer).deploy(
            "BodyGreen",
            "bUPG",
            300,
            ship721.address,
            [700,450,206,279]
        );
        await bodyGreen.deployed();

        bodyBlue = await Composite721.connect(alice.signer).deploy(
            "BodyBlue",
            "bUPG",
            300,
            ship721.address,
            [700,450,206,279]
        );
        await bodyGreen.deployed();


        bodyYellow= await Composite721.connect(alice.signer).deploy(
            "bodyYellow",
            "bUPG",
            300,
            ship721.address,
            [700,450,206,279]
        );
        await bodyYellow.deployed();

        bodyPurple = await Composite721.connect(alice.signer).deploy(
            "bodyPurple",
            "bUPG",
            300,
            ship721.address,
            [700,450,206,279]
        );
        await bodyPurple.deployed();

        bodyCyan = await Composite721.connect(alice.signer).deploy(
            "bodyCyan",
            "bUPG",
            300,
            ship721.address,
            [700,450,206,279]
        );
        await bodyCyan.deployed();

        await ship721.mint(bob.address, 20);

        await droneA.mint(bob.address, 2);
        await droneB.mint(bob.address, 2);
        await droneUpgrade.mint(bob.address, 2);

        await motorA.mint(bob.address, 2);
        await motorB.mint(bob.address, 2);
        await motorC.mint(bob.address, 2);
        await motorD.mint(bob.address, 2);

        await laserWeaponA.mint(bob.address, 2);
        await laserWeaponB.mint(bob.address, 2);

        await bodyRed.mint(bob.address, 1);
        await bodyGreen.mint(bob.address, 1);
        await bodyBlue.mint(bob.address, 1);

        await bodyYellow.mint(bob.address, 1);
        await bodyPurple.mint(bob.address, 1);
        await bodyCyan.mint(bob.address, 1);
  
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

            await ship721.connect(alice.signer).setBaseLayer(svgGrid);

            const drone_A = ` 
            <rect fill="rgb(236,236,236)" width="134" height="134" x="113" y="33" />
            <rect fill="rgb(179,179,179)" width="25" height="100" x="95" y="49" />
            <rect fill="rgb(0,255,255)" width="33" height="100" x="246" y="49" />
            <rect fill="rgb(77,77,77)" width="50" height="83" x="45" y="58" />
            <rect fill="rgb(0,255,255)" width="25" height="66" x="20" y="66" />`;

            await droneA.connect(alice.signer).setBaseLayer(drone_A);

            await ship721.connect(bob.signer).setLayer(
                1,
                0, 
                [
                    droneA.address,
                    1
                ]
            );

            const drone_B = `
            <rect fill="rgb(255,255,0)" width="134" height="134" x="113" y="33" />
            <rect fill="rgb(179,179,179)" width="25" height="100" x="95" y="49" />
            <rect fill="rgb(255,255,255)" width="33" height="100" x="246" y="49" />
            <rect fill="rgb(77,77,77)" width="50" height="83" x="45" y="58" />
            <rect fill="rgb(0,255,255)" width="25" height="66" x="20" y="66" />`;

            await droneB.connect(alice.signer).setBaseLayer(drone_B);
            await droneB.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                2,
                0, 
                [
                    droneB.address,
                    1
                ]
            );

            const motor_A = `
            <rect fill="rgb(102,102,102)" width="35" height="183" x="145" y="6" />
            <rect fill="rgb(179,179,179)" width="18" height="73" x="126" y="18" />
            <rect fill="rgb(128,128,128)" width="36" height="61" x="89" y="24" />
            <rect fill="rgb(0,255,255)" width="45" height="49" x="44" y="30" />
            <rect fill="rgb(0,255,255)" width="23" height="47" x="9" y="30" />
            <rect fill="rgb(0,255,255)" width="23" height="47" x="9" y="106" />
            <rect fill="rgb(179,179,179)" width="18" height="73" x="126" y="93" />
            <rect fill="rgb(128,128,128)" width="36" height="61" x="89" y="100" />
            <rect fill="rgb(0,255,255)" width="45" height="49" x="44" y="106" />
            `;

            await motorA.connect(alice.signer).setBaseLayer(motor_A);
            await motorA.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                1, 
                1,
                [
                    motorA.address,
                    1
                ]
            );

            const weapon_A = `
            <rect fill="rgb(102,102,102)" width="350" height="45" x="40" y="25" />
            <rect fill="rgb(179,179,179)" width="280" height="25" x="50" y="35" />
            <rect fill="rgb(0,255,255)" width="40" height="25" x="340" y="35" />
            <rect fill="rgb(0,255,255)" width="85" height="25" x="400" y="35" />
            <rect fill="rgb(0,255,255)" width="15" height="45" x="25" y="25" />`;

            await laserWeaponA.connect(alice.signer).setBaseLayer(weapon_A);
            await laserWeaponA.connect(alice.signer).toggleComponent(true);
            
            await ship721.connect(bob.signer).setLayer(
                1,
                2, 
                [
                    laserWeaponA.address,
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

            await laserWeaponB.connect(alice.signer).setBaseLayer(weapon_B);
            await laserWeaponB.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                1, 
                3,
                [
                    laserWeaponB.address,
                    1
                ]
            );

            await ship721.connect(bob.signer).setLayer(
                2, 
                1,
                [
                    laserWeaponB.address,
                    2
                ]
            );

            const drone_upgrade = `
            <rect fill="rgb(179,179,179)" width="20" height="160" x="160" y="20" />
            <rect fill="rgb(33,103,120)" width="20" height="160" x="70" y="20" />
            <rect fill="rgb(128,128,128)" width="200" height="15" x="60" y="5" />
            <rect fill="rgb(128,128,128)" width="200" height="15" x="60" y="180" />
            <rect fill="rgb(0,255,255)" width="35" height="15" x="15" y="5" />
            <rect fill="rgb(0,255,255)" width="35" height="15" x="15" y="180" />
            <rect fill="rgb(179,179,179)" width="105" height="100" x="130" y="50" />    `;

            await droneUpgrade.connect(alice.signer).setBaseLayer(drone_upgrade);
            await droneUpgrade.connect(alice.signer).toggleComponent(true);

            await droneA.connect(bob.signer).setLayer(
                1, 
                0,
                [
                    droneUpgrade.address,
                    1
                ]
            );

            const body_red = `
            <rect fill="rgb(170,0,0)" width="625" height="62.5" x="42" y="260" />
            <rect fill="rgb(212,0,0)" width="385" height="104" x="42." y="156" />
            <rect fill="rgb(212,0,0)" width="93.75" height="83" x="84" y="10" />
            <rect fill="rgb(170,0,0)" width="260" height="62.5" x="63" y="93" />
            <rect fill="rgb(170,0,0)" width="385" height="52" x="94" y="322.5" />
            <rect fill="rgb(128,0,0)" width="160" height="52" x="94" y="374" />
            `;

            await bodyRed.connect(alice.signer).setBaseLayer(body_red);
            await bodyRed.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                2, 
                2,
                [
                    bodyRed.address,
                    1
                ]
            );

            const body_green = `
            <rect fill="rgb(0,170,0)" width="625" height="62.5" x="42" y="260" />
            <rect fill="rgb(0,212,0)" width="385" height="104" x="42." y="156" />
            <rect fill="rgb(0,212,0)" width="93.75" height="83" x="84" y="10" />
            <rect fill="rgb(0,170,0)" width="260" height="62.5" x="63" y="93" />
            <rect fill="rgb(0,170,0)" width="385" height="52" x="94" y="322.5" />
            <rect fill="rgb(0,128,0)" width="160" height="52" x="94" y="374" />
            <rect fill="rgb(255,0,255)" width="157" height="98" x="427" y="162" />
            `;

            await bodyGreen.connect(alice.signer).setBaseLayer(body_green);
            await bodyGreen.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                7, 
                0,
                [
                    bodyGreen.address,
                    1
                ]
            );
            
            const body_blue = `
            <rect fill="rgb(0,0,170)" width="625" height="62.5" x="42" y="260" />
            <rect fill="rgb(0,0,212)" width="385" height="104" x="42." y="156" />
            <rect fill="rgb(0,0,212)" width="93.75" height="83" x="84" y="10" />
            <rect fill="rgb(0,0,170)" width="260" height="62.5" x="63" y="93" />
            <rect fill="rgb(0,0,170)" width="385" height="52" x="94" y="322.5" />
            <rect fill="rgb(0,0,128)" width="160" height="52" x="94" y="374" />
            <rect fill="rgb(255,255,0)" width="157" height="98" x="427" y="162" />
            `;

            await bodyBlue.connect(alice.signer).setBaseLayer(body_blue);
            await bodyBlue.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                3, 
                0,
                [
                    bodyBlue.address,
                    1
                ]
            );

                        
            const body_yellow = `
            <rect fill="rgb(170,170,0)" width="625" height="62.5" x="42" y="260" />
            <rect fill="rgb(212,212,0)" width="385" height="104" x="42." y="156" />
            <rect fill="rgb(212,212,0)" width="93.75" height="83" x="84" y="10" />
            <rect fill="rgb(170,170,0)" width="260" height="62.5" x="63" y="93" />
            <rect fill="rgb(170,170,0)" width="385" height="52" x="94" y="322.5" />
            <rect fill="rgb(128,128,0)" width="160" height="52" x="94" y="374" />
            <rect fill="rgb(0,0,255)" width="157" height="98" x="427" y="162" />
            `;

            await bodyYellow.connect(alice.signer).setBaseLayer(body_yellow);
            await bodyYellow.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                4, 
                0,
                [
                    bodyYellow.address,
                    1
                ]
            );

                        
            const body_purple = `
            <rect fill="rgb(170,0,170)" width="625" height="62.5" x="42" y="260" />
            <rect fill="rgb(212,0,212)" width="385" height="104" x="42." y="156" />
            <rect fill="rgb(212,0,212)" width="93.75" height="83" x="84" y="10" />
            <rect fill="rgb(170,0,170)" width="260" height="62.5" x="63" y="93" />
            <rect fill="rgb(170,0,170)" width="385" height="52" x="94" y="322.5" />
            <rect fill="rgb(128,0,128)" width="160" height="52" x="94" y="374" />
            <rect fill="rgb(255,255,0)" width="157" height="98" x="427" y="162" />
            `;

            await bodyPurple.connect(alice.signer).setBaseLayer(body_purple);
            await bodyPurple.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                5, 
                0,
                [
                    bodyPurple.address,
                    1
                ]
            );

                        
            const body_cyan = `
            <rect fill="rgb(0,170,170)" width="625" height="62.5" x="42" y="260" />
            <rect fill="rgb(0,212,212)" width="385" height="104" x="42." y="156" />
            <rect fill="rgb(0,212,212)" width="93.75" height="83" x="84" y="10" />
            <rect fill="rgb(0,170,170)" width="260" height="62.5" x="63" y="93" />
            <rect fill="rgb(0,170,170)" width="385" height="52" x="94" y="322.5" />
            <rect fill="rgb(0,128,128)" width="160" height="52" x="94" y="374" />
            <rect fill="rgb(255,255,0)" width="157" height="98" x="427" y="162" />
            `;

            await bodyCyan.connect(alice.signer).setBaseLayer(body_cyan);
            await bodyCyan.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                6, 
                0,
                [
                    bodyCyan.address,
                    1
                ]
            );

            const motor_B = `
            <rect fill="rgb(102,102,102)" width="35" height="183" x="154" y="6" />
            <rect fill="rgb(179,179,179)" width="18" height="160" x="135" y="18" />
            <rect fill="rgb(128,128,128)" width="29" height="148" x="107" y="24" />
            <rect fill="rgb(0,255,255)" width="53" height="136" x="53" y="30" />
            <rect fill="rgb(0,255,255)" width="24"  height="136" x="18" y="30" />
            `;

            await motorB.connect(alice.signer).setBaseLayer(motor_B);
            await motorB.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                4, 
                1,
                [
                    motorB.address,
                    1
                ]
            );

            const motor_C = `
            <rect fill="rgb(102,102,102)" width="35" height="243" x="145" y="6" />
            <rect fill="rgb(179,179,179)" width="18" height="73" x="126" y="18" />
            <rect fill="rgb(128,128,128)" width="36" height="61" x="89" y="24" />
            <rect fill="rgb(255,255,128)" width="45" height="49" x="44" y="30" />
            <rect fill="rgb(255,255,85)" width="23" height="47" x="9" y="30" />
            <rect fill="rgb(255,255,85)" width="23" height="47" x="9" y="106" />
            <rect fill="rgb(255,255,85)" width="23" height="47" x="9" y="180" />
            <rect fill="rgb(179,179,179)" width="18" height="73" x="126" y="93" />
            <rect fill="rgb(128,128,128)" width="36" height="61" x="89" y="100" />
            <rect fill="rgb(128,128,128)" width="36" height="61" x="89" y="174" />
            <rect fill="rgb(255,255,128)" width="45" height="49" x="44" y="106" />
            <rect fill="rgb(255,255,128)" width="45" height="49" x="45" y="180" />
            <rect fill="rgb(179,179,179)" width="18" height="73" x="126" y="170" />
            `;

            await motorC.connect(alice.signer).setBaseLayer(motor_C);
            await motorC.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                6, 
                1,
                [
                    motorC.address,
                    1
                ]
            );

            const motor_D = `
            <rect fill="rgb(179,179,179)" width="18" height="146" x="126" y="18" />
            <rect fill="rgb(128,128,128)" width="36" height="161" x="89" y="24" />
            <rect fill="rgb(102,102,102)" width="35" height="243" x="145" y="6" />

            <rect fill="rgb(240,128,255)" width="24" height="130" x="65" y="30" />
            <rect fill="rgb(240,200,255)" width="30" height="100" x="10" y="45" />

            <rect fill="rgb(255,180,255)" width="15" height="130" x="45" y="30" />

            <rect fill="rgb(255,230,128)" width="15" height="50" x="45" y="180" />
            <rect fill="rgb(255,238,170)" width="10" height="50" x="30" y="180" />
            <rect fill="rgb(255,246,213)" width="5" height="50" x="20" y="180" />
            <rect fill="rgb(179,179,179)" width="18" height="74" x="127" y="170" />
            <rect fill="rgb(128,128,128)" width="37" height="62" x="90" y="174" />
            <rect fill="rgb(255,204,0)" width="25" height="49" x="65" y="180" />
            `;

            await motorD.connect(alice.signer).setBaseLayer(motor_D);
            await motorD.connect(alice.signer).toggleComponent(true);

            await ship721.connect(bob.signer).setLayer(
                3, 
                1,
                [
                    motorD.address,
                    1
                ]
            );


            
            let metadata = await ship721.connect(bob.signer).tokenURI(1);
            await generateImage(metadata, "ship");

            metadata = await ship721.connect(bob.signer).tokenURI(2);
            await generateImage(metadata, "ship2");
            metadata = await ship721.connect(bob.signer).tokenURI(3);
            await generateImage(metadata, "ship3");
            metadata = await ship721.connect(bob.signer).tokenURI(4);
            await generateImage(metadata, "ship4");
            metadata = await ship721.connect(bob.signer).tokenURI(5);
            await generateImage(metadata, "ship5");
            metadata = await ship721.connect(bob.signer).tokenURI(6);
            await generateImage(metadata, "ship6");
            metadata = await ship721.connect(bob.signer).tokenURI(7);
            await generateImage(metadata, "ship5");

            metadata = await droneA.connect(bob.signer).tokenURI(1);
            await generateImage(metadata, "droneA");

            metadata = await droneB.connect(bob.signer).tokenURI(1);
            await generateImage(metadata, "droneB");

            metadata = await droneUpgrade.connect(bob.signer).tokenURI(2);
            await generateImage(metadata, "drone_upgrade");

            metadata = await motorA.connect(bob.signer).tokenURI(1);
            await generateImage(metadata, "motorA");

            metadata = await motorB.connect(bob.signer).tokenURI(1);
            await generateImage(metadata, "motorB");

            metadata = await motorC.connect(bob.signer).tokenURI(1);
            await generateImage(metadata, "motorC");

            metadata = await motorD.connect(bob.signer).tokenURI(1);
            await generateImage(metadata, "motorD");

        });
    });
});
