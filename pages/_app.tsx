import { default as dayjs } from 'dayjs';
dayjs.locale("America/Lima")
import '../styles/globals.css'
// import type { AppProps } from 'next/app'

import { UserProvider } from '@auth0/nextjs-auth0';
import AxLayout from 'components/layout/ax_layout';
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
export const getServerSideProps = withPageAuthRequired();
export default function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <UserProvider>
      <AxLayout>
        <Component {...pageProps} />
      </AxLayout>
    </UserProvider>
  )
}