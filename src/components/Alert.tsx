import React, { Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { RiErrorWarningLine } from 'react-icons/ri'


interface Props {
  isOpen: boolean,
  closeModal: any,
  status: string,
  title: string,
  description: string,
  btnText: string,
  nextRoute: string | null
}

export default function Alert({ isOpen, closeModal, status, title, description, btnText, nextRoute }: Props) {

  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(function() {
        closeModal()
      }, 2000)
      if (nextRoute.length > 0) {
        nextRoute == 'reload' ? router.reload() : router.push(nextRoute)
      }
    }
  }, [isOpen])

  function whichIcon(status) {
    switch (status) {
        case 'success':
            return <AiOutlineCheckCircle color="#0c0" size={25} />
        case 'warning':
            return <RiErrorWarningLine color="#fdc000" size={25} />
        case 'error':
            return <RiErrorWarningLine color="#c00" size={25} />
        default:
            return <AiOutlineCheckCircle color="#0c0" size={25} />
    }
  }
    
    return (
        <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="dark:bg-brand-dark-400 inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="font-medium leading-6 text-gray-900 dark:text-white flex items-center justify-start space-x-2"
                >
                  {whichIcon(status)}
                  <p>{title}</p>
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-slate-300">
                    {description}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="flex justify-center px-3 py-1 text-xs font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    {btnText}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    )
}