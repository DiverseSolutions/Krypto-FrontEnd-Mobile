import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import Navbar from 'components/navbar';
import { GetServerSidePropsContext } from 'next';
import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5';
import client from 'src/axiosClient';
import { useAppSelector } from 'src/store/hooks';
import { formatNumber } from 'src/utils';


interface Props {
    summary: any,
    cex: any,
}

export default function Exchanges({ summary, cex }: Props) {

    const { systemTheme, theme, } = useTheme()
    const quote = useAppSelector(state => state.quote)

    const { t: ct } = useTranslation('common')
    const { t, lang } = useTranslation('exchanges')

    const [currentTheme, setCurrentTheme] = useState("light")
    const [sort, setSort] = useState({ title: '', asc: true, desc: false })
    const [sortedExchanges, setSortedExchanges] = useState(cex)

    useEffect(() => {
        const temp = theme == 'system' ? systemTheme : theme

        setCurrentTheme(temp)
    }, [theme, systemTheme])

    const handleSort = (id: string) => {
        let sorted;
        if (id === 'volume_24h') {
            sorted = cex.sort((a, b) => {
                if (sort.asc) {
                    return a['quote']['MNT'][id] > b['quote']['MNT'][id] ? 1 : -1
                }
                return b['quote']['MNT'][id] > a['quote']['MNT'][id] ? 1 : -1
            })
        } else {
            sorted = cex.sort((a, b) => {
                if (sort.asc) {
                    return a[id] > b[id] ? 1 : -1
                } else if (sort.desc) {
                    return b[id] > a[id] ? 1 : -1
                }
                return a['rank'] > b['rank'] ? 1 : -1
            })
        }
        setSortedExchanges([...sorted]);
        sort.asc ? setSort({ title: id, asc: false, desc: true }) : sort.desc ? setSort({ title: id, asc: false, desc: false }) : setSort({ title: id, asc: true, desc: false })
    }

    const SortHeader = ({ title, id }) => {
        return (
            <div className="flex items-center" onClick={() => handleSort(id)}>
                {title}
                {sort.title == id && sort.asc ? <></> : sort.title == id && sort.desc ? <IoCaretUpOutline /> : sort.title == id && !sort.asc && !sort.desc ? <IoCaretDownOutline /> : <></>}
            </div>
        )
    }

    return (
        <div className="w-full bg-gray-100 dark:text-white dark:bg-brand-black">
            <Navbar data={summary} />
            <div className="px-[1rem] mt-3">
                <h1 className="my-8 text-3xl font-bold">{ct('centralized-exchange')}</h1>
            </div>
            <div className="mb-6 bg-white dark:bg-brand-black">
                <div className="w-full mx-auto overflow-x-auto no-scrollbar">
                    <table className='w-full p-4 py-0 pt-4 bg-white border-separate rounded-md table-auto dark:bg-brand-black dark:text-white' style={{ minWidth: 800, borderSpacing: 0 }}>
                        <thead>
                            <tr className="text-sm border-b-[1px] border-brand-grey-100 border-opacity-10 dark:border-opacity-30">
                                <th className="sticky left-0 w-12 px-3 py-3 text-left bg-white dark:bg-brand-black">
                                    <div className="flex items-center">
                                        <SortHeader title="#" id="rank" />
                                    </div>
                                </th>
                                <th className="sticky w-1/4 pl-3 mr-3 text-left bg-white dark:bg-brand-black left-8">
                                    <SortHeader title={ct('exchange')} id="name" />
                                </th>
                                <th className="w-1/6 text-left">
                                    <div className="flex items-center justify-start space-x-1">
                                        <SortHeader title={t('vol-local-7d')} id="volume_24h" />
                                        <Popover placement='bottom' trigger='click' gutter={0}>
                                            <PopoverTrigger>
                                                <div className='ml-1 cursor-pointer'>
                                                    <HiInformationCircle className='text-brand-grey-120' size={18} />
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent shadow={'xl'} className='z-10 p-4 bg-white rounded-md dark:bg-brand-dark-400' border={'none'} padding={0}>
                                                <PopoverBody>
                                                    <div className="text-left dark:text-white">
                                                        Хэмжээ 24ц - Доорх дүн нь зөвхөн дотоодын койны арилжааны хэмжээг харуулж байгаа болно.
                                                    </div>
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </th>
                                <th className="w-1/6 pr-1 text-center">{t('liquidity-score')}</th>
                                <th className="w-1/6 pr-1 text-center">
                                    <SortHeader title={`#${t('market-pairs')}`} id="num_market_pairs" />
                                </th>
                                <th className="w-1/6 pr-1 text-center">
                                    <SortHeader title={`#${t('coins')}`} id="num_coins" />
                                </th>
                                <th className="px-3 text-right ">
                                    <div className='w-[120px]'>
                                        {t('vol-local-7d')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedExchanges.map(ex => (
                                <tr className="text-sm cursor-pointer">
                                    <td onClick={() => window.location.href = `/${lang}/exchanges/${ex.slug}`} className="sticky left-0 px-3 py-6 text-left bg-white border-b cursor-default dark:bg-brand-black border-brand-grey-100 border-opacity-10 dark:border-opacity-30">{ex.rank}</td>
                                    <td onClick={() => window.location.href = `/${lang}/exchanges/${ex.slug}`} className="sticky pl-3 pr-6 bg-white border-b left-8 dark:bg-brand-black border-brand-grey-100 border-opacity-10 dark:border-opacity-30">
                                        <div className="flex items-center space-x-2 cursor-pointer">
                                            <div className="relative w-16 h-8">
                                                <Image src={currentTheme === 'dark' && ex.logoUrl ? ex.logoUrl : ex.logoUrl} priority loader={({ src }) => `${src}?width=256`} layout="fill" objectFit="contain" />
                                            </div>
                                            <p className="font-medium">{ex.name}</p>
                                        </div>
                                    </td>
                                    <td onClick={() => window.location.href = `/${lang}/exchanges/${ex.slug}`} className="pr-1 font-medium text-left border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30">{formatNumber(ex.quote['MNT'].localVol24h, 2)}</td>
                                    <td onClick={() => window.location.href = `/${lang}/exchanges/${ex.slug}`} className="pr-1 font-medium text-center border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30">--</td>
                                    <td onClick={() => window.location.href = `/${lang}/exchanges/${ex.slug}`} className="pr-1 text-center border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30">{ex.pairCount || "--"}</td>
                                    <td onClick={() => window.location.href = `/${lang}/exchanges/${ex.slug}`} className="pr-1 text-center border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30">{ex.assetCount || "--"}</td>
                                    <td onClick={() => window.location.href = `/${lang}/exchanges/${ex.slug}`} className="px-3 font-medium text-right border-b border-brand-grey-100 border-opacity-10 dark:border-opacity-30">
                                        <img src={ex.chart7d} alt="chart7d" className='w-[120px] h-[35px]' />
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {

    ctx.res.setHeader('Cache-Control', 'public, s-maxage=90')

    let [summary, cex] = await Promise.all([
        client.get("/crypto/market-summary"),
        client.get("/cex/listing?convert=MNT"),
    ])

    return {
        props: {
            summary: summary.data,
            cex: cex.data.data,
        }
    }
}