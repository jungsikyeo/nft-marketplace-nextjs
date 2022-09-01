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

type AppLayoutProps = {
  children: React.ReactNode;
};

interface IWindow {
  ethereum: any;
}

export default function BaseLayout({ children }: AppLayoutProps) {
  const [web3, setWeb3] = useState({});
  const [network, setNetwork] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [contract, setContract] = useState(null);
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

      console.log(ethereum.networkVersion);

      const networkId = ethereum.networkVersion;
      const networkName = getNetworkName(networkId);

      if (networkName === 'undefined') {
        message.warning('you are not connected to the ethereum testnet!');
        return;
      } else {
        setNetwork(networkName);
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
      } else {
        message.warning('Smart contract not deployed');
      }

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
      setIsUserLoggedIn(false);
      setCurrentAccount('');
      setbalance('');
      logOutSuccessNoti();
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

  useEffect(() => {
    console.log('children changed');
    setSidebar(false);
  }, [children]);

  return (
    <div>
      <Header
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
        contract
      })}
    </div>
  );
}
