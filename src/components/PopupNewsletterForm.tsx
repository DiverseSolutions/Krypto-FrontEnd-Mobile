import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import Cookie from 'js-cookie'
import useTranslation from 'next-translate/useTranslation'


interface Props {
    isModalVisible: boolean,
    onCloseModal: any,
    formik: any,
    isShowLoader: boolean
}

export default function PopUpNewsLetterForm({ isModalVisible, onCloseModal, formik, isShowLoader }: Props) {
    
    function hideNewsletterPopup() {
        Cookie.set('isShowNewsletter', 'hide')
        localStorage.setItem('isShowNewsletter', 'hide')
        onCloseModal()
    }

    const {t} = useTranslation('common')
    
    return (
        <Modal onClose={onCloseModal} size={'sm'} isOpen={isModalVisible}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton className='text-black dark:text-white' />
                <ModalBody className='dark:bg-brand-black'>
                    <div className="mt-8 mb-4 space-y-4">
                        <h3 className="font-medium dark:text-brand-grey-50">{t('newsletter-title')}</h3>
                        <p className="text-sm dark:text-brand-grey-110">{t('newsletter-desc')}</p>
                        <iframe src="https://embeds.beehiiv.com/580513ca-533b-46ca-9638-9ac9b7967a47?slim=true" className="w-full h-20 pt-4" data-test-id="beehiiv-embed" frameBorder="0" scrolling="no" style={{ margin: "0", border: "0", borderRadius: "0", backgroundColor: "transparent", outline: "none" }}></iframe>
                        {/* <form onSubmit={formik.handleSubmit}>
                            <div>
                                <input name="email" onChange={formik.handleChange} value={formik.values.email} className="w-full h-12 px-5 text-xs border rounded-lg dark:bg-brand-dark-400 dark:border-brand-grey-100 focus:outline-none dark:text-white" type="text" placeholder="Имэйл хаягаа оруулна уу" />
                                <p className="h-8 text-xs text-brand-red-400">
                                    {formik.errors.email}
                                </p>
                            </div>
                            <button className="w-full h-12 px-5 text-xs font-medium text-white rounded-lg bg-brand-blue-400 dark:bg-brand-blue-300">
                                {isShowLoader ? <Spinner /> : 'Уншъя'}
                            </button>
                        </form> */}
                        <p onClick={() => hideNewsletterPopup()} className="pt-2 text-xs font-medium text-center underline cursor-pointer dark:text-brand-grey-110">Дахиж харахгүй</p>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
