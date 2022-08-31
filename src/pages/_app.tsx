import BaseLayout from '@components/layout';
import { Layout } from 'antd';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import '../styles/style.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  );
}

export default MyApp;
