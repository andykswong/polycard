// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract PolyCardTokens is ERC1155Supply, ERC1155Receiver, Ownable {
    uint256 public constant GEM = 0;
    // uint256 public constant ADVENTURER = 0x0001;
    uint256 public constant ARCHAEOLOGIST = 0x0002;
    uint256 public constant SWORDSMAN = 0x0003;

    constructor()
        ERC1155("https://andykswong.github.io/polycard/token/{id}.json")
    {
        uint256[] memory ids = new uint256[](3);
        uint256[] memory amounts = new uint256[](3);
        ids[0] = GEM;
        amounts[0] = 10**18;
        ids[1] = ARCHAEOLOGIST;
        amounts[1] = 10**3;
        ids[2] = SWORDSMAN;
        amounts[2] = 10**3;

        _increaseSupplyBatch(ids, amounts);
    }

    function increaseSupplyBatch(
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external onlyOwner {
        _increaseSupplyBatch(ids, amounts);
    }

    function totalSupply(uint256 id)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return
            ERC1155Supply.totalSupply(id) -
            ERC1155.balanceOf(address(this), id);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC1155Receiver)
        returns (bool)
    {
        return (ERC1155.supportsInterface(interfaceId) ||
            ERC1155Receiver.supportsInterface(interfaceId));
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155Received(address,address,uint256,uint256,bytes)"
                )
            );
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"
                )
            );
    }

    function _increaseSupplyBatch(
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal {
        require(ids.length == amounts.length, "ids and amounts length mismatch");
        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];
            _mint(address(this), id, amount, "");
        }
    }
}
