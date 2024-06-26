import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'
import validator from 'validator'
import { Spinner } from '@chakra-ui/spinner'
import { useDisclosure } from '@chakra-ui/react'
import Cookie from 'js-cookie'
import { useFormik } from 'formik'

import NewsLetterImage from 'assets/newsletter-form6.png'
import Alert from './Alert'
import PopUpNewsLetterForm from './PopupNewsletterForm'
import useTranslation from 'next-translate/useTranslation'


export default function NewsLetter () {

    const {isOpen: isModalVisible, onOpen: onOpenModal, onClose: onCloseModal} = useDisclosure(); 
    const router = useRouter()
    const {t: ct} = useTranslation('common')
    const [isOpen, setIsOpen] = useState(false)
    const [alertMsg, setAlertMsg] = useState({ status: null, title: null, description: null, btnText: null, nextRoute: '#' })
    const [isShowLoader, setIsShowLoader] = useState(false)

    useEffect(() => {
        if (!Cookie.get('isShowNewsletter') && router.asPath === '/' && !localStorage.getItem('isShowNewsletter')) {
          onOpenModal()
        }
    }, [])

    const formik = useFormik({
        initialValues: {
          email: ''
        },
        validate: (values) => {
          const errors: any = {}
    
          if (!values.email) {
            errors.email = 'Имэйл ээ оруулна уу.'
          } else if (!validator.isEmail(values.email)) {
            errors.email = 'Имэйл ээ зөв оруулна уу.'
          }
    
          return errors;
        },
        onSubmit: (values, {resetForm}) => {
          setIsShowLoader(true)
            
          let data = {
            "email": values.email
          }
          
          axios.post(`${process.env.NEXT_PUBLIC_PUBLIC_API_URL}/user/register/newsletter`, data).then(res => {
            setIsShowLoader(false)
            if (res.data.meta.error_message) {
              setAlertMsg({ status: 'warning', title: "Захиалга амжилтгүй боллоо, Дахин оролдоно уу", description: "", btnText: "Хаах", nextRoute: '#' })
              openModal()
            } else {
              Cookie.set('isShowNewsletter', 'hide')
              localStorage.setItem('isShowNewsletter', 'hide')
              onCloseModal()
              setAlertMsg({ status: 'success', title: "Захиалга амжилттай", description: "", btnText: "Хаах", nextRoute: '#' })
              openModal()
            }
          }).catch(err => {
            setIsShowLoader(false)
            setAlertMsg({ status: 'error', title: "Захиалга амжилттай", description: "", btnText: "Хаах", nextRoute: '#' })
            openModal()
          })

          resetForm({ values: {email:''} })
        }
    })
    
    return (
        <>
            <div className="px-4 py-6 space-y-4">
                <h3 className="font-medium">{ct('newsletter-title')}</h3>
                <p className="text-sm">{ct('newsletter-desc')}</p>
                {/* <form onSubmit={formik.handleSubmit} className="">
                    <div>
                        <input onChange={formik.handleChange} value={formik.values.email} name="email" className="w-full h-12 px-5 text-xs bg-gray-200 border rounded-lg dark:bg-brand-dark-400 dark:border-brand-grey-100" type="text" placeholder="Имэйл хаягаа оруулна уу" />
                        <p className="h-8 text-xs text-brand-red-400">
                            {formik.errors.email}
                        </p>
                    </div>
                    <button className="w-full h-12 px-5 text-xs font-medium text-white rounded-lg bg-brand-blue-400 dark:bg-brand-blue-300">
                        {isShowLoader ? <Spinner /> : 'Уншъя'}
                    </button>
                </form> */}
                <iframe src="https://embeds.beehiiv.com/580513ca-533b-46ca-9638-9ac9b7967a47?slim=true" className="w-full h-20 pt-4" data-test-id="beehiiv-embed" frameBorder="0" scrolling="no" style={{ margin: "0", border: "0", borderRadius: "0", backgroundColor: "transparent", outline: "none" }}></iframe>
                <div className="relative w-full h-36">
                    <Image src={NewsLetterImage} layout="fill" objectFit="contain" />
                </div>
            </div>
            <Alert isOpen={isOpen} closeModal={closeModal} status={alertMsg.status} title={alertMsg.title} description={alertMsg.description} btnText={alertMsg.btnText} nextRoute={alertMsg.nextRoute} />
            <PopUpNewsLetterForm isModalVisible={isModalVisible} onCloseModal={onCloseModal} formik={formik} isShowLoader={isShowLoader} />
        </>
    )

    function closeModal() {
        setIsOpen(false)
    }
    
    function openModal() {
    setIsOpen(true)
    }
}