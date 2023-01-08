import React, { Fragment, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';

const Modal = ({ isOpen, onClose, children, closeableOnBackdrop = true }) => {
    // const [showModal, setShowModal] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!!isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                setShouldAnimate(true);
            }, 50);
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    useEffect(() => {
        if (!shouldAnimate && !!isOpen) {
            setTimeout(() => {
                onClose(false);
            }, 100);
        }
    }, [shouldAnimate]);

    const closeModal = () => {
        setShouldAnimate(false);
    };

    if (!isOpen || !mounted) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 flex justify-center items-center">
            <div className={`${!shouldAnimate ? 'opacity-0 pointer-events-none' : 'opacity-25'} fixed inset-0 z-50 bg-black transition duration-200`} onClick={closeableOnBackdrop ? closeModal : null} />
            <div className={`${!shouldAnimate ? '-translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} m-3 rounded overfow-hidden transition duration-200 absolute z-50 bg-white shadow-xl`}>
                <div className="relative w-auto mx-auto max-w-3xl overfow-hidden">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {children(closeModal)}
                    </div>
                </div>
            </div>
        </div>,
        document.querySelector('#modal-portal'),
    );
};

export default Modal;

export const MyModal = ({ isOpen, onClose, children, closeableOnBackdrop = true }) => {
    const b = '';
    return (
        <Transition appear show={isOpen} as={Fragment}>
            {/* <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}> */}
            {/* <Dialog as="div" className="relative z-10" onClose={() => onClose(false)}> */}
            <Dialog static={!closeableOnBackdrop} as="div" className="relative z-10" onClose={() => closeableOnBackdrop && onClose(false)}>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >

                            <Dialog.Panel className="transform overflow-hidden bg-white align-middle shadow-xl transition-all">

                                {children}

                            </Dialog.Panel>
                            {/* <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Payment successful
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Your payment has been successfully submitted. We’ve sent
                                        you an email with all of the details of your order.
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Got it, thanks!
                                    </button>
                                </div>
                            </Dialog.Panel> */}
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
