import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import Cookie from 'js-cookie'
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, ModalHeader, useDisclosure, Spinner } from '@chakra-ui/react'
import { CgProfile } from 'react-icons/cg'

import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import Alert from 'components/Alert'
import Navbar from 'components/navbar'
import NewsLetter from 'components/NewsLetter'
import useTranslation from 'next-translate/useTranslation'


export default function Settings() {

    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)

    const {isOpen: isModalVisible, onOpen: onOpenModal, onClose: onCloseModal} = useDisclosure()

    const {t: ct} = useTranslation('common')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [alertMsg, setAlertMsg] = useState({ status: '', title: '', description: '', btnText: '', nextRoute: '' })
    const [avatarFile, setAvatarFile] = useState(null)

    useEffect(() => {
        if (!Cookie.get('accessToken')) {
            router.push('/')
            dispatch({ type: 'SHOW_LOGIN_MODAL', payload: { value: true } })
        }
    }, [])
    
    useEffect(() => {
        formik.setValues({ displayName: user.displayName, userName: user.userName, email: user.email })
    }, [user])

    const formik = useFormik({
        initialValues: {
            displayName: '',
            userName: '',
            email: ''
        },
        validate: (values) => {
            const errors: any = {}

            return errors
        },
        onSubmit: (values) => {
            updateProfileInfo(values.displayName, values.userName)
        }
    })

    const resetPasswordFormik = useFormik({
        initialValues: {
            oldPassword: '',
            password1: '',
            password2: ''
        },
        validate: (values) => {
            const errors: any = {}

            if (!values.oldPassword) {
                errors.oldPassword = 'Нууц үгээ оруулна уу.'
            }
            if (!values.password1) {
                errors.password1 = 'Нууц үгээ оруулна уу.'
            } else if (values.password1 != values.password2) {
                errors.password2 = 'Нууц үг таарахгүй байна.'
            }

            return errors
        },
        onSubmit: (values) => {
            resetPassword(values.oldPassword, values.password1, values.password2)
        }
    })

    const resetPassword = async (oldPassword: string, password1: string, password2: string) => {
        let body = JSON.stringify({
            "oldPassword": oldPassword,
            "password1": password1,
            "password2": password2
        })

        fetch(`${process.env.NEXT_PUBLIC_USER_API}/password/change`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'mn',
                'Authorization': `Bearer ${Cookie.get('accessToken')}`
            },
            body
        }).then(res => res.text())
          .then(result => {
              let data = JSON.parse(result)

              resetPasswordFormik.resetForm()
              dispatch({ type: 'CALL_PROFILE', payload: { value: false } })
              passwordResponseCode(data)
              openModal()
          })
    }

    const updateProfileInfo = async (displayName: string, userName: string) => {
        setIsLoading(true)
        
        let formData = new FormData()
        avatarFile ? formData.append('avatar', avatarFile, 'file') : formData.append('avatar', '')

        fetch(`${process.env.NEXT_PUBLIC_USER_API}/profile?username=${userName}&displayName=${displayName}`, {
            method: "POST",
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${Cookie.get('accessToken')}`
            },
            body: formData
        }).then(res => res.text())
          .then(result => {
              setIsLoading(false)
              
              let data = JSON.parse(result)

              profileResponseCode(data)
              dispatch({ type: 'CALL_PROFILE', payload: { value: true } })
              openModal()
          })
    }

    const isChanged = () => {
        if (formik.values.displayName == user.displayName && formik.values.userName == user.userName && formik.values.email == user.email) {
            return false
        } 
        return true
    }

    return (
        <div className="pb-9">
            <div className="dark:bg-brand-dark-400 dark:text-white">
                <Navbar isForceRefetch={true} metrics={null} />
                <div className="bg-white dark:bg-brand-dark-400">
                    <div className="py-4 pl-3 text-lg font-semibold border-b dark:border-brand-grey-70">
                        {ct('my-profile')}
                    </div>
                    <div className="p-3 space-y-4">
                        <p className="text-xs font-medium">{ct('profile')}</p>
                        <div className="flex items-center space-x-4">
                            {avatarFile ? (
                                <div className="relative w-14 h-14">
                                    <img className="object-cover rounded-full w-14 h-14" src={URL.createObjectURL(avatarFile)} alt="img" />
                                </div>
                            ) : user.avatarUrl ? (
                                    <div className="relative w-14 h-14">
                                        <img className="object-cover rounded-full w-14 h-14" src={user.avatarUrl} alt="img" />
                                    </div>
                            ) : <CgProfile className="text-gray-600 dark:text-gray-200" size={55} /> }
                            <input className="hidden" name="avatar" onChange={(e) => setAvatarFile(e.target.files[0])} id="avatar" type="file" accept=".png" />
                            <label htmlFor="avatar" className="px-6 py-2 text-sm font-medium text-white rounded-md bg-brand-blue-400">{ct('edit')}</label>
                        </div>
                    </div>
                    <form onSubmit={formik.handleSubmit} className="p-3 space-y-6 border-b dark:border-brand-grey-70">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">{ct('name')}</p>
                            <input className="w-full h-12 px-4 text-sm bg-transparent border rounded-md dark:border-brand-grey-70" name="displayName" type="text" value={formik.values.displayName} onChange={formik.handleChange} placeholder="Enter your display name..." />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">{ct('username')}</p>
                            <div className="space-y-1">
                                <input className="w-full h-12 px-4 text-sm bg-transparent border rounded-md dark:border-brand-grey-70" type="text" name="userName" value={formik.values.userName} onChange={formik.handleChange} placeholder="Enter your user name..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">{ct('email-address')}</p>
                            <input disabled={true} className="w-full h-12 px-4 text-sm bg-gray-100 border rounded-md cursor-not-allowed dark:bg-gray-700 dark:border-brand-grey-70" type="email" name="email" value={formik.values.email} onChange={formik.handleChange} />
                        </div>
                        <button disabled={!isChanged()} className="h-10 text-sm font-semibold text-white rounded-md bg-brand-blue-400 w-28" type="submit">
                            {isLoading ? <Spinner /> : ct('save')}
                        </button>
                    </form>
                    <div className="p-3 pb-10 space-y-4">
                        <h3 className="text-lg font-medium">{ct('password')}</h3>
                        <p className="text-sm text-brand-grey-70 dark:text-brand-grey-50">{ct('password-rec')}</p>
                        <button onClick={() => onOpenModal()} className="px-4 py-2 text-sm font-medium border rounded-md dark:border-brand-grey-70">
                            {ct('change-password')}
                        </button>
                    </div>
                </div>
                <NewsLetter />
            </div>
            <Modal isOpen={isModalVisible} onClose={onCloseModal} size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className="dark:bg-brand-dark-400"></ModalHeader>
                    <ModalCloseButton className="dark:text-white" />
                    <ModalBody className="flex flex-col justify-between space-y-2 text-black dark:bg-brand-dark-400 dark:text-white">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-semibold text-center">{ct('change-password')}</h3>
                            <p className="text-sm text-brand-grey-70 dark:text-brand-grey-120">
                                {ct('change-pwd-with-old-new')}
                            </p>
                            <form onSubmit={resetPasswordFormik.handleSubmit} className="pt-10 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium">{ct('current-pwd')}</p>
                                    <input value={resetPasswordFormik.values.oldPassword} name="oldPassword" onChange={resetPasswordFormik.handleChange} className="w-full p-4 text-sm bg-gray-100 border rounded-md text-brand-grey-70 dark:bg-transparent dark:border-brand-grey-70" type="password" />
                                    <p className="text-xs text-brand-red-400">{resetPasswordFormik.errors.oldPassword}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium">{ct('new-pwd')}</p>
                                    <input value={resetPasswordFormik.values.password1} name="password1" onChange={resetPasswordFormik.handleChange} className="w-full p-4 text-sm bg-gray-100 border rounded-md text-brand-grey-70 dark:bg-transparent dark:border-brand-grey-70" type="password" />
                                    <p className="text-xs text-brand-red-400">{resetPasswordFormik.errors.password1}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium">{ct('confirm-pwd')}</p>
                                    <input value={resetPasswordFormik.values.password2} name="password2" onChange={resetPasswordFormik.handleChange} className="w-full p-4 text-sm bg-gray-100 border rounded-md text-brand-grey-70 dark:bg-transparent dark:border-brand-grey-70" type="password" />
                                    <p className="text-xs text-brand-red-400">{resetPasswordFormik.errors.password2}</p>
                                </div>
                                <button className="w-full py-3 text-sm font-semibold text-white rounded-md bg-brand-blue-400 dark:bg-brand-blue-300">{ct('save')}</button>
                            </form>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Alert isOpen={isOpenModal} closeModal={closeModal} status={alertMsg.status} title={alertMsg.title} description={alertMsg.description} btnText={alertMsg.btnText} nextRoute={alertMsg.nextRoute} />
        </div>
    )

    function closeModal() {
        setIsOpenModal(false)
    }

    function openModal() {
        onCloseModal()
        setIsOpenModal(true)
    }

    function passwordResponseCode(response: any) {
        switch (response.meta.error_code) {
            case 0:
                setAlertMsg({ status: 'success', title: "Амжилттай", description: "Нууц үг солигдлоо", btnText: "Хаах", nextRoute: '' })
                break
            case 400:
                setAlertMsg({ status: 'warning', title: "Нууц үг буруу байна", description: "", btnText: "Хаах", nextRoute: '' })
                break
            default:
                setAlertMsg({ status: 'error', title: "Алдаа", description: response.meta.error_message, btnText: "Хаах", nextRoute: '' })
                break
        }
    }

    function profileResponseCode(response: any) {
        switch(response.meta.error_code) {
            case 0:
                setAlertMsg({ status: 'success', title: "Амжилттай", description: "Профайл амжилттай шинэчлэгдлээ", btnText: "Хаах", nextRoute: '' })
                break
            default: 
                setAlertMsg({ status: 'error', title: "Алдаа", description: response.meta.error_message, btnText: "Хаах", nextRoute: '' })
                break
        }
    }
}