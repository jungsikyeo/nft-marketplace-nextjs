import type { NextPage } from 'next';
import Header from '@components/layout/header';

const Home: NextPage = () => {
  return (
    <div>
      <Header title="Home" />
      <div>
        <main className="p-4 md:p-11"></main>
      </div>
    </div>
  );
};

export default Home;
