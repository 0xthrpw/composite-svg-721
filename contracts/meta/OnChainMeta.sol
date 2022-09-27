// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';

contract OnChainMeta {
    using Strings for uint256;
    using Strings for uint128;

    struct Dimensions {
      uint128 width;
      uint128 height;
      uint128 x;
      uint128 y;
    }

    function _buildMeta(
      uint256 _tokenId, 
      string memory _svgData, 
      string memory _attributes, 
      string memory _description,
      string memory _name
    ) internal pure returns (string memory) {

      string memory attrs = string(abi.encodePacked(
        _getTraits(_tokenId),
        ',',
        _attributes
      ));

      string memory metadata = string(abi.encodePacked(
        '{"name":"',
           _buildName(_tokenId, _name),
          '",',
          '"description":"',
             _description,
          '",',
          '"image":"',
          'data:image/svg+xml;base64,',
            Base64.encode(bytes(_svgData)),
          '", "attributes":[',
          attrs,
          ']',
        '}')
      );

      string memory encodedMetadata = string(abi.encodePacked(
        'data:application/json;base64,',
        Base64.encode(bytes(metadata))
      ));

      return encodedMetadata;
    }

    function _buildName(uint256 _tokenId, string memory _name) internal pure returns (string memory) {
      return string(abi.encodePacked(
        _name,
        " #",
        _tokenId.toString()
      ));
    }

    function _getTraits(uint256 _tokenId) internal pure returns (string memory) {
      string memory metadata = string(abi.encodePacked(
        _wrapTrait("Identifier", _tokenId.toString())
      ));

      return metadata;
    }

    function _wrapTrait(string memory trait, string memory value) internal pure returns(string memory) {
        return string(abi.encodePacked(
            '{"trait_type":"',
            trait,
            '","value":"',
            value,
            '"}'
        ));
    }
}
