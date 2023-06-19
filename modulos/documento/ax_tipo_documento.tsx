import { Fragment, useEffect, useReducer, useState } from "react";
import useSWRImmutable from "swr/immutable"
import useSWR from "swr"
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Dialog, Transition } from "@headlessui/react";
import { AxBtnCancelar, AxBtnEditar, AxInput, AxBtnEliminar, AxSelect, AxSubmit, AxModalEliminar, AxSelectMultiple } from 'components/form'
import { EnumTipoEdicion, EnumEstadoEdicion, TypeFormularioProps } from 'lib/edicion'
import TipoDocumentoModel from 'models/tipo_documento_model'
import { ChevronLeftIcon } from "@heroicons/react/outline";


export const getServerSideProps = withPageAuthRequired();
const fetcherGrupo = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const fetcherTipoDocumento = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const fetcherRequisito = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const fetcherConsideracion = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const formReducer = (state: TipoDocumentoModel, event: any): TipoDocumentoModel => {
    if (event.FORM_DATA) {
        return { ...event.FORM_DATA }
    }
    if (event.FORM_ADD) {
        return new TipoDocumentoModel()
    }
    return { ...state, [event.name]: event.value }
}

export default function AxTipoDocumento({ ID, setID, setEstadoEdicion }: TypeFormularioProps) {
    const { data: listaGrupo } = useSWR('/api/administracion/grupo', fetcherGrupo);
    const { data: listaTipoDocumento } = useSWR('/api/documento/tipo_documento', fetcherTipoDocumento);
    const { data: listaRequisito } = useSWR('/api/documento/requisito', fetcherRequisito);
    const { data: listaConsideracion } = useSWR('/api/documento/consideracion', fetcherConsideracion);
    const [formData, setFormData] = useReducer(formReducer, new TipoDocumentoModel());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tipoEdicion, setTipoEdicion] = useState(EnumTipoEdicion.VISUALIZAR)
    const [open, setOpen] = useState(false)
    const fecha = new Date()
    useEffect(() => {
        setIsLoading(true)
        setTipoEdicion(ID == 0 ? EnumTipoEdicion.AGREGAR : EnumTipoEdicion.VISUALIZAR);
        if (ID == 0) {
            setFormData({ FORM_ADD: true })
        }
        else {
            const fetchData = async () => {
                const response = await fetch(`/api/documento/tipo_documento/${ID}`);
                const data: TipoDocumentoModel = await response.json();
                setFormData({ FORM_DATA: data });
            }
            fetchData().catch(console.error);
        }
        setIsLoading(false)
    }, [ID])

    const handleChange = (event: any) => {
        const isCheckbox = event.target.type === 'checkbox';
        if (event.target.name == "tipo_documento_consideracion") {
            const indexAnterior = formData.tipo_documento_consideracion.indexOf(parseInt(event.target.value));
            if (indexAnterior != -1) formData.tipo_documento_consideracion.splice(indexAnterior, 1);
            else formData.tipo_documento_consideracion.push(parseInt(event.target.value));
            setFormData({
                name: event.target.name,
                value: [...formData.tipo_documento_consideracion]
            })
        }
        else if (event.target.name == "tipo_documento_requisito") {
            const indexAnterior = formData.tipo_documento_requisito.indexOf(parseInt(event.target.value));
            if (indexAnterior != -1) formData.tipo_documento_requisito.splice(indexAnterior, 1);
            else formData.tipo_documento_requisito.push(parseInt(event.target.value));
            setFormData({
                name: event.target.name,
                value: [...formData.tipo_documento_requisito]
            })
        }
        else {
            setFormData({
                name: event.target.name,
                value: isCheckbox ? event.target.checked : event.target.value,
            })
        }
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);
        const dataEnvio = JSON.stringify(formData);
        const response = await fetch('/api/documento/tipo_documento', {
            body: dataEnvio,
            headers: { 'Content-Type': 'application/json', },
            method: tipoEdicion == EnumTipoEdicion.EDITAR ? "PUT" : tipoEdicion == EnumTipoEdicion.ELIMINAR ? "DELETE" : "POST"
        })

        const result: any = await response.json()
        if (tipoEdicion == EnumTipoEdicion.AGREGAR) setID(result[0].id);
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
                    <span>Lista de Documentos</span>
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
                                    <h3 className="font-bold text-white text-2xl">{formData.nombre ? formData.nombre : "..."}</h3>
                                </div>
                                {/*AREA DE EDICIÓN*/}
                                <div className="w-0 flex-1 pt-2">
                                    <div className="mt-2 flex">
                                        <AxBtnEditar tipoEdicion={tipoEdicion} setTipoEdicion={setTipoEdicion} setEstadoEdicion={setEstadoEdicion} />
                                        <AxBtnEliminar tipoEdicion={tipoEdicion} setTipoEdicion={setTipoEdicion} setEstadoEdicion={setEstadoEdicion} setOpen={setOpen} />
                                    </div>
                                    <Transition.Root show={open} as={Fragment}>
                                        <Dialog as="div" className="relative z-10" onClose={setOpen}>
                                            <AxModalEliminar setOpen={setOpen} setTipoEdicion={setTipoEdicion} formData={formData.nombre} isSubmitting={isSubmitting} handleSubmit={handleSubmit} nombreModal="Tipo de Documento" />
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
                                            <div className="md:col-span-3">
                                                <AxInput required={true} name="codigo" placeholder="codigo de 6 digitos" label="Código" value={formData.codigo} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxInput required={true} name="nombre" label="Nombre" value={formData.nombre} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxInput required={true} name="descripcion" label="Descripción" value={formData.descripcion} handleChange={handleChange} type="text" />
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxInput required={true} name="tiempo_entrega" label="Tiempo Entrega" value={formData.tiempo_entrega} handleChange={handleChange} type="number" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput required={true} name="costo" label="Costo S/" value={formData.costo} handleChange={handleChange} placeholder="0.00" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxSelect required={true} name="forma_entrega" value={formData.forma_entrega} label="Forma Entrega" handleChange={handleChange}>
                                                    <option>DIRECTO</option>
                                                    <option>IMPRESO</option>
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxSelect required={true} name="id_grupo" value={formData.id_grupo} label="Grupo" handleChange={handleChange}>
                                                    {listaGrupo && listaGrupo.map((grupo: any) => <option key={grupo.id} value={grupo.id}>{grupo.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxSelectMultiple name="tipo_documento_consideracion" value={formData.tipo_documento_consideracion} label="Consideraciones" handleChange={handleChange}>
                                                    {listaConsideracion && listaConsideracion.map((consideracion: any) => <option key={consideracion.id} value={consideracion.id}>{consideracion.nombre}</option>)}
                                                </AxSelectMultiple>
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxSelectMultiple name="tipo_documento_requisito" value={formData.tipo_documento_requisito} label="Requisitos" handleChange={handleChange}>
                                                    {listaRequisito && listaRequisito.map((requisito: any) => <option key={requisito.id} value={requisito.id}>{requisito.nombre}</option>)}
                                                </AxSelectMultiple>
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
