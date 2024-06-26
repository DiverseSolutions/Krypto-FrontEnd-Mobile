import React, { ReactElement, useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'
import Cookies from 'js-cookie'


export default function ThemeSwitch(): ReactElement {

    const { systemTheme, theme, setTheme } = useTheme()

    useEffect(() => {
        if (!theme) {
            setTheme(systemTheme)
        } else {
            setTheme(theme)
        }
    }, [systemTheme, theme])

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark')
            Cookies.set("theme", "dark")
        } else {
            setTheme('light')
            Cookies.set("theme", "light")
        }
    }

    return (
        <div className='flex items-center justify-center text-black cursor-pointer dark:text-white' onClick={toggleTheme}>
            {theme === 'light' ? <HiOutlineSun size={32} /> : <HiOutlineMoon size={32} />}
        </div>
    )
}