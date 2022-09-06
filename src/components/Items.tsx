import { Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { NextPage } from 'next';
import Link from 'next/link';

type NftType = {
  nftTokenId: string;
  nftTokenURI: string;
  imageURL: string;
  name: string;
  description?: string;
  supply: number;
  collection?: string;
  blockchain: string;
};

const Items: NextPage<NftType[]> = ({ itemList }: NftType[] | any) => {
  return (
    <ul className="w-52 sm:w-full h-full flex flex-wrap">
      {itemList?.map((myNft: NftType, key: number) => (
        <Link key={`link_${key}`} href={`/mypage/detail/${myNft.nftTokenId}`}>
          <li
            key={`li_${key}`}
            className="flex flex-col shadow rounded-md w-52 h-72 mb-5 sm:mr-5"
          >
            <Card
              key={`card_${key}`}
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
  );
};

export default Items;
