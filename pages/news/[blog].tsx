import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { Line } from 'rc-progress';
import parse from 'html-react-parser'
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton } from "react-share";
import axios from 'axios';
import moment from 'moment';
import Navbar from 'components/navbar';
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { BsTwitter, BsYoutube } from 'react-icons/bs'
import Head from 'next/head';
import { fromNow, imgLoader } from 'src/utils';
import kryptoClient from 'src/apiClient';
import useTranslation from 'next-translate/useTranslation';
import client from 'src/axiosClient';

const newsSingleImageLoader = ({ src }) => {
    return `${src}?width=512`
}

interface Props {
    data: any,
    summary: any,
}

export default function Blog({ data, summary }: Props) {

    const [percent, setPercent] = useState(0)

    useEffect(() => {
        window.addEventListener('scroll', function() {
            let scrollPx = this.document.documentElement.scrollTop

            const winHeightPx = this.document.documentElement.scrollHeight - this.document.documentElement.clientHeight;
            const scrolled = scrollPx / winHeightPx * 100;

            setPercent(scrolled)
        })
    }, [])

    const {t: ct} = useTranslation('common')
    const {t} = useTranslation('news')

    const shareLink = useMemo(() => {
        return `https://krypto.mn/news/${data.slug}`
    }, [data.slug])
    
    const pageTitle = useMemo<string | null>(() => {
        if (data) {
            return `${data.title} | Krypto`;
        }
        return null
    }, [data])

    useEffect(() => {
       if (!data) {
            window.location.href = '/404';
       }
    }, [data])
    
    if (!data) {
        return <></>
    }

    return (
        <div className="pb-9">
            <Head>
                <meta property="og:url" content={shareLink} key="url" />
                <meta property="og:title" content={data.title} key="title" />
                <meta property="og:image" content={data.image} key="image" />
                {pageTitle ? (<title>{pageTitle}</title>):(<></>)}
            </Head>
            <div className="dark:text-white">
                <div>
                    <Navbar data={summary} />
                </div>
                <div className="relative w-11/12 mx-auto mt-2">
                    <div className="xl:mx-8">
                        {/* <div className="space-x-4">
                            {data.tags.map(tag => <a href={`/news/categories/${tag.tag}`} className="font-medium text-blue-600">{tag.name}</a>)}
                        </div> */}
                        <h1 className="my-4 text-xl font-bold">{data.title}</h1>
                        <div className="flex items-start space-x-8">
                            <div className="text-sm font-medium text-gray-500 dark:text-brand-grey-120">
                                {data.author && <p>{t('author')} {data.author[0]?.last_name || ""} {data.author[0]?.first_name || ""}</p>}
                                <p>{fromNow(data.created_at, ct)}</p>
                                {moment(data.created_at).diff(data.updated_at, 'days') > 0 && <p>{t('updated-at')} {fromNow(data.updated_at, t)}</p>}
                            </div>
                            <div className="flex items-center space-x-2 text-xl">
                                {data.author && data.author[0] ? (
                                    <>
                                        <a target="_blank" href={data.author[0].social_link.facebook} className={`${!data.author[0].social_link.facebook && "hidden"} text-brand-blue-400 cursor-pointer`}><FaFacebookF /></a>
                                        <a target="_blank" href={data.author[0].social_link.instagram} className={`${!data.author[0].social_link.instagram && "hidden"} text-brand-red-400 cursor-pointer`}><FaInstagram /></a>
                                        <a target="_blank" href={data.author[0].social_link.twitter} className={`${!data.author[0].social_link.twitter && "hidden"} text-brand-blue-400 cursor-pointer`}><BsTwitter /></a>
                                        <a target="_blank" href={data.author[0].social_link.youtube} className={`${!data.author[0].social_link.youtube && "hidden"} text-brand-red-400 cursor-pointer`}><BsYoutube /></a>
                                    </>
                                ):(<></>)}
                            </div>
                        </div>
                    </div>
                    <div style={{ height: "15rem" }} className="relative w-full">
                        {data.image ? (<Image className="rounded-lg" priority src={data.image} loader={newsSingleImageLoader} layout="fill" objectFit="contain" />):(<></>)}
                    </div>
                    <div className="pb-8 mt-2 space-y-6 text-base prose text-justify text-black xl:mx-8 lg:mt-9 dark:text-white dark:text-opacity-90 dark:prose-invert">
                        {parse(data.body)}
                    </div>
                </div>
                {percent > 5 && (
                    <>
                        <div className="fixed top-0 left-0 flex items-center justify-between w-full h-24 px-4 bg-white shadow-md dark:bg-brand-dark-400">
                            <p className="w-3/4 text-sm font-semibold">{data.title}</p>
                            <div className="flex flex-wrap w-1/4 text-2xl text-gray-600">
                                <FacebookShareButton
                                    className="flex justify-end w-1/2 mb-1"
                                    url={shareLink}
                                    quote={data.title || ""}
                                >
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    className="flex justify-end w-1/2"
                                    url = {shareLink}
                                    title = { data.title || "" }
                                >
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <TelegramShareButton
                                    className="flex justify-end w-1/2"
                                    url = {shareLink}
                                    title = { data.title || "" }
                                >
                                    <TelegramIcon size={32} round />
                                </TelegramShareButton>
                                <LinkedinShareButton
                                    className="flex justify-end w-1/2"
                                    url = {shareLink}
                                    title = { data.title || "" }
                                >
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                            </div>
                        </div>
                        <Line
                            className="fixed left-0 w-screen top-24"
                            percent={percent}
                            strokeWidth={0.4}
                            trailWidth={0.4}
                            trailColor="#e9eef0"
                            strokeColor="#00d974"
                        />
                    </>
                )}
            </div>
            <Script id="twitter-widget" src="https://platform.twitter.com/widgets.js" charSet="utf-8" />
        </div>
    )
}

export async function getServerSideProps({ params, ...ctx }) {

    ctx.res.setHeader('Cache-Control','public, s-maxage=90')
    
    const summary = await client.get("/crypto/market-summary")
    const data = await client.get(`/news/detail/${params.blog}`)
    
    return {
        props: { 
            data: data.data,
            summary: summary.data,
        }
    }
}