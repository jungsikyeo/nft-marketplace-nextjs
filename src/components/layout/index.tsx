import Header from './header';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import {
  changedAccountNoti,
  changedNetworkNoti,
  getNetworkName,
  loginWarningNoti,
  logOutSuccessNoti
} from '@components/notification';
import OpenPlanet from '@abis/OpenPlanet.json';
import { message } from 'antd';
import { useRouter } from 'next/router';

type AppLayoutProps = {
  children: React.ReactNode;
};

interface IWindow {
  ethereum: any;
}

export default function BaseLayout({ children }: AppLayoutProps) {
  const [title, setTitle] = useState('');
  const [web3, setWeb3] = useState({});
  const [network, setNetwork] = useState({});
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [balance, setbalance] = useState('');
  const [sidebar, setSidebar] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const router = useRouter();

  const connectWallet = async () => {
    try {
      const ethereum: IWindow['ethereum'] = (window as any).ethereum;
      if (!ethereum) {
        console.log('Metamask not detected');
        router.push('/');
        return;
      }

      const web = new Web3(ethereum);
      setWeb3(web);

      console.log('chianId:', ethereum.networkVersion);

      const networkId = ethereum.networkVersion;
      const networkName = getNetworkName(networkId);

      if (networkName === 'undefined') {
        message.warning('you are not connected to the ethereum testnet!');
        return;
      } else {
        setNetwork({ networkId, networkName });
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      console.log('Found account', accounts[0]);
      setIsUserLoggedIn(true);
      setCurrentAccount(accounts[0]);

      const networkData = OpenPlanet.networks[networkId];
      if (networkData) {
        const abi = OpenPlanet.abi;
        const address = networkData.address;

        setContract(new web.eth.Contract(abi, address));

        let balanceWei = await web.eth.getBalance(accounts[0]);
        let balanceETH = await web.utils.fromWei(balanceWei, 'ether');
        const balanceStr = String(balanceETH);
        setbalance(balanceStr);
      } else {
        message.warning('Smart contract not deployed');
        setContract(null);
      }
    } catch (e) {
      console.log('Error::', e);
    }
  };

  const disconnectWallet = async () => {
    try {
      setWeb3({});
      setNetwork({});
      setIsUserLoggedIn(false);
      setCurrentAccount('');
      setbalance('');
      logOutSuccessNoti();
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

  const handleAccountChange = (...args: (string | any[])[]) => {
    const _account = args[0][0];
    if (args[0].length === 0) {
      loginWarningNoti();
      disconnectWallet();
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
    console.log(args);
    const networkId = args[0];
    const networkName = getNetworkName(networkId);
    setNetwork({ networkId, networkName });
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

  const handleDisconnect = (...args: any[]) => {
    console.log('disconnect:', args);
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

  useEffect(() => {
    if (!isUserLoggedIn) {
      connectWallet();
    }
  }, [router.route]);

  return (
    <div>
      <Header
        title={title}
        setTitle={setTitle}
        network={network}
        isUserLoggedIn={isUserLoggedIn}
        currentAccount={currentAccount}
        balance={balance}
        sidebar={sidebar}
        nightMode={nightMode}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        setNightMode={setNightMode}
        setSidebar={setSidebar}
      />
      {React.cloneElement(children, {
        currentAccount,
        contract,
        network
      })}
    </div>
  );
}
