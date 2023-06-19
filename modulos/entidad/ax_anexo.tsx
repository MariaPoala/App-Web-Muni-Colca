import { useEffect, useReducer, useState, Fragment } from "react";
import useSWRImmutable from "swr/immutable"
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/outline"
import { AxInput, AxModalEliminar, AxSubmit, AxBtnEliminar, AxBtnEditar, AxBtnCancelar, AxSelect } from 'components/form'
import { EnumTipoEdicion, EnumEstadoEdicion, TypeFormularioProps } from 'lib/edicion'
import AnexoModel from 'models/anexo_model'

export const getServerSideProps = withPageAuthRequired();

const fetcherDistrito = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const formReducer = (state: AnexoModel, event: any): AnexoModel => {
    if (event.FORM_DATA) {
        return { ...event.FORM_DATA }
    }
    if (event.FORM_ADD) {
        return new AnexoModel()
    }
    return { ...state, [event.name]: event.value }
}

export default function AxDistrito({ ID, setID, setEstadoEdicion }: TypeFormularioProps) {
    const [formData, setFormData] = useReducer(formReducer, new AnexoModel());
    const { data: listaDistrito } = useSWRImmutable('/api/entidad/distrito', fetcherDistrito);
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
                const response = await fetch(`/api/entidad/anexo/${ID}`);
                const data: AnexoModel = await response.json();
                setFormData({ FORM_DATA: data });
            }
            fetchData().catch(console.error);
        }
        setIsLoading(false)
    }, [ID])

    const handleChange = (event: any) => {
        const isCheckbox = event.target.type === 'checkbox';
        setFormData({
            name: event.target.name,
            value: isCheckbox ? event.target.checked : event.target.value,
        });
    }
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);
        const dataEnvio = JSON.stringify(formData);
        const response = await fetch('/api/entidad/anexo', {
            body: dataEnvio,
            headers: { 'Content-Type': 'application/json', },
            method: tipoEdicion == EnumTipoEdicion.EDITAR ? "PUT" : tipoEdicion == EnumTipoEdicion.ELIMINAR ? "DELETE" : "POST"
        })

        const result: AnexoModel = await response.json()
        if (tipoEdicion == EnumTipoEdicion.AGREGAR) setID(result.id);
        if (tipoEdicion == EnumTipoEdicion.ELIMINAR) setID(-1);
        setIsSubmitting(false);
        setOpen(false);
        setTipoEdicion(EnumTipoEdicion.VISUALIZAR);
        setEstadoEdicion(EnumEstadoEdicion.GUARDADO);
    }
    return (
        <>
            <nav className="flex items-start pb-1 sm:hidden" aria-label="Breadcrumb">
                <button
                    onClick={() => { setEstadoEdicion(EnumEstadoEdicion.CANCELADO); }}
                    className="hover:bg-indigo-200 rounded-sm p-2 inline-flex items-center space-x-3 text-sm font-medium text-gray-900">
                    <ChevronLeftIcon className="-ml-2 h-5 w-5 text-indigo-700" aria-hidden="true" />
                    <span>Lista de Anexo</span>
                </button>
            </nav>
            <div className={isLoading ? "animate-pulse" : "" + " flex h-full flex-col  bg-white shadow-xl"}>
                <div className="divide-y divide-gray-200">
                    {/*PORTADA*/}
                    <div className="pb-6">
                        <div className="h-12 bg-indigo-700 rounded-md">
                        </div>
                        <div className="-mt-8 flex items-end px-6">
                            {/*CABECERA*/}
                            <div className="ml-6 flex-1">
                                <div className="-mt-2">
                                    <h3 className="font-bold text-white text-2xl">{formData.nombre ? formData.nombre : "..."}  </h3>
                                </div>
                                {/*AREA DE EDICIÓN*/}
                                <div className="w-0 flex-1 pt-2">
                                    <div className="mt-2 flex">
                                        <AxBtnEditar tipoEdicion={tipoEdicion} setTipoEdicion={setTipoEdicion} setEstadoEdicion={setEstadoEdicion} />
                                        <AxBtnEliminar tipoEdicion={tipoEdicion} setTipoEdicion={setTipoEdicion} setEstadoEdicion={setEstadoEdicion} setOpen={setOpen} />
                                    </div>
                                    <Transition.Root show={open} as={Fragment}>
                                        <Dialog as="div" className="relative z-10" onClose={setOpen}>
                                            <AxModalEliminar setOpen={setOpen} setTipoEdicion={setTipoEdicion} formData={formData.nombre} isSubmitting={isSubmitting} handleSubmit={handleSubmit} nombreModal="Anexo" />
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
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Datos </h3>
                                        </div>
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">
                                            <div className="md:col-span-3">
                                                <AxInput name="nombre" required={true} label="Nombre" value={formData.nombre} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxSelect name="id_distrito" required={true} value={formData.id_distrito} label="Distrito" handleChange={handleChange}>
                                                    {listaDistrito && listaDistrito.map((item: any) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-6">
                                                <AxInput name="descripcion" required={true} label="Descripcion" value={formData.descripcion} handleChange={handleChange} />
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


