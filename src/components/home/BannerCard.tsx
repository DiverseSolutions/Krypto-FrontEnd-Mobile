import React, { ReactElement } from 'react'
import Image from 'next/image'
import HomeBannerImg from 'assets/home_banner.png'


export default function BannerCard(): ReactElement {
    return (
        <div className="flex min-w-[180.63px] p-[0.5rem] bg-white dark:bg-transparent rounded-xl">
            <Image src={HomeBannerImg} width={55} height={55} />
            <div className="flex flex-col ml-[6px]">
                <p className='text-10 text-brand-grey-100 dark:text-brand-grey-120'>News</p>
                <h6 className='text-xs font-medium'>
                    Coming soon
                </h6>
            </div>
        </div>
    )
}