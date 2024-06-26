import Krypto from 'krypto-api-sdk';

const kryptoClient = new Krypto(process.env.API_URL, {
  config: {
      headers: {
          Accept: 'application/json',
          'Accept-Charset': 'utf-8',
          'Accept-Encoding': 'deflate, gzip',
          'Authorization': `${process.env.AUTH_SCHEME} ${process.env.AUTH_TOKEN}`
        }
  }
})

export default kryptoClient;