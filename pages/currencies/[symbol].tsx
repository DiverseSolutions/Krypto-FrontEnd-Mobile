import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import Navbar from 'components/navbar';
import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Line } from 'rc-progress';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5';
import client from 'src/axiosClient';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { formatNumber, fromNow, imgLoader } from 'src/utils';
import { Spinner } from '@chakra-ui/react';

interface Props {
    stats: any,
    marketPairs: any,
    conversions: any,
    trending: any,
    summary: any,
    initialTab: string,
}

const defaultLazyLoader = () => <div className="flex items-center justify-center w-full h-full"><Spinner /></div>

const SinglePageConverterLazy = dynamic(() => import('components/SinglePageConverter'), {
    ssr: false,
    loading: defaultLazyLoader
});

export default function SingleAsset({ stats, conversions, ...props }: Props) {

    const dispatch = useAppDispatch();
    const qt = useAppSelector(state => state.quote)
    const initialFocusRef = React.useRef()
    const router = useRouter()
    const { systemTheme, theme, } = useTheme()
    const { t } = useTranslation('currencies')
    const { t: ct } = useTranslation('common')
    const [isShowInfo, setIsShoInfo] = useState(false)
    const [currentTheme, setCurrentTheme] = useState("light")
    const [selectedChartType, setSelectedChartType] = useState('price')
    const [shouldFetchChart, setShouldFetchChart] = useState(false);
    const [chartInterval, setChartInterval] = useState('7D')
    const [activeTab, setActiveTab] = useState(() => {
        if (props.initialTab) {
            if (['overview', 'market', 'info'].find(t => t === props.initialTab)) {
                return props.initialTab
            }
        }
        return 'overview'
    })

    const chartIntervals = useMemo(() => {
        return [
            {
                id: '1D',
                name: `1${ct('day-fl')}`
            }, {
                id: '7D',
                name: `7${ct('day-fl')}`
            }, {
                id: '1M',
                name: `1${ct('month-fl')}`
            }, {
                id: '3M',
                name: `3${ct('month-fl')}`
            }, {
                id: '1Y',
                name: `1${ct('year-fl')}`
            }, {
                id: 'ALL',
                name: ct('all')
            }]
    }, [ct]);
    
    const chartTypes = useMemo(() => {
        return [{
            name: ct('price'),
            key: 'price',
        },
        {
            name: ct('market-cap'),
            key: 'marketcap',
        }
    ];
    }, [ct])

    useEffect(() => {
        if (activeTab === 'chart') {
            setShouldFetchChart(true);
        }
    }, [activeTab])

    const handleChangeActiveTab = (tab) => {
        setActiveTab(tab)
        router.push(`/currencies/${stats.symbol}?tab=${tab}`, undefined, { shallow: true, scroll: false })
    }

    useEffect(() => {  
        const temp = theme == 'system' ? systemTheme : theme

        setCurrentTheme(temp)
    }, [theme, systemTheme])

    useEffect(() => {
        if (router.query.tab) {
            return setActiveTab(router.query.tab.toString())
        }
        return setActiveTab('overview')
    }, [router])

    useEffect(() => {
        if (shouldFetchChart) {
            fetchChartData(chartInterval);
        }
    }, [chartInterval, shouldFetchChart])
    

    const fetchChartData = async (chartInterval) => {
            // TODO:: chart
    }
    
    return (
        <div className="pb-9">
            <Head>
                <title>{t('currency-title', {name: stats.name, symbol: stats.symbol})}</title>
            </Head>
            <div className="pb-4 mb-8 bg-white dark:text-white dark:bg-brand-black">
                <div className='bg-white dark:bg-brand-black'>
                    <Navbar data={props.summary} />
                </div>
                <div className="px-[1rem] mt-8 flex items-start justify-between">
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <p className="px-2 py-1 text-xs text-black bg-gray-100 dark:text-white dark:bg-brand-dark-400">{ct('rank')} #{stats.rank}</p>
                            <p className="px-2 py-1 text-xs text-black bg-gray-100 dark:text-white dark:bg-brand-dark-400">{stats.is_token ? ct('token') : ct('coin')}</p>
                        </div>
                        <div className="flex space-x-2 text-xl font-semibold">
                            <Image loader={({src}) => `${src}?width=32`} priority src={stats.logoUrl} width={28} height={28} />
                            <h3>{stats.name}</h3>
                            <p>({stats.symbol})</p>
                        </div>
                        <div className="flex items-center space-x-3 font-bold">
                            <div className="flex items-center space-x-1 text-4xl">
                                <span>{'₮'}</span>
                                <h3>{formatNumber(stats.quote['MNT'].price, 2)}</h3>
                            </div>
                            <div className={`${stats.quote['MNT'].ch24hPercent >= 0 ? "text-brand-green-400" : "text-brand-red-400"} flex items-center text-2xl`}>
                                {stats.quote['MNT'].ch24hPercent >= 0 ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
                                <p>{formatNumber(stats.quote['MNT'].ch24hPercent, 2)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-[1rem] mt-3 space-y-2">
                    <Line percent={currentPricePercent(stats.quote['MNT'].low24h, stats.quote['MNT'].high24h, stats.quote['MNT'].price)} strokeWidth={2} trailWidth={2} strokeColor="#0057FF" style={{borderRadius: 5}} trailColor={`${currentTheme === 'light' ? "#e5e7eb" : "#1e293b"}`} strokeLinecap="square" />
                    <div className="flex items-center justify-between text-xs font-medium tracking-wider">
                        <p>{'₮'}{formatNumber(stats.quote['MNT'].low24h, 2)}</p>
                        <p>24H Range</p>
                        <p>{'₮'}{formatNumber(stats.quote['MNT'].high24h, 2)}</p>
                    </div>
                </div>
                <div className="px-[1rem] mt-5">
                    <div className="flex-col space-y-3 font-medium">
                        <div className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-800 pb-2 text-[0.8rem]">
                            <div className="flex items-center w-2/3 space-x-1 text-left text-gray-500 dark:text-white">
                                <p className="">{ct('market-cap')}</p>
                                <Popover placement='bottom' trigger='click' gutter={0}>
                                    <PopoverTrigger>
                                        <div>
                                            <HiInformationCircle className='text-brand-grey-120' size={18} />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent shadow={'xl'} className='z-10 p-4 bg-white rounded-md dark:bg-brand-dark-400' border={'none'} padding={0}>
                                        <PopoverBody>
                                            <div className="text-xs text-left dark:text-white">
                                                Гүйлгээнд буй койны эргэлтийн хэмжээ. <br /> Хөрөнгийн зах зээлийн компанийн үнэлгээтэй ижил гэж ойлгож болно.
                                                <br />Зах зээлийн үнэлгээ = Одоогийн ханш x Гүйлгээнд буй хэмжээ.
                                            </div>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover> 
                            </div>
                            <p className="w-1/3 tracking-wide text-right ">{'₮'}{formatNumber(stats.quote['MNT'].marketCap, 2)}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-800 pb-2 text-[0.8rem]">
                            <div className="flex items-center w-2/3 space-x-1 text-left text-gray-500 dark:text-white">
                                <p>{t('trading-vol-24h')}</p>
                                <Popover placement='bottom' trigger='click' gutter={0}>
                                    <PopoverTrigger>
                                        <div>
                                            <HiInformationCircle className='text-brand-grey-120' size={18} />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent shadow={'xl'} className='z-10 p-4 bg-white rounded-md dark:bg-brand-dark-400' border={'none'} padding={0}>
                                        <PopoverBody>
                                            <div className="text-xs text-left dark:text-white">
                                                Өнгөрсөн 24 цагт арилжаалагдсан койны тоо хэмжээ.
                                            </div>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover> 
                            </div>
                            <p className="w-1/3 font-medium tracking-wide">{'₮'}{formatNumber(stats.quote['MNT'].quoteVol24h, 2)}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-800 pb-2 text-[0.8rem]">
                            <div className="flex items-center justify-start w-2/3 space-x-1 text-gray-500 dark:text-white">
                                <p>{t('fd-market-cap')}</p>
                                <Popover placement='bottom' trigger='click' gutter={0}>
                                    <PopoverTrigger>
                                        <div>
                                            <HiInformationCircle className='text-brand-grey-120' size={18} />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent shadow={'xl'} className='z-10 p-4 bg-white rounded-md dark:bg-brand-dark-400' border={'none'} padding={0}>
                                        <PopoverBody>
                                            <div className="text-xs text-left dark:text-white">
                                                Койны нийлүүлэлт дээд хэмжээнд хүрсэн үеийн зах зээлийн үнэлгээ.  <br />
                                                Ханасан зах зээлийн үнэлгээ = Одоогийн {t('price')} x Нийт нийлүүлэлт.
                                            </div>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover> 
                            </div>
                            <p className="w-1/3 font-medium tracking-wide">{'₮'}{formatNumber(stats.quote['MNT'].fdMarketCap, 2)}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-800 pb-2 text-[0.8rem]">
                            <div className="flex items-center w-2/3 space-x-1 text-gray-500 dark:text-white">
                                <p>{t('trade-vs-marketcap')}</p>
                                <Popover placement='bottom' trigger='click' gutter={0}>
                                    <PopoverTrigger>
                                        <div>
                                            <HiInformationCircle className='text-brand-grey-120' size={18} />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent shadow={'xl'} className='z-10 p-4 bg-white rounded-md dark:bg-brand-dark-400' border={'none'} padding={0}>
                                        <PopoverBody>
                                            <div className="text-xs text-left dark:text-white">
                                                Арилжаа үнэлгээний харьцаа = Өнгөрсөн 24 цагийн арилжааны хэмжээ / Зах зээлийн үнэлгээ.
                                            </div>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover> 
                            </div>
                            <p className="w-1/3 font-medium tracking-wide">{formatNumber(stats.quote['MNT'].quoteVol24h / stats.quote['MNT'].marketCap, 8)}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-800 pb-2 text-[0.8rem]">
                            <div className="flex items-center w-2/3 space-x-1 text-gray-500 dark:text-white">
                                <p>{ct('circulating-supply')}</p>
                                <Popover placement='bottom' trigger='click' gutter={0}>
                                    <PopoverTrigger>
                                        <div>
                                            <HiInformationCircle className='text-brand-grey-120' size={18} />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent shadow={'xl'} className='z-10 p-4 bg-white rounded-md dark:bg-brand-dark-400' border={'none'} padding={0}>
                                        <PopoverBody>
                                            <div className="text-xs text-left dark:text-white">
                                                Зах зээл болон олон нийтийн эзэмшилд буй койны хэмжээ.
                                                <p className="mt-2 text-red-400">Гүйлгээнд буй хэмжээг төслийн багтай холбогдож батлаагүй байгаа болно!</p>
                                            </div>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover> 
                            </div>
                            <div className="flex items-center w-1/3 space-x-1 font-medium tracking-wide">
                                <p>{formatNumber(stats.circulatingSupply, 0)}{stats.symbol}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-800 pb-2 text-[0.8rem]">
                            <div className="flex items-center w-2/3 space-x-1 text-gray-500 dark:text-white">
                                <p>{t('total-supply')}</p>
                                <Popover placement='bottom' trigger='click' gutter={0}>
                                    <PopoverTrigger>
                                        <div>
                                            <HiInformationCircle className='text-brand-grey-120' size={18} />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent shadow={'xl'} className='z-10 p-4 bg-white rounded-md dark:bg-brand-dark-400' border={'none'} padding={0}>
                                        <PopoverBody>
                                            <div className="text-xs text-left dark:text-white">
                                                Нийт боломжит койны хэмжээ. Энэ нь зах зээлд энэ тооны койн арилжаалагдаж байгаа гэсэн үг биш юм. 
                                                Энэ мэдээллийг арилжааны хэмжээнээс харах боломжтой.
                                            </div>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover> 
                            </div>
                            <p className="w-1/3 font-medium tracking-wide">{stats.totalSupply > 0 ? new BigNumber(stats.totalSupply).toFormat() : '--'}{stats.symbol}</p>
                        </div>
                    </div>
                </div>
                <div className="px-[1rem] mt-5 flex flex-col">
                    <div onClick={() => setIsShoInfo(!isShowInfo)} className="py-2 text-center bg-gray-100 rounded-md cursor-pointer dark:bg-brand-dark-400">
                        <p className="text-[0.9rem] font-medium text-black dark:text-white text-opacity-80">{isShowInfo ? t('close') : ct('info')}</p>
                    </div>
                    <span className="mt-5 border-gray-200 border-b-1 dark:border-gray-800"></span>
                </div>
                <div className="px-[1rem] mt-5">
                    <SinglePageConverterLazy trending={props.trending} symbol={stats.symbol} conversions={conversions} />
                </div>
                <div className="px-[1rem] mt-5">
                    <div className="flex space-x-8 font-semibold text-[0.9rem] tracking-wide border-b-1 border-gray-200 dark:border-gray-800 h-8 overflow-x-auto no-scrollbar">
                        <p onClick={() => handleChangeActiveTab('overview')} className={`${activeTab == "overview" ? "border-b-2 border-brand-green-400 text-opacity-80" : "text-opacity-60 dark:text-opacity-60"} text-black dark:text-white cursor-pointer`}>{ct('price')}</p>
                        <p onClick={() => {
                            setShouldFetchChart(true);
                            handleChangeActiveTab('chart')
                        }} className={`${activeTab == "chart" ? "border-b-2 border-brand-green-400 text-opacity-80" : "text-opacity-60 dark:text-opacity-60"} text-black dark:text-white cursor-pointer`}>{t('chart')}</p>
                        <p onClick={() => handleChangeActiveTab('info')} className={`${activeTab == "info" ? "border-b-2 border-brand-green-400 text-opacity-80" : "text-opacity-60 dark:text-opacity-60"} text-black dark:text-white cursor-pointer`}>{t('introduction')}</p>
                        <p onClick={() => handleChangeActiveTab('market')} className={`${activeTab == "market" ? "border-b-2 border-brand-green-400 text-opacity-80" : "text-opacity-60 dark:text-opacity-60"} text-black dark:text-white cursor-pointer`}>{t('market-pairs')}</p>
                    </div>
                </div>
                {activeTab === 'overview' ? (
                    <div className="px-[1rem] mt-5">
                        <div className="px-4 py-2 space-y-4 bg-gray-100 rounded-md dark:bg-brand-dark-400">
                            <h3 className="text-xl font-semibold">{t('price-stats', {name: stats.name})}</h3>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">{t('name-price', {name: stats.name})}</p>
                                <p className="w-3/5 font-medium tracking-wide text-right">
                                    {'₮'}{formatNumber(stats.quote['MNT'].price, 2)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">{ct('market-cap')}</p>
                                <p className="w-3/5 font-medium tracking-wide text-right">
                                    {stats.quote['MNT'].marketCap ? `${'₮'}${formatNumber(stats.quote['MNT'].marketCap, 2)}` : "--"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">{t('24h-low-high')}</p>
                                <div className="flex justify-end w-3/5 space-x-1 font-medium tracking-wide">
                                    <p className="">{stats.quote['MNT'].low24h ? `${'₮'}${formatNumber(stats.quote['MNT'].low24h, 2)}` : "--"}</p>
                                    <span>/</span>
                                    <p className="">{stats.quote['MNT'].high24h ? `${'₮'}${formatNumber(stats.quote['MNT'].high24h, 2)}` : "--"}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">Ранк</p>
                                <p className="w-3/5 font-medium tracking-wide text-right">
                                    #{stats.rank}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">{t('trade-vs-marketcap')}</p>
                                <p className="w-3/5 font-medium tracking-wide text-right">
                                    {stats.quote['MNT'].quoteVol24h ? `${formatNumber(stats.quote['MNT'].quoteVol24h / stats.quote['MNT'].marketCap, 8)}` : "--"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">{t('7d-low-high')}</p>
                                <div className="flex justify-end w-3/5 space-x-1 font-medium tracking-wide">
                                    <p className="">--</p>
                                    <span>/</span>
                                    <p className="">--</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">{t('market-dominance')}</p>
                                <p className="w-3/5 font-medium tracking-wide text-right">
                                    --
                                </p>
                            </div>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">{t('trading-vol')}</p>
                                <p className="w-3/5 font-medium tracking-wide text-right">
                                    --
                                </p>
                            </div>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">{t('ath')}</p>
                                <div className="flex flex-col items-end w-3/5">
                                    <div className="flex space-x-2 tracking-wide">
                                        <p className="font-medium text-right">--</p>
                                        <p className="text-brand-green-400">--</p>
                                    </div>
                                    <p className="text-xs">--</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                <p className="w-2/5 text-gray-500 dark:text-white">{t('atl')}</p>
                                <div className="flex flex-col items-end w-3/5">
                                    <div className="flex space-x-2 font-medium tracking-wide">
                                        <p className="text-right">--</p>
                                        <p className="text-brand-red-400">--</p>
                                    </div>
                                    <p className="text-xs">--</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'chart' ? (
                    <div className="min-h-[600px] px-4">
                        <div className="flex flex-col justify-between w-full mt-8">
                            <div className="flex items-center rounded-xl">
                                <div className="relative z-0 inline-flex mb-4 rounded-md shadow-sm chart-selector">
                                    {chartTypes.map((c) => (
                                        <div key={c.key} onClick={() => setSelectedChartType(c.key)} className={classNames({'bg-gray-200 dark:bg-brand-black': c.key === selectedChartType, 'bg-white dark:bg-opacity-5': c.key !== selectedChartType},"relative inline-flex items-center h-8 px-4 py-2 text-sm font-medium border border-gray-300 border-solid cursor-pointer dark:text-white first:rounded-l-md last:rounded-r-md")}>
                                            {c.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex items-center mb-2 overflow-auto rounded-md cursor-pointer dark:bg-brand-black'>
                                {chartIntervals.map((c) => (
                                    <div key={c.id} onClick={() => {
                                        setChartInterval(c.id)
                                    }} className={classNames({'bg-gray-200 dark:bg-brand-dark-500': chartInterval === c.id, 'bg-white dark:bg-brand-black': c.id !== chartInterval}, " relative inline-flex items-center h-8 px-4 py-2 text-sm font-medium border border-gray-300 border-solid cursor-pointer dark:text-white first:rounded-l-md last:rounded-r-md")}>
                                        {c.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* <SinglePageChart type={selectedChartType} statsData={stats} />  */}
                    </div>
                ) : activeTab === 'info' ? (
                    <div className="px-[1rem] mt-5">
                        <div className="space-y-4 font-sans font-medium text-md dark:text-gray-300 dark:text-opacity-90">
                            <div className="w-full prose asset-info-container dark:prose-invert" style={{maxWidth: '100%'}}>
                                <div dangerouslySetInnerHTML={{__html: stats?.description || ''}}></div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'market' ? (
                    <div className="overflow-x-auto bg-white dark:text-white dark:bg-brand-black no-scrollbar mt-9">
                        <table style={{ minWidth: "900px", borderSpacing: 0 }} className="mx-2 border-separate table-fixed">
                            <thead className="">
                                <tr className="text-sm border-b">
                                    <th className="sticky left-0 w-1/12 px-3 text-left bg-white dark:bg-brand-black">
                                        <div className="flex items-center space-x-3">
                                            <span>#</span>
                                            <p>{ct('exchange')}</p>
                                        </div>
                                    </th>
                                    <th className="w-1/12 px-3 text-right">{ct('pairs')}</th>
                                    <th className="w-1/12 px-3 text-center">{ct('price')}</th>   
                                    <th className="w-1/12 px-3 text-left">{t('vol-24h-shorter')}</th>
                                    <th className="w-1/12 px-3 text-center">Depth -2%</th>
                                    <th className="w-1/12 px-3 text-center">Depth +2%</th>
                                    <th className="w-1/12 px-3 text-center">Liquidiy</th>
                                    <th className="w-1/12 px-3 text-center">Trust score</th>
                                    <th className="w-1/6 px-3 text-right">{ct('updated-at')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.marketPairs.map((market) => (
                                    <tr key={market.rank} className="text-sm font-medium border-solid">
                                        <td className={`${market.isStale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white sticky left-0 px-3 py-4 pr-8 text-left bg-white border-b border-solid dark:bg-brand-black`}>
                                            <a href={market.tradeUrl} target="_blank" className="flex items-center justify-start space-x-2 cursor-pointer">
                                                <span>{market.rank}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`${market.isStale && 'opacity-40 dark:opacity-60'} relative w-16 h-8`}>
                                                        <Image src={market.partnerLogo} loader={imgLoader} layout="fill" objectFit="contain" />
                                                    </div>
                                                </div>
                                            </a>
                                        </td>
                                        <td className={`${market.isStale && 'text-opacity-40 dark:text-opacity-40'} px-3 text-right border-b text-brand-blue-400`}>
                                            <a href={market.tradeUrl} target="_blank" className="">
                                                {market.displaySymbol}
                                            </a>
                                        </td>
                                        <td className={`${market.isStale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white px-3 text-center border-b`}>{market.quote['MNT'].price ? `${'₮'}${formatNumber(market.quote['MNT'].price, 2)}` : "--"}</td>
                                        <td className={`${market.isStale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white px-3 text-left border-b`}>{typeof market.quote['MNT'].quoteVol24h === 'number' ? `${'₮'}${formatNumber(market.quote['MNT'].quoteVol24h, 2)}` : "--"}</td>
                                        <td className={`${market.isStale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white px-3 text-center border-b`}>--</td>
                                        <td className={`${market.isStale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white px-3 text-center border-b`}>--</td>
                                        <td className={`${market.isStale && 'text-opacity-40 dark:text-opacity-40'} text-black dark:text-white px-3 text-center border-b`}>--</td>
                                        <td className={`${market.isStale && ''} text-black dark:text-white px-3 text-center border-b`}>
                                            <div className={`${false ? market.isStale ? 'bg-brand-green-400/40' : 'bg-brand-green-400' : true && true ? market.isStale ? 'bg-yellow-400/40' : 'bg-yellow-400' : market.isStale ? 'bg-brand-red-400/40' : 'bg-brand-red-400'} mx-auto w-[1rem] h-[1rem] rounded-full flex items-center justify-center p-3 text-white text-xs`}></div>
                                        </td>
                                        <td className={`${market.isStale ? 'text-brand-red-400' : 'text-black dark:text-white'} px-3 py-2 text-right border-b`}>{
                                            <Suspense>
                                                {market.ts ? (fromNow(market.ts, ct)):('--')}
                                            </Suspense>
                                        }</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <></>}
            </div>
        </div>
    )

    function currentPricePercent(low : number, high : number, price : number) {
        let diff = high - low
        return 100 * (price - low) / diff;
    }
}

export async function getServerSideProps({ params, query, ...ctx }) {

    ctx.res.setHeader('Cache-Control','public, s-maxage=90')

    const stats = await client.get(`/crypto/currencies/${params.symbol}?convert=MNT`)
    const conversions = await client.get(`/tools/conversions/${params.symbol}`)
    const marketPairs = await client.get(`/crypto/market-pairs/${params.symbol}?convert=MNT`)
    const marketSummary = await client.get(`/crypto/market-summary`)
    const trending = await client.get("/crypto/trending?page=0&pageSize=3&convert=USD,MNT");
    return {
        props: {
            stats: stats.data,
            conversions: conversions.data,
            initialTab: query.tab || "overview",
            summary: marketSummary.data,
            trending: trending.data.data,
            marketPairs: marketPairs.data.data,
        },
    }
}