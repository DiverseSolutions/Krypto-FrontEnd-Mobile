import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5';
import { formatNumber } from 'src/utils';

type Props = {
    title: string,
    val: number,
    ch24h: number,
    chart: string,
}

function SummaryCard({
    title,
    val,
    ch24h,
    chart
}: Props) {
    return (
        <div style={{ height: "12rem" }} className='text-sm font-medium p-[15px] rounded-xl bg-white dark:bg-brand-dark-400 shadow-card w-10/12 mx-auto flex flex-col justify-between'>
            <div className="flex justify-start w-full">
                <div className="flex flex-col items-start justify-start w-full">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-lg font-bold text">₮{formatNumber(val, 2)}</p>
                        <div className="flex items-center">
                            {ch24h > 0 ? <IoCaretUpOutline size={20} className="text-brand-green-400" /> : <></>}
                            {ch24h < 0 ? <IoCaretDownOutline size={20} className="text-brand-red-400" /> : <></>}
                            <span className={classNames("text-sm font-bold", {
                                'text-brand-green-400': ch24h > 0,
                                'text-brand-red-400': ch24h < 0,
                            })}>{formatNumber(ch24h, 2)}%</span>
                        </div>
                    </div>
                    <h6 className="mt-1 text-sm font-medium">{title}</h6>
                </div>
            </div>
            <div className="relative mt-2 h-[8rem]">
                <img src={chart} alt="chart" className='h-[80px] w-full' />
            </div>
        </div>
    )
}

export default SummaryCard