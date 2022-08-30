import Head from 'next/head';
import Image from 'next/image';
import { Input, Switch } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  WalletOutlined,
  WalletTwoTone,
  MoreOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  SettingFilled,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import {
  changedAccountNoti,
  changedNetworkNoti,
  getNetworkName,
  loginWarningNoti,
  logOutSuccessNoti
} from '../notification';

interface LayoutProps {
  title?: string;
}

interface IWindow {
  ethereum: any;
}

export default function Layout({ title }: LayoutProps) {
  const [web3, setWeb3] = useState({});
  const [network, setNetwork] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [balance, setbalance] = useState('');
  const [sidebar, setSidebar] = useState(false);
  const [nightMode, setNightMode] = useState(false);

  const connectWallet = async () => {
    try {
      const ethereum: IWindow['ethereum'] = (window as any).ethereum;
      if (!ethereum) {
        console.log('Metamask not detected');
        return;
      }

      const web = new Web3(ethereum);
      setWeb3(web);

      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log(chainId);

      const ganacheTestChainId = '0x539';
      if (chainId !== ganacheTestChainId) {
        alert('you are not connected to the ethereum testnet!');
        setCorrectNetwork(false);
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      console.log('Found account', accounts[0]);
      setIsUserLoggedIn(true);
      setCurrentAccount(accounts[0]);

      let balanceWei = await web.eth.getBalance(accounts[0]);
      let balanceETH = await web.utils.fromWei(balanceWei, 'ether');
      const balanceStr = String(balanceETH);
      setbalance(balanceStr);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const disconnectWallet = async () => {
    try {
      setWeb3({});
      setNetwork('');
      setCorrectNetwork(false);
      setIsUserLoggedIn(false);
      setCurrentAccount('');
      setbalance('');
    } catch (e) {
      console.log(e);
    }
  };

  const getBalance = async (account: string) => {
    let balanceWei = await (web3 as any).eth.getBalance(account);
    let balanceETH = await (web3 as any).utils.fromWei(balanceWei, 'ether');
    const balanceStr = String(balanceETH);
    setbalance(balanceStr);
  };

  const handleAccountChange = (...args: (string | any[])[]) => {
    const _account = args[0][0];
    if (args[0].length === 0) {
      loginWarningNoti();
    } else if (_account !== currentAccount) {
      setCurrentAccount(_account);
      getBalance(_account);
      changedAccountNoti(_account);
    }
  };

  useEffect(() => {
    (window as any).ethereum?.on('accountsChanged', handleAccountChange);
    return () => {
      (window as any).ethereum?.removeListener(
        'accountsChanged',
        handleAccountChange
      );
    };
  });

  const handleNetworkChanged = (...args: any[]) => {
    const networkId = args[0];
    const networkName = getNetworkName(networkId);
    setNetwork(networkName);
    getBalance(currentAccount);
    changedNetworkNoti(networkName);
    connectWallet();
  };

  useEffect(() => {
    (window as any).ethereum?.on('networkChanged', handleNetworkChanged);
    return () => {
      (window as any).ethereum?.removeListener(
        'networkChanged',
        handleNetworkChanged
      );
    };
  });

  const handleConnectWallet = async () => {
    if (!isUserLoggedIn) {
      connectWallet();
    }
  };

  const handleOpenSidebar = async () => {
    if (sidebar) {
      setSidebar(false);
    } else {
      setSidebar(true);
    }
  };

  const handleNightMode = async () => {
    setNightMode(nightMode => !nightMode);
  };

  const handleDisconnectWallet = async () => {
    disconnectWallet();
  };

  return (
    <div>
      <Head>
        <title>{title} | OpenPlanet</title>
      </Head>
      <nav className="w-full h-16 flex flex-row shadow-md">
        <div className="w-5/6 sm:4/6 h-full flex flex-row justify-between text-center align-middle ">
          <div className="flex flex-row">
            <div className="flex items-center">
              <Image
                src="/sk_logo.png"
                width={'50px'}
                height={'40px'}
                layout={'fixed'}
                alt="Logo"
              />
            </div>
            <div className="flex items-center text-2xl font-extrabold whitespace-nowrap tracking-tight">
              <span>OpenPlanet</span>
            </div>
          </div>
          <div className="flex justify-center w-full mx-2">
            <div className="relative flex items-center left-8 z-10">
              <SearchOutlined className="text-2xl" />
            </div>
            <Input
              type="text"
              placeholder="Search items, collections, and accounts"
              className="self-center w-full h-12 pl-10 z-0"
            />
          </div>
        </div>
        <div className="w-1/6 sm:w-2/6 flex flex-row items-center justify-end sm:justify-evenly mr-5 sm:mr-0 text-lg font-medium">
          <div className="hidden sm:flex">
            <span>Explore</span>
          </div>
          <div className="hidden sm:flex">
            <span>Create</span>
          </div>
          <div
            className={`${
              isUserLoggedIn ? `text-black` : `text-grey1`
            }  hover:text-black hidden sm:flex flex-row items-center text-2xl`}
          >
            {isUserLoggedIn ? (
              <UserOutlined />
            ) : (
              <UserOutlined onClick={handleConnectWallet} />
            )}
          </div>
          <div
            className={`${
              isUserLoggedIn ? `text-black` : `text-grey1`
            }  hover:text-black hidden sm:flex flex-row items-center text-2xl`}
          >
            {sidebar ? (
              <WalletTwoTone onClick={handleOpenSidebar} />
            ) : (
              <WalletOutlined onClick={handleOpenSidebar} />
            )}
          </div>
          <div className="flex sm:hidden flex-row items-center text-2xl">
            <MoreOutlined />
          </div>
        </div>
      </nav>
      <div
        className={`${
          sidebar ? `-translate-x-96` : `translate-x-96`
        } absolute flex flex-col w-96 h-screen -right-96 transition-all shadow-xl`}
      >
        <div className="flex items-center w-full h-20 border-b border-b-black border-opacity-10">
          <div className="flex flex-row justify-between w-full px-8">
            <div className="flex flex-row justify-start">
              <div>picture</div>
              <div>name</div>
            </div>
            <div>
              <span>
                {currentAccount?.length > 0
                  ? `${currentAccount.substring(
                      0,
                      6
                    )} . . . ${currentAccount.substring(
                      currentAccount.length - 4,
                      currentAccount.length
                    )}`
                  : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-32">
          <div className="flex flex-col items-center justify-evenly w-80 h-20 mt-8 mb-4 border border-black border-opacity-10 rounded-xl">
            <div className="flex items-center justify-center w-full h-full rounded-t-xl py-1 text-white font-semibold bg-grey2">
              Total balance
            </div>
            <div className="py-2 text-xl font-bold">
              {`${balance.split('.')[0]}${
                balance.split('.')[1] && balance.split('.')[1].length > 0
                  ? `.${balance.split('.')[1].substring(0, 4)}`
                  : ``
              }`}
              {isUserLoggedIn ? ` ETH` : `0 ETH`}
            </div>
          </div>
        </div>
        <div className="flex items-start justify-center w-full h-96">
          <ul className="flex flex-col items-center justify-evenly w-80 h-60 mt-4 mb-8 border border-black border-opacity-10 rounded-xl">
            <li className="w-full h-1/4 border-b border-black border-opacity-10 hover:shadow-md hover:cursor-pointer">
              <p className="h-full flex flex-row items-center">
                <EyeOutlined className="m-4 text-xl" />
                <span className="text-md font-semibold">Explore</span>
              </p>
            </li>
            <li className="w-full h-1/4 border-b border-black border-opacity-10 hover:shadow-md hover:cursor-pointer">
              <p className="h-full flex flex-row items-center">
                <PlusCircleOutlined className="m-4 text-xl" />
                <span className="text-md font-semibold">Create</span>
              </p>
            </li>
            <li
              className="w-full h-1/4 border-b border-black border-opacity-10 hover:shadow-md hover:cursor-pointer"
              onClick={handleNightMode}
            >
              <div className="h-full flex flex-row items-center justify-between">
                <div className="h-full flex flex-row items-center">
                  <SettingOutlined className="m-4 text-xl" />
                  <span className="text-md font-semibold">Night Mode</span>
                </div>
                <Switch checked={nightMode} className="m-4" />
              </div>
            </li>
            <li
              className="w-full h-1/4 hover:shadow-md hover:rounded-b-xl hover:cursor-pointer"
              onClick={
                isUserLoggedIn ? handleDisconnectWallet : handleConnectWallet
              }
            >
              <p className="h-full flex flex-row items-center">
                {isUserLoggedIn ? (
                  <LogoutOutlined className="m-4 text-xl" />
                ) : (
                  <LoginOutlined className="m-4 text-xl" />
                )}
                <span className="text-md font-semibold">
                  Log {isUserLoggedIn ? `Out` : `In`}
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
