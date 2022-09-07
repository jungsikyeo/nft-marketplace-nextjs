export type CollectionType = {
  name: string;
  logoImageUrl?: string;
  featuredImageUrl?: string;
  account: string;
  networkId: string;
  slug: string;
  description: string;
  blockchain: string;
};

export type ItemType = {
  nftTokenId?: string;
  nftTokenURI?: string;
  imageURL?: string;
  name: string;
  description?: string;
  supply: number;
  collection?: string;
  blockchain: string;
  image?: File | null;
  price?: number;
  external_link?: string;
};

export type CreateCollectionType = {
  isUserLoggedIn: boolean;
  currentAccount: string;
  network: {
    networkId: string;
    networkName: string;
  };
  connectWallet: any;
};

export type CreateItemType = {
  isUserLoggedIn: boolean;
  currentAccount: string;
  contract: any;
  collections: string[];
  connectWallet: any;
};

export type ItemTokenDataType = {
  nftTokenId: number;
  nftTokenURI: string;
};

export type ItemDefailType = {
  contract: any;
  currentAccount: string;
};

export type MyPagePropsType = {
  contract: any;
  currentAccount: string;
  network: {
    networkId: string;
    networkName: string;
  };
};

export type ExplorePropsType = {
  network: {
    networkId: string;
  };
  currentAccount: string;
};

export type LoginPropsType = {
  connectWallet: any;
};

export type HomePropsType = {
  contract: any;
  currentAccount: string;
  network: {
    networkId: string;
    networkName: string;
  };
};

export const ICollections: CollectionType[] = [
  {
    name: '',
    logoImageUrl: '',
    featuredImageUrl: '',
    account: '',
    networkId: '',
    slug: '',
    description: '',
    blockchain: ''
  }
];

export interface HeaderProps {
  title: string;
  setTitle: any;
  network: {
    networkId: string;
    networkName: string;
  };
  isUserLoggedIn: boolean;
  currentAccount: string;
  balance: string;
  sidebar: boolean;
  nightMode: boolean;
  setSidebar: any;
  setNightMode: any;
  connectWallet: any;
  disconnectWallet: any;
}

export type AppLayoutPropsType = {
  children: React.ReactNode | any;
};

export interface IWindow {
  ethereum: any;
}
