import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, useDisclosure, Spinner } from '@chakra-ui/react'
import { RiSearch2Line } from 'react-icons/ri'
import useTranslation from 'next-translate/useTranslation'

const iconLoader = ({ src }) => `${src}?width=64`

export default function Search() {

    const {isOpen: isModalVisible, onOpen: onOpenModal, onClose: onCloseModal} = useDisclosure();
    const initialFocusRef = useRef()
    
    const { systemTheme, theme, } = useTheme()

    const [currentTheme, setCurrentTheme] = useState("light")
    const [currencies, setCurrencies] = useState<Search>(null)
    const [resultCrypto, setResultCrypto] = useState<SearchResult>(null)
    const [resultExchange, setResultExchange] = useState<SearchResult>(null)
    const [searchText, setSearchText] = useState('')
    const [cryptoSize, setCryptoSize] = useState(3)
    const [exchangeSize, setExchangeSize] = useState(3)

    useEffect(() => {  
        const temp = theme == 'system' ? systemTheme : theme

        setCurrentTheme(temp)
    }, [theme, systemTheme])

    const handleClose = () => {
        setCryptoSize(3)
        setExchangeSize(3)
        setSearchText('')
        onCloseModal()
    }

    const fetchSearchData = () => {
        if (!currencies || !resultCrypto || !resultExchange) {
            fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API_URL}/topsearch/rank`).then((res) => res.json())
                .then((data) => {
                    setCurrencies(data.data)
                    fetch(data.data.sources.cryptos_path).then(res => res.json()).then(json => setResultCrypto(json))
                    fetch(data.data.sources.exchanges_path).then(res => res.json()).then(json => setResultExchange(json))
                })
        }
        onOpenModal()
    }

    let sortedCurrencies = useMemo(() => {
        let searchTemp = currencies?.crypto_top_search_ranks.filter(crypto => {
            if (crypto.name.toLowerCase().includes(searchText.toLowerCase()) || crypto.symbol.toLowerCase().includes(searchText.toLowerCase())) {
                return true
            }
        })

        return searchTemp
    }, [currencies, searchText])

    let sortedCryptoResults = useMemo(() => {
        if (resultCrypto) {
            let cryptoTemp = resultCrypto.values.filter(val => {
                if (val[1].toLowerCase().includes(searchText.toLowerCase()) || val[2].toLowerCase().includes(searchText.toLowerCase())) {
                    return true
                }
            })

            return cryptoTemp
        }
    }, [searchText])

    let sortedExchangeResult = useMemo(() => {
        if (resultExchange) {
            let exchangeTemp = resultExchange.values.filter(val => {
                if (val[1].toLowerCase().includes(searchText.toLowerCase()) || val[2].toLowerCase().includes(searchText.toLowerCase())) {
                    return true
                }
            })

            return exchangeTemp
        }
    }, [searchText])
    const { t } = useTranslation('common')
    useEffect(() => {
        if (resultCrypto) {
            let temp = resultCrypto.values.filter(val => {
                if (val[1].toLowerCase().includes(searchText.toLocaleLowerCase()) || val[2].toLowerCase().includes(searchText.toLocaleLowerCase())) {
                    return true
                }
            })
        }
    }, [resultCrypto, searchText])
    
    return (
        <div>
            <RiSearch2Line onClick={() => fetchSearchData()} className="text-black cursor-pointer dark:text-white" size={22} />
            <Modal initialFocusRef={initialFocusRef} onClose={onCloseModal} size={'full'} isOpen={isModalVisible}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className="shadow-md dark:bg-brand-black">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2 text-base text-black/70 dark:text-white">
                                <RiSearch2Line size={17} />
                                <input ref={initialFocusRef} onChange={(e) => setSearchText(e.target.value)} className="bg-transparent focus:outline-none tex-sm" type="text" placeholder={'search-hint'} />
                            </div>
                            <button className="px-2 py-1 text-sm bg-gray-200 rounded dark:bg-gray-500 dark:text-white/90" onClick={() => handleClose()} type="submit">{t('back')}</button>
                        </div>
                    </ModalHeader>
                    <ModalBody style={{ maxHeight: "70rem" }} className="overflow-y-auto dark:bg-brand-dark-400 dark:text-white no-scrollbar">
                        <div className="mt-4">
                            {sortedCurrencies && sortedCurrencies.length > 0 ? (
                                <div className="pb-4 border-b dark:border-brand-grey-70">
                                    <div className="flex items-center px-2 space-x-2 text-sm font-medium">
                                        <span>{t('trending')}</span>
                                        <span>🔥</span>
                                    </div>
                                    <div className="flex flex-col mt-4 space-y-3">
                                        {sortedCurrencies.map((asset) => (
                                            <a href={`currencies/${asset.slug}`} key={asset.id} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100/20">
                                                <div className="flex items-center space-x-2">
                                                    <div className="relative w-6 h-6">
                                                        <Image src={asset.icon} loader={iconLoader} alt="logo" layout="fill" objectFit="contain" />
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-sm">
                                                        <span className="font-medium">{asset.name}</span>
                                                        <p className="text-xs font-medium text-brand-grey-100 dark:text-brand-grey-120">{asset.symbol}</p>
                                                    </div>
                                                </div>
                                                {/* <span className="font-medium text-brand-grey-100 dark:text-brand-grey-120">#{asset.id}</span> */}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ) : !sortedCryptoResults && sortedExchangeResult ? (
                                <div className="flex justify-center my-20">
                                    <Spinner />
                                </div>
                            ) : <></>}
                            {searchText.length > 0 && sortedCryptoResults && sortedCryptoResults.length > 0 && (
                                    <div className="pb-4 mt-4 border-b dark:border-brand-grey-70">
                                        <div className="flex items-center px-2 space-x-2 text-sm font-medium">
                                            <span>Крипто</span>
                                        </div>
                                        <div className="flex flex-col mt-4 space-y-3">
                                            {sortedCryptoResults.slice(0, cryptoSize).map((val) => (
                                                <a href={`currencies/${val[3]}`} key={val[0]} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100/20">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="relative w-6 h-6">
                                                            <Image src={resultCrypto.icons[val[0]].light} loader={iconLoader} alt={val[2]} layout="fill" objectFit="contain" />
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-sm">
                                                            <span className="font-medium">{val[1]}</span>
                                                            <p className="text-xs font-medium text-brand-grey-100 dark:text-brand-grey-120">{val[2]}</p>
                                                        </div>
                                                    </div>
                                                    {/* <span className="font-medium text-brand-grey-100 dark:text-brand-grey-120">#{val[0]}</span> */}
                                                </a>
                                            ))}
                                        </div>
                                        {sortedCryptoResults.length > cryptoSize && (
                                            <span onClick={() => setCryptoSize(sortedCryptoResults.length)} className="ml-2 text-sm font-medium cursor-pointer text-brand-blue-400 dark:text-brand-blue-300">Бүгдийг харах ({sortedCryptoResults.length})</span>
                                        )}
                                    </div>
                                )}
                                {searchText.length > 0 && sortedExchangeResult && sortedExchangeResult.length > 0 && (
                                    <div className="pb-4 mt-4 border-b dark:border-brand-grey-70">
                                        <div className="flex items-center px-2 space-x-2 text-sm font-medium">
                                            <span>Бирж</span>
                                        </div>
                                        <div className="flex flex-col mt-4 space-y-3">
                                            {sortedExchangeResult.slice(0, exchangeSize).map((val) => (
                                                <a href={`/exchanges/${val[2]}`} key={val[0]} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100/20">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="relative w-12 h-6">
                                                            <Image src={currentTheme === 'light' ? resultExchange.icons[val[0]].light : resultExchange.icons[val[0]].dark ? resultExchange.icons[val[0]].dark : resultExchange.icons[val[0]].light} loader={iconLoader} alt={val[2]} layout="fill" objectFit="contain" />
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-sm">
                                                            <span className="font-medium">{val[1]}</span>
                                                        </div>
                                                    </div>
                                                    {/* <span className="font-medium text-brand-grey-100 dark:text-brand-grey-120">#{val[0]}</span> */}
                                                </a>
                                            ))}
                                        </div>
                                        {sortedExchangeResult.length > exchangeSize && (
                                            <span onClick={() => setExchangeSize(sortedExchangeResult.length)} className="ml-2 text-sm font-medium cursor-pointer text-brand-blue-400 dark:text-brand-blue-300">Бүгдийг харах ({sortedExchangeResult.length})</span>
                                        )}
                                    </div>
                                )}
                                {sortedCurrencies?.length == 0 && sortedCryptoResults?.length == 0 && sortedExchangeResult?.length == 0 && <div className="mt-4 text-sm font-medium text-center">Илэрц олдсонгүй</div>}
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}