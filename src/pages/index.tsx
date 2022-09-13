import { GetServerSideProps, NextPage } from 'next';
import Items from '@components/Items';
import {
  HomePropsType,
  ItemTokenDataType,
  ItemType
} from '@libs/client/client';
import { Button } from 'antd';
import Axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { extractMetadataUrl } from '@libs/client/utils';
import OpenPlanet from '@abis/OpenPlanet.json';

const Home: NextPage<HomePropsType> = ({
  web3,
  currentAccount
}: HomePropsType) => {
  const [trendItemList, setTrendItemList] = useState<ItemType[]>();
  const [mainImage, setMainImage] = useState<ItemType>();
  const [openPlanetContract, setOpenPlanetContract] = useState(null);
  const networkId = process.env.NEXT_PUBLIC_MARKET_NETWORK || 1661918429880;
  const mainetURL =
    process.env.NEXT_PUBLIC_MAINNET_URL || 'http://144.24.70.230:8545';

  useEffect(() => {
    const loadOpenPlanet = async (networkId: any) => {
      if (networkId && web3 && web3.eth) {
        const newNetworks: any = OpenPlanet.networks;
        const networkData: any = newNetworks[networkId];
        if (networkData) {
          const abi: any = OpenPlanet.abi;
          const address: string = networkData.address;
          const openPlanetContract: any = await new web3.eth.Contract(
            abi,
            address
          );
          openPlanetContract.setProvider(mainetURL);
          setOpenPlanetContract(openPlanetContract);
        }
      }
    };
    loadOpenPlanet(networkId);
  }, [networkId, web3]);

  useEffect(() => {
    trendItemList &&
      trendItemList.map((item, key) => {
        if (key === 0) {
          console.log(item);
          setMainImage({
            nftTokenId: item.nftTokenId,
            nftTokenURI: item.nftTokenURI,
            imageURL: item.imageURL,
            name: item.name,
            description: item.description,
            supply: item.supply,
            collection: item.collection,
            blockchain: item.blockchain
          });
        }
      });
  }, [trendItemList]);

  useEffect(() => {
    if (openPlanetContract) {
      const loadMyItemList = async (contract: any) => {
        const NFTsTokenData: ItemTokenDataType[] = await contract.methods
          .getMarketList()
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
            imageURL: extractMetadataUrl(metadata.image),
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
      loadMyItemList(openPlanetContract);
    } else {
      setTrendItemList([]);
    }
  }, [openPlanetContract]);

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
        {mainImage && (
          <Image
            src={mainImage.imageURL}
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
        )}
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
                  href={`/item/create/${networkId}/${currentAccount}`}
                  className="w-36 h-14 bg-white border-white text-info ml-5 flex justify-center items-center"
                >
                  Create
                </Button>
              </div>
            </div>
            <div className="w-full xl:w-1/2 mt-10 xl:mt-0 flex justify-center xl:justify-end xl:mr-10">
              {mainImage && (
                <Link href={`/item/detail/${mainImage?.nftTokenId}`}>
                  <a>
                    <div className="w-[35rem] shadow-2xl rounded-3xl">
                      <Image
                        src={mainImage.imageURL}
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
                            {mainImage?.name}
                          </span>
                          <span className="mt-2">{mainImage?.collection}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full xl:w-1/2 flex flex-col items-center">
            <div className="mt-20 text-2xl font-semibold">Recently Items</div>
            <div className="mt-5">
              {trendItemList && <Items itemList={trendItemList} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
