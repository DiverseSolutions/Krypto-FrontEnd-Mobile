import React, { ReactElement } from 'react'
import Image from 'next/image'
import { IoCaretUpOutline, IoCaretDownOutline } from 'react-icons/io5'

import { formatNumber } from 'src/helpers/helpers'
import { imgLoader } from 'src/utils'

interface Props {
    title: string,
    list: any,
    logo: any,
    priority?: boolean
}

const iconLoader = ({ src }) => {
    return `${src}?width=64`
}

export default function HomeCard(props: Props): ReactElement {
    return (
        <div style={{ height: "12rem" }} className='text-sm font-medium p-[15px] rounded-xl bg-white dark:bg-brand-dark-400 shadow-card w-10/12 mx-auto flex flex-col justify-between'>
            <div className="flex items-center">
                <props.logo />
                <h6 className="ml-2 text-sm font-bold">{props.title}</h6>
            </div>
            <div className='pb-2'>
                {props.list.map((item, index) => (
                    <div key={index} className="flex mt-[1.25rem] items-center">
                        <p>{index + 1}</p>
                        <div className='flex justify-between w-full ml-4'>
                            <a href={`currencies/${item.symbol}`} className="flex items-center">
                                {item.logo && <Image priority={props.priority ? true : false} loader={iconLoader} src={item.logo} alt={item.symbol} width="20" height="20" />}
                                <p className="font-bold ml-[7px]">{item.symbol}</p>
                                <p className="font-medium text-brand-grey-100 dark:text-brand-grey-120 ml-[7px] text-xs">{item.name}</p>
                            </a>
                            <div className={`${item.quote['MNT'].ch24hPercent >= 0 ? "text-brand-green-500 dark:text-brand-green-400" : "text-brand-red-400"} flex items-center`}>
                                {item.quote['MNT'].ch24hPercent >= 0 ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
                                <p>{formatNumber(item.quote['MNT'].ch24hPercent, 2)}%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}