import React from 'react'
import Image from 'next/image'
import { FiClock } from 'react-icons/fi'

import { fromNow } from 'src/utils'
import useTranslation from 'next-translate/useTranslation';


interface Props {
    news: any,
}

const imgLoader = ({ src }) => `${src}?width=512`

export default function NewsList({ news }: Props) {
    const {t: ct, lang} = useTranslation()
    return (
        <div className="flex flex-col space-y-8">
            {news.data.map((item, index) => (
                <a href={`/${lang}/news/${item.slug}`} key={index} className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0 w-1/2 h-24">
                        <Image className="rounded-lg" priority={index < 3} src={item.image} loader={imgLoader} layout="fill" objectFit="fill" />
                    </div>
                    <div className="flex flex-col justify-between h-24">
                        <div className="space-y-[2px] text-sm">
                            <h5 className="font-medium">{item.title.length > 40 ? `${item.title.slice(0,35)}...` : item.title}</h5>
                        </div>
                        <div className="flex items-center space-x-2 text-xs font-medium text-black text-opacity-60 dark:text-brand-grey-120">
                            <p>{fromNow(item.createdAt, ct)}</p>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    )
}