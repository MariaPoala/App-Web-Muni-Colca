import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuAlt1Icon } from '@heroicons/react/outline'
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid'
import { UserCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0';
import useSWRImmutable from "swr/immutable"
const fetcherEmpleado = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
interface IMenuUsuario {
    name: string,
    text: string,
    status: 'authenticated' | 'loading' | 'unauthenticated',
    EvClick?: any
    href: string
}

const menuUsuario: Array<IMenuUsuario> = [
    { name: "profile", text: "Tu Perfil", status: "authenticated", href: "/miperfil" },
    { name: "logout", text: "Cerrar Sesión", status: "authenticated", href: "/api/auth/logout" }
]

interface IProps {
    setIsSidebarOpen: (active: boolean) => void;
}

export default function AxHeader({ setIsSidebarOpen }: IProps) {
    const { user, error, isLoading } = useUser();
    const { data: listaEmpleado } = useSWRImmutable('/api/entidad/empleado', fetcherEmpleado);
    if (isLoading) return <div>Loading...</div>;

    return <>
        <div className=" z-10 flex-shrink-0 flex h-16 bg-indigo-300 border-b border-indigo-00 lg:border-none sticky top-0 border-gray-200" >
            <button
                type="button"
                className="px-4 border-r border-indigo-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                onClick={() => {
                    setIsSidebarOpen(true)
                }}
            >
                <span className="sr-only">Abrir sidebar</span>
                <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                {/* Search */}
                <div className="flex-1 flex">
                    <form className="w-full flex md:ml-0" action="#" method="GET">
                        <label htmlFor="search-field" className="sr-only">
                            Buscar
                        </label>
                        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                            <div className="text-indigo-500 absolute inset-y-0 left-0 flex items-center pointer-events-none" aria-hidden="true">
                                <SearchIcon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <input id="search-field" name="search-field" type="search" placeholder="Buscar" className="bg-indigo-300 block w-full h-full pl-8 pr-3 py-2 border-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm" />
                        </div>
                    </form>
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                    <button type="button" className="bg-indigo-300 p-1 rounded-full text-indigo-500 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Ver notificaciones</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                        <div>
                            <Menu.Button className="max-w-xs bg-indigo-400 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 lg:p-2 lg:rounded-md lg:hover:bg-indigo-500">

                                {user ?
                                         <>
                                        <img className="h-8 w-8 rounded-full" src={user.picture || ""} alt="" />
                                        <span className="hidden ml-3 text-white text-sm font-medium lg:block">
                                            <span className="sr-only">Open user menu for </span>{user.email || ""}
                                        </span>
                                    </>
                                        :

                                        <UserCircleIcon className="h-8 w-8 rounded-full"></UserCircleIcon>
                                }

                                <ChevronDownIcon className="hidden flex-shrink-0 ml-1 h-5 w-5 text-indigo-600 lg:block" aria-hidden="true" />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-indigo-300 ring-1 ring-black ring-opacity-5  focus:outline-none">
                                {
                                    menuUsuario.map(item => (
                                        <Link key={item.name} href={item.href}>
                                            <Menu.Item key={item.name}>
                                                <a onClick={item.EvClick} href="#" className="block px-4 py-2 text-sm text-white hover:bg-indigo-400">
                                                    {item.text + ""}
                                                </a>
                                            </Menu.Item>
                                        </Link>
                                    ))
                                }
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </div>
    </>
}