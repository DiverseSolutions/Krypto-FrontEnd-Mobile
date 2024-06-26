import React, { useState, useEffect } from 'react'
import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-v3'
import { useFormik } from 'formik'
import validator from 'validator'
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, ModalHeader, useDisclosure, Spinner } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'src/store'

import Alert from 'components/Alert'
import useTranslation from 'next-translate/useTranslation'


export default function ForgotModal() {

    const dispatch = useAppDispatch()
    const auth = useAppSelector(state => state.auth)
    const {isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal} = useDisclosure()

    const {t: ct} = useTranslation('common')
    const [key, setKey] = useState(0)
    const [captchaToken, setCaptchaToken] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenAlert, setIsOpenAlert] = useState(false)    
    const [alertMsg, setAlertMsg] = useState({ status: '', title: '', description: '', btnText: '', nextRoute: '' })

    useEffect(() => {
        loadReCaptcha(process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY)
        setKey(key + 1)
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
            
            return errors
        },
        onSubmit: (values) => {
            forgotPassword(values.email)
        }
    })

    const forgotPassword = async(email: string) => {
        if (captchaToken) {
            setIsLoading(true)
            
            let body = JSON.stringify({
                "email": email,
                redirectUrl: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/passwordReset`,
                captchaResponse: captchaToken
            })
    
            await fetch(`${process.env.NEXT_PUBLIC_USER_API}/password/forgot`, {
                method: "POST",
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Accept-Language': 'mn'
                },
                body
            }).then(res => res.text())
              .then(result => {
                  let data = JSON.parse(result)
    
                  setIsLoading(false)
                  setKey(key + 1)
                  responseCode(data)
                  setIsOpenAlert(true)
                  removeModal()                  
              })
        } else {
            setKey(key + 1)
        }
    }

    const removeModal = () => {
        dispatch({ type: 'SHOW_FORGOT_MODAL', payload: { value: false } })
    }
    
    return (
        <>
            <Modal onClose={onCloseModal} size="full" isOpen={auth.isShowForgotModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className="dark:bg-brand-dark-400">
                        <div className="space-y-2 dark:text-white">
                            <h1 className="text-3xl font-bold">{ct('forgot-password')}</h1>
                        </div>
                    </ModalHeader>
                    <ModalCloseButton className="dark:text-white" onClick={removeModal} />
                    <ModalBody className="dark:bg-brand-dark-400 dark:text-white">
                        <form onSubmit={formik.handleSubmit} className="mb-10 space-y-6">
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">{ct('email-address')}</label>
                                <input type="email" name="email" className="h-12 px-4 text-sm bg-gray-200 border rounded-md focus:outline-none dark:bg-brand-dark-500 dark:border-brand-grey-70" onChange={formik.handleChange} value={formik.values.email} placeholder={ct('email-address-hint')} />
                                <p className="text-sm font-medium text-brand-red-400">
                                    {formik.errors.email}
                                </p>
                            </div>
                            <button type="submit" disabled={isLoading} className={`${formik.values.email ? 'bg-brand-blue-400 dark:bg-brand-blue-300 text-white' : 'bg-gray-100 dark:bg-gray-700'} w-full h-12 text-center font-medium rounded-md`}>
                                {isLoading ? <Spinner /> : ct('forgot-password')}
                            </button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>            
            <ReCaptcha
                key={key}
                action='forgot_password'
                sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                verifyCallback={(e) => setCaptchaToken(e)}
            />
            <Alert isOpen={isOpenAlert} closeModal={closeModal} status={alertMsg.status} title={alertMsg.title} description={alertMsg.description} btnText={alertMsg.btnText} nextRoute={alertMsg.nextRoute} />
        </>
    )

    function closeModal() {
        setIsOpenAlert(false)
    }

    function responseCode(response: any) {
        switch (response.meta.error_code) {
            case 0: 
                setAlertMsg({ status: 'success', title: "Баталгаажуулах", description: "Имэйл ээ баталгаажуулна уу.", btnText: "Хаах", nextRoute: '' })
                break
            default:
                setAlertMsg({ status: 'error', title: "Алдаа", description: response.meta.error_message, btnText: "Хаах", nextRoute: '' })
                break
        }
    }
}
