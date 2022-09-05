import { useEffect, useRef, useState } from 'react';
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
import { PlusOutlined } from '@ant-design/icons';
import {
  beforeUpload,
  cls,
  extractMetadataUrl,
  uploadStore
} from '@libs/client/utils';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { useRouter } from 'next/router';
import { Option } from 'antd/lib/mentions';

type Collection = {
  account: string;
  networkId: string;
  name: string;
  slug: string;
  description: string;
  blockchain: string;
};

const requireClass = `after:content-['*'] after:ml-1 after:text-danger after:font-semibold`;
const sectionClass = `flex flex-col justify-start w-full mb-8`;
const titleClass = `text-sm font-bold mb-2`;
const messageClass = `text-xs font-semibold opacity-40 mb-2`;

const NFT_STORAGE_TOKEN: string =
  process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '';
const SERVER_URL: string = process.env.NEXT_PUBLIC_SERVER_URL || '';

const getBase64 = (file: UploadFile<any>) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = error => reject(error);
  });

const CreateCollection: NextPage = ({ currentAccount, network }) => {
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [logoImageFileList, setLogoImageFileList] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImageFileList, setFeaturedImageFileList] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageFileList, setBannerImageFileList] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [slug, setSlug] = useState('');
  const [blockchain, setBlockchain] = useState('ethereum');
  const [logoPreviewVisible, setLogoPreviewVisible] = useState(false);
  const [logoPreviewImage, setLogoPreviewImage] = useState('');
  const [logoPreviewTitle, setLogoPreviewTitle] = useState('');
  const [featuredPreviewVisible, setFeaturedPreviewVisible] = useState(false);
  const [featuredPreviewImage, setFeaturedPreviewImage] = useState('');
  const [featuredPreviewTitle, setFeaturedPreviewTitle] = useState('');
  const [bannerPreviewVisible, setBannerPreviewVisible] = useState(false);
  const [bannerPreviewImage, setBannerPreviewImage] = useState('');
  const [bannerPreviewTitle, setBannerPreviewTitle] = useState('');

  const router = useRouter();

  const handleLogoCancel = () => {
    setLogoPreviewVisible(false);
    setLogoImage(null);
  };

  const handleFeaturedCancel = () => {
    setFeaturedPreviewVisible(false);
    setFeaturedImage(null);
  };

  const handleBannerCancel = () => {
    setBannerPreviewVisible(false);
    setBannerImage(null);
  };

  const setPreview = async (file: UploadFile<any>, targetImage: string) => {
    let fileName: string,
      fileUrl: string,
      filePreview: string,
      fileTitle: string;

    fileName = file.name || '';
    fileUrl = file.url || '';
    filePreview = file.preview || '';
    if (!fileUrl && !filePreview) {
      filePreview = await getBase64(file.originFileObj);
    }

    fileTitle = fileName || fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

    if (targetImage === 'logo') {
      setLogoPreviewImage(fileUrl || filePreview);
      setLogoPreviewVisible(true);
      setLogoPreviewTitle(fileTitle);
    } else if (targetImage === 'featured') {
      setFeaturedPreviewImage(fileUrl || filePreview);
      setFeaturedPreviewVisible(true);
      setFeaturedPreviewTitle(fileTitle);
    } else if (targetImage === 'banner') {
      setBannerPreviewImage(fileUrl || filePreview);
      setBannerPreviewVisible(true);
      setBannerPreviewTitle(fileTitle);
    }
  };
  const handleLogoPreview = async (file: UploadFile<any>) => {
    setPreview(file, 'logo');
  };
  const handleFeaturedPreview = async (file: UploadFile<any>) => {
    setPreview(file, 'featured');
  };
  const handleBannerPreview = async (file: UploadFile<any>) => {
    setPreview(file, 'banner');
  };

  const handleLogoChange = ({
    fileList: newFileList
  }: UploadChangeParam<UploadFile<any>>) => {
    if (newFileList.length === 0) {
      handleLogoCancel();
      setLogoImageFileList(newFileList);
      return;
    }
    const newFile = newFileList[newFileList.length - 1];
    if (newFile) {
      if (beforeUpload(newFile.type, newFile.size)) {
        setLogoImageFileList(newFileList);
        setLogoImage(newFile.originFileObj);
      } else {
        handleLogoCancel();
      }
    }
  };

  const handleFeaturedChange = ({
    fileList: newFileList
  }: UploadChangeParam<UploadFile<any>>) => {
    if (newFileList.length === 0) {
      handleFeaturedCancel();
      setFeaturedImageFileList(newFileList);
      return;
    }
    const newFile = newFileList[newFileList.length - 1];
    if (newFile) {
      if (beforeUpload(newFile.type, newFile.size)) {
        setFeaturedImageFileList(newFileList);
        setFeaturedImage(newFile.originFileObj);
      } else {
        handleFeaturedCancel();
      }
    }
  };

  const handleBannerChange = ({
    fileList: newFileList
  }: UploadChangeParam<UploadFile<any>>) => {
    if (newFileList.length === 0) {
      handleBannerCancel();
      setBannerImageFileList(newFileList);
      return;
    }
    const newFile = newFileList[newFileList.length - 1];
    if (newFile) {
      if (beforeUpload(newFile.type, newFile.size)) {
        setBannerImageFileList(newFileList);
        setBannerImage(newFile.originFileObj);
      } else {
        handleBannerCancel();
      }
    }
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

  const handleName = (event: any) => {
    const newName = event.target.value;
    setName(newName);
  };
  const handleDescription = (event: any) => {
    setDescription(event.target.value);
    setDescriptionLength(event.target.value.length);
  };
  const handlelSlug = (event: any) => setSlug(event.target.value);
  const handleBlockchain = (value: string) => setBlockchain(value);
  const handleCreate = async () => {
    setSubmit(true);

    const collection: Collection = {
      account: currentAccount,
      networkId: network.networkId,
      name,
      slug: slug ? slug : name.replaceAll(' ', '-'),
      description: description,
      blockchain
    };

    if (!loading) {
      const logoMetadata = await uploadStore({
        ...collection,
        image: logoImage
      });

      const featuredMetadata = featuredImage
        ? await uploadStore({
            ...collection,
            image: featuredImage
          })
        : null;

      const bannerMetadata = bannerImage
        ? await uploadStore({
            ...collection,
            image: bannerImage
          })
        : null;

      await fetch('/api/collection/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          networkId: collection.networkId,
          account: collection.account,
          logoImageMetadata: extractMetadataUrl(logoMetadata),
          featuredImageMetadata: extractMetadataUrl(featuredMetadata),
          bannerImageMetadata: extractMetadataUrl(bannerMetadata),
          name: collection.name,
          description: collection.description,
          slug: collection.slug,
          blockchain: collection.blockchain
        })
      })
        .then(response => response.json().catch(() => {}))
        .then(data => {
          console.log(data);
          message.success('create collection success!');
          router.push('/mypage');
        })
        .catch(error => {
          message.error('create collection error!');
          console.log(error);
        })
        .finally(() => setSubmit(false));
    }
  };

  useEffect(() => {
    if (submit) {
      setLoading(true);
    } else {
      if (logoImage && name) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [logoImage, name, submit]);

  return (
    <div>
      <div className="w-full h-full flex justify-center">
        <main className="flex flex-col items-start sm:w-1/2 md:w-2/5 w-2/3 py-11">
          <Title type="title-content" text="Create New Collection" />
          <section className={sectionClass}>
            <div className={`${titleClass} ${requireClass}`}>Logo image</div>
            <div className={messageClass}>
              This image will also be used for navigation. 350 x 350
              recommended.
            </div>
            <Upload
              name="logoImage"
              action="/"
              listType="picture-card"
              fileList={logoImageFileList}
              onPreview={handleLogoPreview}
              onChange={handleLogoChange}
              maxCount={1}
            >
              {uploadButton}
            </Upload>
            <Modal
              visible={logoPreviewVisible}
              title={logoPreviewTitle}
              footer={null}
              onCancel={handleLogoCancel}
            >
              <img
                alt="logoPreviewImage"
                className="w-full"
                src={logoPreviewImage}
              />
            </Modal>
          </section>
          <section className={sectionClass}>
            <div className={`${titleClass}`}>Featured image</div>
            <div className={messageClass}>
              This image will be used for featuring your collection on the
              homepage, category pages, or other promotional areas of OpenSea.
              600 x 400 recommended.
            </div>
            <Upload
              action="/"
              listType="picture-card"
              fileList={featuredImageFileList}
              onPreview={handleFeaturedPreview}
              onChange={handleFeaturedChange}
              maxCount={1}
            >
              {uploadButton}
            </Upload>
            <Modal
              visible={featuredPreviewVisible}
              title={featuredPreviewTitle}
              footer={null}
              onCancel={handleFeaturedCancel}
            >
              <img
                alt="featuredPreviewImage"
                className="w-full"
                src={featuredPreviewImage}
              />
            </Modal>
          </section>
          <section className={sectionClass}>
            <div className={`${titleClass}`}>Banner image</div>
            <div className={messageClass}>
              This image will appear at the top of your collection page. Avoid
              including too much text in this banner image, as the dimensions
              change on different devices. 1400 x 350 recommended.
            </div>
            <Upload
              action="/"
              listType="picture-card"
              fileList={bannerImageFileList}
              onPreview={handleBannerPreview}
              onChange={handleBannerChange}
              maxCount={1}
            >
              {uploadButton}
            </Upload>
            <Modal
              visible={bannerPreviewVisible}
              title={bannerPreviewTitle}
              footer={null}
              onCancel={handleBannerCancel}
            >
              <img
                alt="bannerPreviewImage"
                className="w-full"
                src={bannerPreviewImage}
              />
            </Modal>
          </section>
          <section className={sectionClass}>
            <div className={`${titleClass} ${requireClass}`}>Name</div>
            <div className="w-full">
              <Input
                onChange={handleName}
                placeholder="Example: Treasures of the Planet"
              />
            </div>
          </section>
          <section className={sectionClass}>
            <div className={titleClass}>URL</div>
            <div className={messageClass}>
              Customize your URL on OpenSea. Must only contain lowercase
              letters, numbers, and hyphens.
            </div>
            <div>
              <Input
                addonBefore={`${SERVER_URL}/collection/`}
                placeholder="treasures-of-the-planet"
                onChange={handlelSlug}
              />
            </div>
          </section>
          <section className={sectionClass}>
            <div className={titleClass}>Description</div>
            <div className={messageClass}>
              Markdown syntax is supported. {descriptionLength} of 1000
              characters used.
            </div>
            <div>
              <Input.TextArea
                rows={4}
                onChange={handleDescription}
                maxLength={1000}
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
                <Option key="1" value="ethereum">
                  Ethereum
                </Option>
                <Option key="2" value="solana" disabled>
                  Solana
                </Option>
                <Option key="3" value="polygon" disabled>
                  Polygon
                </Option>
                <Option key="4" value="klaytn" disabled>
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
              text="Create"
              disabled={loading}
              onClick={handleCreate}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default CreateCollection;