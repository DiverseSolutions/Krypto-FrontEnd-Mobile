import React, { ReactElement, useRef, useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import BigNumber from 'bignumber.js';
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Input, useDisclosure } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, ModalHeader } from '@chakra-ui/react'
import { FaExchangeAlt, FaChevronDown } from 'react-icons/fa';
import { FaRegCheckCircle } from 'react-icons/fa'
import { FcCurrencyExchange } from 'react-icons/fc'
import classNames from 'classnames';


interface Props {
    title: string
    conversions: any,
    defaultBase: string,
    defaultQuote: string,
    trending: any,
}

const imgLoader = ({ src }) => {
    return `${src}?width=64`
}

const VISIBLE_OPTIONS = 10;

const Converter = ({ title, conversions, defaultBase, defaultQuote, trending }: Props): ReactElement => {

    const {isOpen: isBaseAssetModalVisible, onOpen: onOpenBaseAssetModal, onClose: onCloseBaseAssetModal} = useDisclosure();
    const {isOpen: isQuoteAssetModalVisible, onOpen: onOpenQuoteAssetModal, onClose: onCloseQuoteAssetModal} = useDisclosure(); 
    
    const convertAmountRef = useRef<HTMLInputElement>()
    const [difference, setDifference] = useState('')
    const [selectedBaseCurrency, setSelectedBaseCurrency] = useState(defaultBase);
    const [selectedQuoteCurrency, setSelectedQuoteCurrency] = useState(defaultQuote);
    const [selectedBaseIconUrl, setSelectedBaseIconUrl] = useState(() => conversions.crypto[selectedBaseCurrency].logo)
    const [selectedQuoteIconUrl, setSelectedQuoteIconUrl] = useState(() => conversions.fiat[selectedQuoteCurrency].logo)
    const searchRef = useRef(null)
    const baseInputRef = useRef(null)
    const quoteInputRef = useRef(null)
    const [search, setSearch] = useState('');
    const [baseRate, setBaseRate] = useState(conversions.rates[selectedBaseCurrency]);
    const [quoteRate, setQuoteRate] = useState(conversions.rates[selectedQuoteCurrency]);
    const [amount, setAmount] = useState('1');
    const [price, setPrice] = useState('');
    
    const [cryptoSize, setCryptoSize] = useState(VISIBLE_OPTIONS)
    const [foreignSize, setForeignSize] = useState(VISIBLE_OPTIONS)
    const [fiatSize, setFiatSize] = useState(VISIBLE_OPTIONS)

    const searchLower = useMemo(() => {
        return search.toLowerCase()
    }, [search])

    

    const cryptoList = useMemo(() => {
        const keys = Object.keys(conversions.crypto);
        return keys.map((k) => conversions.crypto[k])
    }, [conversions.crypto])

    const foreignList = useMemo(() => {
        return cryptoList.filter((c) => !c.isLocal)
    }, [cryptoList])

    const fiatList = useMemo(() => {
        const keys = Object.keys(conversions.fiat);
        return keys.map((k) => conversions.fiat[k]).sort((f, f1) => {
            if (f.symbol === 'MNT') {
                return -2;
            }
            if (f.symbol === 'USD') {
                return -1;
            }
            return f.symbol - f1.symbol
        })
    }, [conversions.fiat])

    const assetList = useMemo(() => {
        return [...cryptoList, ...fiatList];
    }, [cryptoList, fiatList])

    useEffect(() => {
        const c = fiatList.find((f) => f.symbol === selectedQuoteCurrency) || cryptoList.find((f) => f.symbol === selectedQuoteCurrency)
        setQuoteRate(conversions.rates[c.symbol]);
        setDifference((new BigNumber(quoteRate).dividedBy(baseRate)).toString())
    }, [fiatList, cryptoList])

    const visibleTrending = useMemo(() => {
        if (search?.length) {
            return trending.filter((c) => c.symbol.toLowerCase().includes(searchLower) || c.name.toLowerCase().includes(searchLower))
        }
        return trending
    }, [trending, search])
    
    const visibleCryptos = useMemo(() => {
        if (search?.length) {
            return cryptoList.filter((c) => c.symbol.toLowerCase().includes(searchLower) || c.name.toLowerCase().includes(searchLower))
        }
        return cryptoList.slice(0, cryptoSize);
    }, [cryptoList, search, cryptoSize])

    const visibleForeigns = useMemo(() => {
        if (search?.length) {
            return cryptoList.filter((c) => !c.isLocal && c.symbol.toLowerCase().includes(searchLower) || c.name.toLowerCase().includes(searchLower))
        }
        return cryptoList.filter(c => !c.isLocal).slice(0, foreignSize);
    }, [cryptoList, search, foreignSize])

    const visibleFiats = useMemo(() => {
        if (search?.length) {
            return fiatList.filter((c) => c.symbol.toLowerCase().includes(searchLower) || c.name.toLowerCase().includes(searchLower))
        }
        return fiatList.slice(0, fiatSize);
    }, [fiatList, search, fiatSize])

    const handleAmountChange = (amount) => {
        setDifference((new BigNumber(quoteRate).dividedBy(baseRate)).toString())

        setAmount(amount)
        if (parseFloat(amount) && baseRate) {
            setPrice(new BigNumber(amount).multipliedBy(difference).toFixed(4))
        } else {
            setAmount('')
        }
    }

    useEffect(() => {
        if (amount?.length && !price?.length && baseRate && quoteRate && difference?.length) {
            handleAmountChange(amount)
        }
    }, [amount, baseRate, quoteRate, price, difference])

    const handlePriceChange = (price) => {
        setDifference((new BigNumber(quoteRate).dividedBy(baseRate)).toString())
        setPrice(price)

        if (parseFloat(price) && baseRate) {
            const p = new BigNumber(price).dividedBy(difference).toFixed(4);
            setAmount(p)
        } else {
            setPrice('')
        }
    }
    
    const handleSelectBaseCurrency = (c) => {
        let rate = conversions.rates[c.symbol]

        setBaseRate(rate)
        setSelectedBaseCurrency(c.symbol)
        setSelectedBaseIconUrl(c.logo)
        setSearch('')
        setDifference((quoteRate / rate).toString())
        if (amount && rate) {
            const r = new BigNumber(rate);
            const a = new BigNumber(amount);
            const q = new BigNumber(quoteRate);
            const p = a.multipliedBy(q.dividedBy(r))
            setPrice(p.toFixed(4))
        }
        onCloseBaseAssetModal()
        convertAmountRef.current?.focus();
    }

    const handleSelectQuoteCurrency = (c) => {
        let rate = conversions.rates[c.symbol]

        setQuoteRate(rate)
        setDifference((rate / baseRate).toString())
        setSelectedQuoteCurrency(c.symbol)
        setSelectedQuoteIconUrl(c.logo)
        setSearch('')

        if (amount && rate) {
            const a = new BigNumber(amount);
            const r = new BigNumber(rate);
            const p = a.multipliedBy(r.dividedBy(baseRate)).toFixed(4);
            setPrice(p)
        }
        onCloseQuoteAssetModal()
        convertAmountRef.current?.focus();
    }

    const swapCurrencies = () => {
        let oldBase = assetList.find(c => c.symbol === selectedBaseCurrency) || fiatList.find(f => f.symbol === selectedBaseCurrency)
        let oldQuote = assetList.find(c => c.symbol === selectedQuoteCurrency) || fiatList.find(f => f.symbol === selectedQuoteCurrency)

        handleSelectBaseCurrency(oldQuote)
        
        let rate = conversions.rates[oldBase.symbol]

        setQuoteRate(rate)
        setDifference((rate / quoteRate).toString())
        setSelectedQuoteCurrency(oldBase.symbol)
        setSelectedQuoteIconUrl(oldBase.logo)

        if (amount && rate) {
            setPrice(amount)
            setAmount(price)
        }
    }
    
    return (
        <div style={{ height: "12rem" }} className='text-sm font-medium p-[15px] rounded-xl bg-white dark:bg-brand-dark-400 shadow-card w-10/12 mx-auto flex flex-col justify-between'>
            <div className="flex items-center w-full">
                <FcCurrencyExchange color="#37474f" size={30} />
                <h6 className="ml-2 text-sm font-bold">{title}</h6>
            </div>
            <div className="flex items-center justify-center pt-2 rounded-xl">
                <div onClick={() => onOpenBaseAssetModal()} className="flex w-1/3 cursor-pointer items-center border-none space-x-1 justify-center h-12 py-[10px] mr-[1.5px] rounded-tl-md rounded-bl-md bg-brand-grey-50 dark:bg-brand-black">
                    <div className="relative flex-shrink-0 w-6 h-6">
                        <Image src={selectedBaseIconUrl} loader={imgLoader} layout="fill" objectFit="contain" />
                    </div>
                    <p className='mr-1 text-xs font-medium'>{selectedBaseCurrency}</p>
                    <FaChevronDown />
                </div>
                <Modal onClose={onCloseBaseAssetModal} initialFocusRef={searchRef} finalFocusRef={baseInputRef} size={'full'} isOpen={isBaseAssetModalVisible}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader className='dark:bg-brand-black dark:text-white'>Хөрөнгө</ModalHeader>
                        <ModalCloseButton onClick={() => setSearch('')} className='text-black dark:text-white' />
                        <ModalBody className='dark:bg-brand-black'>
                            <div className="pb-4 dark:bg-brand-black">
                                <div className='w-full dark:border-gray-700 dark:text-white'>
                                    <input onChange={(e) => setSearch(e.target.value)} value={search} ref={searchRef} type="text" className="w-full p-2 px-4 text-sm bg-gray-200 rounded-lg h-7" placeholder="Хайх" />
                                </div>
                                <div>
                                    <h6 className="my-4 text-sm font-bold text-left dark:text-white">
                                        Эрэлттэй
                                    </h6>
                                    <div className="">
                                        <div className="flex flex-col items-start justify-start">
                                            {visibleTrending.map((c) => (
                                            <div key={c.symbol} onClick={() => {
                                                handleSelectBaseCurrency(c)
                                                onCloseBaseAssetModal()
                                            }} className={`${classNames({'bg-gray-100 dark:bg-brand-dark-400': selectedBaseCurrency === c.symbol})} w-full p-2 mb-2 text-xs font-medium rounded cursor-pointer`}>
                                                <div className="flex items-center justify-between space-x-2">
                                                    <div className="flex items-center justify-start">
                                                        <div className="relative w-6 h-6">
                                                            <Image src={c.icon} className="flex-shrink-0" layout="fill" objectFit="contain" />
                                                        </div>
                                                        <div className='ml-3 text-xs'>
                                                            <p className="text-gray-500 dark:text-white dark:text-opacity-60">{c.name}</p>
                                                            <p className="text-gray-500 dark:text-white dark:text-opacity-90">{c.symbol}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`${classNames({'hidden': selectedBaseCurrency !== c.symbol})} text-brand-green-400`}>
                                                        <FaRegCheckCircle size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h6 className="my-4 text-sm font-bold text-left dark:text-white">
                                        Крипто Хөрөнгүүд
                                    </h6>
                                    <div className="">
                                        <div className="flex flex-col items-start justify-start">
                                            {visibleCryptos.map((c, i) => (
                                            <div key={c.id} onClick={() => {
                                                handleSelectBaseCurrency(c)
                                                onCloseBaseAssetModal()
                                            }} className={`${classNames({'bg-gray-100 dark:bg-brand-dark-400': selectedBaseCurrency === c.symbol})} w-full p-2 mb-2 text-xs font-medium rounded cursor-pointer`}>
                                                <div className="flex items-center justify-between space-x-2">
                                                    <div className="flex items-center justify-start">
                                                        <div className="relative w-6 h-6">
                                                            <Image src={c.logo} loader={imgLoader} className="flex-shrink-0 " width={30} height={30} objectFit="contain" />
                                                        </div>
                                                        <div className='ml-3 text-xs'>
                                                            <p className="text-gray-500 dark:text-white dark:text-opacity-60">{c.name}</p>
                                                            <p className="text-gray-500 dark:text-white dark:text-opacity-90">{c.symbol}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`${classNames({'hidden': selectedBaseCurrency !== c.symbol})} text-brand-green-400`}>
                                                        <FaRegCheckCircle size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                    {!visibleCryptos.length || (cryptoSize === cryptoList.length) ? (<></>) : (
                                        <div className="flex justify-start">
                                            <div onClick={() => setCryptoSize(Math.min(cryptoSize + 10, cryptoList.length))} className='flex px-8 py-2 text-sm font-medium bg-black cursor-pointer dark:text-white bg-opacity-10 rounded-xl shrink'>
                                                Бусад
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h6 className="my-4 text-sm font-bold text-left dark:text-white">
                                        Гадаад Хөрөнгүүд
                                    </h6>
                                    <div className="">
                                        <div className="flex flex-col items-start justify-start">
                                            {visibleForeigns.map((c, index) => (
                                            <div key={c.id} onClick={() => {
                                                handleSelectBaseCurrency(c)
                                                onCloseBaseAssetModal()
                                            }} className={`${classNames({'bg-gray-100 dark:bg-brand-dark-400': selectedBaseCurrency === c.symbol})} w-full p-2 mb-2 text-xs font-medium rounded cursor-pointer`}>
                                                <div className="flex items-center justify-between space-x-2">
                                                    <div className="flex items-center justify-start">
                                                        <div className="relative w-6 h-6">
                                                            <Image src={c.icon} loader={imgLoader} className="flex-shrink-0 " width={30} height={30} objectFit="contain" />
                                                        </div>
                                                        <div className='ml-3 text-xs'>
                                                            <p className="text-gray-500 dark:text-white dark:text-opacity-60">{c.name}</p>
                                                            <p className="text-gray-500 dark:text-white dark:text-opacity-90">{c.symbol}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`${classNames({'hidden': selectedBaseCurrency !== c.symbol})} text-brand-green-400`}>
                                                        <FaRegCheckCircle size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                    {!visibleForeigns.length || (foreignSize === foreignList.length) ? (<></>) : (
                                        <div className="flex justify-start">
                                            <div onClick={() => setForeignSize(Math.min(foreignSize + 10, foreignList.length))} className='flex px-8 py-2 text-sm font-medium bg-black cursor-pointer dark:text-white bg-opacity-10 rounded-xl shrink'>
                                                Бусад
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h6 className="my-4 text-sm font-bold dark:text-white">
                                    Мөнгөн тэмдэгт
                                    </h6>
                                    <div className="flex flex-col items-start justify-start">
                                        {visibleFiats.map((c, i) => (
                                        <div key={c.id} onClick={() => {
                                            handleSelectBaseCurrency(c)
                                            onCloseBaseAssetModal()
                                        }} className={`${classNames({'bg-gray-100 dark:bg-brand-dark-400': selectedBaseCurrency === c.symbol})} w-full p-2 text-sm mb-2 font-medium rounded cursor-pointer`}>
                                            <div className="flex items-center justify-between space-x-2">
                                                <div className="flex items-center justify-start">
                                                    <div className="relative w-8 h-6">
                                                        <Image src={c.logo} loader={imgLoader} className="" layout="fill" objectFit="contain" />
                                                    </div>
                                                    <div className='ml-3 text-xs'>
                                                        <p className={classNames({'text-gray-500 dark:text-white dark:text-opacity-60': selectedBaseCurrency !== c.symbol}, {'dark:text-white ': selectedBaseCurrency === c.symbol}, ' dark:text-white' )}>{c.name}</p>
                                                        <p className={classNames({'text-gray-500 dark:text-white dark:text-opacity-90': selectedBaseCurrency !== c.symbol}, {'dark:text-white ': selectedBaseCurrency === c.symbol},' dark:text-white' )}>{c.symbol}</p>
                                                    </div>
                                                </div>
                                                <div className={`${classNames({'hidden': selectedBaseCurrency !== c.symbol})} text-brand-green-400`}>
                                                    <FaRegCheckCircle size={20} />
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                    {!visibleFiats.length || (fiatSize === fiatList.length) ? (<></>) : (
                                        <div className="flex justify-start">
                                            <div onClick={() => setFiatSize(Math.min(fiatSize + 10, fiatList.length))} className='flex px-8 py-2 text-sm font-medium bg-black cursor-pointer dark:text-white bg-opacity-10 rounded-xl shrink'>
                                                Бусад
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
                <div className="w-2/3 bg-brand-grey-50 dark:bg-brand-black">
                    <input ref={baseInputRef} value={amount} onChange={(e) => handleAmountChange(e.target.value)} className='border-none border-tr-md border-br-md bg-brand-grey-50 dark:bg-brand-black dark:text-white h-12 py-[10px] w-full px-2 focus:outline-blue-40' type="number" />
                </div>
            </div>
            <div className="flex justify-center my-1">
              <FaExchangeAlt onClick={() => swapCurrencies()} className='cursor-pointer text-brand-dark-400 dark:text-brand-grey-110' size={24} />
            </div>
            <div className="flex items-center rounded-xl">
                <div className="flex items-center justify-between w-full rounded-xl">
                    <div onClick={() => onOpenQuoteAssetModal()} className="w-1/3 flex cursor-pointer items-center border-none space-x-1 justify-center h-12 py-[10px] mr-[1.5px] rounded-tl-md rounded-bl-md bg-brand-grey-50 dark:bg-brand-black">
                        <div className="relative flex-shrink-0 w-6 h-6">
                            <Image src={selectedQuoteIconUrl} loader={imgLoader} layout="fill" objectFit="contain" />
                        </div>
                        <p className='mr-1 text-xs font-medium'>{selectedQuoteCurrency}</p>
                        <FaChevronDown />
                    </div>
                    <Modal onClose={onCloseQuoteAssetModal} initialFocusRef={searchRef} finalFocusRef={quoteInputRef} size={'full'} isOpen={isQuoteAssetModalVisible}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader className='dark:bg-brand-black dark:text-white'>Хөрөнгө</ModalHeader>
                            <ModalCloseButton onClick={() => setSearch('')} className='text-black dark:text-white' />
                            <ModalBody className='dark:bg-brand-black'>
                                <div className="pb-4 dark:bg-brand-black">
                                    <div className='w-full dark:border-gray-700 dark:text-white'>
                                    <input onChange={(e) => setSearch(e.target.value)} value={search} ref={searchRef} type="text" className="w-full p-2 px-4 text-sm bg-gray-200 rounded-lg h-7" placeholder="Хайх" />
                                    </div>
                                    <div>
                                        <h6 className="my-4 text-sm font-bold text-left dark:text-white">
                                            Эрэлттэй
                                        </h6>
                                        <div className="">
                                            <div className="flex flex-col items-start justify-start">
                                                {visibleTrending.map((c, i) => (
                                                <div key={c.id} onClick={() => {
                                                    handleSelectQuoteCurrency(c)
                                                    onCloseQuoteAssetModal()
                                                }} className={`${classNames({'bg-gray-100 dark:bg-brand-dark-400': selectedQuoteCurrency === c.symbol})} w-full p-2 mb-2 text-xs font-medium rounded cursor-pointer`}>
                                                    <div className="flex items-center justify-between space-x-2">
                                                        <div className="flex items-center justify-start">
                                                            <div className="relative w-6 h-6">
                                                                <Image src={c.icon} loader={imgLoader} className="flex-shrink-0" layout="fill" objectFit="contain" />
                                                            </div>
                                                            <div className='ml-3 text-xs'>
                                                                <p className="text-gray-500 dark:text-white dark:text-opacity-60">{c.name}</p>
                                                                <p className="text-gray-500 dark:text-white dark:text-opacity-90">{c.symbol}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`${classNames({'hidden': selectedQuoteCurrency !== c.symbol})} text-brand-green-400`}>
                                                            <FaRegCheckCircle size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 className="my-4 text-sm font-bold text-left dark:text-white">
                                            Крипто Хөрөнгүүд
                                        </h6>
                                        <div className="">
                                            <div className="flex flex-col items-start justify-start">
                                                {visibleCryptos.map((c, i) => (
                                                <div key={c.id} onClick={() => {
                                                    handleSelectQuoteCurrency(c)
                                                    onCloseQuoteAssetModal()
                                                }} className={`${classNames({'bg-gray-100 dark:bg-brand-dark-400': selectedQuoteCurrency === c.symbol})} w-full p-2 mb-2 text-sm font-medium rounded cursor-pointer`}>
                                                    <div className="flex items-center justify-between space-x-2">
                                                        <div className="flex items-center justify-start">
                                                            <div className="relative w-10 h-8">
                                                                <Image src={c.logo} loader={imgLoader} className="flex-shrink-0 " width={30} height={30} objectFit="contain" />
                                                            </div>
                                                            <div className='ml-3 text-xs'>
                                                                <p className="text-gray-500 dark:text-white dark:text-opacity-40">{c.name}</p>
                                                                <p className="text-gray-500 dark:text-white dark:text-opacity-70">{c.symbol}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`${classNames({'hidden': selectedQuoteCurrency !== c.symbol})} text-brand-green-400`}>
                                                            <FaRegCheckCircle size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                        {!visibleCryptos.length || (cryptoSize === cryptoList.length) ? (<></>) : (
                                            <div className="flex justify-start">
                                                <div onClick={() => setCryptoSize(Math.min(cryptoSize + 20, cryptoList.length))} className='flex px-4 py-1 text-sm font-medium bg-black rounded-md cursor-pointer dark:text-white bg-opacity-10 shrink'>
                                                    Бусад
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h6 className="my-4 text-sm font-bold text-left dark:text-white">
                                            Гадаад Хөрөнгүүд
                                        </h6>
                                        <div className="">
                                            <div className="flex flex-col items-start justify-start">
                                                {visibleForeigns.map((c, i) => (
                                                <div key={c.id} onClick={() => {
                                                    handleSelectQuoteCurrency(c)
                                                    onCloseQuoteAssetModal()
                                                }} className={`${classNames({'bg-gray-100 dark:bg-brand-dark-400': selectedQuoteCurrency === c.symbol})} w-full p-2 mb-2 text-sm font-medium rounded cursor-pointer`}>
                                                    <div className="flex items-center justify-between space-x-2">
                                                        <div className="flex items-center justify-start">
                                                            <div className="relative w-10 h-8">
                                                                <Image src={c.icon} loader={imgLoader} className="flex-shrink-0 " width={30} height={30} objectFit="contain" />
                                                            </div>
                                                            <div className='ml-3 text-xs'>
                                                                <p className="text-gray-500 dark:text-white dark:text-opacity-40">{c.name}</p>
                                                                <p className="text-gray-500 dark:text-white dark:text-opacity-70">{c.symbol}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`${classNames({'hidden': selectedQuoteCurrency !== c.symbol})} text-brand-green-400`}>
                                                            <FaRegCheckCircle size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                        {!visibleForeigns.length || (foreignSize === foreignList.length) ? (<></>) : (
                                            <div className="flex justify-start">
                                                <div onClick={() => setForeignSize(Math.min(foreignSize + 20, foreignList.length))} className='flex px-4 py-1 text-sm font-medium bg-black rounded-md cursor-pointer dark:text-white bg-opacity-10 shrink'>
                                                    Бусад
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h6 className="my-4 text-sm font-bold dark:text-white">
                                            Мөнгөн тэмдэгт
                                        </h6>
                                        <div className="flex flex-col items-start justify-start">
                                            {visibleFiats.map((c, i) => (
                                            <div key={c.id} onClick={() => {
                                                handleSelectQuoteCurrency(c)
                                                onCloseQuoteAssetModal()
                                            }} className={`${classNames({'bg-gray-100 dark:bg-brand-dark-400': selectedQuoteCurrency === c.symbol})} w-full p-2 text-sm mb-2 font-medium rounded cursor-pointer`}>
                                                <div className="flex items-center justify-between space-x-2">
                                                    <div className="flex items-center justify-start">
                                                        <div className="relative w-10 h-8">
                                                            <Image src={c.logo} className="" loader={imgLoader} layout="fill" objectFit="contain" />
                                                        </div>
                                                        <div className='ml-3 text-xs'>
                                                            <p className={classNames({'text-gray-500 dark:text-white dark:text-opacity-40': selectedQuoteCurrency !== c.symbol}, {'dark:text-white ': selectedQuoteCurrency === c.symbol}, ' dark:text-white' )}>{c.name}</p>
                                                            <p className={classNames({'text-gray-500 dark:text-white dark:text-opacity-70': selectedQuoteCurrency !== c.symbol}, {'dark:text-white ': selectedQuoteCurrency === c.symbol},' dark:text-white' )}>{c.symbol}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`${classNames({'hidden': selectedQuoteCurrency !== c.symbol})} text-brand-green-400`}>
                                                        <FaRegCheckCircle size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                        {!visibleFiats.length || (fiatSize === fiatList.length) ? (<></>) : (
                                            <div className="flex justify-start">
                                                <div onClick={() => setFiatSize(Math.min(fiatSize + 20, fiatList.length))} className='flex px-4 py-1 text-sm font-medium bg-black rounded-md cursor-pointer dark:text-white bg-opacity-10 shrink'>
                                                    Бусад
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <div className="w-2/3 bg-brand-grey-50 dark:bg-brand-black">
                        <input onChange={(e) => handlePriceChange(e.target.value)} ref={quoteInputRef} value={price} className='border-none border-tr-md border-br-md bg-brand-grey-50 dark:bg-brand-black dark:text-white h-12 py-[10px] w-full px-2 focus:outline-blue-40' type="number" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Converter);