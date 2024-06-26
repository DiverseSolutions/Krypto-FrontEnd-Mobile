import React from 'react'
import Image from 'next/image'
import { FiClock } from 'react-icons/fi'

import { fromNow } from 'src/utils'
import useTranslation from 'next-translate/useTranslation'


interface Props {
    tag: string,
    news: NewsSearch[],
    pageSize: number
}

const imgLoader = ({ src }) => `${src}?width=512`

export default function CategoriesNewsList({ tag, news, pageSize }: Props) {

    const {t: ct, lang} = useTranslation('common')
    return (
        <div className="flex flex-col space-y-12">
            {news.map((item, index) => (
                <a href={`/${lang}/news/${item.slug}`} key={index} className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0 w-1/2 h-24">
                        <Image className="rounded-lg" src={item.image_url} priority={index < 3} loader={imgLoader} layout="fill" objectFit="fill" />
                        <p className="absolute bg-brand-blue-400 text-xs px-2 py-[0.1rem] rounded-xl font-black text-white right-2 top-2">{tag}</p>
                    </div>
                    <div className="flex flex-col justify-between h-24">
                        <h5 className="text-sm font-medium">{item.title.length > 50 ? `${item.title.slice(0,50)}...` : item.title}</h5>
                        <div className="flex items-center space-x-2 text-xs text-black dark:text-brand-grey-120 text-opacity-70">
                            <p>{fromNow(item.updated_at, ct)}</p>
                            <div className="flex items-center space-x-1">
                                <FiClock />
                                <p>{item.read_time}</p>
                            </div>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    )
}