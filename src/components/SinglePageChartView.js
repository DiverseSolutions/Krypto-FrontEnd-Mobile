import React, { useEffect, useMemo } from "react";
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
import useTranslation from "next-translate/useTranslation";

const StaticSimpleChart = (data2, name) => {
    return <SplineSeries name={name} data={data2} />;
};

function ChartComp ({
    data,
    ylabel
}) {

    const {t, lang} = useTranslation('common')
    const {t: ct} = useTranslation('currencies')

    useEffect(() => {
        if (Highcharts?.setOptions) {
            Highcharts?.setOptions({
                time: {
                    timezone: 'Asia/Ulaanbaatar'
                },
                lang: lang === 'mn' ? ({
                    numericSymbols: [" Мянга", " Сая", " Тэрбум", " Их наяд", " МД", " ИМД"]
                }) : ({
                    numericSymbols: [" Thousand", " Million", " Billion", " Их наяд", " МД", " ИМД"]
                })
            })
        }
    }, [])
    
    const [yMin, yMax] = useMemo(() => {
        const arr = data.map((d) => d[1])
        return [Math.min.apply(null, arr), Math.max.apply(null, arr)];
    }, [
        data
    ]);
    
    return (
        <HighchartsProvider Highcharts={Highcharts}>
            <HighchartsStockChart containerProps={{style: {height: 400}}}>
            <Chart zoomType="x" />
            <Tooltip />
            <XAxis>
                <XAxis.Title>{ct('hour')}</XAxis.Title>
            </XAxis>

            <div>
                <YAxis
                id="price"
                opposite
                min={yMin}
                max={yMax}
                >
                <YAxis.Title>{ct('price')}</YAxis.Title>
                {StaticSimpleChart(data, ylabel)}
                </YAxis>
            </div>
            <Navigator />
            </HighchartsStockChart>
        </HighchartsProvider>
    )
}


export default ChartComp
