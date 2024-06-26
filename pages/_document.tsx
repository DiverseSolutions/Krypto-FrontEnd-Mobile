import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

import { GA_TRACKING_ID } from "src/utils/gtag";

export default class MyDocument extends Document {
  render() {
    return (
      <Html className="dark">
        <Head>
          <title>Крипто зах зээлийн статистик</title>
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/x-icon" href="/favicon-blue.ico" />
        </Head>
        <body className="bg-white dark:bg-brand-black">
          <Main />
          <NextScript />
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
            `}
          </Script>
        </body>
      </Html>
    );
  }
}