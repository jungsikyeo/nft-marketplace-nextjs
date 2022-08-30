import type { NextPage } from 'next';
import Layout from '../components/layout';
import Head from 'next/head';
import {
  SectionButton,
  Title,
  SectionInput,
  SectionSwitch,
  SectionModal
} from '../components';

const Home: NextPage = () => {
  return (
    <Layout title="Home">
      <Head>
        <title>Home</title>
      </Head>
      <div>
        <main className="p-4 md:p-11">
          <Title type="title-content" text="NextJS-Antd-Tailwindcss" />

          <SectionButton />

          <SectionInput />

          <SectionSwitch />

          <SectionModal />
        </main>
      </div>
    </Layout>
  );
};

export default Home;
