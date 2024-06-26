import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Head from 'next/head';
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useRouter } from "next/router";
import * as gtag from "src/utils/gtag"; 
import Cookie from 'js-cookie'
import { ChakraProvider } from '@chakra-ui/react'
import { wrapper } from 'src/store'
import NextNprogress from 'nextjs-progressbar';
import '../styles/globals.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { useAppDispatch } from 'src/store/hooks';
import { imgLoader } from 'src/utils';
import LogoWhite from 'assets/logo-white-circle.png';
import Footer from 'components/Footer';
import useTranslation from 'next-translate/useTranslation';


const queryClient = new QueryClient()

function App({ Component, pageProps }) {
  
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {t} = useTranslation('common')

  const [isOnlineUser, setIsOnlineUser] = useState(true)

  useEffect(() => {
    setIsOnlineUser(navigator.onLine)
    
    if (Cookie.get('access') && !Cookie.get('accessToken')) {
      Cookie.set('accessToken', JSON.parse(Cookie.get('access')).access_token)
      Cookie.remove('access', { path: '/', domain: '.krypto.mn' })
      dispatch({ type: 'CALL_WATCHLIST', payload: { value: true } })
      dispatch({ type: 'CALL_PROFILE', payload: { value: true } })
    } else if (Cookie.get('accessToken')) {
      dispatch({ type: 'CALL_WATCHLIST', payload: { value: true } })
      dispatch({ type: 'CALL_PROFILE', payload: { value: true } })
    }
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const handleRouteChange = (url: URL) => {
        gtag.pageview(url)
      }
      router.events.on("routeChangeComplete", handleRouteChange)
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange)
      }
    }
    if (router.query.reset) {
      dispatch({ type: 'SHOW_RESET_MODAL', payload: { value: true } })
    }
  }, [router])
  
  return (
    <>
    <Head>
        <title>{t('page-title')}</title>
        <meta property="og:url"                content="https://krypto.mn" key="url" />
        <meta property="og:title"              content="Крипто зах зээлийн статистик" key={`title`} />
        <meta property="og:description"        content="Krypto.mn нь виртуал хөрөнгө болон блокчэйн технологийн хөгжил, ололт, шинэчлэлтийн үнэн, зөв мэдээллийн эх сурвалж байж, нэг цэгийн зогсоол болох зорилго тавьж буй Медиа компани юм." key={`description`}/>
        <meta property="og:image"              content="https://krypto.mn/favicon.ico" key={`image`}/>
    </Head>
    <NextNprogress
        options={{ easing: 'ease', speed: 500 }}
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <ThemeProvider enableSystem attribute="class" defaultTheme={pageProps?.theme || "dark"}>
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
            {isOnlineUser ? (
              <div className="flex flex-col justify-between min-h-screen bg-gray-100 dark:bg-brand-black">
                <Component {...pageProps} />
                <Footer />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-screen h-screen space-y-4 bg-brand-dark-400">
                <div className="relative w-1/3 h-32">
                  <Image src={LogoWhite} loader={imgLoader} layout="fill" objectFit="contain" />
                </div>
                <p className="text-xl text-white">{t('check-your-network-connection')}</p>
              </div>
            )}
          </QueryClientProvider>
        </ChakraProvider>
      </ThemeProvider>
    </>
  )
}

const themes = ['light', 'dark']
App.getInitialProps = ({Component, ctx}) => {
  const themeParam = ctx.req.cookies?.theme || 'dark';
  const theme = themes.includes(themeParam) ? themeParam : 'dark';
  return {
    props: {
      theme,
    }
  }
}

export default wrapper.withRedux(App)