import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'

import FooterLightLogo from 'assets/Krypto.mn-08.png'
import FooterDarkLogo from 'assets/Krypto.mn-09.png'
import useTranslation from 'next-translate/useTranslation'


export default function Footer() {

    const router = useRouter()
    const { systemTheme, theme, } = useTheme()

    const { t } = useTranslation('common')

    const [currentTheme, setCurrentTheme] = useState("light")

    useEffect(() => {  
        const temp = theme == 'system' ? systemTheme : theme

        setCurrentTheme(temp)
    }, [theme, systemTheme])
    
    return (
        <footer className='static bottom-0 left-0 bg-[#0157ff] dark:bg-brand-dark-400 w-screen py-2'>
            <div style={{backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundImage: currentTheme === 'light' ? `url("${FooterLightLogo.src}")` : `url("${FooterDarkLogo.src}")` ,}} className="flex items-center justify-end text-white dark:text-brand-grey-110 h-36">
                <div className="flex flex-col items-start w-1/2">
                <div className="">
                    <p className="text-sm font-bold">{t('social-channels')}</p>
                    <div className="flex flex-wrap items-center justify-start text-xs">
                    <a href="https://www.facebook.com/KryptoMN" target="_blank" className="mr-2">{t('facebook')}</a>
                    <a href="https://instagram.com/krypto.mn?igshid=YmMyMTA2M2Y=" target="_blank" className="mr-2">{t('instagram')}</a>
                    <a href="https://t.me/Kryptomn" target="_blank" className="mr-2">{t('telegram')}</a>
                    </div>
                </div>
                <div className="my-2">
                    <p className="text-sm font-bold">{t('about-krypto')}</p>
                    <div className="flex flex-wrap items-center justify-start text-xs">
                        <p onClick={() => {
                            // TODO:: methodology
                            // router.push('/methodology')
                        }} className="mr-2">{t('methodology')}</p>
                    </div>
                </div>
                <div className="">
                    <p className="text-sm font-bold">{t('contact-us')}</p>
                    <div className="flex flex-wrap items-center justify-start text-xs">
                    <a href="https://www.dsolutions.mn/" target="_blank" className="mr-2">{t('diverse-solutions')}</a>
                    </div>
                </div>
                </div>
            </div>
        </footer>
    )
}