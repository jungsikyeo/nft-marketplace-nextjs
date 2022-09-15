import Header from './header';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import {
  getNetworkName,
  loginWarningNoti,
  logOutSuccessNoti
} from '@components/notification';
import OpenPlanet from '@abis/OpenPlanet.json';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { AppLayoutPropsType, IWindow } from '@libs/client/client';
import { NextPage } from 'next';

const networkId = process.env.NEXT_PUBLIC_MARKET_NETWORK || '1661918429880';
const mainetURL =
  process.env.NEXT_PUBLIC_MAINNET_URL || 'http://144.24.70.230:8545';

const BaseLayout: NextPage<AppLayoutPropsType> = ({
  children
}: AppLayoutPropsType) => {
  const [title, setTitle] = useState('');
  const [web3, setWeb3] = useState({});
  const [network, setNetwork] = useState({
    networkId: networkId,
    networkName: getNetworkName(networkId)
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [openPlanetContract, setOpenPlanetContract] = useState(null);
  const [balance, setbalance] = useState('');
  const [sidebar, setSidebar] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadOpenPlanet = async (networkId: any) => {
      if (networkId) {
        const web3 = new Web3();
        web3.setProvider(mainetURL);
        const newNetworks: any = OpenPlanet.networks;
        const networkData: any = newNetworks[networkId];
        if (networkData) {
          const abi: any = OpenPlanet.abi;
          const address: string = networkData.address;
          const openPlanetContract: any = await new web3.eth.Contract(
            abi,
            address
          );
          setOpenPlanetContract(openPlanetContract);
        }
      }
    };
    loadOpenPlanet(networkId);
  }, []);

  const connectWallet = async () => {
    try {
      const ethereum: IWindow['ethereum'] = (window as any).ethereum;
      if (!ethereum) {
        message.error('Metamask not detected');
        return false;
      }

      const metamaskNetworkId: string | any = ethereum.networkVersion;
      const metamaskNetworkName: string | any =
        getNetworkName(metamaskNetworkId);

      if (metamaskNetworkId !== networkId) {
        message.warning('you are not connected to the ethereum testnet!');
        router.push('/login');
        return false;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        setIsUserLoggedIn(true);

        const web = new Web3(ethereum);
        let balanceWei = await web.eth.getBalance(accounts[0]);
        let balanceETH = await web.utils.fromWei(balanceWei, 'ether');
        const balanceStr = String(balanceETH);
        setbalance(balanceStr);
        return true;
      }
    } catch (e) {
      message.error('An unexpected problem has occurred.');
      console.log(e);
      return false;
    }
  };

  const disconnectWallet = async () => {
    try {
      await setIsUserLoggedIn(false);
      await setCurrentAccount('');
      await setbalance('');
      await logOutSuccessNoti();
      await router.push('/login');
    } catch (e) {
      console.log(e);
    }
  };

  const getBalance = async (account: string) => {
    if ((web3 as any).eth) {
      let balanceWei = await (web3 as any).eth.getBalance(account);
      let balanceETH = await (web3 as any).utils.fromWei(balanceWei, 'ether');
      const balanceStr = String(balanceETH);
      setbalance(balanceStr);
    } else {
      disconnectWallet();
    }
  };

  const handleAccountChange = async (...args: (string | any[])[]) => {
    const _account = args[0][0];
    if (args[0].length === 0) {
      loginWarningNoti();
      disconnectWallet();
    } else if (_account !== currentAccount) {
      await setCurrentAccount(_account);
      await getBalance(_account);
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
    setNetwork({ networkId, networkName });
    isUserLoggedIn && getBalance(currentAccount);
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

  const handleDisconnect = (...args: any[]) => {
    disconnectWallet();
  };

  useEffect(() => {
    (window as any).ethereum?.on('disconnect', handleDisconnect);
    return () => {
      (window as any).ethereum?.removeListener('disconnect', handleDisconnect);
    };
  });

  useEffect(() => {
    setSidebar(false);
  }, [children]);

  return (
    <div>
      <Header
        title={title}
        setTitle={setTitle}
        network={network}
        isUserLoggedIn={isUserLoggedIn}
        currentAccount={currentAccount}
        connectWallet={connectWallet}
        balance={balance}
        sidebar={sidebar}
        nightMode={nightMode}
        disconnectWallet={disconnectWallet}
        setNightMode={setNightMode}
        setSidebar={setSidebar}
      />
      {React.cloneElement(children, {
        web3,
        isUserLoggedIn,
        currentAccount,
        openPlanetContract,
        network,
        connectWallet
      })}
    </div>
  );
};

export default BaseLayout;
