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
import { AppLayoutPropsType, IWindow } from '@libs/client/client';
import { NextPage } from 'next';

const BaseLayout: NextPage<AppLayoutPropsType> = ({
  children
}: AppLayoutPropsType) => {
  const [title, setTitle] = useState('');
  const [web3, setWeb3] = useState({});
  const [network, setNetwork] = useState({
    networkId: '',
    networkName: ''
  });
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
        router.push('/login');
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
      if (accounts.length > 0) {
        console.log('Found account', accounts[0]);
        setIsUserLoggedIn(true);
        localStorage.setItem('isUserLoggedIn', 'true');
        setCurrentAccount(accounts[0]);

        const newNetworks: any = OpenPlanet.networks;
        const networkData: any = newNetworks[networkId];
        if (networkData) {
          const abi: any = OpenPlanet.abi;
          const address: string = networkData.address;
          const newContract: any = new web.eth.Contract(abi, address);
          setContract(newContract);

          let balanceWei = await web.eth.getBalance(accounts[0]);
          let balanceETH = await web.utils.fromWei(balanceWei, 'ether');
          const balanceStr = String(balanceETH);
          setbalance(balanceStr);

          await fetch('/api/user/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              networkId: networkId,
              account: accounts[0]
            })
          })
            .then(response => response.json().catch(() => {}))
            .then(data => {
              console.log(data);
            })
            .catch(error => {
              message.error('create user error!');
              console.log(error);
              router.push('/login');
            })
            .finally(() => {
              if (router.route === '/login') {
                router.push('/mypage');
              }
            });
        } else {
          message.warning('Smart contract not deployed');
          setContract(null);
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    } catch (e) {
      console.log('Error::', e);
    }
  };

  const disconnectWallet = async () => {
    try {
      await setWeb3({});
      await setNetwork({ networkId: '', networkName: '' });
      await setIsUserLoggedIn(false);
      await localStorage.setItem('isUserLoggedIn', 'false');
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
      await changedAccountNoti(_account);

      if (router.route === '/login' || router.route === '/mypage') {
        await router.push('/mypage');
      } else if (
        router.route.startsWith('/item/create/') &&
        router.route.replace('/item/create/', '') !== _account
      ) {
        (window as any).location =
          await `/item/create/${network.networkId}/${_account}`;
      }
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
    // connectWallet();
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
    const storageIsLogin =
      localStorage.getItem('isUserLoggedIn') === 'true' ? true : false;
    if (storageIsLogin && !isUserLoggedIn) {
      connectWallet();
    }
  }, []);

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
        contract,
        network,
        connectWallet
      })}
    </div>
  );
};

export default BaseLayout;
