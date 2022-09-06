import type { NextPage } from 'next';
import { message, Card, Tabs, Grid } from 'antd';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { PaperClipOutlined } from '@ant-design/icons';
import Items from '@components/Items';
import Collections, { CollectionType } from '@components/collections';
import { ICollections } from '../explore';
import { Collection } from '@prisma/client';

const { TabPane } = Tabs;

type ItemTokenData = {
  nftTokenId: number;
  nftTokenURI: string;
};

type Item = {
  nftTokenId: string;
  nftTokenURI: string;
  imageURL: string;
  name: string;
  description?: string;
  supply: number;
  collection?: string;
  blockchain: string;
};

type MyPageProps = {
  contract: any;
  currentAccount: string;
  network: {
    networkId: string;
    networkName: string;
  };
};

const MyPage: NextPage<MyPageProps> = ({
  contract,
  currentAccount,
  network
}: MyPageProps) => {
  const [myItemList, setMyItemList] = useState<Item[]>([]);
  const [myCollectionList, setMyCollectionList] =
    useState<CollectionType[]>(ICollections);

  useEffect(() => {
    if (contract && currentAccount && network) {
      const loadMyItemList = async (contract: any) => {
        const NFTsTokenData: ItemTokenData[] = await contract.methods
          .getNftTokens(currentAccount)
          .call();

        const NFTsMetadata = await Promise.all(
          NFTsTokenData.filter(res =>
            res.nftTokenURI.startsWith('https://')
          ).map(res =>
            Axios.get(res.nftTokenURI).then(({ data }) =>
              Object.assign(data, res)
            )
          )
        );

        const items: Item[] = NFTsMetadata.map(metadata => {
          const item: Item = {
            nftTokenId: metadata.nftTokenId,
            nftTokenURI: metadata.nftTokenURI,
            imageURL: `https://ipfs.io/ipfs/${metadata.image.split('//')[1]}`,
            name: metadata.name,
            description: metadata.description,
            supply: metadata.supply,
            collection: metadata.collection,
            blockchain: metadata.blockchain
          };
          return item;
        });

        setMyItemList(items.sort().reverse());
      };
      loadMyItemList(contract);

      const loadMyCollectionList = async () => {
        await fetch('/api/collection/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            networkId: network.networkId,
            account: currentAccount
          })
        })
          .then(response => response.json().catch(() => {}))
          .then(async data => {
            if (data?.collections && data?.collections?.length > 0) {
              await Promise.all(
                data.collections
                  .filter((res: Collection) =>
                    res.logoImageMetadata?.startsWith('https://')
                  )
                  .map((res: Collection) =>
                    Axios.get(res.logoImageMetadata).then(({ data }) => {
                      return Object.assign(res, { logoImageUrl: data.image });
                    })
                  )
              );

              await Promise.all(
                data.collections
                  .filter((res: Collection) =>
                    res.featuredImageMetadata?.startsWith('https://')
                  )
                  .map((res: any) =>
                    Axios.get(res.featuredImageMetadata).then(({ data }) => {
                      console.log(data.image);
                      return Object.assign(res, {
                        featuredImageUrl: data.image
                      });
                    })
                  )
              );

              setMyCollectionList(data.collections);
            }
          })
          .catch(error => {
            console.log(error);
          });
      };
      loadMyCollectionList();
    } else {
      setMyItemList([]);
      setMyCollectionList([]);
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
                className="w-full h-full text-base font-semibold"
              >
                <TabPane tab="Items" key="1">
                  <Items itemList={myItemList} />
                </TabPane>
                <TabPane tab="Collections" key="2">
                  <Collections collectionList={myCollectionList} />
                </TabPane>
                <TabPane tab="Activities" key="3"></TabPane>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPage;
