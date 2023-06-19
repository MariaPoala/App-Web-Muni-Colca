import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import AxBodyNavegacion from 'components/form/ax_body_navegacion'
import { XIcon } from '@heroicons/react/outline';

interface IProps {
    isSidebarOpen: boolean,
    setIsSidebarOpen: (active: boolean) => void;
}

export default function AxSidebar({ isSidebarOpen, setIsSidebarOpen }: IProps) {
    return <>
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
            <div className="flex flex-col flex-grow bg-indigo-600 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                    <div className="mt-4 ml-8 flex flex-grow flex-shrink-0 lg:flex-grow-0 lg:ml-4">
                        <img className="h-12" src="https://tailwindui.com/img/logos/tuple-logo-indigo-300.svg" alt="Tuple" />
                    </div>
                </div>
                <AxBodyNavegacion clase="mt-5 flex-1 flex flex-col divide-y divide-indigo-500 overflow-y-auto"></AxBodyNavegacion>
            </div>
        </div >
        {
            < Transition.Root show={isSidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={setIsSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex z-40">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Cerrar sidebar</span>
                                            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="mt-4 ml-8 flex flex-shrink-0 lg:flex-grow-0 lg:ml-4">
                                    <img className="h-12" src="https://tailwindui.com/img/logos/tuple-logo-indigo-300.svg" alt="Tuple" />
                                </div>
                                <AxBodyNavegacion clase="mt-5 flex-shrink-0 h-full divide-y divide-indigo-800 overflow-y-auto"></AxBodyNavegacion>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                        </div>
                    </div>
                </Dialog>
            </Transition.Root >
        }
    </>
}