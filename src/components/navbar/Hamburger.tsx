import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Cookie from 'js-cookie'
import { useQuery } from 'react-query'
import { FaTimes } from "react-icons/fa";
import { BiNews, BiMenu } from 'react-icons/bi'
import { IoMdBook } from 'react-icons/io'
import { RiExchangeFill } from 'react-icons/ri'
import { BsCurrencyExchange, BsListCheck } from 'react-icons/bs'
import { HiOutlineLanguage } from 'react-icons/hi2'
import { AiFillApi } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import setLanguage from 'next-translate/setLanguage'
import { AiOutlineStock } from 'react-icons/ai'
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import LogoBlack from '../logo/LogoBlack';
import LogoWhite from '../logo/LogoWhite';
import Alert from 'components/Alert';
import { imgLoader } from 'src/utils';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import Cookies from 'js-cookie';

const ThemeSwitch = dynamic(() => import('./ThemeSwitch'), {
    ssr: false,
})

export default function Hamburger() {

    const dispatch = useAppDispatch()
    const query = useAppSelector(state => state.reactQuery)
    const user = useAppSelector(state => state.user)
    const { t: ct, lang } = useTranslation('common')

    const { systemTheme, theme, setTheme } = useTheme()

    const [currentTheme, setCurrentTheme] = useState("light")
    const [navOpen, setNavOpen] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [alertMsg, setAlertMsg] = useState({ status: '', title: '', description: '', btnText: '', nextRoute: '' })
    const [isForeignQuote, setIsForeignQuote] = useState(false)

    const fetchProfileInfo = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_API}/profile`, {
            method: "GET",
            headers: {
                'Accept-Language': 'mn',
                'Authorization': `Bearer ${Cookie.get('accessToken')}`
            }
        })

        if (Cookie.get('accessToken') && response.status === 401) {
            setAlertMsg({ status: 'warning', title: "Нэвтрэх эрхийн хугацаа дууслаа", description: "Та дахин нэвтрэнэ үү!", btnText: "Хаах", nextRoute: '/' })
            openModal()
            logOut()
        }

        if (response.status === 200) {
            let temp = await response.json()

            dispatch({ type: "USER_LOG_IN", payload: {
                email: temp.data.email,
                displayName: temp.data.displayName,
                userName: temp.data.username,
                avatarUrl: temp.data.avatarUrl
            }})
        }

        dispatch({ type: 'CALL_PROFILE', payload: { value: false } })

        return response.json()
    }

    const { data: profileInfoData, status: profileInfoStatus } = useQuery("profile", fetchProfileInfo, { enabled: query.isCallProfile })

    useEffect(() => {
        let tempQuote = Cookie.get('isForeignQuote')
        if (tempQuote === 'usd') {
            setIsForeignQuote(true)
            dispatch({ type: "FOREIGN_QUOTE" })
        } else {
            setIsForeignQuote(false)
            dispatch({ type: "LOCAL_QUOTE" })
        }
    }, [])

    useEffect(() => {  
        const temp = theme == 'system' ? systemTheme : theme

        setCurrentTheme(temp)
    }, [theme, systemTheme])

    const handleToggle = () => {
        setNavOpen(!navOpen)
    }

    const openLoginModal = () => {
        dispatch({ type: 'SHOW_LOGIN_MODAL', payload: { value: true } })
    }

    const openSignupModal = () => {
        dispatch({ type: 'SHOW_SIGNUP_MODAL', payload: { value: true } })

    }

    const logOut = async () => {
        Cookie.remove('accessToken')
        dispatch({ type: 'USER_LOG_OUT', payload: { } })
    }

    const toggleQuote = (quote) => {
        if (quote === "usd") {
            setIsForeignQuote(true)
            dispatch({ type: "FOREIGN_QUOTE", payload: {} })
            Cookie.set("isForeignQuote", "usd")
        } else {
            setIsForeignQuote(false)
            dispatch({ type: "LOCAL_QUOTE" })
            Cookie.set("isForeignQuote", "mnt")
        }
    }

    return (
        <div>
            <nav className="relative flex items-center justify-between">
                <div className="flex lg:hidden">
                    <button onClick={handleToggle} className="relative flex items-center text-blue-600">
                        <BiMenu size={30} className="text-black dark:text-white" />
                    </button>
                </div>
            </nav>
            <div className="navbar-menu">
                <nav
                    className={classNames(`z-50 bg-white dark:bg-brand-black fixed top-0 bottom-0 flex flex-col w-full max-w-full py-5 px-5 bg-dax-blue border-r overflow-y-auto`, 
                    {'fixed right-0 transition-all duration-200 ease-in': navOpen},
                    {'fixed -right-full transition-all duration-200 ease-in': !navOpen})}>
                    <div className={'flex items-center justify-between'}>
                        <div className="flex items-center">
                            {currentTheme === 'light' ? <LogoBlack /> : <LogoWhite />}
                        </div>
                        <button onClick={handleToggle} className="navbar-close">
                            <FaTimes className="w-6 h-6 text-black dark:text-white" />
                        </button>
                    </div>
                    <div className="mt-8">
                        <div className="flex flex-col">
                            <div onClick={handleToggle} className="flex items-center justify-start py-4 space-x-2 border-b dark:border-brand-grey-70">
                                <RiExchangeFill className="text-blue-500" size={25} />
                                <a href={`/${lang}`} className="font-medium text-black dark:text-white">{ct('crypto-currency')}</a>
                            </div>
                            <div onClick={handleToggle} className="flex items-center justify-start py-4 space-x-2 border-b dark:border-brand-grey-70">
                                <BsCurrencyExchange className="text-orange-400" size={25} />
                                <a href={`/${lang}/exchanges`} className="font-medium text-black dark:text-white">{ct('centralized-exchange')}</a>
                            </div>
                            <div onClick={handleToggle} className="flex items-center justify-start py-4 space-x-2 border-b dark:border-brand-grey-70">
                                <BiNews className="text-brand-blue-400 dark:text-brand-blue-400" size={25} />
                                <a href={`/${lang}/news/page/1`} className="font-medium text-black dark:text-white">{ct('news')}</a>
                            </div>
                            <div onClick={handleToggle} className="relative flex items-center justify-start py-4 space-x-2 border-b dark:border-brand-grey-70">
                                <AiOutlineStock className="text-brand-blue-400 dark:text-brand-blue-400" size={25} />
                                <a href={`#`} className="font-medium text-black dark:text-white">{ct('stock')}</a>
                                <span className="absolute top-2 left-[7rem] text-xs font-semibold bg-brand-blue-400 rounded-md px-2 py-1">{ct('coming-soon')}</span>
                            </div>
                            <div onClick={handleToggle} className="relative flex items-center justify-start py-4 space-x-2 border-b dark:border-brand-grey-70">
                                {/* <AiOutlineStock className="text-black dark:text-white" size={25} /> */}
                                <img src={"/goaly3.gif"} className="h-[48px] w-auto" />
                                <a href={`#`} className="font-medium text-black dark:text-white">Goalyfy</a>
                                <span className="absolute top-2 left-[7rem] text-xs font-semibold bg-brand-blue-400 rounded-md px-2 py-1">{ct('coming-soon')}</span>
                            </div>
                            <div onClick={async () => {
                                if (lang === 'en') {
                                    Cookies.set('NEXT_LOCALE', 'mn')
                                    await setLanguage('mn')
                                } else {
                                    Cookies.set('NEXT_LOCALE', 'en')
                                    await setLanguage('en')
                                }
                                handleToggle()
                            }} className="flex items-center justify-start py-4 space-x-2 border-b dark:border-brand-grey-70">
                                <HiOutlineLanguage className="text-brand-blue-400 text-gray dark:text-white" size={25} />
                                <span className="font-medium text-black dark:text-white">
                                    {lang === 'mn' ? 'Хэл (Монгол/English)' : 'Language (Mongolian/English)'}
                                </span>
                            </div>
                            {user.isLoggedIn ? (
                                <>
                                <div onClick={handleToggle} className="flex items-center justify-start py-4 space-x-2 border-b dark:border-brand-grey-70">
                                    {user.avatarUrl ? (
                                        <div className="relative w-9 h-9">
                                            <Image className="rounded-full" src={user.avatarUrl} loader={imgLoader} layout="fill" objectFit="cover" />
                                        </div>
                                    ) : <CgProfile className="text-gray-600 dark:text-gray-200" size={30} />}
                                    <a href={`/${lang}/settings`} className="font-medium text-black dark:text-white">{ct('my-profile')}</a>
                                </div>
                                <div className="mt-20 space-y-4">
                                    <div onClick={() => logOut()} className="w-full py-2 text-sm font-semibold text-center text-black bg-gray-200 rounded-md">{ct('logout')}</div>
                                </div>
                                </>
                            ): (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 space-y-4">
                        {/* <div className="flex items-center justify-center">
                            <p onClick={() => toggleQuote("usd")} className={`${isForeignQuote ? 'bg-brand-blue-300 dart:bg-brand-blue-400 text-white' : 'bg-gray-200 text-black'} cursor-pointer w-16 text-center py-1 rounded rounded-r-none`}>USD</p>
                            <p onClick={() => toggleQuote("mnt")} className={`${!isForeignQuote ? 'bg-brand-blue-300 dart:bg-brand-blue-400 text-white' : 'bg-gray-200 text-black'} cursor-pointer w-16 text-center py-1 rounded rounded-l-none`}>MNT</p>
                        </div> */}
                        <ThemeSwitch />
                        <p className="my-4 text-xs text-center text-gray-400">
                            <a href="https://www.dsolutions.mn/" target="_blank">Copyright © Diverse Solutions</a>
                        </p>
                    </div>
                </nav>
            </div>
            <Alert isOpen={isOpenModal} closeModal={closeModal} status={alertMsg.status} title={alertMsg.title} description={alertMsg.description} btnText={alertMsg.btnText} nextRoute={alertMsg.nextRoute} />
        </div>
    )

    function closeModal() {
        setIsOpenModal(false)
    }

    function openModal() {
        setIsOpenModal(true)
    }
}