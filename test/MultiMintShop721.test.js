'use strict';

// Imports.
// import { ethers, network } from 'hardhat';
// import { expect } from 'chai';
// //import 'chai/register-should';
// const { should } = require('chai').should();
import HashTree from '../scripts/HashTree';

const { ethers, network } = require('hardhat');
const { expect } = require('chai');
const { should } = require('chai').should();

/**
  Describe the contract testing suite, retrieve testing wallets, and create
  contract factories from the artifacts we are testing.
*/
describe('Multi Mint Shop', function () {
  let alice, bob, carol, dev;
  let Composite721, MultiMintShop721;
  
  before(async () => {
    const signers = await ethers.getSigners();
    const addresses = await Promise.all(signers.map(async signer => signer.getAddress()));
    
    alice = { provider: signers[0].provider, signer: signers[0], address: addresses[0] };
    bob = { provider: signers[1].provider, signer: signers[1], address: addresses[1] };
    carol = { provider: signers[2].provider, signer: signers[2], address: addresses[2] };
    dev = { provider: signers[3].provider, signer: signers[3], address: addresses[3] };

    Composite721 = await ethers.getContractFactory('Composite721');
    MultiMintShop721 = await ethers.getContractFactory('MultiMintShop721');
  });

  let ship721, droneA, droneB, laserWeaponA, laserWeaponB, droneUpgrade;
  let motorA, motorB, motorC, motorD;
  let bodyRed, bodyGreen, bodyBlue, bodyYellow, bodyPurple, bodyCyan;
  let multiMintShop;

  beforeEach(async () => {
    ship721 = await Composite721.connect(alice.signer).deploy(
        "Substrate",
        "SUBSTR",
        555,
        ethers.constants.AddressZero,
        [1000,1000,0,0],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await ship721.deployed();

    droneA = await Composite721.connect(alice.signer).deploy(
        "DroneA721",
        "DRONEA721",
        100,
        ship721.address,
        [300,200,600,100],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await droneA.deployed();

    droneB = await Composite721.connect(alice.signer).deploy(
        "DroneB721",
        "DRONEB721",
        100,
        ship721.address,
        [300,200,600,100],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await droneB.deployed();

    motorA = await Composite721.connect(alice.signer).deploy(
        "MotorA721",
        "MOTORA721",
        200,
        ship721.address,
        [200,300,50,400],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
            
    await motorA.deployed();

    motorB = await Composite721.connect(alice.signer).deploy(
        "MotorB721",
        "MOTORB721",
        200,
        ship721.address,
        [200,300,50,400],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
            
    await motorB.deployed();

    motorC = await Composite721.connect(alice.signer).deploy(
        "MotorC721",
        "MOTORC721",
        200,
        ship721.address,
        [200,300,50,400],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
            
    await motorC.deployed();

    motorD = await Composite721.connect(alice.signer).deploy(
        "MotorD721",
        "MOTORD721",
        200,
        ship721.address,
        [200,300,50,400],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
            
    await motorD.deployed();

    laserWeaponA = await Composite721.connect(alice.signer).deploy(
        "WeaponA721",
        "WEAPONA721",
        300,
        ship721.address,
        [500,100,200,700],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await laserWeaponA.deployed();

    laserWeaponB = await Composite721.connect(alice.signer).deploy(
        "WeaponB721",
        "WEAPONB721",
        300,
        ship721.address,
        [500,100,200,700],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await laserWeaponB.deployed();

    droneUpgrade = await Composite721.connect(alice.signer).deploy(
        "DroneUpgrade",
        "dUPG",
        300,
        droneA.address,
        [300,200,0,0],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await droneUpgrade.deployed();

    bodyRed = await Composite721.connect(alice.signer).deploy(
        "BodyRed",
        "bUPG",
        300,
        ship721.address,
        [700,450,206,279],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await bodyRed.deployed();

    bodyGreen = await Composite721.connect(alice.signer).deploy(
        "BodyGreen",
        "bUPG",
        300,
        ship721.address,
        [700,450,206,279],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await bodyGreen.deployed();

    bodyBlue = await Composite721.connect(alice.signer).deploy(
        "BodyBlue",
        "bUPG",
        300,
        ship721.address,
        [700,450,206,279],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await bodyBlue.deployed();


    bodyYellow= await Composite721.connect(alice.signer).deploy(
        "bodyYellow",
        "bUPG",
        300,
        ship721.address,
        [700,450,206,279],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await bodyYellow.deployed();

    bodyPurple = await Composite721.connect(alice.signer).deploy(
        "bodyPurple",
        "bUPG",
        300,
        ship721.address,
        [700,450,206,279],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await bodyPurple.deployed();

    bodyCyan = await Composite721.connect(alice.signer).deploy(
        "bodyCyan",
        "bUPG",
        300,
        ship721.address,
        [700,450,206,279],
        '{ "trait_type": "Trait", "value": "Dummy" }',
        "description"
    );
    await bodyCyan.deployed();

    multiMintShop = await MultiMintShop721.connect(alice.signer).deploy();
    await multiMintShop.deployed();

    // Configure shop by setting pools
    await multiMintShop.connect(alice.signer).setPools(
      [
        [
          ethers.utils.parseEther(".01"), //price
          555, //cap
          1, //sellCount
          ship721.address //collection address
        ],
        [
          ethers.utils.parseEther(".0004"), //price
          100, //cap
          0, //sellCount
          droneA.address //collection address
        ],
        [
          ethers.utils.parseEther(".0004"), //price
          100, //cap
          0, //sellCount
          droneB.address //collection address
        ],
        [
          ethers.utils.parseEther(".0003"), //price
          200, //cap
          0, //sellCount
          droneUpgrade.address //collection address
        ],

        [
          ethers.utils.parseEther(".0002"), //price
          200, //cap
          0, //sellCount
          motorA.address //collection address
        ],
        [
          ethers.utils.parseEther(".0002"), //price
          200, //cap
          0, //sellCount
          motorB.address //collection address
        ],
        [
          ethers.utils.parseEther(".0004"), //price
          200, //cap
          0, //sellCount
          motorC.address //collection address
        ],
        [
          ethers.utils.parseEther(".0005"), //price
          200, //cap
          0, //sellCount
          motorD.address //collection address
        ],

        [
          ethers.utils.parseEther(".0004"), //price
          300, //cap
          0, //sellCount
          laserWeaponA.address //collection address
        ],
        [
          ethers.utils.parseEther(".0006"), //price
          300, //cap
          0, //sellCount
          laserWeaponB.address //collection address
        ],

        [
          ethers.utils.parseEther(".0008"), //price
          300, //cap
          0, //sellCount
          bodyRed.address //collection address
        ],
        [
          ethers.utils.parseEther(".0008"), //price
          300, //cap
          0, //sellCount
          bodyGreen.address //collection address
        ],
        [
          ethers.utils.parseEther(".0008"), //price
          300, //cap
          0, //sellCount
          bodyBlue.address //collection address
        ],
        [
          ethers.utils.parseEther(".0008"), //price
          300, //cap
          0, //sellCount
          bodyYellow.address //collection address
        ],
        [
          ethers.utils.parseEther(".0008"), //price
          300, //cap
          0, //sellCount
          bodyPurple.address //collection address
        ]
      ]
    );

    // Make the mint multiMintShop an admin for the item.
    await ship721.connect(alice.signer).setAdmin(multiMintShop.address, true);

    let poolCountBeforeMod = await multiMintShop.poolCount();

    await multiMintShop.connect(alice.signer).setPool(
      0,
      [
        ethers.utils.parseEther(".01"), //price
        555, //cap
        0, //sellCount
        ship721.address //collection address
      ]
    );

    let poolCountAfterMod = await multiMintShop.poolCount();
    poolCountBeforeMod.should.be.equal(poolCountAfterMod);
    
    let poolCountBeforeAdd = await multiMintShop.poolCount();

    await multiMintShop.connect(alice.signer).setPool(
      15,
        [
          ethers.utils.parseEther(".0008"), //price
          300, //cap
          0, //sellCount
          bodyCyan.address //collection address
        ]
    );
    let poolCounterAfterAdd = await multiMintShop.poolCount();
    poolCountBeforeAdd.should.be.equal(poolCounterAfterAdd.sub(1));

  });

  // Perform tests during the public sale.
  context('during the public sale', async function() {

    // Attempt to purchase an item during the public sale as a non-presaler.
    it('allows caller to buy an item for ether',
    async function () {
      let carolBalance = await ship721.connect(alice.signer)
        .balanceOf(carol.address);
      carolBalance.should.be.equal(0);

      // Carol will attempt to buy an item.
      await multiMintShop.connect(carol.signer).mint(1, 0, {
        value: ethers.utils.parseEther('.01')
      });

      // Ensure that Carol received her item.
      carolBalance = await ship721.connect(alice.signer)
        .balanceOf(carol.address);
      carolBalance.should.be.equal(1);
    });

    it('rejects under payment', async function() {
      await expect(
        multiMintShop.connect(carol.signer).mint(1, 0, {
          value: ethers.utils.parseEther('.001')
        })
      ).to.be.revertedWith('UnderpaidMint()');
    });

    it('returns change if over payment', async function() {
      const carolEthBalanceBefore = await alice.provider.getBalance(carol.address);
      const parsedCarolEthBalBefore = ethers.utils.formatEther(carolEthBalanceBefore.toString())
      const cost = ".01" //ethers.utils.parseEther('.01');

      await multiMintShop.connect(carol.signer).mint(1, 0, {
        value: ethers.utils.parseEther('.1')
      });
      const carolEthBalanceAfter = await alice.provider.getBalance(carol.address);
      const parsedCarolEthBalAfter = ethers.utils.formatEther(carolEthBalanceAfter.toString())
      
      // parsedCarolEthBalAfter.should.be.equal(parsedCarolEthBalBefore - cost)
    });

    // Attempt to purchase an item during the public sale as a presale caller.
    // it('allows whitelist caller to buy an item for ether', async function() {
    //   let bobBalance = await composite721.connect(alice.signer)
    //     .balanceOf(bob.address);
    //   bobBalance.should.be.equal(0);

    //   // Create a null proof for a public sale to submit.
    //   let nullProof = {
    //     id: 0,
    //     index: 0,
    //     allowance: 0,
    //     proof: [ ]
    //   };

    //   // Bob will attempt to buy an item.
    //   await multiMintShop.connect(bob.signer).mint(1, nullProof, {
    //     value: ethers.utils.parseEther('2')
    //   });

    //   // Ensure that Bob received his item.
    //   bobBalance = await composite721.connect(alice.signer)
    //     .balanceOf(bob.address);
    //   bobBalance.should.be.equal(1);
    // });

    // Purchases that are short on ETH should fail.
    // it('should fail if payment is < current price', async function() {
    //   let bobBalance = await composite721.connect(alice.signer)
    //     .balanceOf(bob.address);
    //   bobBalance.should.be.equal(0);

    //   // Create a null proof for a public sale to submit.
    //   let nullProof = {
    //     id: 0,
    //     index: 0,
    //     allowance: 0,
    //     proof: [ ]
    //   };

    //   // Bob will attempt to buy an item.
    //   await expect(
    //     multiMintShop.connect(bob.signer).mint(1, nullProof, {
    //       value: ethers.utils.parseEther('1')
    //     })
    //   ).to.be.revertedWith('CannotUnderpayForMint()');

    //   // Ensure that Bob received no item.
    //   bobBalance = await composite721.connect(alice.signer)
    //     .balanceOf(bob.address);
    //   bobBalance.should.be.equal(0);
    // });
  });
});
