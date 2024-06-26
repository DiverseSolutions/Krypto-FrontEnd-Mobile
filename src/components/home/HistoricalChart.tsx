import React, { useState, useEffect, useMemo } from 'react'
import ReactDOMServer from 'react-dom/server';
import { useTheme } from 'next-themes'
import { Spinner } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import axios from 'axios';
import { FcLineChart } from 'react-icons/fc'
import Highcharts from "highcharts/highstock";
import {
    HighchartsStockChart,
    Chart,
    HighchartsProvider,
    XAxis,
    YAxis,
    Title,
    AreaSplineSeries,
    SplineSeries,
    Navigator,
    CandlestickSeries,
    Tooltip
  } from "react-jsx-highstock";
import useTranslation from 'next-translate/useTranslation';

function HistoricalChart() {

    const { systemTheme, theme, } = useTheme()
    const { t, lang } = useTranslation('home')
    const { t: ct } = useTranslation('common')
    const [currentTheme, setCurrentTheme] = useState("light")
    const [priceChart, setPriceChart] = useState([])

    useEffect(() => {
        if (Highcharts?.setOptions) {
            Highcharts?.setOptions({
                ...(lang === 'mn' ? ({lang: {
                    numericSymbols: [" Мянга", " Сая", " Тэрбум", " Их наяд", " МД", " ИМД"]
                }}):{lang: {
                    numericSymbols: [" Thousand", " Million", " Billion", " Их наяд", " МД", " ИМД"]
                }})
            })
        }
    }, [lang])

    useEffect(() => {
        fetchChartData()
    }, [])

    useEffect(() => {  
        const temp = theme == 'system' ? systemTheme : theme

        setCurrentTheme(temp)
    }, [theme, systemTheme])

    const fetchChartData = async () => {
        try {
            const resp = await axios.get(`${process.env.NEXT_PUBLIC_PUBLIC_API_URL}/data-api/global-metric/quotes/chart?range=14d`)
            const raw = resp.data.data;

            const tempPriceChartData = [];
            raw.forEach((r) => {
                const [time, local_market, total_market, local_vol, total_vol] = r;
                const timeMillis = time * 1000;
                tempPriceChartData.push([timeMillis, local_market, local_market, local_market, local_market])
            });

            setPriceChart(tempPriceChartData)
        } catch(e) {
            console.log(`failed to fetch chart data: ${e}`)
        }
    }

    const [yMin, yMax] = useMemo(() => {
        const arr = priceChart.map((d) => d[1])
        return [Math.min.apply(null, arr), Math.max.apply(null, arr)];
    }, [
        priceChart
    ]);

  return (
    <div style={{ height: "12rem" }} className='text-sm font-medium p-[15px] rounded-xl bg-white dark:bg-brand-dark-400 shadow-card w-10/12 mx-auto flex flex-col justify-between'>
        <div className="flex items-center w-full">
            <FcLineChart color="#37474f" size={25} />
            <h6 className="ml-2 text-xs font-bold">{t('local-market-cap-14d')}</h6>
        </div>
        {!priceChart.length ? (
            <div className="w-full h-[500px] flex justify-center items-center">
                <Spinner />
            </div>
        ) : (
            <HighchartsProvider Highcharts={Highcharts}>
                <div className='max-h-full'>
                    <HighchartsStockChart>
                        <Chart zoomType="x" />
                        <Tooltip />
                        <XAxis>
                            <XAxis.Title>{ct('day')}</XAxis.Title>
                        </XAxis>
                        <div>
                            <YAxis
                            labels={{
                                align: 'left'
                            }}
                            min={yMin}
                            max={yMax}
                            height={130}
                            >
                                <SplineSeries name={ct('market-cap')} data={priceChart} />
                            </YAxis>
                        </div>
                    </HighchartsStockChart>
                </div>
            </HighchartsProvider>
        )}
      </div>
  )
}

export default React.memo(HistoricalChart)