import BaseLayout from '@components/layout';
import type { AppProps } from 'next/app';
import '../styles/style.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  );
}

export default MyApp;
