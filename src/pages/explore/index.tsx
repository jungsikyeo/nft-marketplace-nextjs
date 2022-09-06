import type { NextPage } from 'next';
import { Typography, Tabs, Card } from 'antd';
import { useEffect, useState } from 'react';
import { Collection } from '@prisma/client';
import Axios from 'axios';
import Collections, { CollectionType } from '@components/collections';

const { TabPane } = Tabs;
const { Title } = Typography;

type ExploreProps = {
  network: {
    networkId: string;
  };
  currentAccount: string;
};

export const ICollections: CollectionType[] = [
  {
    name: '',
    logoImageUrl: '',
    featuredImageUrl: ''
  }
];

const Explore: NextPage<ExploreProps> = ({
  network,
  currentAccount
}: ExploreProps) => {
  const [allList, setAllList] = useState<CollectionType[]>(ICollections);
  const [myList, setMyList] = useState<CollectionType[]>(ICollections);

  useEffect(() => {
    if (network && currentAccount) {
      const getAllCollection = async () => {
        await fetch('/api/collection/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            networkId: network.networkId
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

              const myList = data.collections.filter((res: any) => {
                console.log(res.account === currentAccount);
                return res.account === currentAccount;
              });

              setAllList(data.collections);
              setMyList(myList);
            }
          })
          .catch(error => {
            console.log(error);
          });
      };
      getAllCollection();
    }
  }, [network, currentAccount]);

  return (
    <div>
      <div className="w-full h-screen flex justify-start">
        <main className="w-full h-full flex flex-col p-14">
          <div className="flex sm:flex-row flex-col w-42 w">
            <div className="flex flex-col justify-center items-center mt-2 sm:mt-0">
              <Title level={1}>Explore collections</Title>
            </div>
          </div>
          <div className="w-full h-full mt-5">
            <div className="w-full h-auto flex justify-center sm:block sm:justify-start">
              <Tabs
                defaultActiveKey="1"
                className="w-full h-full text-base font-semibold"
              >
                <TabPane tab="All" key="1">
                  <Collections collectionList={allList} />
                </TabPane>
                <TabPane tab="My collections" key="2">
                  <Collections collectionList={myList} />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;
