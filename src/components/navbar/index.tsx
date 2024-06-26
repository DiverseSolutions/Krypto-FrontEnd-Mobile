import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { formatNumber } from 'src/utils'
import Hamburger from './Hamburger'
import LogoBlack from '../logo/LogoBlack'
import LogoWhite from '../logo/LogoWhite'
import Search from './Search'
import { useAppSelector } from 'src/store/hooks'
import useTranslation from 'next-translate/useTranslation'

interface Props {
    data?: any,
    isForceRefetch?: any,
    metrics?: any,
}

export default function Navbar({ data }: Props) {

    const { t, lang } = useTranslation('common')
    const quote = useAppSelector(state => state.quote)
    const { systemTheme, theme, setTheme } = useTheme()

    const [currentTheme, setCurrentTheme] = useState('dark')

    useEffect(() => {
        if (!theme) {
            setTheme(systemTheme)
        } else {
            setTheme(theme)
        }
    }, [systemTheme, theme])

    useEffect(() => {
      setCurrentTheme(theme)
    }, [theme])

    return (
        <div className='bg-white dark:bg-brand-black pt-[1rem]'>
            <div className='flex items-center justify-between mx-5'>
                <a href={`/${lang}`}>
                    <div className='flex items-center'>
                        {currentTheme === 'light' ? <LogoBlack /> : <LogoWhite />}
                    </div>
                </a>
                <div className='flex items-center space-x-2 text-white'>
                    <Hamburger />
                </div>
            </div>
            <div className="flex overflow-x-auto space-x-4 no-scrollbar px-[1rem] border-t-1 mt-4 p-2 border-b-1 border-gray-200 dark:border-gray-700">
                <div className="flex flex-shrink-0 space-x-1 text-[0.8rem]">
                    <p className="text-brand-grey-100 dark:text-white">{t('crypto')}:</p>
                    <p className="text-brand-blue-400 dark:text-white">{data.assetCount || '-'}</p>
                </div>
                <div className="flex flex-shrink-0 space-x-1 text-[0.8rem]">
                    <p className="text-brand-grey-100 dark:text-white">{t('exchange')}:</p>
                    <p className="text-brand-blue-400 dark:text-white">{data.cexCount || '-'}</p>
                </div>
                <div className="flex flex-shrink-0 space-x-1 text-[0.8rem]">
                    <p className="text-brand-grey-100 dark:text-white">{t('local-market-cap')}:</p>
                    <p className="text-brand-blue-400 dark:text-white">{'₮'}{formatNumber(data.quote['MNT']?.localMarketCap, 2)}</p>
                </div>
                <div className="flex flex-shrink-0 space-x-1 text-[0.8rem]">
                    <p className="text-brand-grey-100 dark:text-white">{t('local-vol-24h')}: </p>
                    <p className="text-brand-blue-400 dark:text-white">{'₮'}{formatNumber(data.quote['MNT'].localVol24h, 2)}</p>
                </div>
            </div>
        </div>
    )
}