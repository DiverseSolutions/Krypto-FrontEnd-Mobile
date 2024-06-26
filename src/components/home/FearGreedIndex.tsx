import React from 'react'
import { FcBinoculars } from 'react-icons/fc'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

const CaugeChart = dynamic(() => import('react-gauge-chart'), {ssr: false, loading: () => <></>})

interface Props {
    title: string,
    fgi: FearAndGreed
}

const FearGreedIndex = ({ title, fgi }: Props) => {

    const { t } = useTranslation('home')

    return (
        <div style={{ height: "12rem" }} className='text-sm font-medium p-[15px] pb-1 rounded-xl bg-white dark:bg-brand-dark-400 shadow-card w-10/12 mx-auto flex flex-col justify-between'>
            <div className="z-20 flex items-center w-full">
                <FcBinoculars color="#37474f" size={25} />
                <h6 className="mx-2 text-sm font-bold">{title}</h6>
            </div>
            {Object.keys(fgi.fgi).length > 0 && (
                <div className="w-[15rem] mx-auto p-0 rounded-md pb-4">
                    <div className="relative flex items-end w-full">
                        <CaugeChart
                            nrOfLevels={4}
                            percent={fgi.fgi.now.value / 100}
                            hideText
                            colors={['#f00', '#21ba45']}
                        />
                        <div className={`${fgi.fgi.now.value < 25 ? "bottom-12 left-1 bg-red-600" : fgi.fgi.now.value < 50 ? "-top-7 left-20 bg-yellow-500" : fgi.fgi.now.value < 75 ? "-top-7 right-20 bg-lime-500" : "bottom-12 right-1 bg-green-600"} absolute w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold z-20`}>
                            <p>{fgi.fgi.now.value}</p>
                        </div>
                        <p className="absolute text-xs font-bold text-red-600 lg:left-6">{t('extreme-fear')}</p>
                        <p className="absolute right-0 text-xs font-bold text-green-600 lg:right-6">{t('extreme-greed')}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default React.memo(FearGreedIndex)