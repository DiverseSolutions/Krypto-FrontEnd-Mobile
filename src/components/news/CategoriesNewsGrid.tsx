import React from 'react'
import Image from 'next/image'
import { FiClock } from 'react-icons/fi'

import { fromNow } from 'src/utils'
import useTranslation from 'next-translate/useTranslation'


interface Props {
    news: NewsSearch[],
    tag: string,
    pageSize: number
}

const imgLoader = ({ src }) => `${src}?width=512`

export default function CategoriesNewsGrid({ news, tag, pageSize }: Props) {

    const { t: ct, lang } = useTranslation('common')

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-5">
            {news.map((item, index) => (
                <a href={`/${lang}/news/${item.slug}`} key={index} className="flex flex-col mb-10">
                    <div className="relative h-48">
                        <Image className="rounded-xl" loader={imgLoader} priority={index < 3} src={item.image_url} layout="fill" objectFit="fill" />
                        <p className="absolute bg-brand-blue-400 text-xs px-2 py-[0.1rem] rounded-xl font-black text-white right-2 top-2">{tag}</p>
                    </div>
                    <div className="flex flex-col mt-4 space-y-2">
                        <h5 className="font-medium leading-tight">{item.title}</h5>
                        <p className="text-sm font-medium text-black dark:text-brand-grey-110 text-opacity-60">{item.description}</p>
                    </div>
                    <div className="flex flex-col mt-3 text-xs font-medium text-black dark:text-brand-grey-120 text-opacity-60">
                        <p>By {item.author[0].last_name} {item.author[0].first_name}</p>
                        <div className="flex items-center space-x-8">
                            <span>{fromNow(item.updated_at, ct)}</span>
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