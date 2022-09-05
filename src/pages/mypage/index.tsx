import type { NextPage } from 'next';
import { Title } from '@components/atoms';
import { message, Card, List, Tabs, Grid, Tag, Row, Col } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { PaperClipOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { TabPane } = Tabs;
const { useBreakpoint } = Grid;
const { Meta } = Card;

type NftTokenData = {
  nftTokenId: number;
  nftTokenURI: string;
};

type Nft = {
  nftTokenId: string;
  nftTokenURI: string;
  imageURL: string;
  name: string;
  description?: string;
  supply: number;
  collection?: string;
  blockchain: string;
};

const MyPage: NextPage = ({ contract, currentAccount, network }) => {
  const [myNFTs, setMyNFTs] = useState<Nft[]>([]);
  const handleTabs = () => {};

  useEffect(() => {
    if (contract && currentAccount && network) {
      const loadMyNFTs = async contract => {
        const NFTsTokenData: NftTokenData[] = await contract.methods
          .getNftTokens(currentAccount)
          .call();
        //console.log('myNFTs:', NFTsTokenData);

        const NFTsMetadata = await Promise.all(
          NFTsTokenData.filter(res =>
            res.nftTokenURI.startsWith('https://')
          ).map(res =>
            Axios.get(res.nftTokenURI).then(({ data }) =>
              Object.assign(data, res)
            )
          )
        );
        //console.log('metadata:', NFTsMetadata);

        const NFTs: Nft[] = NFTsMetadata.map(metadata => {
          console.log(metadata);
          const nft: Nft = {
            nftTokenId: metadata.nftTokenId,
            nftTokenURI: metadata.nftTokenURI,
            imageURL: `https://ipfs.io/ipfs/${metadata.image.split('//')[1]}`,
            name: metadata.name,
            description: metadata.description,
            supply: metadata.supply,
            collection: metadata.collection,
            blockchain: metadata.blockchain
          };
          return nft;
        });
        //console.log('myNFTs:', NFTs);

        setMyNFTs(NFTs.sort().reverse());
      };
      loadMyNFTs(contract);
    }
  }, [contract, currentAccount, network]);

  const addressId =
    currentAccount?.length > 0
      ? `${currentAccount.substring(0, 6)} . . . ${currentAccount.substring(
          currentAccount.length - 4,
          currentAccount.length
        )}`
      : '';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentAccount);
    message.success('Copied!');
  };

  return (
    <div>
      <div className="w-full h-screen flex justify-start">
        <main className="w-full h-full flex flex-col p-14">
          <div className="flex sm:flex-row flex-col w-42 w">
            <div className="flex justify-center sm:block sm:justify-start">
              <div className="flex items-center justify-center rounded-full p-1 border-2 text-info">
                <Jazzicon
                  diameter={100}
                  seed={jsNumberForAddress(currentAccount)}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-2 sm:mt-0 sm:ml-10">
              <div className="text-3xl font-semibold">{addressId}</div>
              <div className="w-full flex justify-center sm:justify-start mt-2">
                <button
                  onClick={handleCopyAddress}
                  className="flex items-center border-2 border-grey3 hover:border-black hover:bg-black hover:text-white hover:transition-all rounded-md font-medium py-1 px-2"
                >
                  <span>{addressId}</span>
                  <PaperClipOutlined className="ml-2" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full h-full mt-5">
            <div className="w-full h-auto flex justify-center sm:block sm:justify-start">
              <Tabs
                defaultActiveKey="1"
                onChange={handleTabs}
                className="w-full h-full text-base font-semibold"
              >
                <TabPane tab="Items" key="1">
                  <ul className="w-52 sm:w-full h-full flex flex-wrap">
                    {myNFTs?.map((myNft: Nft, key: number) => (
                      <Link
                        href={`/mypage/detail/${myNft.nftTokenId}`}
                        alt="token_id"
                      >
                        <li
                          key={key}
                          className="flex flex-col shadow rounded-md w-52 h-72 mb-5 sm:mr-5"
                        >
                          <Card
                            hoverable
                            className="flex flex-col justify-between"
                            style={{
                              width: '100%',
                              height: '100%'
                            }}
                            cover={
                              <div className="h-4/6">
                                <img
                                  alt={myNft.name}
                                  width="100%"
                                  height="100%"
                                  style={{ overflow: 'hidden' }}
                                  src={myNft.imageURL}
                                />
                              </div>
                            }
                          >
                            <Meta
                              title={myNft.name}
                              description={myNft.collection || 'default'}
                            />
                          </Card>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </TabPane>
                <TabPane tab="Activities" key="2"></TabPane>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPage;
