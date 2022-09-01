// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

contract OpenPlanet is ERC721URIStorage, Ownable, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721('openpNFT', 'PNFT') {}

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function mintNFT(address recipient, string memory tokenURI)
    public
    returns (uint256)
  {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, tokenURI);
    return newItemId;
  }

  function listUserNFTs(address owner)
    external
    view
    returns (uint256[] memory)
  {
    uint256 balance = balanceOf(owner);
    uint256[] memory tokens = new uint256[](balance);
    for (uint256 i = 0; i < balance; i++) {
      tokens[i] = (tokenOfOwnerByIndex(owner, i));
    }

    return tokens;
  }

  struct NftTokenData {
    uint256 nftTokenId;
    string nftTokenURI;
    //uint price ;
  }

  function getNftTokens(address _nftTokenOwner)
    public
    view
    returns (NftTokenData[] memory)
  {
    uint256 balanceLength = balanceOf(_nftTokenOwner);
    NftTokenData[] memory nftTokenData = new NftTokenData[](balanceLength);
    for (uint256 i = 0; i < balanceLength; i++) {
      uint256 nftTokenId = tokenOfOwnerByIndex(_nftTokenOwner, i);
      string memory nftTokenURI = tokenURI(nftTokenId);
      nftTokenData[i] = NftTokenData(nftTokenId, nftTokenURI);
      // uint tokenPrice = getNftTokenPrice(nftTokenId);
      // nftTokenData[i] = NftTokenData(nftTokenId , nftTokenURI, tokenPrice );
    }

    return nftTokenData;
  }

  mapping(uint256 => uint256) public nftTokenPrices;
  uint256[] public onSaleNftTokenArray;

  function addToMarket(uint256 _tokenId, uint256 _price) public {
    address nftTokenOwner = ownerOf(_tokenId);
    require(nftTokenOwner == msg.sender, 'Caller is not nft token owner.');
    setApprovalForAll(address(this), true);

    nftTokenPrices[_tokenId] = _price;
    onSaleNftTokenArray.push(_tokenId); //판매중인 nft list
  }

  function getMarketList() public view returns (NftTokenData[] memory) {
    uint256[] memory onSaleNftToken = getSaleNftToken();
    NftTokenData[] memory onSaleNftTokens = new NftTokenData[](
      onSaleNftToken.length
    );

    for (uint256 i = 0; i < onSaleNftToken.length; i++) {
      uint256 tokenId = onSaleNftToken[i];
      //uint256 tokenPrice = getNftTokenPrice(tokenId);
      onSaleNftTokens[i] = NftTokenData(tokenId, tokenURI(tokenId));
    }

    return onSaleNftTokens;
  }

  function getSaleNftToken() public view returns (uint256[] memory) {
    return onSaleNftTokenArray;
  }

  function getNftTokenPrice(uint256 _tokenId) public view returns (uint256) {
    return nftTokenPrices[_tokenId];
  }

  function buyNft(uint256 _tokenId) public payable {
    uint256 price = nftTokenPrices[_tokenId];
    address nftTokenOwner = ownerOf(_tokenId);
    require(price > 0, 'nft token not sale.');
    require(nftTokenOwner != msg.sender, 'caller is nft token owner.');
    require(
      isApprovedForAll(nftTokenOwner, address(this)),
      'nft token owner did not approve token.'
    );
    payable(nftTokenOwner).transfer(msg.value);
    IERC721(address(this)).safeTransferFrom(
      nftTokenOwner,
      msg.sender,
      _tokenId
    );
    removeToken(_tokenId);
  }

  function burn(uint256 _tokenId) public {
    address addr_owner = ownerOf(_tokenId);
    require(
      addr_owner == msg.sender,
      'msg.sender is not the owner of the token'
    );
    _burn(_tokenId);
    removeToken(_tokenId);
  }

  function removeToken(uint256 _tokenId) private {
    nftTokenPrices[_tokenId] = 0;
    for (uint256 i = 0; i < onSaleNftTokenArray.length; i++) {
      if (nftTokenPrices[onSaleNftTokenArray[i]] == 0) {
        onSaleNftTokenArray[i] = onSaleNftTokenArray[
          onSaleNftTokenArray.length - 1
        ];
        onSaleNftTokenArray.pop();
      }
    }
  }
}