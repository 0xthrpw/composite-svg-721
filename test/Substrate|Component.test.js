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
            ]
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
            ]
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
            ]
        );
        await composite721_2.deployed();
  
    });

    // Confirm that ownership is correctly tracked.
    describe('ownerOf', async function() {
        it('mint substrate', async function() {
            await substrate721.mint(bob.address, 1);

            await composite721_1.mint(bob.address, 1);
            // let ownerOne = await tiny721.connect(alice.signer).ownerOf(1);
            // ownerOne.should.be.equal(alice.address);
            // let ownerTwo = await tiny721.connect(alice.signer).ownerOf(2);
            // ownerTwo.should.be.equal(bob.address);
            // let ownerFour = await tiny721.connect(alice.signer).ownerOf(4);
            // ownerFour.should.be.equal(carol.address);
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
