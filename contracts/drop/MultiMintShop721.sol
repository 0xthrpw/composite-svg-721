// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "../interfaces/IComposite721.sol";

// Errors
error CannotBuyZeroItems();
error CannotExceedCap();
error CollectionNotSet();
error RefundFailed();
error UnderpaidMint();
error SweepFailed();

contract MultiMintShop721 is Ownable, ReentrancyGuard {
    /**
       @param price the price of each item in the collection
       @param cap the total number of items this shop can sell
       @param sellCount the current count of items sold from this collection
       @param collection the contract address of the collection
     */
    struct Pool {
        uint256 price;
        uint256 cap;
        uint256 sellCount;
        address collection;
    }

    /// A mapping to look up collection details for a given pool.
    mapping ( uint256 => Pool ) public pools;

    /// The current count of collections for sale
    uint256 public poolCount;

    /**
       Mint an item from a collection
       @param _amount the amount of items to mint
       @param _poolId the pool from which to mint
    */
    function mint ( 
        uint256 _amount,
        uint256 _poolId
    ) external payable nonReentrant {
        // Reject purchases for no items.
        if (_amount < 1) { revert CannotBuyZeroItems(); }

        Pool memory pool = pools[_poolId];

        // Reject empty collection
        if(pool.collection == address(0)){
            revert CollectionNotSet();
        }

        // Sold out
        if (pool.sellCount + _amount > pool.cap) {
            revert CannotExceedCap();
        }

        // Reject under paid mints
        uint256 totalCost = pool.price * _amount;
        if(msg.value < totalCost){
            revert UnderpaidMint();
        }

        // Refund over paid mints
        if (msg.value > totalCost) {
            uint256 excess = msg.value - totalCost;
            (bool returned, ) = payable(msg.sender).call{ value: excess }("");
            if (!returned) { revert RefundFailed(); }
        }

        // Update sell count
        pool.sellCount = pool.sellCount + _amount;

        // Mint items to user
        IComposite721(pool.collection).mint(msg.sender, _amount);
    }

    /**
       Set the data for multiple pools
       @param _pools the array of pool data to update
    */
    function setPools (
        Pool[] memory _pools
    ) external onlyOwner {
        for(uint i; i < _pools.length; ++i){
            if(pools[i].collection == address(0)){
                ++poolCount;
            }

            pools[i] = _pools[i];
        }
    }

    /**
       Set the data for a single pool
       @param _poolId the id of the pool to update
       @param _poolData the data to update
    */
    function setPool ( 
        uint256 _poolId,
        Pool memory _poolData
    ) external onlyOwner {
        if(pools[_poolId].collection == address(0)){
            ++poolCount;
        }
        pools[_poolId] = _poolData;

    }

    /**
        Allow the owner to sweep either Ether from the contract and send it to 
        another address. This allows the owner of the shop to withdraw their 
        funds after the sale is completed.

        @param _amount The amount of token to sweep.
        @param _destination The address to send the swept tokens to.
    */
    function sweep (
        address _destination,
        uint256 _amount
    ) external onlyOwner nonReentrant {
        (bool success, ) = payable(_destination).call{ value: _amount }("");
        if (!success) { revert SweepFailed(); }
    }
}