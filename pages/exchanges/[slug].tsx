import { Popover, PopoverBody, PopoverContent, PopoverTrigger, Spinner } from '@chakra-ui/react';
import Navbar from 'components/navbar';
import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { AiOutlineLink } from 'react-icons/ai';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { HiInformationCircle } from 'react-icons/hi';
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5';
import client from 'src/axiosClient';
import { useAppSelector } from 'src/store/hooks';
import { formatNumber, fromNow } from 'src/utils';


interface Props {
    summary: any,
    cex: any,
}

const logoLoader = ({ src }) => {
    return `${src}?width=256`
}

export default function SingleExchange({ summary, cex }: Props) {

    const router = useRouter()
    const contentRef = useRef(null)
    const { systemTheme, theme, setTheme } = useTheme()
    const quote = useAppSelector(state => state.quote)

    const {t: ct} = useTranslation('common')
    const {t} = useTranslation('exchanges')

    const [currentTheme, setCurrentTheme] = useState("light")
    const [sortedMarketPairs, setSortedMarketPairs] = useState(cex.market.data)
    const [sort, setSort] = useState({title: '', asc: true, desc: false})

    useEffect(() => {  
        const temp = theme == 'system' ? systemTheme : theme

        setCurrentTheme(temp)
    }, [theme, systemTheme])

    useEffect(() => {
        setSortedMarketPairs(cex.market.data)
    }, [cex.market.data.length])
    
    const handleSort = (id: string) => {
        let sorted;
        if (id === 'price' || id === 'volume_24h') {
            sorted = cex.market.data.sort((a, b) => {
                if (sort.asc) {
                    return a['quote']['MNT'][id] - b['quote']['MNT'][id]
                } else if (sort.desc) {
                    return b['quote']['MNT'][id] - a['quote']['MNT'][id]
                }
                return a['rank'] > b['rank'] ? 1 : -1
            })
        } else {
            sorted = cex.market.data.sort((a, b) => {
                if (sort.asc) {
                    return a[id] > b[id] ? 1 : -1
                } else if (sort.desc) {
                    return b[id] > a[id] ? 1 : -1
                }
                return a['rank'] > b['rank'] ? 1 : -1
            })
        }

        setSortedMarketPairs([...sorted]);
        sort.asc ? setSort({ title: id, asc: false, desc: true }) : sort.desc ? setSort({ title: id, asc: false, desc: false }) : setSort({ title: id, asc: true, desc: false })
    }

    const SortHeader = ({title, id}) => {
        return (
            <div className="flex items-center space-x-1" onClick={() => handleSort(id)}>
                {title}
                {sort.title == id && sort.asc ? <></> : sort.title == id && sort.desc ? <IoCaretUpOutline /> : sort.title == id && !sort.asc && !sort.desc ? <IoCaretDownOutline /> : <></>}
            </div>
        )
    }

    return (
        <div className="pb-9">
            <Head>
                <title>{t('exchange-page-title', {name: cex.name})}</title>
            </Head>
            <div className="w-full dark:text-white dark:bg-brand-black">
                <div>
                    <Navbar data={summary} />
                </div>
                <div className="px-[1rem] my-3">
                    <div className="flex flex-col items-start space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="relative w-20 h-12">
                                <Image src={cex.logo} loader={({ src }) => `${src}?width=256`} priority layout="fill" objectFit="contain" />
                            </div>
                            <p className="text-2xl font-semibold">{cex.name}</p>
                        </div>
                        <div className="space-y-1 text-sm">
                            <p className="text-brand-grey-100 dark:text-brand-grey-110">{t('vol-local-24h')}</p>
                            <h3 className="text-2xl font-semibold">{'₮'}{formatNumber(cex.quote["MNT"].localVol24h, 2)}</h3>
                        </div>
                        <div className="flex items-start">
                            <div className="space-y-1 text-xs">
                                <p className="text-brand-grey-100 dark:text-brand-grey-110">{t('vol-total-24h')}</p>
                                <h3 className="text-sm font-semibold">{'₮'}{formatNumber(cex.quote["MNT"].totalVol24h, 2)}</h3>
                            </div>
                            <Popover placement='bottom' trigger='click' gutter={0}>
                                <PopoverTrigger>
                                    <div className='cursor-pointer'>
                                        <HiInformationCircle className='text-brand-grey-120' size={18} />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent shadow={'xl'} className='z-10 p-4 bg-white rounded-md dark:bg-brand-dark-400' border={'none'} padding={0}>
                                    <PopoverBody>
                                        <div className="text-left dark:text-white">
                                            Хөрвөх чадварыг оруулсан хэмжээ
                                        </div>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="flex items-center space-x-1 text-sm">
                            <AiOutlineLink color={`${currentTheme === 'light' ? "#818b9e" : "#eee"}`} size={25} />
                            <a href="#" target="_blank" className="text-brand-blue-400 dark:text-brand-blue-300 hover:text-opacity-70">{cex.webUrl}</a>
                        </div>
                    </div>
                </div>
                <div ref={contentRef} className="mt-8 overflow-x-auto no-scrollbar">
                    <table className='w-full p-4 bg-white border-separate rounded-md table-fixed dark:bg-brand-black dark:text-white' style={{ minWidth: 900, borderSpacing: 0 }}>
                        <thead>
                            <tr className="text-sm border-b-[1px] border-brand-grey-100 border-opacity-10 dark:border-opacity-30">
                                <th className="sticky left-0 w-12 px-3 py-3 text-left bg-white dark:bg-brand-black">
                                    <SortHeader title={'#'} id="rank" />
                                </th>
                                <th className="sticky w-1/6 text-left bg-white left-12 dark:bg-brand-black">
                                    <SortHeader title={ct('asset')} id="name" />
                                </th>
                                <th className="w-1/6 pr-1 text-left">
                                    <SortHeader title={ct('pairs')} id="market_pair" />
                                </th>
                                <th className="w-1/6 pr-1 text-center">
                                    <SortHeader title={ct('price')} id="price" />
                                </th>
                                <th className="w-1/6 pr-1 text-left">
                                    <SortHeader title={ct('volume-24h')} id="volume_24h" />
                                </th>
                                <th className="w-1/12 pr-1 text-center">+2% Depth</th>
                                <th className="w-1/12 pr-1 text-center">-2% Depth</th>
                                <th className="w-1/12 pr-1 text-center">{t('liquidity-score')}</th>
                                <th className="w-1/6 pr-1 text-right">{ct('updated-at')}</th>
                            </tr>
                        </thead>   
                        <tbody>
                                {sortedMarketPairs.map((ex, i) => (
                                    <tr key={ex.displaySymbol} className="text-sm">
                                        <td className={`${ex.is_stale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white sticky left-0 px-3 py-6 bg-white border-b dark:bg-brand-black border-brand-grey-100 border-opacity-10 dark:border-opacity-30`}>{i+1}</td>
                                        <td className={`${ex.is_stale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white sticky pr-3 bg-white border-b left-12 dark:bg-brand-black border-brand-grey-100 border-opacity-10 dark:border-opacity-30`}>
                                            <a href={ex.assetSymbol && ex.assetSymbol !== '#' ? `/currencies/${ex.assetSymbol}` : '#'} target='_blank' className="flex items-center justify-start space-x-2">
                                                <div className={`${ex.is_stale && 'opacity-40 dark:opacity-60'} relative w-8 h-8 flex-shrink-0`}> 
                                                    <Image src={ex.logo} loader={({ src }) => `${src}?width=64`} priority={i < 15} layout="fill" objectFit="contain" />
                                                </div>
                                                <p className="font-medium">{ex.name}</p>
                                            </a>
                                        </td>
                                        <td className={`${ex.is_stale && 'text-opacity-40'} pr-1 text-left border-b text-brand-blue-400 dark:text-brand-blue-300 border-brand-grey-100 border-opacity-10 dark:border-opacity-30`}>
                                            <a href={ex.tradeUrl} target="_blank" className="">{ex.displaySymbol}</a>
                                        </td>
                                        <td className={`${ex.is_stale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white pr-1 text-left border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30`}>{ex.quote['MNT'].price ? `${'₮'}${formatNumber(ex.quote["MNT"].price, quote.isForeignQuote ? 4 : 2)}` : "--"}</td>
                                        <td className={`${ex.is_stale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white pr-1 text-left border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30`}>{typeof ex.quote['MNT'].quoteVol24h === 'number' ? `${'₮'}${formatNumber(ex.quote["MNT"].quoteVol24h, 2)}` : "--"}</td>
                                        <td className={`${ex.is_stale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white pr-1 text-center border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30`}>--</td>
                                        <td className={`${ex.is_stale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white pr-1 text-center border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30`}>--</td>
                                        <td className={`${ex.is_stale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white pr-1 text-center border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30`}>--</td>
                                        <td className={`${ex.is_stale ? 'text-brand-red-400' : 'text-black dark:text-white'} pr-1 text-right border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30`}>
                                            <Suspense>
                                                {ex.ts ? fromNow(ex.ts, ct):'--'}
                                            </Suspense>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ params, query, ...ctx }) {

    ctx.res.setHeader('Cache-Control','public, s-maxage=90');

    const summary = await client.get(`/crypto/market-summary?convert=MNT`)
    const cex = await client.get(`/cex/detail/${params.slug}?convert=MNT`)
    
    return {
        props: { 
            cex: cex.data,
            summary: summary.data,
        }
    }
}