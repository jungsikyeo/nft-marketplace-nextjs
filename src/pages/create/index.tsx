import { useState } from 'react';
import type { NextPage } from 'next';
import { Title, Button } from '@components/atoms';
import {
  Divider,
  message,
  Upload,
  Input,
  Modal,
  Select,
  InputNumber
} from 'antd';
import { File, NFTStorage } from 'nft.storage';
import { PlusOutlined } from '@ant-design/icons';
import { cls } from '@libs/client/utils';
import { RcFile } from 'antd/lib/upload';
import { useRouter } from 'next/router';
import { Option } from 'antd/lib/mentions';

type Nft = {
  image: File;
  name: string;
  description?: string;
  supply: number;
  collection?: string;
  blockchain: string;
};

const requireClass = `after:content-['*'] after:ml-1 after:text-danger after:font-semibold`;
const sectionClass = `flex flex-col justify-start w-full mb-8`;
const titleClass = `text-sm font-bold mb-2`;
const messageClass = `text-xs font-semibold opacity-40 mb-2`;

const NFT_STORAGE_TOKEN: string =
  process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '';

const getBase64 = (file: RcFile) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = error => reject(error);
  });

const Create: NextPage = ({ currentAccount, contract }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [supply, setSupply] = useState(1);
  const [collection, setCollection] = useState('');
  const [blockchain, setBlockchain] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const router = useRouter();

  const handleCancel = () => {
    setPreviewVisible(false);
    setImage(null);
  };

  const handlePreview = async (file: RcFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }: RcFile[]) => {
    if (newFileList.length === 0) {
      handleCancel();
      setFileList(newFileList);
      return;
    }
    setLoading(true);
    const newFile = newFileList[newFileList.length - 1];
    if (newFile) {
      if (beforeUpload(newFile.type, newFile.size)) {
        setFileList(newFileList);
        setImage(newFile.originFileObj);
      } else {
        handleCancel();
      }
    }
    setLoading(false);
  };

  const beforeUpload = (fileType: string, fileSize: number) => {
    const isJpgOrPng =
      fileType === 'image/jpeg' ||
      fileType === 'image/png' ||
      fileType === 'image/gif' ||
      fileType === 'image/svg+xml' ||
      fileType === 'video/mp4' ||
      fileType === 'video/webm' ||
      fileType === 'audio/mp3' ||
      fileType === 'audio/wav' ||
      fileType === 'video/ogg' ||
      fileType === 'model/gltf-binary' ||
      fileType === 'model/gltf+json';
    if (!isJpgOrPng) {
      message.error('This file type cannot be uploaded!');
    }
    const isLt100M = fileSize / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.error('Image must smaller than 100MB!');
    }
    return isJpgOrPng && isLt100M;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleName = (event: any) => setName(event.target.value);

  const handleDescription = (event: any) => setDescription(event.target.value);

  const handleSupply = (value: number) => setSupply(value);

  const handleCollection = (value: string) => setCollection(value);

  const handleBlockchain = (value: string) => setBlockchain(value);

  const onMint = async () => {
    console.log(loading);
    setLoading(true);

    if (!image) {
      message.warning('Please upload NFT image!');
      setLoading(false);
      return;
    }

    if (!name) {
      message.warning('Please input NFT name!');
      setLoading(false);
      return;
    }

    const nft: Nft = {
      image,
      name,
      description,
      supply,
      collection,
      blockchain
    };

    if (!loading) {
      const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
      const metadata = await client.store(nft);
      contract.methods
        .mintNFT(
          currentAccount,
          `https://ipfs.io/ipfs/${metadata.url.split('//')[1]}`
        )
        .send({
          from: currentAccount
        })
        .once('receipt', receipt => {
          setLoading(false);
          router.push('/explore');
        });
    }
  };

  return (
    <div>
      <div className="w-full h-screen flex justify-center">
        <main className="flex flex-col items-start sm:w-1/2 md:w-2/5 w-2/3 py-11">
          <Title type="title-content" text="Create New Item" />
          <section className={sectionClass}>
            <div className={`${titleClass} ${requireClass}`}>
              Image, Video, Audio, or 3D Model
            </div>
            <div className={messageClass}>
              File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
              OGG, GLB, GLTF. Max size: 100 MB
            </div>
            <Upload
              action="/"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              maxCount={1}
            >
              {uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img alt="previewImage" className="w-full" src={previewImage} />
            </Modal>
          </section>
          <section className={sectionClass}>
            <div className={`${titleClass} ${requireClass}`}>Name</div>
            <div className="w-full">
              <Input onChange={handleName} placeholder="Item name" />
            </div>
          </section>
          <section className={sectionClass}>
            <div className={titleClass}>External link</div>
            <div className={messageClass}>
              OpenPlanet will include a link to this URL on this item's detail
              page, so that users can click to learn more about it. You are
              welcome to link to your own webpage with more details.
            </div>
            <div>
              <Input placeholder="https://yoursite.io/item/123" />
            </div>
          </section>
          <section className={sectionClass}>
            <div className={titleClass}>Description</div>
            <div className={messageClass}>
              The description will be included on the item's detail page
              underneath its image. Markdown syntax is supported.
            </div>
            <div>
              <Input.TextArea
                rows={4}
                placeholder="Provide a detailed description of your item."
                onChange={handleDescription}
              />
            </div>
          </section>
          <section className={sectionClass}>
            <div className={titleClass}>Collection</div>
            <div className={messageClass}>
              This is the collection where your item will appear.
            </div>
            <div>
              <Select
                style={{ width: '100%' }}
                placeholder="Select collection"
                onChange={handleCollection}
              ></Select>
            </div>
          </section>
          <section className={sectionClass}>
            <div className={titleClass}>Supply</div>
            <div className={messageClass}>
              The number of items that can be minted. No gas cost to you!
            </div>
            <div>
              <InputNumber
                onChange={handleSupply}
                placeholder="Selection collection"
                min={1}
                defaultValue={1}
              />
            </div>
          </section>
          <section className={sectionClass}>
            <div className={titleClass}>Blockchain</div>
            <div>
              <Select
                defaultValue="ethereum"
                style={{ width: '100%' }}
                onChange={handleBlockchain}
              >
                <Option value="ethereum">Ethereum</Option>
                <Option value="solana" disabled>
                  Solana
                </Option>
                <Option value="polygon" disabled>
                  Polygon
                </Option>
                <Option value="klaytn" disabled>
                  Klaytn
                </Option>
              </Select>
            </div>
          </section>
          <Divider />
          <section className={cls([...sectionClass, 'mb-10'])}>
            <Button
              type="primary"
              className="w-24 h-12"
              text="Primary"
              disabled={loading}
              onClick={onMint}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Create;
