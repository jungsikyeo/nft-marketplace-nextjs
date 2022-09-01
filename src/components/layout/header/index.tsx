import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Input, Switch } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  WalletOutlined,
  WalletTwoTone,
  CloseOutlined,
  EllipsisOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Web3 from 'web3';
import {
  changedAccountNoti,
  changedNetworkNoti,
  getNetworkName,
  loginWarningNoti,
  logOutSuccessNoti
} from '@components/notification';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import Link from 'next/link';

interface HeaderProps {
  network: string;
  isUserLoggedIn: boolean;
  currentAccount: string;
  balance: string;
  sidebar: boolean;
  nightMode: boolean;
  title?: string;
  setSidebar: any;
  setNightMode: any;
  connectWallet: any;
  disconnectWallet: any;
}

interface IWindow {
  ethereum: any;
}

export default function Header({
  network,
  isUserLoggedIn,
  currentAccount,
  balance,
  sidebar,
  nightMode,
  title,
  setSidebar,
  setNightMode,
  connectWallet,
  disconnectWallet
}: HeaderProps) {
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
    setNightMode((nightMode: boolean) => !nightMode);
  };

  const handleDisconnectWallet = async () => {
    disconnectWallet();
  };

  return (
    <div>
      <Head>
        <title>{title} | OpenPlanet</title>
      </Head>
      <div
        className={`${
          sidebar
            ? `-translate-x-96 -right-96 w-96`
            : `translate-x-96 right-0 w-0`
        } absolute flex flex-col h-screen  transition-all shadow-xl bg-light top-16 mt-1 z-10`}
      >
        <div className={sidebar ? `block` : `hidden`}>
          <div className="flex items-center w-full h-20 border-b border-b-black border-opacity-10">
            <div className="flex flex-row justify-between w-full px-8">
              <div className="flex flex-row justify-start">
                <div className="flex items-center">
                  <div className="flex justify-center items-center rounded-full p-0.5 border-2 text-info">
                    {currentAccount && (
                      <Jazzicon
                        diameter={36}
                        seed={jsNumberForAddress(currentAccount)}
                      />
                    )}
                  </div>
                  <span className="pl-2 text-base font-semibold">
                    {network}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs">
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
                {balance &&
                  `${balance.split('.')[0]}${
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
              <Link href="/explore">
                <li className="w-full h-1/4 border-b border-black border-opacity-10 hover:shadow-md hover:cursor-pointer">
                  <p className="h-full flex flex-row items-center">
                    <EyeOutlined className="m-4 text-xl" />
                    <span className="text-md font-semibold">Explore</span>
                  </p>
                </li>
              </Link>
              <Link href="/create">
                <li className="w-full h-1/4 border-b border-black border-opacity-10 hover:shadow-md hover:cursor-pointer">
                  <p className="h-full flex flex-row items-center">
                    <PlusCircleOutlined className="m-4 text-xl" />
                    <span className="text-md font-semibold">Create</span>
                  </p>
                </li>
              </Link>
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
      <nav className="w-full h-16 flex flex-row justify-between shadow-md bg-light z-50">
        <div className="w-full sm:w-4/6 h-full flex flex-row justify-between text-center align-middle">
          <div className="flex flex-row">
            <Link href="/">
              <a className="flex items-center mx-1">
                <svg
                  version="1.2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1610 1295"
                  className="w-9 h-7"
                >
                  <g id="layer1">
                    <g id="g8385">
                      <g id="g8358">
                        <path
                          id="path7986"
                          fill="#e31837"
                          d="m775.8 515.3l-299.5 367.7c-2.2-0.4-37.4-5.9-95.8-5.8-27.9 0.1-53.2 1.4-76.3 3.4 57.2-35.8 110.1-100.4 109.7-196.4-0.3-127.5-79.9-186.5-80.1-283.9-0.3-107.2 98.6-167.8 165.4-180.4 96.3 74.2 193.4 170.8 276.6 295.4z"
                        />
                        <path
                          id="path7990"
                          fill="#e31837"
                          d="m669.8 1040.8c-29-50.8-52.2-76.8-53.7-78.6 10-29.8 142.6-398.7 159.7-446.9 261.7 10.6 472.7 104.7 617.2 196.9-70.7 39.4-184.5 99.4-358.7 100.2-45.4 0.1-70.5-3.5-96.8-3.5-118.9 0.5-137.4 67.4-141 156.3-3.2 95.3-7.9 188.8-45.7 247.6-15.2-43.2-38.2-102.3-81-172z"
                        />
                      </g>
                      <g id="g8352">
                        <path
                          id="path7994"
                          fill="#f58025"
                          d="m118.2 911.4c-15.1 0.1-22.7-10-24.7-27.4-2-17.3-76.9-702.9-88-806.6-1.6-15.2-5.4-43-5.4-52.9-0.1-16 10.3-24.3 22.6-24.4 35.5-0.1 228.9 45.2 434.2 189.2-59.2 16.6-166.2 78.1-165.7 205.6 0.4 112.8 81.1 174.8 81.5 287.9 0.7 184-210.7 228.5-254.5 228.6z"
                        />
                        <path
                          id="path7998"
                          fill="#f58025"
                          d="m833.9 1025.9c0.9-22.3 1.2-42.6 1.7-57.7 3.3-79.8 26.1-118.8 117.1-119.1 31.3-0.1 41.6 2.9 87.3 2.8 186.6-0.7 312.1-69.1 392.4-113.4 101.1 70.2 161.6 134.5 173.4 153.6 2.4 3.8 3.6 8 3.7 12.3 0 7.5-4.1 14.8-12.9 19.9-8.5 5-34.5 16.6-48.2 23.1-94.3 43.6-719.7 334.8-735.5 342.1-6.5 2.9-12.4 4.5-17.1 4.6-7.6 0-13.7-3.7-18.5-11.7-3-5-6.1-12.2-9.3-20.7 54.6-65.9 63-164.4 65.9-235.8z"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </a>
            </Link>
            <Link href="/">
              <div className="flex items-center text-2xl font-extrabold whitespace-nowrap tracking-tight hover:cursor-pointer">
                OpenPlanet
              </div>
            </Link>
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
        <div className="w-20 sm:w-96 flex flex-row items-center justify-evenly sm:mr-0 text-lg font-medium">
          <div className="hidden sm:flex">
            <Link href="/explore">
              <a>Explore</a>
            </Link>
          </div>
          <div className="hidden sm:flex">
            <Link href="/create">
              <a>Create</a>
            </Link>
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
            {sidebar ? (
              <CloseOutlined
                onClick={handleOpenSidebar}
                className="transition-all"
              />
            ) : (
              <EllipsisOutlined onClick={handleOpenSidebar} />
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
