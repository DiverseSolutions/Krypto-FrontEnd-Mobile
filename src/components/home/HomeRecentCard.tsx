import React, { ReactElement } from 'react'
import Image from 'next/image'
import { formatNumber, imgLoader } from 'src/utils'
import { useAppSelector } from 'src/store/hooks'

interface Props {
    title: string,
    list: any[],
    logo: any
}

export default function HomeRecentCard(props: Props): ReactElement {

    const quote = useAppSelector(state => state.quote)
    
    return (
        <div style={{ height: "12rem" }} className='text-sm font-medium p-[15px] rounded-xl bg-white dark:bg-brand-dark-400 shadow-card w-10/12 mx-auto flex flex-col justify-between'>
            <div className="flex items-center w-full">
                <props.logo />
                <h6 className="ml-2 text-sm font-bold">{props.title}</h6>
            </div>
            <div className='mt-[0.875rem] pb-2'>
                {props.list.map((item, index) => (
                    <div key={index} className="flex mt-[1.25rem] items-center">
                        <p>{index + 1}</p>
                        <div className='flex justify-between w-full ml-4'>
                            <a href={`currencies/${item.symbol}`} className="flex">
                                <Image loader={imgLoader} src={item.logo} alt={item.symbol} width="20" height="20" />
                                <p className="text-xs font-bold ml-[7px]">{item.symbol}</p>
                                <p className="text-xs font-medium text-brand-grey-100 dark:text-brand-grey-120 ml-[7px]">{item.name}</p>
                            </a>
                            <div className={`flex items-center`}>
                                <p>{quote.isForeignQuote ? '$' : '₮'}{formatNumber(item.quote[quote.isForeignQuote ? 'USD' : 'MNT'].price, quote.isForeignQuote ? 8 : 2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}