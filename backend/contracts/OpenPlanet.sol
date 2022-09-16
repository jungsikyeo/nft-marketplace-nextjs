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

  constructor() public ERC721('openPlanetNFT', 'OPNFT') {}

  mapping(uint256 => uint256) public nftTokenPrices;
  mapping(uint256 => string) public nftTokenCollections;
  uint256[] public onSaleNftTokenArray;

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

  function mintNFT(
    address recipient,
    string memory tokenURI,
    string memory collectionName
  ) public returns (uint256) {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, tokenURI);
    _setCollection(newItemId, collectionName);
    return newItemId;
  }

  function _setCollection(uint256 _tokenId, string memory collectionName)
    private
  {
    nftTokenCollections[_tokenId] = collectionName;
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
    string nftTokenCollection;
  }

  function getCollectionTokens() public view returns (NftTokenData[] memory) {
    uint256 totalLength = totalSupply();
    NftTokenData[] memory nftTokenData = new NftTokenData[](totalLength);
    for (uint256 i = 0; i < totalLength; i++) {
      uint256 nftTokenId = tokenByIndex(i);
      string memory nftTokenURI = tokenURI(nftTokenId);
      nftTokenData[i] = NftTokenData(
        nftTokenId,
        nftTokenURI,
        getCollectionName(nftTokenId)
      );
    }

    return nftTokenData;
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
      nftTokenData[i] = NftTokenData(
        nftTokenId,
        nftTokenURI,
        getCollectionName(nftTokenId)
      );
    }

    return nftTokenData;
  }

  function addToMarket(uint256 _tokenId, uint256 _price) public {
    // nft를 소유한 계정에서만 판매등록 가능
    address nftTokenOwner = ownerOf(_tokenId);

    // 마켓에 올리기 위한 조건들
    require(nftTokenOwner == msg.sender, 'Caller is not nft token owner.');
    // require(_price > 0, "Price is zero or lower.");
    // require(nftTokenPrices[_tokenId] == 0, "This nft token is already on sale.");

    setApprovalForAll(address(this), true);

    //판매 리스트에서 삭제
    removeToken(_tokenId);

    nftTokenPrices[_tokenId] = _price;

    // push를 이용해 데이터를 넣어줌
    onSaleNftTokenArray.push(_tokenId); //판매중인 nft list
  }

  // 판매리스트, 배열을 하나 만들고 Loop 돌리는 형태
  function getMarketList() public view returns (NftTokenData[] memory) {
    uint256[] memory onSaleNftToken = getSaleNftToken();
    NftTokenData[] memory onSaleNftTokens = new NftTokenData[](
      onSaleNftToken.length
    );

    for (uint256 i = 0; i < onSaleNftToken.length; i++) {
      uint256 tokenId = onSaleNftToken[i];
      onSaleNftTokens[i] = NftTokenData(
        tokenId,
        tokenURI(tokenId),
        getCollectionName(tokenId)
      );
    }

    return onSaleNftTokens;
  }

  function getCollectionName(uint256 _tokenId)
    public
    view
    returns (string memory)
  {
    return nftTokenCollections[_tokenId];
  }

  function getSaleNftToken() public view returns (uint256[] memory) {
    return onSaleNftTokenArray;
  }

  function getNftTokenPrice(uint256 _tokenId) public view returns (uint256) {
    return nftTokenPrices[_tokenId];
  }

  //구매함수, payable 사용!!
  function buyNft(uint256 _tokenId) public payable {
    // 금액
    uint256 price = nftTokenPrices[_tokenId];
    // 해당 nft 소유자
    address nftTokenOwner = ownerOf(_tokenId);

    // 제한사항, owner는 구매하지 못함.
    require(price > 0, 'nft token not sale.');
    // require(price  <= msg.value, "caller sent lower than price.");
    require(nftTokenOwner != msg.sender, 'caller is nft token owner.');
    // 상태가 false일때는 구매 못함.
    require(
      isApprovedForAll(nftTokenOwner, address(this)),
      'nft token owner did not approve token.'
    );

    // 구매가 이루어지면 nft를 transfer
    payable(nftTokenOwner).transfer(msg.value);

    // 소유권 이전. IERC721에 정의된 스펙
    IERC721(address(this)).safeTransferFrom(
      nftTokenOwner,
      msg.sender,
      _tokenId
    );

    //판매 리스트에서 삭제
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
