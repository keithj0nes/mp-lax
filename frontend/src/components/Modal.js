/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children, closeableOnBackdrop = true }) => {
    // const [showModal, setShowModal] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [mounted, setMounted] = useState(false)

   useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
   }, [])

    useEffect(() => {
        if (!!isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                setShouldAnimate(true);
            }, 50);
        } else {
                document.body.style.overflow = 'unset';
        }
    }, [isOpen])
  
    useEffect(() => {
      if (!shouldAnimate && !!isOpen) {
          setTimeout(() => {
              onClose(false);
          }, 100);
      }
    }, [shouldAnimate])
  
    const closeModal = () => {
      setShouldAnimate(false);
    }

    if (!isOpen || !mounted) {
        return null;
    }
  
    return createPortal(
        <div className="fixed inset-0 flex justify-center items-center">
            <div className={`${!shouldAnimate ? 'opacity-0 pointer-events-none' : 'opacity-25'} fixed inset-0 z-50 bg-black transition duration-200`} onClick={closeableOnBackdrop ? closeModal : null}></div>
            <div className={`${!shouldAnimate ? '-translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} m-3 rounded overflow-hidden transition duration-200 absolute z-50 bg-white shadow-xl`}>
                <div className="relative w-auto mx-auto max-w-3xl overflow-hidden">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {children(closeModal)}
                    </div>
                </div>
            </div>
        </div>,
        document.querySelector("#modal-portal")
    );
  }
  
  export default Modal;
