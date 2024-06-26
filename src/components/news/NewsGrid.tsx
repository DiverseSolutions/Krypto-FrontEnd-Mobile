import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { fromNow } from 'src/utils';


interface Props {
    news: any,
}

const imgLoader = ({ src }) => `${src}?width=512`

export default function NewsGrid({ news }: Props) {

    const {t, lang} = useTranslation('common')
    const router = useRouter()

    return (
        <div className="grid grid-cols-1 mx-auto sm:grid-cols-2 sm:gap-5">
            {news.data.map((item, index) => (
                <a href={`/${lang}/news/${item.slug}`} key={index} className="flex flex-col mb-10">
                    <div className="relative h-44">
                        <Image priority={index < 3} className="rounded-xl" loader={imgLoader} src={item.image} layout="fill" objectFit="fill" />
                    </div>
                    <div className="flex flex-col mt-4 space-y-2">
                        <h5 className="text-lg font-medium leading-tight">
                            {item.title}
                        </h5>
                        <p className="text-sm font-medium text-black dark:text-brand-grey-50 text-opacity-60">{item.description}</p>
                    </div>
                    <div className="flex flex-col mt-3 text-xs font-medium text-black dark:text-brand-grey-50 dark:text-opacity-80 text-opacity-60">
                        {/* <p>By {item.author.last_name}{item.author.first_name}</p> */}
                        <div className="flex items-center space-x-8">
                            <span>{fromNow(item.createdAt, t)}</span>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    )
}