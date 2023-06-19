import React, { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { SearchIcon, ChevronRightIcon, MailIcon, UserAddIcon, UsersIcon, PhoneIcon, FilterIcon } from '@heroicons/react/solid'
import AxInicio from 'components/layout/ax_inicio'
import AxEmpresa from 'modulos/entidad/ax_empresa'
import { EnumEstadoEdicion } from 'lib/edicion'
import EmpresaModel from 'models/empresa_model'
import { Menu, Transition } from '@headlessui/react';

export const getServerSideProps = withPageAuthRequired();

export default function AxPageEmpresa() {
    const [ID, setID] = useState(-1)
    const [lista, setLista] = useState<EmpresaModel[]>([]);
    const [estadoEdicion, setEstadoEdicion] = useState(EnumEstadoEdicion.LISTAR)
    const [isLoading, setIsLoading] = useState(true);
    const [textoFiltro, setTextoFiltro] = useState('')
    const [tipoFiltro, setTipoFiltro] = useState("TODOS")

    useEffect(() => {
        if (estadoEdicion != EnumEstadoEdicion.LISTAR && estadoEdicion != EnumEstadoEdicion.GUARDADO) return;
        setIsLoading(true)
        const fetchData = async () => {
            const response = await fetch(`/api/entidad/empresa`, { method: "GET" })
            const result: EmpresaModel[] = await response.json()
            setLista(result);
            setIsLoading(false)
        }
        fetchData().catch(console.error);
    }, [estadoEdicion])

    const listaFiltro = ((textoFiltro == "" && tipoFiltro == "TODOS" ? lista : lista.filter(item =>
        (item.razon_social.toUpperCase().includes(textoFiltro.toUpperCase())) &&
        (tipoFiltro == "TODOS" || item.estado == (tipoFiltro == "ACTIVO"))
    )))
    return (
        <>
            <Head><title>Empresa</title></Head>
            <div className={isLoading ? "animate-pulse" : "" + " h-full flex flex-col"}>
                <div className="min-h-0 flex-1 flex overflow-hidden ">
                    <main className="min-w-0 flex-1 border-t border-gray-200 xl:flex">
                        {/*DETALLE*/}
                        <div className={((estadoEdicion == EnumEstadoEdicion.SELECCIONADO || estadoEdicion == EnumEstadoEdicion.EDITANDO) ? "block" : "hidden sm:block") + " flex-1 inset-y-0 pl-0 m-1 sm:pl-72 md:pl-80 lg:pl-80 bg-white"}>
                            {ID == -1
                                ? <AxInicio nombre="Empresa" />
                                : <AxEmpresa ID={ID} setID={setID} setEstadoEdicion={setEstadoEdicion} />
                            }
                        </div>
                        {/*LISTA*/}
                        <aside className={((estadoEdicion == EnumEstadoEdicion.SELECCIONADO || estadoEdicion == EnumEstadoEdicion.EDITANDO) ? "invisible sm:visible" : "visible") + " fixed mt-16 w-full inset-y-0 sm:w-72 md:w-80 lg:w-80"}>
                            <div className="h-full relative flex flex-col border-r border-gray-200 bg-gray-100">
                                {/*CABECERA */}
                                <div className="flex-shrink-0">
                                    <div className="px-6 pt-2 pb-2 ">
                                        <h2 className="text-lg font-medium text-gray-900">Lista de Empresas</h2>
                                        <div className="mt-2 flex space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="relative rounded-md shadow-sm overflow-y-auto">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="relative rounded-md shadow-sm">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            </div>
                                                            <input
                                                                type="search"
                                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-indigo-300 rounded-md"
                                                                placeholder="Buscar..."
                                                                onChange={(event) => setTextoFiltro(event.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Menu as="div" className="relative z-1 inline-block text-left">
                                                <div>
                                                    <Menu.Button className="inline-flex justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                        <FilterIcon className={(tipoFiltro == "ACTIVO" ? "text-green-400 " : tipoFiltro == "DESACTIVADO" ? "text-red-400 " : "text-blue-300 ") + "  h-5 w-5 "} aria-hidden="true" />
                                                    </Menu.Button>
                                                </div>
                                                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95"                                                >
                                                    <Menu.Items className="origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <div className="py-1">
                                                            <a onClick={() => { setTipoFiltro("ACTIVO") }} className={(tipoFiltro == "ACTIVO" ? "bg-indigo-100" : "") + " hover:bg-indigo-200 block px-4 py-2 text-sm font-medium text-gray-900"}>
                                                                <span className="absolute  right-16 block h-3 w-3 rounded-full ring-2 ring-white bg-green-300" />
                                                                Activos
                                                            </a>

                                                            <a onClick={() => { setTipoFiltro("DESACTIVADO") }} className={(tipoFiltro == "DESACTIVADO" ? "bg-indigo-100" : "") + " hover:bg-indigo-200 block px-4 py-2 text-sm font-medium text-gray-900"}>
                                                                <span className="absolute  right-16 block h-3 w-3 rounded-full ring-2 ring-white bg-red-400" />
                                                                Inactivos
                                                            </a>
                                                            <a onClick={() => { setTipoFiltro("TODOS") }} className={(tipoFiltro == "TODOS" ? "bg-indigo-100" : "") + " hover:bg-indigo-200 block px-4 py-2 text-sm font-medium text-gray-900"}>
                                                                <span className="absolute  right-16 block h-3 w-3 rounded-full ring-2 ring-white bg-blue-300" />
                                                                Todos
                                                            </a>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="border-t border-b border-gray-200 bg-gray-100 px-6 py-2 text-sm font-medium text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <div className='flex-1'>
                                                <p className="text-sm font-medium text-gray-500">{
                                                    listaFiltro && listaFiltro.length || 0} Registros</p>
                                            </div>
                                            <div>
                                                <button onClick=
                                                    {() => {
                                                        setID(0);
                                                        setEstadoEdicion(EnumEstadoEdicion.EDITANDO);
                                                    }}
                                                    type="button" className="bg-indigo-200 p-1 rounded-full text-indigo-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:text-indigo-600">
                                                    <span className="sr-only">Agregar Empresa</span>
                                                    <UserAddIcon className="h-6 w-6 border-solid " aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*Ciudadanos*/}
                                <nav aria-label="Message list" className="min-h-0 flex-1 overflow-y-auto">
                                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                        <ul role="list" className="divide-y divide-gray-200">
                                            {listaFiltro && listaFiltro.map(item => {
                                                return <li key={item.id}>
                                                    <a onClick={() => {
                                                        setID(item.id);
                                                        setEstadoEdicion(EnumEstadoEdicion.SELECCIONADO);
                                                    }}
                                                        className={(item.id == ID ? "bg-indigo-100" : "") + " block hover:bg-indigo-200"}>
                                                        <div className="flex px-4 py-4 sm:px-6">
                                                            <div className="min-w-0 flex-1 flex">
                                                                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols md:gap-4">
                                                                    <div>
                                                                        <span className="inline-block relative">
                                                                            <span className={"absolute bottom-4 right-full block h-2.5 w-2.5 rounded-full ring-2 ring-white " + (item.estado == true ? "bg-green-400" : "bg-red-400")} />
                                                                            <p className="text-sm font-medium text-indigo-600 truncate">{item.razon_social}</p>
                                                                        </span>
                                                                        <p className="mt-2 flex text-sm text-gray-500">
                                                                            <MailIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                            <span className="truncate">{item.email}</span>
                                                                        </p>
                                                                        <p className="mt-2 flex text-sm text-gray-500">
                                                                            <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                            <span className="truncate">{item.celular}</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                            })
                                            }
                                        </ul>
                                        {textoFiltro !== '' && listaFiltro.length === 0 && (
                                            <div className="py-14 px-4 text-center sm:px-14">
                                                <UsersIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                                                <p className="mt-4 text-sm text-gray-900">No se encontraron empresas usando ese término de búsqueda.</p>
                                            </div>
                                        )}
                                    </div>
                                </nav>
                            </div>
                        </aside>
                    </main>
                </div >
            </div >
        </>
    )
}
