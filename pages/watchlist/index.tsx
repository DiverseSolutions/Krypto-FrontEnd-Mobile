import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useQuery } from 'react-query'
import { useFormik } from 'formik'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import Cookie from 'js-cookie'
import { Line } from 'rc-progress'
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, ModalHeader, useDisclosure, Spinner } from '@chakra-ui/react'
import { FaRegCheckCircle } from 'react-icons/fa'
import { BsPlusLg, BsFillStarFill } from 'react-icons/bs'
import { IoCaretUpOutline, IoCaretDownOutline } from 'react-icons/io5'
import 'react-loading-skeleton/dist/skeleton.css'

import { formatNumber, imgLoader } from 'src/utils'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import Navbar from 'components/navbar'
import NewsLetter from 'components/NewsLetter'
import kryptoClient from 'src/apiClient';
import { GetServerSidePropsContext } from 'next'


interface Props {
    latest: Latest
}

export default function Watchlist({ latest }: Props) {

    const dispatch = useAppDispatch()
    const query = useAppSelector(state => state.reactQuery)
    const user = useAppSelector(state => state.user)
    const searchRef = useRef(null)

    const { systemTheme, theme } = useTheme()
    const {isOpen: isEditOpenModal, onOpen: onOpenEditModal, onClose: onCloseEditModal} = useDisclosure()
    const {isOpen: isAddCoinOpenModal, onOpen: onOpenAddCoinModal, onClose: onCloseAddCoinModal} = useDisclosure()
    
    const [currentTheme, setCurrentTheme] = useState("light")
    const [sort, setSort] = useState({title: null, asc: false, desc: false})
    const [search, setSearch] = useState('')
    const [isLoader, setIsLoader] = useState(false)
    const [activeId, setActiveId] = useState(0)
    const [visibleCoins, setVisibleCoins] = useState(latest.data)
    const [sortedIds, setSortedIds] = useState([])
    const [cryptoIds, setCryptoIds] = useState([])
    const [cryptoData, setCryptoData] = useState([])

    const fetchWatchlist = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_API}/watchlist`, {
            method: 'get',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${Cookie.get('accessToken')}`
            }
        })

        dispatch({ type: 'CALL_WATCHLIST', payload: { value: false } })

        return response.json()
    }

    const {data: watchlistData, status: watchlistStatus} = useQuery('watchlist', fetchWatchlist, { enabled: query.isCallWatchlist })

    useEffect(() => {  
        const temp = theme == 'system' ? systemTheme : theme

        setCurrentTheme(temp)
    }, [theme, systemTheme])
    
    useEffect(() => {
        setSortedIds(cryptoData)
    }, [cryptoData])

    useEffect(() => {
        !user.isLoggedIn && setSortedIds([])
    }, [user])

    useEffect(() => {
        if (watchlistData) {
            let temp = []
            let ids = Object.keys(watchlistData.data[0].cryptocurrencies)
            setCryptoIds(ids)

            ids.forEach(id => {
                temp.push(watchlistData.data[0].cryptocurrencies[id])
            })

            setCryptoData([...temp])
        }
    }, [watchlistData])

    useEffect(() => {
        if (!Cookie.get('accessToken')) {
            dispatch({ type: 'SHOW_LOGIN_MODAL', payload: { value: true } })
        }
    }, [])

    useEffect(() => {
        if (search) {
            setVisibleCoins(latest.data.filter((t) => t.symbol.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase())))
        } else {
            setVisibleCoins(latest.data)
        }
    }, [search])

    const editFormik = useFormik({
        initialValues: {
            name: '',
            desc: '',
        },
        validate: (values) => {

        },
        onSubmit: (values) => {

        }
    })
    
    const SortHeader = ({title, id}) => {
        return (
            <div onClick={() => handleSort(id)} className="flex items-center cursor-pointer">
                {title}
                {sort.title == id && sort.asc ? <></> : sort.title == id && sort.desc ? <IoCaretUpOutline /> : sort.title == id && !sort.asc && !sort.desc ? <IoCaretDownOutline /> : <></>}
            </div>
        )
    }

    const addCoins = () => {
        if (Cookie.get('accessToken')) {
            onOpenAddCoinModal()
        } else {
            dispatch({ type: 'SHOW_LOGIN_MODAL', payload: { value: true } })
        }
    }

    const handleSelectedCoins = (id: number) => {
        let temp = cryptoIds
        temp.find(t => parseInt(t) === id) ? temp.splice(temp.indexOf(id.toString()), 1) : temp.push(id.toString())

        setCryptoIds([...temp])
    }

    const removeWatchlist = async (id: number) => {
        setIsLoader(true)
        setActiveId(id)

        let body = JSON.stringify({
            "assetId": id
        })

        fetch(`${process.env.NEXT_PUBLIC_USER_API}/watchlist/crypto/remove`, {
            method: "POST",
            headers: {
                'Accept-Language': 'mn',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookie.get('accessToken')}`
            },
            body
        }).then(res => res.text())
          .then(result => {
            let temp = cryptoData.filter(crypto => crypto.id !== id)

            setCryptoIds(temp.map(t => t.id))
            setCryptoData([...temp])
            setIsLoader(false)
          })
    }

    const removeAndSaveSelectedCoins = () => {
        setIsLoader(true)

        let ids = cryptoData.map(a => a.id.toString())

        let counter = 0
        let addCoins = cryptoIds.filter(id => !ids.includes(id))
        let removeCoins = ids.filter(id => !cryptoIds.includes(id))
        
        let headers = new Headers()
        headers.append('Accept-Language', 'mn')
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${Cookie.get('accessToken')}`)

        addCoins.forEach(coinId => {
            counter ++
            fetch(`${process.env.NEXT_PUBLIC_USER_API}/watchlist/crypto/save`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "assetId": parseInt(coinId)
                })
            }).then(res => res.text())
            .then(result => {
                if (counter === addCoins.length + removeCoins.length) {
                    setIsLoader(false)
                    dispatch({ type: 'CALL_WATCHLIST', payload: { value: true } })
                    onCloseAddCoinModal()
                }
            })
        })

        removeCoins.forEach(coinId => {
            counter ++
            fetch(`${process.env.NEXT_PUBLIC_USER_API}/watchlist/crypto/remove`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "assetId": parseInt(coinId)
                })
            }).then(res => res.text())
              .then(result => {
                if (counter === addCoins.length + removeCoins.length) {
                    setIsLoader(false)
                    dispatch({ type: 'CALL_WATCHLIST', payload: { value: true } })
                    onCloseAddCoinModal()
                }
              })
        })
    }

    return (
        <div className="pb-9 dark:text-white">
            <Navbar isForceRefetch={true} metrics={null} />
            <div className="p-4">
                <div className="mb-8 space-y-4">
                    <span className={`${watchlistStatus === 'loading' || !watchlistData ? 'bg-transparent' : 'bg-brand-blue-400 dark:bg-brand-blue-300 px-2 py-1'} text-white rounded text-xs font-medium`}>
                        {watchlistStatus === 'loading' ? <Spinner /> : watchlistData?.data[0]?.isMain ? 'Үндсэн' : watchlistData?.data[0]?.isPublic ? 'Нээлттэй' : ''}
                    </span>
                    <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-semibold">
                            {watchlistStatus === 'loading' ? <Spinner /> : watchlistData?.data[0]?.name}
                        </h1>
                        {/* <IoIosArrowDown className="cursor-pointer" size={15} /> */}
                    </div>
                </div>
                <div onClick={() => addCoins()} className="flex items-center justify-around p-2 space-x-1 bg-gray-200 rounded-md cursor-pointer w-28 dark:bg-brand-dark-400">
                    <BsPlusLg size={12} />
                    <span className="text-xs font-medium">Койн нэмэх</span>
                </div>
                <div className={`${!user.isLoggedIn || sortedIds.length == 0 ? 'overflow-x-hidden' : 'overflow-x-auto'} w-full mx-auto no-scrollbar`}>
                    <table className='w-full mt-4 bg-white border-separate rounded-md table-auto dark:bg-brand-black dark:text-white' style={{ minWidth: 1100, borderSpacing: 0 }}>
                        <thead>
                            <tr className="text-xs">
                                <th onClick={() => sortEvent("id")} className="sticky left-0 p-3 text-left bg-white w-14 dark:bg-brand-black">
                                    <div className="flex items-center">
                                        <SortHeader title="#" id="rank" />
                                    </div>
                                </th>
                                <th onClick={() => sortEvent("name")} className="sticky w-1/12 p-3 text-left bg-white left-12 dark:bg-brand-black">
                                    <div className="flex items-center">
                                        <SortHeader title="Нэр" id="name" />
                                    </div>
                                </th>
                                <th onClick={() => sortEvent("price")} className="w-1/12 p-3 text-left bg-white dark:bg-brand-black">
                                    <div className="flex items-center">
                                        <SortHeader title="Ханш" id="price" />
                                    </div>
                                </th>
                                <th onClick={() => sortEvent("24h_change")} className="w-1/12 p-3 text-left bg-white dark:bg-brand-black">
                                    <div className="flex items-center">
                                        <SortHeader title="24 цаг %" id="24h_change" />
                                    </div>
                                </th>
                                <th onClick={() => sortEvent("7d_change")} className="w-1/12 p-3 text-left bg-white dark:bg-brand-black">
                                    <div className="flex items-center">
                                        <SortHeader title="7 хоног %" id="7d_change" />
                                    </div>
                                </th>
                                <th onClick={() => sortEvent("24h_volume")} className="w-1/6 p-3 text-left bg-white dark:bg-brand-black">
                                    <div className="flex items-center">
                                        <SortHeader title="Хэмжээ(24 цаг)" id="24h_volume" />
                                    </div>
                                </th>
                                <th onClick={() => sortEvent("circulating_supp")} className="w-1/6 p-3 text-left bg-white dark:bg-brand-black">
                                    <div className="flex items-center">
                                        <SortHeader title="Гүйлгээнд буй хэмжээ" id="circulating_supp" />
                                    </div>
                                </th>
                                <th onClick={() => sortEvent("market_cap")} className="w-1/6 p-3 text-left bg-white dark:bg-brand-black">
                                    <div className="flex items-center">
                                        <SortHeader title="Зах зээлийн үнэлгээ" id="market_cap" />
                                    </div>
                                </th>
                                <th className="w-1/6 p-3 text-left bg-white dark:bg-brand-black">
                                    Сүүлийн 7 хоног
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-sm'>
                            {sortedIds.length > 0 && sortedIds.map(stat => (
                                <tr key={stat.id} className="text-sm font-medium cursor-pointer">
                                    <td className='sticky left-0 bg-white dark:bg-brand-black p-[10px] text-left border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                        <div className='flex items-center justify-start space-x-2'>
                                            {isLoader && activeId === stat.id ? <Spinner speed="1s" size="sm" color="blue.500" /> : <BsFillStarFill className="cursor-pointer text-brand-yellow-400" onClick={() => removeWatchlist(stat.id)} />}
                                            <p className='text-brand-grey-100 dark:text-white'>{stat.id}</p>
                                        </div>
                                    </td>
                                    <td onClick={() => window.location.href = `/currencies/${stat.slug}`} className='sticky left-12 bg-white dark:bg-brand-black py-3 px-2 border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                        <div className="flex items-center">
                                            <div className="relative flex-shrink-0 w-8 h-8">
                                                <Image loader={imgLoader} src={stat.iconUrl} layout="fill" objectFit="contain" />
                                            </div>
                                            <div className="flex flex-col ml-[9px]">
                                                <p className="font-medium">{stat.symbol}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td onClick={() => window.location.href = `/currencies/${stat.slug}`} className='py-3 text-center border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                        <a href={`/currencies/${stat.slug}`}>
                                            <p>₮{formatNumber(stat.quote['MNT'].price, 2)}</p>
                                        </a>
                                    </td>
                                    <td onClick={() => window.location.href = `/currencies/${stat.slug}`} className={`p-[10px] ${stat.quote['MNT'].percent_change_24h >= 0 ? "text-brand-green-500 dark:text-brand-green-400" : "text-brand-red-400"} border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30`}>
                                        <a href={`/currencies/${stat.slug}`} className="flex items-center justify-start space-x-1">
                                            {stat.quote['MNT'].percent_change_24h >= 0 ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
                                            <p>{formatNumber(stat.quote['MNT'].percent_change_24h, stat.quote['MNT'].visible_decimals)}%</p>
                                        </a>
                                    </td>
                                    <td onClick={() => window.location.href = `/currencies/${stat.slug}`} className={`p-[10px] ${stat.quote['MNT'].percent_change_7d >= 0 ? "text-brand-green-500 dark:text-brand-green-400" : "text-brand-red-400"} border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30`}>
                                        <a href={`/currencies/${stat.slug}`} className="flex items-center justify-start space-x-1">
                                            {stat.quote['MNT'].percent_change_7d >= 0 ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
                                            <p>{formatNumber(stat.quote['MNT'].percent_change_7d, stat.quote['MNT'].visible_decimals)}%</p>
                                        </a>
                                    </td>
                                    <td onClick={() => window.location.href = `/currencies/${stat.slug}`} className='p-[10px] border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                        <a href={`/currencies/${stat.slug}`} className="flex flex-col items-start">
                                            <p>₮{formatNumber(stat.quote['MNT'].volume_24h, 0)}</p>
                                            <p className="text-xs font-light">{formatNumber(stat.volume_24h, 0)} {stat.symbol}</p>
                                        </a>
                                    </td>
                                    <td onClick={() => window.location.href = `/currencies/${stat.slug}`} className='p-[10px] pr-[1rem] border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                        <div className="flex flex-col items-end justify-center space-y-1 text-sm">
                                            <p className="text-start">{formatNumber(stat.circulating_supply, 0)} {stat.circulating_supply ? stat.symbol : ''}</p>
                                            {stat.circulating_supply > 0 && stat.max_supply > 0 && (
                                                <Line percent={(stat.circulating_supply * 100) / stat.max_supply} strokeWidth={5} trailWidth={5} strokeColor={`${currentTheme === 'light' ? "#cfd6e4" : "#323546"}`} trailColor={`${currentTheme === 'light' ? "#eff2f5" : "#1C1C1C"}`} style={{borderRadius: 5}} strokeLinecap="square" />
                                            )}
                                        </div>
                                    </td>
                                    <td onClick={() => window.location.href = `/currencies/${stat.slug}`} className='p-[10px] pr-[1rem] border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                        <a href={`/currencies/${stat.slug}`} className="flex justify-center">
                                            <p>₮{formatNumber(stat.circulating_supply * stat.quote['MNT'].price, 2)}</p>
                                        </a>
                                    </td>
                                    <td onClick={() => window.location.href = `/currencies/${stat.slug}`} className='p-[10px] text-center border-brand-grey-100 border-b-[1px] border-opacity-10 dark:border-opacity-30'>
                                        <a href={`/currencies/${stat.slug}`}>
                                            <div className="relative flex-shrink-0 h-16 w-36">
                                                <Image loader={imgLoader} alt={stat.iconUrl} src={stat.chart7d} layout="fill" objectFit="contain" />
                                            </div>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!user.isLoggedIn || sortedIds.length == 0 ? (
                        <div className="relative flex items-center justify-center overflow-x-hidden bg-white border-b dark:bg-brand-dark-400 dark:border-transparent">
                            <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                <div className="flex flex-col w-full">
                                    {[1,2,3,4,5,6,7,8,9].map(item => (
                                        <div className="flex justify-between w-full px-4 py-3 border-b opacity-50" style={{minWidth: 1200, borderSpacing: 0}}>
                                            <div className="flex space-x-2">
                                                <Skeleton borderRadius={100} baseColor="#eee" highlightColor="#eee" width="1rem" />
                                                <Skeleton baseColor="#eee" highlightColor="#eee" width="1rem" />
                                            </div>
                                            <div className="flex space-x-2">
                                                <Skeleton borderRadius={10} baseColor="#eee" highlightColor="#eee" width="1rem" />
                                                <Skeleton baseColor="#eee" highlightColor="#eee" width="10rem" />
                                            </div>
                                            <Skeleton baseColor="#eee" highlightColor="#eee" width="10rem" />
                                            <Skeleton baseColor="#eee" highlightColor="#eee" width="10rem" />
                                            <Skeleton baseColor="#eee" highlightColor="#eee" width="10rem" />
                                            <Skeleton baseColor="#eee" highlightColor="#eee" width="10rem" />
                                            <Skeleton baseColor="#eee" highlightColor="#eee" width="10rem" />
                                        </div>
                                    ))}
                                </div>
                            </SkeletonTheme>
                            <div className="absolute z-20 flex flex-col items-center space-y-4">
                                <BsFillStarFill size={50} className="p-3 text-gray-400 bg-gray-200 rounded-full" />
                                <h1 className="text-2xl font-bold text-center">Таны жагсаалт хоосон байна</h1>
                                <p className="text-sm text-center">Доорх товчийг дарж үзэх жагсаалтаа үүсгээрэй</p>
                                <button onClick={() => addCoins()} type="submit" className="w-24 py-2 text-sm font-medium text-white rounded-md bg-brand-blue-400">Койн нэмэх</button>
                            </div>
                            <div className="absolute z-10 w-full h-full bg- bg-gradient-to-t from-brand-grey-50 dark:from-brand-dark-400"></div>
                        </div>
                    ) : <></>}
                </div>
                <NewsLetter />
            </div>
            <Modal isOpen={isEditOpenModal} onClose={onCloseEditModal} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <h1 className="text-2xl">Edit Watchlist</h1>
                    </ModalHeader>
                    <ModalCloseButton className="dark:text-white" />
                    <ModalBody>
                        <form onSubmit={editFormik.handleSubmit} className="mb-4 space-y-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Watchlist name</p>
                                <input value={editFormik.values.name} onChange={editFormik.handleChange} name="name" className="w-full px-3 py-1 border rounded-md" type="text" />
                             </div>
                             <div className="space-y-1">
                                <p className="text-sm font-medium">Description (optional)</p>
                                <textarea rows={4} value={editFormik.values.desc} onChange={editFormik.handleChange} name="desc" className="w-full px-3 py-1 border rounded-md" />
                             </div>
                             <button className="w-full py-2 text-sm font-medium text-white rounded bg-brand-blue-400" type="submit">Save Changes</button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isAddCoinOpenModal} onClose={onCloseAddCoinModal} initialFocusRef={searchRef} size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className="dark:text-white dark:bg-brand-dark-400">
                        <h1 className="text-xl">Койн нэмэх</h1>
                    </ModalHeader>
                    <ModalCloseButton className="dark:text-white" />
                    <ModalBody className="dark:text-white dark:bg-brand-dark-400">
                        <div className='w-full pb-4 space-y-4 dark:border-gray-700 dark:text-white'>
                            <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} type="text" className="w-full p-2 px-4 text-sm bg-gray-200 rounded-lg dark:bg-brand-dark-500 h-7" placeholder="Хайх" />
                            <div className="space-y-4 max-h-[30rem] overflow-y-auto no-scrollbar">
                                {visibleCoins.length > 0 && visibleCoins.map(l => (
                                    <div onClick={() => handleSelectedCoins(l.id)} className="flex items-center justify-between px-1 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div className="flex items-center space-x-2">
                                            <div className="relative w-6 h-6">
                                                <Image src={l.iconUrl} loader={imgLoader} layout="fill" objectFit="contain" />
                                            </div>
                                            <h3 className="text-sm font-semibold">{l.name}</h3>
                                            <p className="text-sm text-brand-grey-150">{l.symbol}</p>
                                        </div>
                                        <div className={`${cryptoIds.find(c => parseInt(c) === l.id) ? 'block' : 'hidden'} text-brand-green-400`}>
                                            <FaRegCheckCircle size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => removeAndSaveSelectedCoins()} className="w-full py-2 text-sm font-medium text-white rounded-md bg-brand-blue-400 dark:bg-brand-blue-300" type="submit">
                                {isLoader ? <Spinner /> : cryptoIds.length > 0 ? `Хадгалах (${cryptoIds.length})` : 'ХААХ'}
                            </button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )

    function handleSort(id: string) {
        switch (id) {
            case "rank":
                if (sort.asc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.id - b.id } ))
                } else if (sort.desc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return b.id - a.id } ))
                } else {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.id - b.id } ))
                }
                break;
            case "name": 
                if (sort.asc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.name > b.name ? 1 : -1 } ))
                } else if (sort.desc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return b.name > a.name ? 1 : -1 } ))
                } else {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.id - b.id } ))
                }
                break;
            case "price": 
                if (sort.asc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.quote['MNT'].price - b.quote['MNT'].price } ))
                } else if (sort.desc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return b.quote['MNT'].price - a.quote['MNT'].price } ))
                } else {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.id - b.id } ))
                }
                break;
            case "24h_change": 
                if (sort.asc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.quote['MNT'].percent_change_24h - b.quote['MNT'].percent_change_24h } ))
                } else if (sort.desc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return b.quote['MNT'].percent_change_24h - a.quote['MNT'].percent_change_24h } ))
                } else {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.id - b.id } ))
                }
                break;
            case "7d_change": 
                if (sort.asc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.quote['MNT'].percent_change_7d - b.quote['MNT'].percent_change_7d } ))
                } else if (sort.desc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return b.quote['MNT'].percent_change_7d - a.quote['MNT'].percent_change_7d } ))
                } else {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.id - b.id } ))
                }
                break;
            case "24h_volume": 
                if (sort.asc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.quote['MNT'].volume_24h - b.quote['MNT'].volume_24h } ))
                } else if (sort.desc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return b.quote['MNT'].volume_24h - a.quote['MNT'].volume_24h } ))
                } else {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.id - b.id } ))
                }
                break;
            case "circulating_supp": 
                if (sort.asc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.circulating_supply - b.circulating_supply } ))
                } else if (sort.desc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return b.circulating_supply - a.circulating_supply } ))
                } else {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.id - b.id } ))
                }
                break;
            case "market_cap": 
                if (sort.asc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.quote['MNT'].market_cap - b.quote['MNT'].market_cap } ))

                } else if (sort.desc) {
                    setSortedIds(cryptoData.sort(function(a,b) { return b.quote['MNT'].market_cap - a.quote['MNT'].market_cap } ))
                } else {
                    setSortedIds(cryptoData.sort(function(a,b) { return a.id - b.id } ))
                }
                break;
            default:
                setSortedIds(cryptoData.sort(function(a,b) { return a.rank - b.rank } ))
                break;
        }
    }

    function sortEvent(title) {
        if (sort.title == title) {
            if (sort.asc) {
                setSort({title: title, asc: false, desc: true})
            } else if (sort.desc) {
                setSort({title: title, asc: false, desc: false})
            } else {
                setSort({title: title, asc: true, desc: false})
            }
        } else {
            setSort({title: title, asc: true, desc: false})
        }
    }
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {

    ctx.res.setHeader('Cache-Control','public, s-maxage=90')

    let [latest] = await Promise.all([kryptoClient.getCryptoListingsLatest({ start: 0, limit: 100 })])

    return {
        props: {
            latest
        }
    }
}