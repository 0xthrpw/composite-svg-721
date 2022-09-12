// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.8.11;

import '@openzeppelin/contracts/utils/Strings.sol';

library Composite {
    using Strings for uint32;

    struct Settings {
        uint32 x;
        uint32 y;
        uint32 z;
        uint32 w;
        uint32 h;
    }

    function generateHead(Settings memory settings) internal pure returns (string memory svg) {
        string memory dat =
            string(
                abi.encodePacked(
                '<svg version="1.1" width="',
                settings.w.toString(),
                '" height="',
                settings.h.toString(),
                '" viewBox="0 0 ',
                settings.w.toString(),
                ' ',
                settings.h.toString(),
                '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                )
            );

        return
            string(
                abi.encodePacked(
                dat,
                '<rect width="',
                settings.w.toString(),
                '" height="',
                settings.h.toString(),
                '" x="',
                settings.x.toString(),
                '" y="',
                settings.y.toString(),
                '" />'
                )
            );
    }

    function generateBody(Settings memory settings) internal pure returns (string memory svg) {

    }

}