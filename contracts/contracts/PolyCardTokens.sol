// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract PolyCardTokens is ERC1155Supply, ERC1155Receiver, Ownable {
    uint256 public constant GEM = 0;
    uint256 public constant ARCHAEOLOGIST = 0x0002;
    uint256 public constant SWORDSMAN = 0x0003;

    uint256 public gemPrice;
    mapping(uint256 => uint256) public tokenGemPrices;

    mapping(address => bool) public admins;

    event Sold(address buyer, uint256 tokenId, uint256 amount);

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

        gemPrice = 5 * uint256(10) ** 14;
        tokenGemPrices[ARCHAEOLOGIST] = 200;
        tokenGemPrices[SWORDSMAN] = 200;

        // TODO: testing only, to be removed
        _mint(0x6E12A2f11De0b963ed63a1C70b2fFD4B88dF5365, GEM, 1000, '');
    }

    function buyGems(uint256 gems) public payable {
        require(msg.value == gems * gemPrice);
        require(balanceOf(address(this), GEM) >= gems);

        _safeTransferFrom(address(this), msg.sender, GEM, gems, '');

        emit Sold(msg.sender, GEM, gems);
    }

    function buyToken(uint256 id) public {
        uint256 tokenPrice = tokenGemPrices[id];
        require(tokenPrice >= 0);
        require(balanceOf(address(msg.sender), GEM) >= tokenPrice);
        require(balanceOf(address(this), id) > 0);

        _safeTransferFrom(msg.sender, address(this), GEM, tokenPrice, '');
        _safeTransferFrom(address(this), msg.sender, id, 1, '');

        emit Sold(msg.sender, id, 1);
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function increaseSupplyBatch(
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external onlyOwner {
        _increaseSupplyBatch(ids, amounts);
    }

    function setAdmin(
        address account, bool approved
    ) public onlyOwner {
        admins[account] = approved;
    }

    function setGemPrice(
        uint256 price
    ) public onlyOwner {
        gemPrice = price;
    }

    function setTokenGemPriceBatch(
        uint256[] calldata ids,
        uint256[] calldata prices
    ) external onlyOwner {
        require(ids.length == prices.length, "ids and prices length mismatch");
        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];
            uint256 price = prices[i];
            tokenGemPrices[id] = price;
        }
    }

    function isApprovedForAll(address account, address operator) public view virtual override returns (bool) {
        return admins[operator] || super.isApprovedForAll(account, operator);
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
        address /* operator */,
        address /* from */,
        uint256 /* id */,
        uint256 /* value */,
        bytes calldata /* data */
    ) external pure override returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155Received(address,address,uint256,uint256,bytes)"
                )
            );
    }

    function onERC1155BatchReceived(
        address /* operator */,
        address /* from */,
        uint256[] calldata /* ids */,
        uint256[] calldata /* values */,
        bytes calldata /* data */
    ) external pure override returns (bytes4) {
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
