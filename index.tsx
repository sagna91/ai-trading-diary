import Head from 'next/head';
import TradingDiary from '../components/TradingDiary';

export default function Home() {
  return (
    <>
      <Head>
        <title>AI-дневник трейдера</title>
      </Head>
      <main>
        <TradingDiary />
      </main>
    </>
  );
}
