import { navigation } from '../layout/ax_menu_item_admin'
import { navigation_usuario} from '../layout/ax_menu_item_usuario'
import { useEffect, useReducer, useState } from "react";
import Link from 'next/link'
import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { useRouter } from 'next/router'
import { NombreTramite } from 'lib/edicion';
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { useUser } from '@auth0/nextjs-auth0';

const fetcherGrupo = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherEmpleado = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
function classNames(...classes: Array<string>) {
    return classes.filter(Boolean).join(' ')
}

export default function AxBodyNavegacion({ clase }: any) {
    const { user, error, isLoading } = useUser();
    const { data: listaGrupo } = useSWRImmutable('/api/administracion/grupo', fetcherGrupo);
    const { data: listaEmpleado } = useSWRImmutable<any[]>('/api/entidad/empleado', fetcherEmpleado);
    const [id_rol, setId_rol] = useState(0);
    const router = useRouter();
    useEffect(() => {
        const empleado = listaEmpleado?.filter(x => x.email == user?.email);
        if (empleado && empleado[0]) {
            setId_rol(empleado[0].id_rol)
            console.log(empleado[0].id_rol);
            
        }
    }, [listaEmpleado])

    return <nav className="mt-5 flex-1 flex flex-col divide-y divide-indigo-500 overflow-y-auto" aria-label="Sidebar">
        <div className="px-2 space-y-1">

            {(id_rol==5 ? navigation : navigation_usuario).map((item) => (
                !item.children ? (
                    <Link key={item.name} href={item.href}>
                        <a
                            href={item.href}
                            className={classNames(
                                router.pathname == item.href
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-500',
                                'group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md hover:text-white hover:bg-indigo-500  focus:ring-indigo-500'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                        >
                            <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-200" aria-hidden="true" />
                            {item.name}
                        </a>
                    </Link>
                ) : (
                    <Disclosure as="div" key={item.name} className="space-y-1">
                        {({ open }) => (
                            <>
                                <Disclosure.Button
                                    className={classNames(
                                        item.current
                                            ? 'bg-indigo-800 text-white'
                                            : 'text-indigo-100 hover:bg-indigo-500 ',
                                        'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-indigo-800'
                                    )}
                                >
                                    <item.icon
                                        className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-200 "
                                        aria-hidden="true"
                                    />
                                    <span className="flex-1">{item.name}</span>
                                    <svg
                                        className={classNames(
                                            open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                                            'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150'
                                        )}
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                    >
                                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                                    </svg>
                                </Disclosure.Button>
                                <Disclosure.Panel className="space-y-1">
                                    {item.children.map((subItem) => (
                                        item.name == "Tramite" ?
                                            (listaGrupo && listaGrupo.map((grupoItem:any) => (
                                                <Link key={grupoItem.nombre} href='/solicitud'>

                                                    <Disclosure.Button
                                                        key={grupoItem.nombre}
                                                        as="a"
                                                        href='/solicitud'
                                                        className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-500"
                                                    >
                                                        <subItem.icon className="mr-4 flex-shrink-0 h-5 w-5 text-indigo-200" aria-hidden="true"></subItem.icon>
                                                        {grupoItem.nombre}
                                                    </Disclosure.Button>
                                                </Link>
                                            )))
                                            :
                                        <Link key={subItem.name} href={subItem.href}>
                                            <Disclosure.Button
                                                key={subItem.name}
                                                as="a"
                                                href={subItem.href}
                                                className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-500"
                                            >
                                                <subItem.icon className="mr-4 flex-shrink-0 h-5 w-5 text-indigo-200" aria-hidden="true"></subItem.icon>
                                                {subItem.name}
                                            </Disclosure.Button>

                                        </Link>
                                    ))}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                )
            ))}
        </div>        
    </nav>;
}


