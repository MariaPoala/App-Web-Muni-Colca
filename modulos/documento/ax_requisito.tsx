import { useEffect, useReducer, useState, Fragment } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Dialog, Transition } from "@headlessui/react";
import { AxInput, AxModalEliminar, AxSubmit, AxBtnEliminar, AxBtnEditar, AxBtnCancelar } from 'components/form'
import { EnumTipoEdicion, EnumEstadoEdicion, TypeFormularioProps } from 'lib/edicion'
import { ChevronLeftIcon, EyeIcon, EyeOffIcon, PlusCircleIcon } from "@heroicons/react/outline"

import * as uuid from 'uuid'
// import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage'
import RequisitoModel from 'models/requisito_model'
// import db from "lib/firebase-config";
// db.app
export const getServerSideProps = withPageAuthRequired();
import supabase from "lib/supabase_config";
import { async } from "@firebase/util";


const formReducer = (state: RequisitoModel, event: any): RequisitoModel => {
    if (event.FORM_DATA) {
        return { ...event.FORM_DATA }
    }
    if (event.FORM_ADD) {
        return new RequisitoModel()
    }
    return { ...state, [event.name]: event.value }
}

export default function AxGrupo({ ID, setID, setEstadoEdicion }: TypeFormularioProps) {
    const [formData, setFormData] = useReducer(formReducer, new RequisitoModel());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tipoEdicion, setTipoEdicion] = useState(EnumTipoEdicion.VISUALIZAR)
    const [open, setOpen] = useState(false)
    const [clicVisualizarArchivo, setClicVisualizarArchivo] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [urlArchivo, setUrlArchivo] = useState("")


    useEffect(() => {
        setIsLoading(true)
        setClicVisualizarArchivo(false)
        setTipoEdicion(ID == 0 ? EnumTipoEdicion.AGREGAR : EnumTipoEdicion.VISUALIZAR);
        if (ID == 0) {
            setFormData({ FORM_ADD: true })
        }
        else {
            const fetchData = async () => {
                const response = await fetch(`/api/documento/requisito/${ID}`);
                const data: RequisitoModel = await response.json();
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
        const response = await fetch('/api/documento/requisito', {
            body: dataEnvio,
            headers: { 'Content-Type': 'application/json', },
            method: tipoEdicion == EnumTipoEdicion.EDITAR ? "PUT" : tipoEdicion == EnumTipoEdicion.ELIMINAR ? "DELETE" : "POST"
        })

        const result: RequisitoModel = await response.json()
        if (tipoEdicion == EnumTipoEdicion.AGREGAR) setID(result.id);
        setIsSubmitting(false);
        setOpen(false);
        if (tipoEdicion == EnumTipoEdicion.ELIMINAR) setID(-1);
        setTipoEdicion(EnumTipoEdicion.VISUALIZAR)
        setEstadoEdicion(EnumEstadoEdicion.GUARDADO);
    }

    async function FndescargarImg() {
        try {

            if (formData.url_imagen) {

                const { signedURL, error } = await supabase.storage.from('archivo-requisito').createSignedUrl(formData.url_imagen, 60)
                if (error) {
                    throw error
                }
                if (signedURL) {
                    setUrlArchivo(signedURL)
                }
            }
        } catch (error: any) {
            console.log('Error downloading image: ', error.message)
        }
    }


    async function subirArchivo(event: any) {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }
            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            let { error: uploadError } = await supabase.storage.from('archivo-requisito').upload(filePath, file)
            if (uploadError) {
                throw uploadError
            }
            setFormData({ name: 'url_imagen', value: fileName })
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <>
            <nav className="flex items-start pb-1 sm:hidden" aria-label="Breadcrumb">
                <button
                    onClick={() => { setEstadoEdicion(EnumEstadoEdicion.CANCELADO); }}
                    className="hover:bg-indigo-200 rounded-sm p-2 inline-flex items-center space-x-3 text-sm font-medium text-gray-900">
                    <ChevronLeftIcon className="-ml-2 h-5 w-5 text-indigo-700" aria-hidden="true" />
                    <span>Lista de Requisitos</span>
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
                                            <AxModalEliminar setOpen={setOpen} setTipoEdicion={setTipoEdicion} formData={formData.nombre} isSubmitting={isSubmitting} handleSubmit={handleSubmit} nombreModal="Grupo" />
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
                                            <div className="md:col-span-2">
                                                <AxInput required={true} name="nombre" label="Nombre" value={formData.nombre} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-4">
                                                <AxInput required={true} name="descripcion" label="Descripcion" value={formData.descripcion} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-5">
                                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                                    <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                        Adjuntar formato de Ejemplo
                                                    </label>

                                                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                                                        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300">
                                                            <div className="space-y-1 text-center">
                                                                <div>
                                                                    <div style={{ width: 100 }}>
                                                                        {formData.url_imagen ?
                                                                            <label className="button primary block" htmlFor="single">
                                                                                {uploading ? 'Actualizando archivo ...' : 'Actualizar Archivo'}
                                                                            </label> :
                                                                            <label className="button primary block" htmlFor="single">
                                                                                {uploading ? 'Subiendo archivo ...' : 'Subir Archivo'}
                                                                            </label>
                                                                        }
                                                                        <p className="text-xs text-gray-500">Jpg, Png, Img</p>
                                                                        <input
                                                                            style={{
                                                                                visibility: 'hidden',
                                                                                position: 'absolute',
                                                                            }}
                                                                            type="file"
                                                                            id="single"
                                                                            accept="image/*"
                                                                            onChange={subirArchivo}
                                                                            disabled={uploading}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <legend>
                                                <div className="md:col-span-1">
                                                    <div className=" sm:border-t sm:border-gray-200 sm:pt-5">
                                                        {formData.url_imagen ?
                                                            <i className="ml-3 cursor-pointer h-2 text-xs w-36 inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm  leading-4 font-sm rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500    "
                                                                onClick={() => {
                                                                    FndescargarImg()
                                                                    setClicVisualizarArchivo(!clicVisualizarArchivo)
                                                                }}
                                                            >
                                                                {clicVisualizarArchivo == false
                                                                    ? <><EyeIcon className="h-5 w-5 mr-1 text-white "> </EyeIcon>Visualizar Archivo</>
                                                                    : <><EyeOffIcon className="h-5 w-5 mr-1 text-white "></EyeOffIcon>Ocultar Archivo</>}
                                                            </i>
                                                            : <p className="ml-3 h-2 text-md w-32 inline-flex items-center text-center px-3 py-2 border border-red-300 shadow-sm  leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500     disabled:bg-red-300">Sin Archivo</p>
                                                        }
                                                    </div>
                                                </div>
                                            </legend>
                                            <div className="md:col-span-6">
                                                {clicVisualizarArchivo == true &&
                                                    <div className="bg-white">
                                                        {urlArchivo ? (
                                                            <div className="">
                                                                <ul role="list" className="content-start sm:grid sm:grid-cols-1 sm:gap-x-1 sm:gap-y-1 sm:space-y-0 lg:grid-cols-1 lg:gap-x-1">
                                                                    <li key={urlArchivo}>
                                                                        <img className="lg:ml-20 md:ml:2 object-cover shadow-lg rounded-lg" src={urlArchivo} alt="" />
                                                                    </li>
                                                                </ul>
                                                            </div>)
                                                            :
                                                            (
                                                                <div className="archivo-requisito no-image" style={{ height: 100, width: 100 }} />
                                                            )}

                                                    </div>
                                                }
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


