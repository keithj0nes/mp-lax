import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
    const [showModal, setShowModal] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    const [mounted, setMounted] = useState(false)

   useEffect(() => {
      setMounted(true)

      return () => setMounted(false)
   }, [])

  
    useEffect(() => {
        if (!!isOpen) {
            console.log('show')
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
          console.log('hide')
          setTimeout(() => {
              console.log('setting false')
              onClose(false);
          }, 100);
      }
    }, [shouldAnimate])
  
    const closeModal = () => {
      setShouldAnimate(false);
    }

    console.log(isOpen, mounted, 'isOpen && mounted')
    // console.log(children,' children')
    if (!isOpen || !mounted) {
        return null;
    }
  
    return createPortal(
        <div className="absolute inset-0 flex justify-center items-center">
            <div className={`${!shouldAnimate ? 'opacity-0 pointer-events-none' : 'opacity-25'} fixed inset-0 z-50 bg-black transition duration-200`} onClick={closeModal}></div>
            <div className={`${!shouldAnimate ? '-translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} m-3 rounded overflow-hidden transition duration-200 absolute z-50 bg-white shadow-xl`}>


                <div className="relative w-auto mx-auto max-w-3xl overflow-hidden">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                        {children(closeModal)}
                        {/* <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Modal Title
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={closeModal}
                            >
                                <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        <div className="relative p-6 flex-auto">
                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae expedita corrupti laudantium aperiam, doloremque explicabo ipsum earum dicta saepe delectus totam vitae ipsam doloribus et obcaecati facilis eius assumenda, cumque.
        
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae expedita corrupti laudantium aperiam, doloremque explicabo ipsum earum dicta saepe delectus totam vitae ipsam doloribus et obcaecati facilis eius assumenda, cumque.
                            </p>
                        </div>
                        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={closeModal}
                            >
                                Save Changes
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
            {/* </div> */}
  
        </div>,
        document.querySelector("#modal-portal")
    );
  }
  
  export default Modal;
