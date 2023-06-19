import { Fragment, useEffect, useReducer, useState } from "react";
import useSWRImmutable from "swr/immutable"
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Dialog, Transition } from "@headlessui/react";
import { AxBtnCancelar, AxBtnEditar, AxCheck, AxInput, AxBtnEliminar, AxSelect, AxSubmit, AxModalEliminar } from 'components/form'
import { EnumTipoEdicion, EnumEstadoEdicion, TypeFormularioProps } from 'lib/edicion'
import EmpresaModel from 'models/empresa_model'
import { ChevronLeftIcon } from "@heroicons/react/outline";

export const getServerSideProps = withPageAuthRequired();
const fetcherDistrito = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherAnexo = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const formReducer = (state: EmpresaModel, event: any): EmpresaModel => {
    if (event.FORM_DATA) {
        return { ...event.FORM_DATA }
    }
    if (event.FORM_ADD) {
        return new EmpresaModel()
    }
    return { ...state, [event.name]: event.value }
}

export default function AxEmpresa({ ID, setID, setEstadoEdicion }: TypeFormularioProps) {
    const { data: listaDistrito } = useSWRImmutable('/api/entidad/distrito', fetcherDistrito);
    const { data: listaAnexo } = useSWRImmutable<any[]>('/api/entidad/anexo', fetcherAnexo);
    const [formData, setFormData] = useReducer(formReducer, new EmpresaModel());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tipoEdicion, setTipoEdicion] = useState(EnumTipoEdicion.VISUALIZAR)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setTipoEdicion(ID == 0 ? EnumTipoEdicion.AGREGAR : EnumTipoEdicion.VISUALIZAR);
        if (ID == 0) {
            setFormData({ FORM_ADD: true })
        }
        else {
            const fetchData = async () => {
                const response = await fetch(`/api/entidad/empresa/${ID}`);
                const data: EmpresaModel = await response.json();
                setFormData({ FORM_DATA: data });
            }
            fetchData().catch(console.error);
        }
        setIsLoading(false)
    }, [ID])

    const handleChange = (event: any) => {
        const isCheckbox = event.target.type === 'checkbox';
        if (event.target.name == "id_anexo") {
            const item = listaAnexo?.filter(x => x.id == event.target.value);
            if (item && item[0]) {
                setFormData({ name: "id_distrito", value: item[0].id_distrito })
            }
        }
        setFormData({
            name: event.target.name,
            value: isCheckbox ? event.target.checked : event.target.value,
        });
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);
        const dataEnvio = JSON.stringify(formData);
        const response = await fetch('/api/entidad/empresa', {
            body: dataEnvio,
            headers: { 'Content-Type': 'application/json', },
            method: tipoEdicion == EnumTipoEdicion.EDITAR ? "PUT" : tipoEdicion == EnumTipoEdicion.ELIMINAR ? "DELETE" : "POST"
        })

        const result: EmpresaModel = await response.json()
        if (tipoEdicion == EnumTipoEdicion.AGREGAR) setID(result.id);
        setIsSubmitting(false);
        setOpen(false);
        if (tipoEdicion == EnumTipoEdicion.ELIMINAR) setID(-1);
        setTipoEdicion(EnumTipoEdicion.VISUALIZAR)
        setEstadoEdicion(EnumEstadoEdicion.GUARDADO);
    }

    return (
        <>
            <nav className="flex items-start pb-1 sm:hidden" aria-label="Breadcrumb">
                <button
                    onClick={() => { setEstadoEdicion(EnumEstadoEdicion.CANCELADO); }}
                    className="hover:bg-indigo-200 rounded-sm p-2 inline-flex items-center space-x-3 text-sm font-medium text-gray-900">
                    <ChevronLeftIcon className="-ml-2 h-5 w-5 text-indigo-700" aria-hidden="true" />
                    <span>Lista de Ciudadanos</span>
                </button>
            </nav>
            <div className={isLoading ? "animate-pulse" : "" + " flex h-full flex-col  bg-white shadow-xl"}>
                <div className="divide-y divide-gray-200">
                    {/*PORTADA*/}
                    <div className="pb-6">
                        <div className="h-12 bg-indigo-700 rounded-md" />
                        <div className="-mt-8 flex items-end px-6">
                            {/*CABECERA*/}
                            <div className="ml-6 flex-1">
                                <div className="-mt-2">
                                    <h3 className="font-bold text-white text-2xl">{formData.razon_social ? formData.razon_social + " RUC:" + formData.numero_ruc : "..."}</h3>
                                </div>
                                {/*AREA DE EDICIÓN*/}
                                <div className="w-0 flex-1 pt-2">
                                    <div className="mt-2 flex">
                                        <a href={`tel:${'+51' + formData.celular}`}>
                                            <button type="button" disabled={tipoEdicion != EnumTipoEdicion.VISUALIZAR}

                                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md 
                                            text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                            disabled:bg-blue-300"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                                                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                Llamar
                                            </button>
                                        </a>
                                        <a href={`https://wa.me/51` + formData.celular}>
                                            <button type="button" disabled={tipoEdicion != EnumTipoEdicion.VISUALIZAR}
                                                className="ml-3 inline-flex items-center px-3 py-2 border 
                                            border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                                            disabled:bg-green-300"
                                            >
                                                <svg className="w-4 h-4 text-white fill-current mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                                                </svg>
                                                Mensaje
                                            </button>
                                        </a>
                                        <AxBtnEditar tipoEdicion={tipoEdicion} setTipoEdicion={setTipoEdicion} setEstadoEdicion={setEstadoEdicion} />
                                        <AxBtnEliminar tipoEdicion={tipoEdicion} setTipoEdicion={setTipoEdicion} setEstadoEdicion={setEstadoEdicion} setOpen={setOpen} />
                                    </div>
                                    <Transition.Root show={open} as={Fragment}>
                                        <Dialog as="div" className="relative z-10" onClose={setOpen}>
                                            <AxModalEliminar setOpen={setOpen} setTipoEdicion={setTipoEdicion} formData={formData.numero_ruc} isSubmitting={isSubmitting} handleSubmit={handleSubmit} nombreModal="Personas" />
                                        </Dialog>
                                    </Transition.Root>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*FORMULARIO*/}
                    <div className="px-0 py-0">
                        <div className="p-4 md:p-6">
                            <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
                                <fieldset disabled={tipoEdicion == EnumTipoEdicion.VISUALIZAR} className="space-y-8 divide-y divide-gray-200">
                                    <div className="">
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Información Personal </h3>
                                        </div>
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">
                                            <div className="md:col-span-4">
                                                <AxInput name="razon_social" required={true} label="Razón Social" value={formData.razon_social} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput name="numero_ruc" required={true} label="Numero RUC" value={formData.numero_ruc} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxSelect name="id_anexo" required={true} value={formData.id_anexo} label="Anexo" handleChange={handleChange}>
                                                    {listaAnexo && listaAnexo.map((anexo: any) => <option key={anexo.id} value={anexo.id}>{anexo.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxSelect name="id_distrito" required={true} value={formData.id_distrito} label="Distrito" handleChange={handleChange}>
                                                    {listaDistrito && listaDistrito.map((distrito: any) => <option key={distrito.id} value={distrito.id}>{distrito.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-4">
                                                <AxInput name="email" required={true} label="Correo Electronico" value={formData.email} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput name="celular" required={true} label="Celular" value={formData.celular} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-6">
                                                <AxInput name="direccion" required={true} label="Direccion" value={formData.direccion} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-6">
                                                <div className="pt-8">
                                                    <div>
                                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Condiciones</h3>
                                                    </div>
                                                    <div className="mt-6">
                                                        <fieldset>
                                                            <div className="text-base font-medium text-gray-900" aria-hidden="true">
                                                                Estado
                                                            </div>
                                                            <div className="mt-4 space-y-4">
                                                                <AxCheck id="estado" name="estado" value={formData.estado} label="¿Es Activo?" handleChange={handleChange} />
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                {
                                    tipoEdicion != EnumTipoEdicion.VISUALIZAR &&
                                    <div className="pt-5">
                                        <div className="flex justify-end">
                                            <AxBtnCancelar tipoEdicion={tipoEdicion} setEstadoEdicion={setEstadoEdicion} setTipoEdicion={setTipoEdicion} setID={setID} />
                                            <AxSubmit loading={isSubmitting} />
                                        </div>
                                    </div>
                                }
                            </form >
                        </div >
                    </div>
                </div>
            </div>
        </>
    )
}
