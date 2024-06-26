import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Image from 'next/image'
import Cookie from 'js-cookie'
import { Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { HiViewList, HiViewGrid } from 'react-icons/hi'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import NewsBanner from 'assets/news-02.png'
import Navbar from 'components/navbar'
import NewsList from 'components/news/NewsList';
import NewsGrid from 'components/news/NewsGrid';
import kryptoClient from 'src/apiClient';
import useTranslation from 'next-translate/useTranslation';
import client from 'src/axiosClient';


interface Props {
    news: any,
    summary: any,
}

const VISIBLE_PAGE = 18

export default function Home ({ news, summary, ...props }: Props) {

    const router = useRouter()

    const { t: ct } = useTranslation('common')
    const { t } = useTranslation('news')

    const [isNewsGrid, setIsNewsGrid] = useState(true)

    useEffect(() => {
        setIsNewsGrid(Cookie.get('isNewsHomeGrid') === 'hide' ? false : true)
    }, [])

    const handlePageView = (i) => {
        router.push(`/news/page/${i}`, undefined, { scroll: false })
    }

    const handleNewsToggleLayout = (isShow) => {
        setIsNewsGrid(isShow)

        if (isShow) {
            Cookie.set('isNewsGrid', 'show')
        } else {
            Cookie.set('isNewsGrid', 'hide')
        }
    }

    return (
        <div className='dark:text-white pb-9'>
            <Navbar data={summary} />
            <div className="mb-20">
                <div className="w-screen bg-black">
                    <div className="flex items-center justify-start w-11/12 py-4 mx-auto">
                        <div className="flex flex-col items-center w-1/2 space-y-4">
                            <h1 className="text-3xl font-bold text-white">{ct('news')}</h1>
                        </div>
                        <div className="relative h-[7rem] w-1/2 mx-auto flex-shrink-0">
                            <Image src={NewsBanner} priority loader={({ src }) => `${src}?width=512`} layout="fill" objectFit="contain" /> 
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-brand-black">
                        <div className="w-11/12 mx-auto flex items-center justify-end text-sm space-x-4 py-[1rem]">
                            <p className="font-medium">{t('layout')}</p>
                            <div className="flex items-center space-x-2">
                                <HiViewGrid onClick={() => handleNewsToggleLayout(true)} size={24} className={`${isNewsGrid ? "" : "text-opacity-30 dark:text-opacity-60"} cursor-pointer text-black dark:text-brand-grey-110`} />
                                <HiViewList onClick={() => handleNewsToggleLayout(false)} size={20} className={`${!isNewsGrid ? "" : "text-opacity-30 dark:text-opacity-60"} cursor-pointer text-black dark:text-brand-grey-110`} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-11/12 pt-6 mx-auto">
                    {isNewsGrid ? <NewsGrid news={news} /> : <NewsList news={news} />}
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ query, ...ctx }) {

    ctx.res.setHeader('Cache-Control','public, s-maxage=90')
    
    const news = await client.get("/news/list?page=0&pageSize=50");
    const summary = await client.get("/crypto/market-summary?convert=MNT,USD");

    return {
        props: {
            news: news.data,
            summary: summary.data,
        },
    }
}