import axios from "axios";
import BigNumber from "bignumber.js";
import moment from "moment";
import { Translate } from "next-translate";
import kryptoClient from "src/apiClient";

export function fromNow(date: moment.MomentInput, t: Translate) {
    const d1 = moment(date)
    const d2 = moment();
    const years = d2.diff(d1, 'years')
    if (years > 0) {
        return t('n-years-ago', {n: years})
    }
    const months = d2.diff(d1, 'months')
    if (months > 0) {
        return t('n-months-ago', {n: months})
    }
    const days = d2.diff(d1, 'days');
    if (days > 0) {
        return t('n-days-ago', {n: days})
    }
    const hours = d2.diff(d1, 'hours');
    if (hours > 0) {
        return t( hours === 1 ? 'n-hour-ago' : 'n-hours-ago', {n: hours})
    }
    const minutes = d2.diff(d1, 'minutes');
    if (minutes > 0) {
        return t( minutes === 1 ? 'n-minute-ago' : 'n-minutes-ago', {n: minutes})
    }
    const seconds = d2.diff(d1, 'seconds')
    if (seconds > 0) {
        return t(seconds === 1 ? 'n-second-ago' :'n-seconds-ago', {n: seconds})
    }
    return t('just-now');
}

export function formatNumber(amount: number, decimal: number) {
    if (typeof(amount) === 'number') {
        return new BigNumber(new BigNumber(amount).toFixed(decimal)).toFormat(decimal)
    }
    return '--'
}

export async function getConversions(symbol: string): Promise<{
    cryptos: Conversion[],
    fiats: Conversion[],
    foreign: Conversion[],
    trending: Conversion[],
    rates: Array<string>
  }> {

    const [
        fiatsResponse,
        cryptosResponse,
        foreignResponse,
        trendingResponse
    ] = await Promise.all([
        axios.get(`${process.env.API_URL}/fiat/map`, kryptoClient.config),
        axios.get(`${process.env.API_URL}/cryptocurrency/map`, kryptoClient.config),
        axios.get(`${process.env.API_URL}/cryptocurrency/map?rank=foreign&start=0&limit=30`, kryptoClient.config),
        axios.get(`${process.env.API_URL}/cryptocurrency/listings/trending?start=0&limit=5`, kryptoClient.config),
    ])
    const fiats = fiatsResponse.data.data;
    const cryptos = cryptosResponse.data.data;
    const foreign = foreignResponse.data.data
    const trending = trendingResponse.data.data;

    const conversions = {
        cryptos: [],
        fiats: [],
        trending: [],
        foreign: [],
        rates: []
    }
    
    try {
        const fiatSymbols = fiats.map((f) => f.symbol).join(',')
        const fiatsPromises = fiats.map(async (f) => {
            return {
                id: f.id,
                symbol: f.symbol,
                name: f.name,
                icon: f.icon
            }
        })
        conversions.fiats = await Promise.all(fiatsPromises);
        conversions.fiats = conversions.fiats.filter((f) => f)

        const foreignSymbols = foreign.map((f) => f.symbol).join(',')
        const foreignPromises = foreign.map(async (f) => {
            return {
                id: f.id,
                symbol: f.symbol,
                name: f.name,
                icon: f.icon
            }
        })
        conversions.foreign = await Promise.all(foreignPromises);
        conversions.foreign = conversions.foreign.filter((f) => f)

        const cryptoSymbols = cryptos.map((c) => c.symbol).join(',')
        const cryptosPromises = cryptos.map(async (c) => {
            return {
                id: c.id,
                symbol: c.symbol,
                name: c.name,
                icon: c.icon
            }
        })
        conversions.cryptos = await Promise.all(cryptosPromises)
        conversions.cryptos = conversions.cryptos.filter((f) => f)

        const trendingPromises = trending.map(async (c) => {
            return {
                id: c.id,
                symbol: c.symbol,
                name: c.name,
                icon: c.iconUrl
            }
        })
        conversions.trending = await Promise.all(trendingPromises)
        conversions.trending = conversions.trending.filter((f) => f)


        const allSymbols = cryptoSymbols + "," + fiatSymbols + "," + foreignSymbols
        const allSymbolsRes = await axios.get(`${process.env.API_URL}/tools/conversion-rates?symbol=${symbol}&convert=${allSymbols}`, kryptoClient.config);

        const ratesPromises = Object.keys(allSymbolsRes.data.rates).slice(0,1).map(async (c) => {
            return allSymbolsRes.data.rates
        })
        conversions.rates = await Promise.all(ratesPromises)
        conversions.rates = conversions.rates.filter((f) => f)
    } catch(e) {
        console.log(`CONVERSION ERROR:`)
        console.log(e)
    }
  
    return conversions;
}

export const imgLoader = ({ src, width }) => {
    return `${src}?w=${width}&q=75`
}