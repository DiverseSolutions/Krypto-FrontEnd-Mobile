import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-v3'
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, ModalHeader, useDisclosure, Spinner } from '@chakra-ui/react'
import Cookie from 'js-cookie'
import { useFormik } from 'formik'
import validator from 'validator'
import { BsFacebook } from 'react-icons/bs'

import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import Alert from 'components/Alert'
import { imgLoader } from 'src/utils'
import useTranslation from 'next-translate/useTranslation'


export default function LoginModal() {

    const dispatch = useAppDispatch()
    const auth = useAppSelector(state => state.auth)
    const elemRef = useRef(null)

    const {t: ct} = useTranslation('common')

    const {isOpen: isLoginModalVisible, onOpen: onOpenLoginModal, onClose: onCloseLoginModal} = useDisclosure()

    const [key, setKey] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)    
    const [captchaToken, setCaptchaToken] = useState('')
    const [alertMsg, setAlertMsg] = useState({ status: '', title: '', description: '', btnText: '', nextRoute: '' })

    useEffect(() => {
        loadReCaptcha(process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY)
        setKey(key + 1)
    }, [])

    const removeLoginModal = () => {
        dispatch({ type: 'SHOW_LOGIN_MODAL', payload: { value: false } })
    }

    const toggleModal = () => {
        dispatch({ type: 'SHOW_LOGIN_MODAL', payload: { value: false } })
        dispatch({ type: 'SHOW_SIGNUP_MODAL', payload: { value: true } })
    }

    const loginFormik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate: (values) => {
            const errors: any = {}

            if (!validator.isEmail(values.email)) {
                errors.email = 'Имэйл ээ зөв оруулна уу.'
            }

            return errors
        },
        onSubmit: (values) => {
            loginUser(values.email, values.password)
        }
    })

    const loginUser = async (email: string, password: string) => {
        if (captchaToken) {
            setIsLoading(true)
            
            let body = JSON.stringify({
                "username": email,
                "password": password,
                "captchaResponse": captchaToken
            })

            fetch(`${process.env.NEXT_PUBLIC_USER_API}/login`, {
                method: "POST",
                headers: {
                    'accept': "*/*",
                    'Content-Type': "application/json",
                    'Accept-Language': "mn"
                },
                body
            }).then(res => res.text())
              .then(result => {
                  let data = JSON.parse(result)

                  setIsLoading(false)
                  responseCode(data)
                  removeLoginModal()
                  dispatch({ type: 'CALL_PROFILE', payload: { value: true } })
                  setIsOpenModal(true)
                  setKey(key + 1)
              })
        } else {
            setKey(key + 1)
        }
    }

    const jumptForgotModal = () => {
        dispatch({ type: 'SHOW_LOGIN_MODAL', payload: { value: false } })
        dispatch({ type: 'SHOW_FORGOT_MODAL', payload: { value: true } })
    }

    return (
        <>
            <Modal onClose={onCloseLoginModal} initialFocusRef={elemRef} size="full" isOpen={auth.isShowLoginModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className="dark:bg-brand-dark-400">
                        <div className="space-y-2 dark:text-white">
                            <h1 className="text-3xl font-bold">{ct('login')}</h1>
                            <p className="text-sm font-normal">{ct('dont-have-an-account')}? <span onClick={() => toggleModal()} className="cursor-pointer text-brand-blue-400 dark:text-brand-blue-300 hover:underline">{ct('signup')}</span></p>
                        </div>
                    </ModalHeader>
                    <ModalCloseButton className="dark:text-white" onClick={removeLoginModal} />
                    <ModalBody className="dark:bg-brand-dark-400 dark:text-white">
                        <form onSubmit={loginFormik.handleSubmit} className="mb-10 space-y-6">
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">{ct('email-address')}</label>
                                <input ref={elemRef} type="email" name="email" className="h-12 px-4 text-sm bg-gray-200 border rounded-md focus:outline-none dark:bg-brand-dark-500 dark:border-brand-grey-70" onChange={loginFormik.handleChange} value={loginFormik.values.email} placeholder={ct('email-address-hint')} />
                                <p className="text-sm font-medium text-brand-red-400">
                                    {loginFormik.errors.email}
                                </p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between text-sm font-medium">
                                    <label>{ct('password')}</label>
                                    <p onClick={jumptForgotModal} className="text-brand-grey-100 dark:text-brand-grey-110">{ct('forgot-password')}?</p>
                                </div>
                                <input type="password" name="password" className="h-12 px-4 text-sm bg-gray-200 border rounded-md focus:outline-none dark:bg-brand-dark-500 dark:border-brand-grey-70" onChange={loginFormik.handleChange} value={loginFormik.values.password} placeholder={ct('password-hint')} />
                            </div>
                            <button type="submit" disabled={loginFormik.values.email && loginFormik.values.password && !isLoading ? false : true} 
                                className={`${loginFormik.values.email && loginFormik.values.password && !isLoading ? 'bg-brand-blue-400 dark:bg-brand-blue-300 text-white cursor-pointer' : 'bg-gray-100 dark:bg-brand-grey-70 text-brand-grey-100 dark:text-white cursor-not-allowed'} w-full h-12 text-center font-medium rounded-md`}>
                                {isLoading ? <Spinner /> : ct('login')}
                            </button>
                            <div className="flex items-center justify-between space-x-4">
                                <span className="h-[1px] w-1/2 bg-gray-200 dark:bg-brand-grey-70"></span>
                                <p className="text-sm font-medium">{ct('or').toUpperCase()}</p>
                                <span className="h-[1px] w-1/2 bg-gray-200 dark:bg-brand-grey-70"></span>
                            </div>
                            <a href={`${process.env.NEXT_PUBLIC_USER_API}/oauth2/authorization/facebook`} className={`w-full h-12 font-medium rounded-md border text-sm flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 border-gray-500 dark:border-gray-400 dark:hover:bg-brand-dark-500`}>
                                <BsFacebook size={25} className="text-brand-blue-400 dark:text-brand-blue-300" />
                                <p>Continue with Facebook</p>
                            </a>
                            <a href={`${process.env.NEXT_PUBLIC_USER_API}/oauth2/authorization/google`} className={`w-full h-12 font-medium rounded-md border text-sm flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-brand-dark-500 border-gray-500 dark:border-gray-400`}>
                                <div className="relative w-8 h-8">
                                    <Image src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" loader={imgLoader} layout="fill" objectFit="contain" />
                                </div>
                                <p>Sign In with Google</p>
                            </a>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal> 
            <Alert isOpen={isOpenModal} closeModal={closeModal} status={alertMsg.status} title={alertMsg.title} description={alertMsg.description} btnText={alertMsg.btnText} nextRoute={alertMsg.nextRoute} />
            <ReCaptcha
                key={key}
                action='login'
                sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                verifyCallback={(e) => setCaptchaToken(e)}
            />
        </>
    )

    function closeModal() {
        setIsOpenModal(false)
    }

    function responseCode(response: any) {
        switch (response.meta.error_code) {
            case 0: 
                setAlertMsg({ status: 'success', title: "Амжилттай", description: "Амжилттай нэвтэрлээ", btnText: "Хаах", nextRoute: 'reload' })
                Cookie.set('accessToken', response.data.accessToken)
                break
            case 2001:
                setAlertMsg({ status: 'warning', title: "Бүртгэл үүссэн байна", description: "", btnText: "Хаах", nextRoute: '' })
                break
            default:
                setAlertMsg({ status: 'error', title: "Алдаа", description: response.meta.error_message, btnText: "Хаах", nextRoute: '' })
                break
        }
    }
}