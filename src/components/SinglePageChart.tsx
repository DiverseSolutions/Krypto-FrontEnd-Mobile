import React, {useState, useEffect, useMemo} from 'react'
import { useTheme } from 'next-themes'
import { Spinner } from '@chakra-ui/react';

import { useAppSelector } from 'src/store';

import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';

const ChartViewLazy = dynamic(() => import('./SinglePageChartView'))

type Props = {
    statsData: SingleData,
    type: 'price' | 'marketcap' | 'tradingview' | string
}

const SinglePageChart = ({ type = 'price', statsData }: Props) => {

    const { systemTheme, theme, } = useTheme()

    const {t} = useTranslation('currencies')
    const {t: ct} = useTranslation('common')
    
    const priceChart = useAppSelector(state => state.single.priceChart)
    const marketcapChart = useAppSelector(state => state.single.marketcapChart)
    const isChartLoading = useAppSelector(state => state.single.isChartLoading)

    const [currentChartData, setCurrentChartData] = useState([])
    const [currentTheme, setCurrentTheme] = useState("light")

    useEffect(() => {
        if (type === 'price') {
            setCurrentChartData(priceChart || [])
        } else if (type === 'marketcap') {
            setCurrentChartData(marketcapChart || [])
        }
    }, [priceChart, type, marketcapChart])

    const ohlc = useMemo(() => {
        if (!currentChartData?.length) {
            return []
        }
        const d = currentChartData.map((p) => [p.x, p.y, p.y, p.y, p.y])
        return d;
    }, [currentChartData])

    // useEffect(() => {
    //     ReactHighstock.Highcharts.setOptions({
    //         lang: {
    //             numericSymbols: [" Мянга", " Сая", " Тэрбум", " Их наяд", " МД", " ИМД"]
    //         },
    //     })
    // }, [])

    useEffect(() => {  
        const temp = theme == 'system' ? systemTheme : theme
        setCurrentTheme(temp)
    }, [theme, systemTheme])

    const ylabel = useMemo(() => {
        switch (type) {
            case 'price':
                return ct('price')
            case 'marketcap':
                return ct('market-cap')
            default:
                return type
        }
    }, [type, ct])

    if (isChartLoading && !currentChartData?.length) {
        return (
            <div className="w-full h-[500px] flex justify-center items-center">
                <Spinner />
            </div>
        )
    }
    
  return (
      <>
        <div className="relative">
            <ChartViewLazy data={ohlc || []} ylabel={ylabel} />
            {isChartLoading ? (
                <div className="absolute top-0 bottom-0 left-0 right-0 z-50">
                    <div className="flex items-center justify-center w-full h-full">
                        <Spinner />
                    </div>
                </div>
            ) : (<></>)}
        </div>
      </>
  )
}

export default SinglePageChart;