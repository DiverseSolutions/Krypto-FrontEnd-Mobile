import { Table } from 'components/home/Table';
import Navbar from 'components/navbar';
import Slider from 'react-slick';
import NewsLetter from 'components/NewsLetter';
import useTranslation from 'next-translate/useTranslation';
import React, { ReactElement, startTransition, Suspense, useEffect, useMemo, useRef, useState } from 'react';

import NewsSlider from './NewsSlider';
import { BiChevronLeft, BiChevronRight, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import HomeCard from './HomeCard';
import HomeRecentCard from './HomeRecentCard';
import LogoGainers from 'components/logo/LogoGainers';
import LogoRecently from 'components/logo/LogoRecently';
import LogoTrending from 'components/logo/LogoTrending';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { Spinner } from '@chakra-ui/react';
import SummaryCard from './SummaryCard';

interface Props {
    data: {
        listing: any,
        news: any,
        gainers: any,
        trending: any,
        recent: any,
        marketSummary: any,
        listingType: 'local' | 'foreign',
        isActiveWidgets: 'show' | 'hide',
        fearAndGreed: any,
        conversions: any,
    }
}

const settings = {
    className: "",
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <WidgetsPrevArrow />,
    nextArrow: <WidgetsNextArrow />,
};

const defaultLazyLoader = () => <div className="flex items-center justify-center w-full h-full"><Spinner /></div>

const ConverterLazy = dynamic(() => import('./Converter'), {
    ssr: false,
    loading: defaultLazyLoader,
  }) as any;

function WidgetsPrevArrow(props) {
    const { className, style, onClick } = props;

    return (
        <div onClick={onClick} className={`${onClick === null ? "hidden" : "cursor-pointer z-10"} absolute text-brand-blue-300 font-extrabold top-1/2 -translate-y-1/2 left-1 cursor-pointer`}>
            <BiLeftArrow size={28} />
        </div>
    );
}

function WidgetsNextArrow(props) {
    const { className, style, onClick } = props;

    return (
        <div onClick={onClick} className={`${onClick === null ? "hidden" : "cursor-pointer z-10"} absolute text-brand-blue-300 font-extrabold top-1/2 -translate-y-1/2 right-1 cursor-pointer`}>
            <BiRightArrow size={28} />
        </div>
    );
}

const FearGreedIndexLazy = dynamic(() => import('./FearGreedIndex'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center w-full h-full"><Spinner /></div>
}) as any;

export default function HomePage(props: Props) {

    const tagRef = useRef(null)
    const { t } = useTranslation('home')
    const { t: ct } = useTranslation('common')

    const router = useRouter();

    const [isActiveWidgets, setIsActiveWidgets] = useState(() => props.data.isActiveWidgets === 'hide' ? false : true)
    const handleToggleWidgets = () => {
        const v = !isActiveWidgets;
        setIsActiveWidgets(v)
        if (v) {
            Cookies.set('isActiveWidgets', 'show')
        } else {
            Cookies.set('isActiveWidgets', 'hide')
        }
    }

    const currentPage = useMemo(() => {
        if (router.isReady) {
            return parseInt(`${router.query.page}`) || 1;
        }
        return null
    },[router])

    const pages = useMemo(() => {
        return Array.from({length: props.data.listing.totalPages}, (_, index) => index + 1)
    }, [props.data.listing.totalPages])

    const addQueryParam = (key: string, value: string) => {
        // Retrieve the current pathname and query parameters
        const currentPathname = router.pathname;
        const currentQuery = router.query;
    
        // Define the new query parameter you want to add
        const newQueryParam = { [key]: value };
    
        // Merge the current query parameters with the new one
        const updatedQuery = { ...currentQuery, ...newQueryParam };
    
        // Push the updated query parameters to the current route
        router.push({
          pathname: currentPathname,
          query: updatedQuery,
        }, undefined, { shallow: false });
     };

    return (
        <div className="w-full dark:text-white dark:bg-brand-black">
            <Navbar data={props.data.marketSummary} />
            <div className="mt-[30px] relative">
                <NewsSlider data={props.data.news} />
            </div>
            <div className="flex flex-col space-y-4 mt-[30px]">
                <div className="flex items-center justify-end w-full pr-4 space-x-4">
                    <p className="text-xs font-medium">{t('show-utils')}</p>
                    <div onClick={handleToggleWidgets} className={`${isActiveWidgets ? "bg-brand-blue-400" : "bg-brand-grey-120"} w-12 h-5 rounded-xl cursor-pointer flex items-center duration-1000`}>
                        <div className={`${isActiveWidgets ? "translate-x-7" : "translate-x-0"} duration-300 h-5 w-5 rounded-full bg-white`}></div>
                    </div>
                </div>
                {isActiveWidgets && (
                    <div>
                        <Slider {...settings}>
                            <HomeCard title={t('gainers')} list={props.data.gainers} logo={LogoGainers} />
                            <HomeCard priority title={t('trending')} list={props.data.trending} logo={LogoTrending} />
                            <FearGreedIndexLazy title={t('fgi')} fgi={props.data.fearAndGreed} />
                            <ConverterLazy title={t('converter')} trending={props.data.trending} conversions={props.data.conversions} defaultBase={props.data.trending.length ? props.data.trending[0].symbol : "ARDX"} defaultQuote={"MNT"} />
                            <SummaryCard title={`${ct('local-market-cap')} 7d`} 
                                chart={props.data.marketSummary.localMarketCap7d} 
                                val={props.data.marketSummary.quote['MNT'].localMarketCap}
                                ch24h={props.data.marketSummary.quote['MNT'].localMarketCap24hPercent}
                                 />
                            <SummaryCard title={`${ct('local-vol-24h')} 7d`} 
                                chart={props.data.marketSummary.localVol24h7d} 
                                val={props.data.marketSummary.quote['MNT'].localVol24h}
                                ch24h={props.data.marketSummary.quote['MNT'].localVol24hPercent}
                                 />
                            <HomeRecentCard title={t('recently-added')} list={props.data.recent} logo={LogoRecently} />
                        </Slider>
                    </div>
                )}
            </div>
            <div ref={tagRef} className="mt-8 p-[1rem] bg-white dark:bg-brand-black">
                <h1 className="text-sm font-bold">{t('today-crypto')}</h1>
                <div className="mt-3">
                    <div className="flex items-center space-x-4 overflow-x-auto text-xs font-medium no-scrollbar">
                        <div className="flex items-center">
                            <div onClick={() => {
                                Cookies.set("listingType", "foreign");
                                router.push({
                                    pathname: '/',
                                    query: {
                                        listing: 'foreign',
                                    }
                                }, undefined, {
                                    shallow: false,
                                })
                            }} className={`${props.data.listingType !== 'local' ? "bg-brand-blue-300 text-white" : "text-brand-blue-300 hover:bg-brand-blue-300/30"} py-1 w-20 border rounded-l border-brand-blue-300 cursor-pointer`}>
                                <p className='text-center'>{ct('foreign')}</p>
                            </div>
                            <div onClick={() => {
                                Cookies.set("listingType", "local");
                                router.push({
                                    pathname: '/',
                                    query: {
                                        listing: 'local',
                                    }
                                }, undefined, {
                                    shallow: false,
                                })
                            }} className={`${props.data.listingType === 'local' ? "bg-brand-blue-300 text-white" : "text-brand-blue-300 hover:bg-brand-blue-300/30"} py-1 w-20 border rounded-r border-brand-blue-300 cursor-pointer`}>
                                <p className='text-center'>{ct('mongolian')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Table listing={props.data.listing} />
                <div className="flex items-center justify-center w-full mx-auto mt-4">
                    <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
                        <a
                            onClick={() => {
                                addQueryParam('page', (Math.max(currentPage-1, 1)).toString())
                            }}
                            className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">Previous</span>
                            <BiChevronLeft className="w-5 h-5" aria-hidden="true" />
                        </a>
                        {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                        {pages.map((p) => (
                            <a
                                key={`${props.data.listingType}${p}`}
                                onClick={() => {
                                    addQueryParam('page', p.toString())
                                }}
                                aria-current="page"
                                className={
                                    classNames("relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", {
                                        ' bg-brand-blue-300 text-white': currentPage === p,
                                        ' text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300': currentPage !== p,
                                    })
                                }
                            >
                                {p}
                            </a>
                        ))}
                        <a  
                            onClick={() => {
                                addQueryParam('page', (Math.min(currentPage+1, props.data.listing.totalPages)).toString())
                            }}
                            className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">Next</span>
                            <BiChevronRight className="w-5 h-5" aria-hidden="true" />
                        </a>
                    </nav>
                </div>

            </div>
            <div>
                <NewsLetter />
            </div>
        </div>
    )
}