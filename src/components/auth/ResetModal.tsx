import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie'
import { useFormik } from 'formik'
import validator from 'validator'
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, ModalHeader, useDisclosure, Spinner } from '@chakra-ui/react'

import { useAppDispatch, useAppSelector } from 'src/store'
import Alert from 'components/Alert'


export default function ResetPasswordModal() {

    const dispatch = useAppDispatch()
    const auth = useAppSelector(state => state.auth)
    const router = useRouter()
    const {isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal} = useDisclosure()

    const [isLoading, setIsLoading] = useState(false)
    const [alertMsg, setAlertMsg] = useState({ status: '', title: '', description: '', btnText: '', nextRoute: '' })
    const [isOpenAlert, setIsOpenAlert] = useState(false)    

    const formik = useFormik({
        initialValues: {
            password1: '',
            password2: ''
        },
        validate: (values) => {
            const errors: any = {}

            if (!values.password1) {
                errors.password1 = 'Имэйл ээ оруулна уу.'
            }
            if (values.password1 != values.password2) {
                errors.password2 = 'Имэйл таарахгүй байна.'
            }

            return errors
        },
        onSubmit: (values) => {
            resetPassword(values.password1, values.password2)
        }
    })

    const resetPassword = async(password1: string, password2: string) => {
        setIsLoading(true)
        
        let body = JSON.stringify({
            "email": Cookie.get('email'),
            "resetCode": router.query.reset,
            "password1": password1,
            "password2": password2
        })

        await fetch(`${process.env.NEXT_PUBLIC_USER_API}/password/reset`, {
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
              
              console.log("data")
              console.log(data)

              setIsLoading(false)
              removeModal()
              responseCode(data)
              setIsOpenAlert(true)
              setTimeout(() => {
                dispatch({ type: 'SHOW_LOGIN_MODAL', payload: { value: true } })
              }, 3000);
          })
    }

    const removeModal = () => {
        dispatch({ type: 'SHOW_RESET_MODAL', payload: { value: false } })
    }
    
    return (
        <>
            <Modal onClose={onCloseModal} size="lg" isOpen={auth.isShowResetModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className="dark:bg-brand-dark-400">
                        <div className="space-y-2 dark:text-white">
                            <h1 className="font-bold text-3xl">Нууц үг сэргээх</h1>
                        </div>
                    </ModalHeader>
                    <ModalCloseButton className="dark:text-white" onClick={removeModal} />
                    <ModalBody className="dark:bg-brand-dark-400 dark:text-white">
                        <form onSubmit={formik.handleSubmit} className="space-y-6 mb-10">
                            <div className="flex flex-col space-y-2">
                                <label className="font-medium text-sm">Шинэ нууц үг</label>
                                <input type="password" name="password1" className="focus:outline-none border rounded-md h-12 px-4 text-sm dark:bg-brand-dark-500 dark:border-brand-grey-70" onChange={formik.handleChange} value={formik.values.password1} />
                                <p className="text-brand-red-400 text-sm font-medium">
                                    {formik.errors.password1}
                                </p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="font-medium text-sm">Нууц үг давтах</label>
                                <input type="password" name="password2" className="focus:outline-none border rounded-md h-12 px-4 text-sm dark:bg-brand-dark-500 dark:border-brand-grey-70" onChange={formik.handleChange} value={formik.values.password2} />
                                <p className="text-brand-red-400 text-sm font-medium">
                                    {formik.errors.password2}
                                </p>
                            </div>
                            <button type="submit" disabled={isLoading} className={`${formik.values.password1 && formik.values.password1 == formik.values.password2 ? 'bg-brand-blue-400 text-white' : 'bg-gray-100'} w-full h-12 text-center font-medium rounded-md`}>
                                {isLoading ? <Spinner /> : 'Шинэчлэх'}
                            </button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>            
            <Alert isOpen={isOpenAlert} closeModal={closeModal} status={alertMsg.status} title={alertMsg.title} description={alertMsg.description} btnText={alertMsg.btnText} nextRoute={alertMsg.nextRoute} />
        </>
    )

    function closeModal() {
        setIsOpenAlert(false)
    }

    function responseCode(response: any) {
        switch (response.meta.error_code) {
            case 0: 
                setAlertMsg({ status: 'success', title: "Амжилттай", description: "Нууц үг амжилттай солигдлоо", btnText: "Хаах", nextRoute: '' })
                break
            default:
                setAlertMsg({ status: 'error', title: "Алдаа", description: response.meta.error_message, btnText: "Хаах", nextRoute: '' })
                break
        }
    }
}