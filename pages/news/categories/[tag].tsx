import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Image from 'next/image'
import Navbar from 'components/navbar'
import CookieParser from 'cookie';
import Cookie from 'js-cookie'
import { Spinner } from '@chakra-ui/react';
import { HiViewList, HiViewGrid } from 'react-icons/hi'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useRouter } from 'next/router';

import CategoriesNewsGrid from 'components/news/CategoriesNewsGrid';
import CategoriesNewsList from 'components/news/CategoriesNewsList';
import kryptoClient from 'src/apiClient';

interface Props {
    metrics: Metrics,
    newsTag: NewsTag,
    news: NewsSearch[],
    isNewsGrid: boolean,
    totalPage: string,
    currentPage: string
}

const VISIBLE_PAGE = 18

export default function News ({ metrics, news, newsTag, totalPage, ...props }: Props) {

    const router = useRouter()
    const { tag } = router.query
    const tagName = newsTag[tag.toString()].name
    
    const [currentPage, setCurrentPage] = useState<number>(parseInt(props.currentPage));
    const [isNewsGrid, setIsNewsGrid] = useState(props.isNewsGrid)

    useEffect(() => {
        router.query.page = currentPage.toString()
        router.push(router, undefined, { scroll: false })
    }, [currentPage])

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
            <Navbar isForceRefetch={false} metrics={metrics.data} />
            <div className="mb-10">
                <div className="w-screen bg-blue-900">
                    <div className="flex items-center justify-start w-11/12 py-4 mx-auto">
                        <div className="flex flex-col items-start w-2/5 py-4 space-y-4">
                            <h1 className="text-3xl font-bold text-white">{tagName}</h1>
                            <p className="text-sm text-white">
                                {newsTag[tag.toString()].description || ''}
                            </p>
                        </div>
                        <div className="w-3/5 relative h-[10rem]">
                            {newsTag[tag.toString()].image_url && <Image src={newsTag[tag.toString()].image_url} priority loader={({ src }) => `${src}?width=780`} layout="fill" objectFit="contain" /> }
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-brand-black">
                        <div className="w-11/12 mx-auto flex items-center justify-end text-sm space-x-4 py-[1rem]">
                            <p className="font-medium">Харагдалт</p>
                            <div className="flex items-center space-x-2">
                                <HiViewGrid onClick={() => handleNewsToggleLayout(true)} size={20} className={`${isNewsGrid ? "" : "text-opacity-30 dark:text-opacity-60"} cursor-pointer text-black dark:text-brand-grey-110`} />
                                <HiViewList onClick={() => handleNewsToggleLayout(false)} size={20} className={`${!isNewsGrid ? "" : "text-opacity-30 dark:text-opacity-60"} cursor-pointer text-black dark:text-brand-grey-110`} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-11/12 mx-auto">
                    <h3 className="text-xl font-bold my-9">Мэдээ ({totalPage})</h3>
                    {parseInt(props.currentPage) === currentPage ? 
                        isNewsGrid ? <CategoriesNewsGrid pageSize={VISIBLE_PAGE} news={news} tag={tagName} /> : <CategoriesNewsList pageSize={VISIBLE_PAGE}  news={news} tag={tagName} />
                    : (
                        <div className="flex justify-center items-center my-[10rem]">
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.300'
                                size='xl'
                            />
                        </div>
                    )}
                </div>
                {parseInt(totalPage) > VISIBLE_PAGE && (
                    <div className="flex items-center justify-center w-full mx-auto mt-20">
                        <FaAngleLeft onClick={() => handleReduceCurrentPage()} className="cursor-pointer" />
                        <div className="flex mx-10">{processPagination()}</div>
                        <FaAngleRight onClick={() => handleRaiseCurrentPage()} className="cursor-pointer" />
                    </div>
                )}
            </div>
        </div>
    )
    

    function handleReduceCurrentPage() {
        parseInt(props.currentPage) > 1 && setCurrentPage(parseInt(props.currentPage) - 1);
    }
    
    function handleRaiseCurrentPage() {
        parseInt(props.currentPage) != Math.ceil(parseInt(totalPage) / VISIBLE_PAGE) && setCurrentPage(parseInt(props.currentPage) + 1);
    }
    
    function processPagination() {
        let a = [];
    
        let startPage;
        let endPage;
    
        const totalPages = Math.ceil(parseInt(totalPage) / VISIBLE_PAGE);

        if (parseInt(props.currentPage) < 1) setCurrentPage(1);
        else if (parseInt(props.currentPage) > totalPages) setCurrentPage(totalPages);
    
        if (totalPages >= VISIBLE_PAGE) {
            startPage = 1;
            endPage = totalPages;
        } else {
            let maxPagesBeforeCurrentPages = Math.floor(VISIBLE_PAGE / 2);
            let maxPagesAfterCurrentPages = Math.ceil(VISIBLE_PAGE / 2) - 1;
    
            if (parseInt(props.currentPage) <= maxPagesBeforeCurrentPages || parseInt(props.currentPage) === totalPages) {
                startPage = 1;
                endPage = totalPages;
            } else if (parseInt(props.currentPage) + maxPagesAfterCurrentPages >= totalPages) {
                startPage = totalPages - VISIBLE_PAGE + 1;
                endPage = totalPages;
            } else {
                startPage = parseInt(props.currentPage) - maxPagesBeforeCurrentPages;
                endPage = parseInt(props.currentPage) + maxPagesAfterCurrentPages;
            }
        }
    
        for (let i = startPage; i <= endPage; i++) {
            if (parseInt(props.currentPage) == i)
                a.push(<p className={`mx-1 px-4 py-2 rounded-lg cursor-pointer bg-gray-200 dark:bg-brand-grey-150 font-medium`}>{i}</p>);
            else
                a.push(
                    <p
                        onClick={() => setCurrentPage(i)}
                        className={`mx-1 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200/50 dark:hover:bg-brand-grey-150/50 font-medium`}>
                        {i}
                    </p>
                );
        }
    
        return a;
    }
}

export async function getServerSideProps({ req, query, ...ctx }) {

    ctx.res.setHeader('Cache-Control','public, s-maxage=90')
    
    const cookie = CookieParser.parse(req.headers.cookie || "")

    let [metrics, newsTag, news] = await Promise.all([
                kryptoClient.getMetricsQuotesLatest({ convert: "MNT,USD" }),
                kryptoClient.getNewsTagInfo({ slug: query.tag }),
                kryptoClient.getNewsSearch({ tag: query.tag, start: (query?.page - 1 || 0) * VISIBLE_PAGE, limit: VISIBLE_PAGE })
    ])
    
    const totalPage = news.meta.total

    return {
        props: {
            metrics,
            news: news.data,
            newsTag: newsTag.data,
            totalPage,
            currentPage: query?.page || 1,
            isNewsGrid: cookie?.isNewsGrid === 'hide' ? false : true
        }
    }
}