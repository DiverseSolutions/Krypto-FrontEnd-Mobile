import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { Line } from 'rc-progress';
import React, { useEffect, useState } from 'react';
import { BsStar } from 'react-icons/bs';
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { formatNumber } from 'src/utils';


interface Props {
    listing: any,
}

const iconImgLoader = ({ src }) => {
    return `${src}?width=64`
}
export const Table = ({ listing }: Props) => {

    const stats = listing.data;

    const dispatch = useAppDispatch()
    const query = useAppSelector(state => state.reactQuery)
    const user = useAppSelector(state => state.user)
    const quote = useAppSelector(state => state.quote)

    const { t, lang } = useTranslation('home')
    const { t: ct } = useTranslation('common')

    const { systemTheme, theme, setTheme } = useTheme()

    const [currentTheme, setCurrentTheme] = useState("light")
    const [sort, setSort] = useState({ title: null, asc: false, desc: false })
    const [sortedData, setSortedData] = useState(listing.data)
    const [watchlist, setWatchlist] = useState([])
    const [activeId, setActiveId] = useState(0)
    const [isLoader, setIsLoader] = useState(false)

    useEffect(() => {
        const temp = theme == 'system' ? systemTheme : theme

        setCurrentTheme(temp)
    }, [theme, systemTheme])

    useEffect(() => {
        if (!user.isLoggedIn) {
            setWatchlist([])
        }
    }, [user])

    useEffect(() => {
        switch (sort.title) {
            case "id":
                if (sort.asc) {
                    setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                } else if (sort.desc) {
                    setSortedData([...stats.sort(function (a, b) { return b.rank - a.rank })])
                } else {
                    setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                }
                break;
            case "name":
                if (sort.asc) {
                    setSortedData([...stats.sort(function (a, b) { return a.name > b.name ? 1 : -1 })])
                } else if (sort.desc) {
                    setSortedData([...stats.sort(function (a, b) { return b.name > a.name ? 1 : -1 })])
                } else {
                    setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                }
                break;
            case "price":
                if (sort.asc) {
                    setSortedData([...stats.sort(function (a, b) { return a.quote['MNT'].price - b.quote['MNT'].price })])
                } else if (sort.desc) {
                    setSortedData([...stats.sort(function (a, b) { return b.quote['MNT'].price - a.quote['MNT'].price })])
                } else {
                    setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                }
                break;
            case "24h_change":
                if (sort.asc) {
                    setSortedData([...stats.sort(function (a, b) { return a.quote['MNT'].ch24hPercent - b.quote['MNT'].ch24hPercent })])
                } else if (sort.desc) {
                    setSortedData([...stats.sort(function (a, b) { return b.quote['MNT'].ch24hPercent - a.quote['MNT'].ch24hPercent })])
                } else {
                    setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                }
                break;
            case "7d_change":
                if (sort.asc) {
                    setSortedData([...stats.sort(function (a, b) { return a.quote['MNT'].ch7dPercent - b.quote['MNT'].ch7dPercent })])
                } else if (sort.desc) {
                    setSortedData([...stats.sort(function (a, b) { return b.quote['MNT'].ch7dPercent - a.quote['MNT'].ch7dPercent })])
                } else {
                    setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                }
                break;
            case "24h_volume":
                if (sort.asc) {
                    setSortedData([...stats.sort(function (a, b) { return a.quote['MNT'].vol24h - b.quote['MNT'].vol24h })])
                } else if (sort.desc) {
                    setSortedData([...stats.sort(function (a, b) { return b.quote['MNT'].vol24h - a.quote['MNT'].vol24h })])
                } else {
                    setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                }
                break;
            case "circulating_supp":
                if (sort.asc) {
                    setSortedData([...stats.sort(function (a, b) { return a.circulatingSupply - b.circulatingSupply })])
                } else if (sort.desc) {
                    setSortedData([...stats.sort(function (a, b) { return b.circulatingSupply - a.circulatingSupply })])
                } else {
                    setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                }
                break;
            case "market_cap":
                if (sort.asc) {
                    setSortedData([...stats.sort(function (a, b) { return (a.quote['MNT'].marketCap) - (b.quote['MNT'].marketCap) })])
                } else if (sort.desc) {
                    setSortedData([...stats.sort(function (a, b) { return (b.quote['MNT'].marketCap) - (a.quote['MNT'].marketCap) })])
                } else {
                    setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                }
                break;
            default:
                setSortedData([...stats.sort(function (a, b) { return a.rank - b.rank })])
                break;
        }
    }, [sort, stats])

    function sortEvent(title) {
        if (sort.title == title) {
            if (sort.asc) {
                setSort({ title: title, asc: false, desc: true })
            } else if (sort.desc) {
                setSort({ title: title, asc: false, desc: false })
            } else {
                setSort({ title: title, asc: true, desc: false })
            }
        } else {
            setSort({ title: title, asc: true, desc: false })
        }
    }

    return (
        <div className="w-full mx-auto overflow-x-auto no-scrollbar">
            <table className='w-full pt-4 bg-white border-separate rounded-md table-auto dark:bg-brand-black dark:text-white' style={{ minWidth: 1100, borderSpacing: 0 }}>
                <thead>
                    <tr className="text-xs">
                        <th onClick={() => sortEvent("id")} className="sticky left-0 p-3 text-left bg-white w-14 dark:bg-brand-black">
                            <div className="flex items-center">
                                <p>#</p>
                                {sort.title == "id" && sort.asc ? <IoCaretUpOutline /> : sort.title == "id" && sort.desc ? <IoCaretDownOutline /> : sort.title == "id" && !sort.asc && !sort.desc ? <></> : <></>}
                            </div>
                        </th>
                        <th onClick={() => sortEvent("name")} className="sticky w-1/12 p-3 text-left bg-white left-14 dark:bg-brand-black">
                            <div className="flex items-center">
                                <p>{ct('name')}</p>
                                {sort.title == "name" && sort.asc ? <IoCaretUpOutline /> : sort.title == "name" && sort.desc ? <IoCaretDownOutline /> : sort.title == "name" && !sort.asc && !sort.desc ? <></> : <></>}
                            </div>
                        </th>
                        <th onClick={() => sortEvent("price")} className="w-1/12 p-3 text-left bg-white dark:bg-brand-black">
                            <div className="flex items-center">
                                <p>{ct('price')}</p>
                                {sort.title == "price" && sort.asc ? <IoCaretUpOutline /> : sort.title == "price" && sort.desc ? <IoCaretDownOutline /> : sort.title == "price" && !sort.asc && !sort.desc ? <></> : <></>}
                            </div>
                        </th>
                        <th onClick={() => sortEvent("24h_change")} className="w-1/12 p-3 text-left bg-white dark:bg-brand-black">
                            <div className="flex items-center">
                                <p>{ct('hours-24')} %</p>
                                {sort.title == "24h_change" && sort.asc ? <IoCaretUpOutline /> : sort.title == "24h_change" && sort.desc ? <IoCaretDownOutline /> : sort.title == "24h_change" && !sort.asc && !sort.desc ? <></> : <></>}
                            </div>
                        </th>
                        <th onClick={() => sortEvent("7d_change")} className="w-1/12 p-3 text-left bg-white dark:bg-brand-black">
                            <div className="flex items-center">
                                <p>{ct('days-7')} %</p>
                                {sort.title == "7d_change" && sort.asc ? <IoCaretUpOutline /> : sort.title == "7d_change" && sort.desc ? <IoCaretDownOutline /> : sort.title == "7d_change" && !sort.asc && !sort.desc ? <></> : <></>}
                            </div>
                        </th>
                        <th onClick={() => sortEvent("24h_volume")} className="w-1/6 p-3 text-left bg-white dark:bg-brand-black">
                            <div className="flex items-center">
                                <p>{ct('volume-24h')}</p>
                                {sort.title == "24h_volume" && sort.asc ? <IoCaretUpOutline /> : sort.title == "24h_volume" && sort.desc ? <IoCaretDownOutline /> : sort.title == "24h_volume" && !sort.asc && !sort.desc ? <></> : <></>}
                            </div>
                        </th>
                        <th onClick={() => sortEvent("circulating_supp")} className="w-1/6 p-3 text-left bg-white dark:bg-brand-black">
                            <div className="flex items-center">
                                <p>{ct('circulating-supply')}</p>
                                {sort.title == "circulating_supp" && sort.asc ? <IoCaretUpOutline /> : sort.title == "circulating_supp" && sort.desc ? <IoCaretDownOutline /> : sort.title == "circulating_supp" && !sort.asc && !sort.desc ? <></> : <></>}
                            </div>
                        </th>
                        <th onClick={() => sortEvent("market_cap")} className="w-1/6 p-3 text-left bg-white dark:bg-brand-black">
                            <div className="flex items-center">
                                <p>{ct('market-cap')}</p>
                                {sort.title == "market_cap" && sort.asc ? <IoCaretUpOutline /> : sort.title == "market_cap" && sort.desc ? <IoCaretDownOutline /> : sort.title == "market_cap" && !sort.asc && !sort.desc ? <></> : <></>}
                            </div>
                        </th>
                        <th className="w-1/6 p-3 text-left bg-white dark:bg-brand-black">
                            {ct('last-7-days')}
                        </th>
                    </tr>
                </thead>
                <tbody className='text-sm'>
                    {sortedData.length > 0 && sortedData.map((stat, i) => (
                        <tr key={stat.symbol} className="text-sm font-medium cursor-pointer">
                            <td className='sticky left-0 bg-white dark:bg-brand-black p-[10px] text-left border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                <div className='flex items-center justify-start space-x-2'>
                                    <BsStar onClick={() => {
                                        // TODO:: save to fav
                                    }} className='cursor-pointer text-brand-yellow-400' />
                                    <p className='text-brand-grey-100 dark:text-white'>{stat.rank}</p>
                                </div>
                            </td>
                            <td onClick={() => window.location.href = `/${lang}/currencies/${stat.symbol}`} className='sticky left-14 bg-white dark:bg-brand-black py-3 px-2 border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                <div className="flex items-center">
                                    <div className="relative flex-shrink-0 w-8 h-8">
                                        <Image loader={iconImgLoader} priority={i < 3} src={stat.logoUrl} layout="fill" objectFit="contain" />
                                    </div>
                                    <div className="flex flex-col ml-[9px]">
                                        <p className="font-medium">{stat.symbol}</p>
                                        {/* <p className="font-normal text-10 text-brand-grey-100 dark:text-brand-grey-120">{stat.name}</p> */}
                                    </div>
                                </div>
                            </td>
                            <td onClick={() => window.location.href = `/${lang}/currencies/${stat.symbol}?tab=market`} className='py-3 text-center border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                <a href={`/${lang}/currencies/${stat.symbol}?tab=market`}>
                                    <p>{'₮'}{formatNumber(stat.quote['MNT'].price, 2)}</p>
                                </a>
                            </td>
                            <td onClick={() => window.location.href = `/${lang}/currencies/${stat.symbol}?tab=market`} className={`p-[10px] ${stat.quote['MNT'].ch24hPercent >= 0 ? "text-brand-green-500" : "text-brand-red-400"} border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30`}>
                                <a href={`/${lang}/currencies/${stat.symbol}?tab=market`} className="flex items-center justify-start space-x-1">
                                    {stat.quote['MNT'].ch24hPercent >= 0 ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
                                    <p>{formatNumber(stat.quote['MNT'].ch24hPercent, 2)}%</p>
                                </a>
                            </td>
                            <td onClick={() => window.location.href = `/${lang}/currencies/${stat.symbol}?tab=market`} className={`p-[10px] ${stat.quote['MNT'].ch7dPercent >= 0 ? "text-brand-green-500" : "text-brand-red-400"} border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30`}>
                                <a href={`/${lang}/currencies/${stat.symbol}?tab=market`} className="flex items-center justify-start space-x-1">
                                    {stat.quote['MNT'].ch7dPercent >= 0 ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
                                    <p>{formatNumber(stat.quote['MNT'].ch7dPercent, 2)}%</p>
                                </a>
                            </td>
                            <td onClick={() => window.location.href = `/${lang}/currencies/${stat.symbol}?tab=market`} className='p-[10px] border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                <a href={`/${lang}/currencies/${stat.symbol}?tab=market`} className="flex flex-col items-start">
                                    <p>{'₮'}{formatNumber(stat.quote['MNT'].quoteVol24h, 0)}</p>
                                    <p className="text-xs font-light">{formatNumber(stat.vol24h, 2)} {stat.symbol}</p>
                                </a>
                            </td>
                            <td onClick={() => window.location.href = `/${lang}/currencies/${stat.symbol}?tab=market`} className='p-[10px] pr-[1rem] border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                <div className="flex flex-col items-end justify-center space-y-1 text-sm">
                                    <p className="text-start">{formatNumber(stat.circulatingSupply, 0)} {stat.circulatingSupply ? stat.symbol : ''}</p>
                                    {stat.circulatingSupply > 0 && stat.maxSupply > 0 && (
                                        <Line percent={(stat.circulatingSupply * 100) / stat.maxSupply} strokeWidth={5} trailWidth={5} strokeColor={`${currentTheme === 'light' ? "#cfd6e4" : "#323546"}`} trailColor={`${currentTheme === 'light' ? "#eff2f5" : "#1C1C1C"}`} style={{ borderRadius: 5 }} strokeLinecap="square" />
                                    )}
                                </div>
                            </td>
                            <td onClick={() => window.location.href = `/${lang}/currencies/${stat.symbol}?tab=market`} className='p-[10px] pr-[1rem] border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                <a href={`/${lang}/currencies/${stat.symbol}?tab=market`} className="flex justify-center">
                                    <p>{'₮'}{formatNumber(stat.quote['MNT'].marketCap, 2)}</p>
                                </a>
                            </td>
                            <td onClick={() => window.location.href = `/${lang}/currencies/${stat.symbol}?tab=chart`} className='p-[10px] text-center border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                <a href={`/${lang}/currencies/${stat.symbol}?tab=chart`}>
                                    <div className="items-center h-full flex-full">
                                        <img alt={"chart7d"} src={stat.chart7d} className='object-contain w-full h-[60px]' />
                                    </div>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}