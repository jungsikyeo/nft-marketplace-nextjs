import { message } from 'antd';
import { NFTStorage } from 'nft.storage';

export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export const beforeUpload = (fileType: string, fileSize: number) => {
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

const NFT_STORAGE_TOKEN: string =
  process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '';
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
export const uploadStore = async (storeData: any) => {
  return await client.store({
    ...storeData
  });
};

export const extractMetadataUrl = (metadata: any) => {
  return metadata ? `https://ipfs.io/ipfs/${metadata.url.split('//')[1]}` : '';
};
