import {
  Button,
  Card,
  Col,
  Collapse,
  Empty,
  Image,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  Input
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  AlignLeftOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
  StockOutlined,
  TagFilled,
  TagsFilled,
  UnorderedListOutlined,
  WalletFilled,
  ZoomInOutlined
} from '@ant-design/icons';
import { loginWarningNoti } from '@components/notification';
import Axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Gap } from '@components/atoms';
import Link from 'next/link';

const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;

const columns = [
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: text => <>{text}</>
  },
  {
    title: 'Expiration',
    dataIndex: 'expiration',
    key: 'expiration',
    render: text => <Paragraph ellipsis>{text}</Paragraph>
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: text => <Paragraph ellipsis>{text}</Paragraph>
  }
];

const data = [];

// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i,
//     price: `100 ETH`,
//     expiration: `${(1 + i).toFixed()} minutes ago`,
//     from: `0x5A2609D698DE041B1Ba77139A4229c8a161dDd9e`
//   });
// }

const onChange = key => {
  console.log(key);
};

const NftDetail: NextPage = ({ contract, currentAccount, network }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [collectionName, setCollectionName] = useState('');

  // const tx_id = location.pathname.split('/')[4];
  // const token_id = location.pathname.split('/')[5];

  // const getNFTList = async () => {
  //   const response = await getNFTDetailAPI(tx_id, token_id);
  //   setNFTName(response.name);
  //   setNFTImg(response.image_url);
  //   setNFTDescription(response.description);
  //   setNFTCollectionName(response.collection.name);
  // };

  const getNFTList = async () => {
    if (contract && currentAccount) {
      console.log('GET GET START');
      const result = await contract.methods
        .getNftTokens(currentAccount)
        .call({ from: currentAccount });

      const metadata = await Promise.all(
        result
          .filter(res => res.nftTokenId === router.query.id)
          .map(res =>
            Axios.get(res.nftTokenURI).then(({ data }) =>
              Object.assign(data, res)
            )
          )
      );

      console.log(metadata);

      const correctMetadata = await metadata
        .filter(meta => meta.image)
        .map(meta => {
          return {
            name: meta.name,
            imageUrl: `https://ipfs.io/ipfs/${meta.image.split('//')[1]}`,
            collectionName: meta.collection,
            description: meta.description,
            price: meta.price
          };
        });

      if (correctMetadata[0] !== undefined) {
        setName(correctMetadata[0].name);
        setPrice(correctMetadata[0].price);
        setImageUrl(correctMetadata[0].imageUrl);
        setCollectionName(correctMetadata[0].collectionName);
        setDescription(correctMetadata[0].description);
      }
    }
  };

  useEffect(() => {
    getNFTList();
  }, [currentAccount, contract, router.query.id]);

  const [address, setAddress] = useState('');

  const onMakeOffer = async () => {
    return;
    !currentAccount && loginWarningNoti();
    // console.log(tokenContract);
    // tokenContract.methods.setApprovalForAll(contract_addr, 'true').send({
    //   from: account,
    // });
    contract.methods.addToMarket(router.query.id, '100').send({
      from: currentAccount,
      gas: 210000
    });
  };

  const onSendTransfer = async () => {
    !currentAccount && loginWarningNoti();
    contract.methods
      .transferFrom(currentAccount, address, router.query.id)
      .send({
        from: currentAccount,
        gas: 210000
      });
  };

  return (
    <div className="w-full h-full">
      <div className="mx-5 my-10 sm:m-10">
        <div className="flex justify-center">
          <div className="w-full sm:w-[50rem] md:w-[65rem]">
            {/* Header */}
            <div className="h-20 flex flex-col">
              <Title level={5} className="text-info">
                <Link href={`/collection/${collectionName}`}>
                  {collectionName}
                </Link>
              </Title>
              <Title level={2} className="mt-0">
                {name}
              </Title>
            </div>

            {/* // NFT image Box  */}
            <div className="w-full flex flex-col sm:flex-row justify-start items-start">
              <div className="w-full sm:w-1/2 flex flex-col mr-5 mb-10">
                <Card
                  size="small"
                  title={''}
                  className="flex justify-center items-center rounded-lg mb-5"
                >
                  <Image
                    src={imageUrl}
                    alt={`${name}`}
                    width="100%"
                    preview={false}
                  />
                </Card>
                {/* Curren Price Box */}
                <Card
                  title={
                    <>
                      <ClockCircleOutlined /> Sale ends August 16, 2022 at
                      2:32am GMT+9
                    </>
                  }
                  className="rounded-lg"
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text type="secondary">Current price</Text>
                    <Space className="h-12">
                      <div className="h-full flex items-center">
                        <svg
                          width="23"
                          height="30"
                          viewBox="0 0 33 53"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.3576 0.666687L16.0095 1.85009V36.1896L16.3576 36.5371L32.2976 27.115L16.3576 0.666687Z"
                            fill="#343434"
                          />
                          <path
                            d="M16.3578 0.666687L0.417816 27.115L16.3578 36.5372V19.8699V0.666687Z"
                            fill="#8C8C8C"
                          />
                          <path
                            d="M16.3575 39.5552L16.1613 39.7944V52.0268L16.3575 52.6L32.307 30.1378L16.3575 39.5552Z"
                            fill="#3C3C3B"
                          />
                          <path
                            d="M16.3578 52.5998V39.5551L0.417816 30.1377L16.3578 52.5998Z"
                            fill="#8C8C8C"
                          />
                          <path
                            d="M16.3575 36.537L32.2973 27.1151L16.3575 19.8699V36.537Z"
                            fill="#141414"
                          />
                          <path
                            d="M0.417816 27.1151L16.3576 36.537V19.8699L0.417816 27.1151Z"
                            fill="#393939"
                          />
                        </svg>
                      </div>
                      <Title
                        level={2}
                        className="h-full flex justify-center mb-0"
                      >
                        {price}
                      </Title>
                    </Space>
                    <Input
                      placeholder="e.g. 0x1ed3... or destination.eth"
                      onChange={e => {
                        setAddress(e.target.value);
                      }}
                    />
                    <span className="flex justify-center items-center text-xs font-semibold -mt-1 mb-1">{`"${name}" will be transferred to ...`}</span>
                    <Button
                      type="primary"
                      size="large"
                      style={{ width: '100%' }}
                      onClick={onSendTransfer}
                      className="flex items-center justify-center"
                    >
                      <WalletFilled />
                      <span>Transfer</span>
                    </Button>
                    <Button
                      size="large"
                      style={{ width: '100%' }}
                      onClick={onMakeOffer}
                      className="flex items-center justify-center"
                    >
                      <TagFilled />
                      <span>Make offer</span>
                    </Button>
                  </Space>
                </Card>
              </div>

              {/* Order Box */}
              <div className="w-full sm:w-1/2 flex flex-col">
                {/* Description */}
                <div>
                  <Collapse
                    defaultActiveKey={['1', '2']}
                    onChange={onChange}
                    expandIconPosition={'end'}
                    className="rounded-lg mb-5"
                  >
                    <Panel
                      header={
                        <div className="flex items-center font-semibold">
                          <AlignLeftOutlined />
                          <span className="ml-2">Description</span>
                        </div>
                      }
                      key="1"
                    >
                      {description}
                    </Panel>
                    <Panel
                      header={
                        <div className="flex items-center font-semibold">
                          <TagsFilled />
                          <span className="ml-2">Properties</span>
                        </div>
                      }
                      key="2"
                    >
                      <Empty />
                    </Panel>
                    <Panel
                      header={
                        <div className="flex items-center font-semibold">
                          <ProfileOutlined />
                          <span className="ml-2">About {collectionName}</span>
                        </div>
                      }
                      key="3"
                    >
                      <Empty />
                    </Panel>
                    <Panel
                      header={
                        <div className="flex items-center font-semibold">
                          <ZoomInOutlined />
                          <span className="ml-2">Details</span>
                        </div>
                      }
                      key="4"
                      className="rounded-b-lg"
                    >
                      <Empty />
                    </Panel>
                  </Collapse>
                </div>
                {/* Price Box */}
                <div>
                  <Collapse
                    expandIconPosition={'end'}
                    onChange={onChange}
                    className="rounded-lg mb-5"
                  >
                    <Panel
                      header={
                        <div className="flex items-center font-semibold">
                          <StockOutlined />
                          <span className="ml-2">Price History</span>
                        </div>
                      }
                      key="1"
                      className="rounded-b-lg"
                    >
                      <Empty />
                    </Panel>
                  </Collapse>
                  {/* Listings Box */}
                  <Collapse
                    expandIconPosition={'end'}
                    onChange={onChange}
                    className="rounded-lg mb-5"
                  >
                    <Panel
                      header={
                        <div className="flex items-center font-semibold">
                          <TagFilled />
                          <span className="ml-2">Listings</span>
                        </div>
                      }
                      key="1"
                      className="rounded-b-lg"
                    >
                      <Empty />
                    </Panel>
                  </Collapse>
                  {/* Offers Box */}
                  <Collapse
                    defaultActiveKey={['1']}
                    expandIconPosition={'end'}
                    onChange={onChange}
                    className="rounded-lg"
                  >
                    <Panel
                      header={
                        <div className="flex items-center font-semibold">
                          <UnorderedListOutlined />
                          <span className="ml-2">Offers</span>
                        </div>
                      }
                      key="1"
                      className="mb-5 rounded-b-lg"
                    >
                      {/* <Empty /> */}
                      <Table
                        width="100%"
                        columns={columns}
                        dataSource={data}
                        pagination={{
                          pageSize: 50
                        }}
                        scroll={{
                          y: 240
                        }}
                      />
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetail;
