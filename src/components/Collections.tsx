import { Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { NextPage } from 'next';
import Link from 'next/link';

export type CollectionType = {
  name: string;
  logoImageUrl: string;
  featuredImageUrl?: string;
};

const Collections: NextPage<CollectionType[]> = ({
  collectionList
}: CollectionType[] | any) => {
  return (
    <ul className="w-[30rem] sm:w-full h-full flex flex-wrap">
      {collectionList?.length > 0 &&
        collectionList?.map((collection: any, key: number) => (
          <Link key={`link_${key}`} href={`/explore/${collection?.name}`}>
            <li
              key={`li_${key}`}
              className="flex flex-col shadow rounded-md w-[30rem] h-96 mb-5 sm:mr-5"
            >
              <Card
                key={`card_${key}`}
                hoverable
                className="flex flex-col justify-between"
                style={{
                  width: '480px',
                  height: '280px'
                }}
                cover={
                  collection?.featuredImageUrl ? (
                    <img
                      alt={collection?.name}
                      className="bg-fixed"
                      style={{
                        width: '480px',
                        height: '280px',
                        objectFit: 'cover'
                      }}
                      src={`https://ipfs.io/ipfs/${
                        collection?.featuredImageUrl?.split('//')[1]
                      }`}
                    />
                  ) : (
                    <img
                      alt={collection?.name}
                      className="bg-fixed"
                      style={{
                        width: '480px',
                        height: '280px',
                        objectFit: 'cover'
                      }}
                      src={`https://ipfs.io/ipfs/${
                        collection?.logoImageUrl?.split('//')[1]
                      }`}
                    />
                  )
                }
              >
                <div className="flex">
                  <div className="relative left-0 -top-10 flex border-4 border-white shadow-md rounded-2xl">
                    <img
                      alt={collection?.name}
                      width="90"
                      height="90"
                      src={`https://ipfs.io/ipfs/${
                        collection?.logoImageUrl?.split('//')[1]
                      }`}
                      className="rounded-xl"
                    />
                  </div>
                  <Meta
                    title={
                      <span className="font-bold">{collection?.name}</span>
                    }
                    className="ml-5 mt-1"
                  />
                </div>
              </Card>
            </li>
          </Link>
        ))}
    </ul>
  );
};

export default Collections;
