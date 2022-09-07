import Collections from '@components/collections';
import Items from '@components/Items';
import {
  CollectionType,
  HomePropsType,
  ICollections,
  ItemTokenDataType,
  ItemType
} from '@libs/client/client';
import { Button } from 'antd';
import Axios from 'axios';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Home: NextPage<HomePropsType> = ({
  contract,
  currentAccount,
  network
}: HomePropsType) => {
  const [trendItemList, setTrendItemList] = useState<ItemType[]>([]);

  useEffect(() => {
    if (contract && currentAccount && network) {
      const loadMyItemList = async (contract: any) => {
        const NFTsTokenData: ItemTokenDataType[] = await contract.methods
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

        const items: ItemType[] = NFTsMetadata.map(metadata => {
          const item: ItemType = {
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

        console.log(items);

        setTrendItemList(items.sort().reverse());
      };
      loadMyItemList(contract);
    } else {
      setTrendItemList([]);
    }
  }, [contract, currentAccount, network]);

  return trendItemList ? (
    trendItemList.map((item, key) => {
      if (key === 0) {
        return (
          <div className="w-full h-auto flex flex-col justify-between">
            <div className="w-full h-[50rem] relative opacity-30">
              <div
                style={{
                  position: 'absolute',
                  zIndex: 3,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(transparent, rgb(255, 255, 255))'
                }}
              ></div>
              <Image
                src={item.imageURL}
                width="100%"
                height="100%"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                alt="image"
                style={{
                  zIndex: 1,
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
            <div className="w-full h-[35rem] absolute left-0 top-52">
              <div className="w-full flex justify-center">
                <div className="w-4/5 xl:w-[80rem] flex flex-col xl:flex-row justify-between">
                  <div className="w-full xl:w-1/2 flex flex-col justify-evenly xl:justify-center xl:ml-10">
                    <p className="w-full text-[2.7rem] font-bold leading-tight break-words flex justify-center xl:justify-start">
                      Discover, collect, and sell extraordinary NFTs
                    </p>
                    <p className="w-full mt-5 text-2xl font-normal flex justify-center xl:justify-start">
                      OpenSea is the world`s first and largest NFT marketplace
                    </p>
                    <div className="flex justify-center xl:justify-start mt-5">
                      <Button
                        type="primary"
                        href="/explore"
                        className="w-36 h-14 bg-info border-info flex justify-center items-center"
                      >
                        Explore
                      </Button>
                      <Button
                        type="primary"
                        href={`/create/item/${network.networkId}/${currentAccount}`}
                        className="w-36 h-14 bg-white border-white text-info ml-5 flex justify-center items-center"
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                  <div className="w-full xl:w-1/2 mt-10 xl:mt-0 flex justify-center xl:justify-end xl:mr-10">
                    <Link href="/item/">
                      <div className="w-[35rem] shadow-2xl rounded-3xl">
                        <Image
                          src={item.imageURL}
                          width="560"
                          height="500"
                          layout="fixed"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-t-3xl"
                          alt="image"
                          style={{
                            zIndex: 5
                          }}
                        />
                        <div className="flex">
                          <div className="flex flex-col my-3 mx-7">
                            <span className="text-lg font-semibold">
                              {item.name}
                            </span>
                            <span className="mt-2">{item.collection}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full xl:w-1/2 flex flex-col items-center">
                  <div className="mt-20 text-2xl font-semibold">
                    Trending Items
                  </div>
                  <div className="mt-5">
                    {trendItemList && <Items itemList={trendItemList} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    })
  ) : (
    <></>
  );
};

export default Home;
