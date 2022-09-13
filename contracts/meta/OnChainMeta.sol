// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './NFTSVG.sol';
import './Composite.sol';

contract OnChainMeta {
    using Strings for uint256;
    using Composite for Composite.Settings;

    string public metaDescription = 'Components';

    function _buildMeta(uint256 _tokenId, string memory _svgData) internal view returns (string memory) {

      //string memory svgHead = Composite.generateHead(_settings); 

      string memory metadata = string(abi.encodePacked(
        '{"name":"',
           _buildName(_tokenId),
          '",',
          '"description":"',
             metaDescription,
          '",',
          '"image":"',
          'data:image/svg+xml;base64,',
            Base64.encode(bytes(_svgData)),
          '", "attributes":[',
             _getTraits(_tokenId),
          ']',
        '}')
      );

      string memory encodedMetadata = string(abi.encodePacked(
        'data:application/json;base64,',
        Base64.encode(bytes(metadata))
      ));

      return encodedMetadata;
    }

    function _buildName(uint256 _tokenId) internal pure returns (string memory) {
      return string(abi.encodePacked("Composite #", _tokenId.toString()));
    }

    function _getTraits(uint256 _tokenId) internal pure returns (string memory) {
      string memory metadata = string(abi.encodePacked(
        // _wrapTrait("Generation", groupId.toString()),',',
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
