// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

import "./Tiny721.sol";
import "../../meta/Composite.sol";
import "../../meta/OnChainMeta.sol";

error ItemNotAssigned();
error LayerOwnerNotSender();
error LayerInUse();
error NoLayersInComponent();
error RecursiveLayer();

interface IComp721 {
    function assignment ( uint256 id ) external view returns ( bool );
    function settings () external view returns ( Composite.Settings memory );
    function ownerOf ( uint256 id ) external view returns ( address );
    function svgData ( uint256 id ) external view returns ( string memory );
    function setAssignment ( uint256 _id, bool _status ) external;
}

contract Composite721 is Tiny721, OnChainMeta {
    using Composite for Composite.Settings;

    /// The image settings for this item
    Composite.Settings public settings;

    /// The item contract and item id that comprise this layer
    struct Layer {
        address item;
        uint256 id;
    }

    /// Boolean flag for component status
    bool public isComponent;

    /// item id > in use
    mapping ( uint256 => bool) public assignment;

    /// svgData if component
    string public componentData;

    /// substrate contract
    address public substrate;

    /// item id > number of image layers
    mapping ( uint256 => uint256 ) public layerCounts;
    
    /// item id > z index > layer data
    mapping ( uint256 => mapping ( uint256 => Layer )) public layers;

    event Assigned ( address component, uint256 cid, uint256 sid, bool status );

    /**
        A modifier to see if a caller is an approved administrator.
    */
    modifier onlyTokenOwner (uint256 _id) {
        if ( _msgSender() != this.ownerOf(_id) && _msgSender() != substrate) {
            revert NotAnAdmin();
        }
        _;
    }


    /**
        Construct a new instance of this ERC-721 contract.

        @param _name The name to assign to this item collection contract.
        @param _symbol The ticker symbol of this item collection.
        @param _cap The maximum number of tokens that may be minted.
        @param _settings The image settings for this item
    */
    constructor (
        string memory _name,
        string memory _symbol,
        uint256 _cap,
        Composite.Settings memory _settings,
        address _substrate
    ) Tiny721(_name, _symbol, _cap) {
        settings = _settings;
        substrate = _substrate;
    }


    /**
        Token owners can use this function to add a layer to a given item that 
        they possess.

        @param _id The ID of the token to modify.
        @param _layer The data to add to the layer, { item address, item id }

    */
    function addLayer (
        uint256 _id,
        Layer memory _layer
    ) public onlyTokenOwner(_id) {
        // prevent recursive assignment
        if(_layer.id == _id && _layer.item == address(this)){
            revert RecursiveLayer();
        }

        // require not in component status
        if(isComponent){
            revert NoLayersInComponent();
        }

        // get the settings from the item contract
        Composite.Settings memory itemSettings;
        address layerOwner; 
        bool layerAssigned;

        if(_layer.item == address(this)){
            itemSettings = settings;
            layerOwner = this.ownerOf(_layer.id);
            layerAssigned = assignment[_layer.id];
        }else{
            IComp721 compositeItem = IComp721(_layer.item);
            layerOwner = compositeItem.ownerOf(_layer.id);
            itemSettings = compositeItem.settings();
            layerAssigned = compositeItem.assignment(_layer.id);
        }

                // require layer not in use
        if(layerAssigned){
            revert LayerInUse();
        }

        // require layer token owner
        if(_msgSender() != layerOwner){
            revert LayerOwnerNotSender();
        }
        
        // specifically the z index so we know where to put the layer
        uint256 zIndex = itemSettings.z;

        // check for existing layer data
        Layer memory existing = layers[_id][zIndex];

        // increment layer count if new layer
        if(existing.item == address(0) && existing.id == uint(0)){
            ++layerCounts[_id];
        }

        
        // save layer data
        layers[_id][zIndex] = _layer;
        IComp721(_layer.item).setAssignment(_layer.id, true);

        emit Assigned( _layer.item, _layer.id, _id, true );
    }


    /**
        Token owners can use this function to remove a layer of a given item that 
        they possess.

        @param _itemId The ID of the token to modify.
        @param _layerId The layer ID of the image to modify.
        
    */
    function rmLayer (
        uint256 _itemId,
        uint256 _layerId
    ) public onlyTokenOwner(_itemId) {
        // require not in component status
        if(isComponent){
            revert NoLayersInComponent();
        }

        Layer memory layer = layers[_itemId][_layerId];

        // require item is assigned
        if(layer.item == address(0) || layer.id == uint(0)){
            revert ItemNotAssigned();
        }

        address layerOwner; 
        if(layer.item == address(this)){
            layerOwner = this.ownerOf(layer.id);
            this.setAssignment(layer.id, false);
        }else{
            IComp721 compositeItem = IComp721(layer.item);
            layerOwner = compositeItem.ownerOf(layer.id);
            compositeItem.setAssignment(layer.id, false);
        }

        // require layer token owner
        if(_msgSender() != layerOwner){
            revert LayerOwnerNotSender();
        }

        // decrement layer count if existing layer
        --layerCounts[_itemId];

        // reset layer data
        layers[_itemId][_layerId] = Layer({
            item: address(0),
            id: uint(0)
        });

        emit Assigned( layer.item, layer.id, _itemId, false );
    }


    /**
        Return the token URI of the token with the specified `_id`.

        @param _id The ID of the token to retrive a metadata URI for.

        @return The metadata URI of the token with the ID of `_id`.
    */
    function tokenURI (
        uint256 _id
    ) external view virtual override returns (string memory) {
        if (!_exists(_id)) { revert URIQueryForNonexistentToken(); }
        
        return _buildMeta(_id, this.svgData(_id));
    }


    /**
        Change item component status.  This prevents an item from 
        possessing 'layers' and represents the leaf on a branch on a tree of 
        layer recursion

        @param _status is component or not
    */
    function toggleComponent (
        bool _status
    ) external onlyOwner {
        isComponent = _status;
    }


    /**
        Return the SVG data of the token with the specified `_id`.

        @param _id The ID of the token to retrive data for.

        @return The SVG data of the token with the ID of `_id`.
    */
    function svgData (
        uint256 _id 
    ) external view returns (string memory) {
        string memory svgHead = Composite.generateHead(settings);

        if(isComponent){
            
            return componentData;
        }

        string memory svgBody;
        uint256 layerCount = layerCounts[_id];

        for(uint i=1; i <= layerCount; ++i){
            Layer memory layer = layers[_id][i];
            string memory svgLayer;
            address layerOwner;

            if(layer.item == address(this)){
                //if not component and if item contract is this contract, refer to local storage for data
                svgLayer = this.svgData(layer.id);
                layerOwner = this.ownerOf(layer.id);
            }else{
                // else call the contract to return the layer
                svgLayer = IComp721(layer.item).svgData(layer.id);
                layerOwner = IComp721(layer.item).ownerOf(layer.id);
            }

            // if layer/component owner is not substrate owner, ignore this layer
            if(layerOwner != this.ownerOf(_id)){
                continue;
            }

            svgBody = string(abi.encodePacked(
                svgBody,
                svgLayer
            ));
        }

        svgBody = string(abi.encodePacked(
            svgHead,
            svgBody,
            '</svg>'
        ));

        return svgBody;
    }


    /**
        Set the component SVG data of the token.

        @param _svgData The svg data to set for this item.
    */
    function setComponent ( string memory _svgData ) external onlyOwner {
        componentData = string(abi.encodePacked(_svgData));
    }


    /**
        Set the component assignment.

        @param _id The id of the assigned item.
        @param _status The boolean status of this assignment.
    */
    function setAssignment ( uint256 _id, bool _status ) public onlyTokenOwner(_id) {
        assignment[_id] = _status;
    }
}