import { useEffect, useReducer, useState } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AxInput, AxSelect, AxSubmit, AxCheck, AxBtnModalCancelar, AxRadio } from 'components/form'
import { EnumTipoEdicion, EnumEstadoEdicion, TypeFormularioProps } from 'lib/edicion'
import SolicitudModel from 'models/solicitud_model'
import DocumentoModel from "models/documento_model";
import supabase from "lib/supabase_config";
import { EyeIcon, EyeOffIcon, DownloadIcon } from "@heroicons/react/outline";
export const getServerSideProps = withPageAuthRequired()

const formReducer = (state: SolicitudModel, event: any): SolicitudModel => {
    if (event.FORM_DATA) {
        return { ...event.FORM_DATA }
    }
    if (event.FORM_ADD) {
        return new SolicitudModel()
    }
    return { ...state, [event.name]: event.value }
}

export default function AxSolicitudArchivo({ ID, setID, setEstadoEdicion, tipoEdicion }: any) {
    const [formData, setFormData] = useReducer(formReducer, new SolicitudModel());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownload, setIsDownload] = useState(true);
    const [clic, setclic] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [urlArchivo, setUrlArchivo] = useState("")

    useEffect(() => {
        setIsLoading(true)
        setclic(true)
        const fetchData = async () => {
            const response = await fetch(`/api/documento/solicitud/${ID}`);
            const data: SolicitudModel = await response.json();
            setFormData({ FORM_DATA: data });
        }
        fetchData().catch(console.error);
        setIsLoading(false)
    }, [ID])

    useEffect(() => {
        FndescargarImg()
    }, [formData.url_archivo_solicitud])


    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);
        const dataEnvio = JSON.stringify(formData);
        const response = await fetch('/api/documento/solicitud', {
            body: dataEnvio,
            headers: { 'Content-Type': 'application/json', },
            method: tipoEdicion == EnumTipoEdicion.EDITAR ? "PUT" : tipoEdicion == EnumTipoEdicion.ELIMINAR ? "DELETE" : "POST"
        })
        const result: SolicitudModel = await response.json()
        if (tipoEdicion == EnumTipoEdicion.AGREGAR) setID(result.id);
        setIsSubmitting(false);
        if (tipoEdicion == EnumTipoEdicion.ELIMINAR) setID(-1);
        setEstadoEdicion(EnumEstadoEdicion.GUARDADO);
    }

    async function FndescargarImg() {
        setIsDownload(true);
        try {
            if (formData.url_archivo_solicitud) {
                const { signedURL, error } = await supabase.storage.from('archivo-solicitud').createSignedUrl(formData.url_archivo_solicitud, 60)
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
        setIsDownload(false);
    }

    async function FnguardarImg() {
        setIsDownload(true);
        if (urlArchivo) {
            //PARA ABRIR EN UNA NUEVA PESTAÑA
            const wPrint = window.open(urlArchivo);
            if (wPrint) wPrint.window.print();
        }
        setIsDownload(false);
    }

    async function subirArchivo(event: any) {
        setIsDownload(true);
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }
            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`
            let { error: uploadError } = await supabase.storage.from('archivo-solicitud').upload(filePath, file)
            if (uploadError) {
                throw uploadError
            }
            setFormData({ name: 'url_archivo_solicitud', value: fileName })
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
        setIsDownload(false);
    }

    return (
        <>
            <div className={isLoading ? "animate-pulse" : "" + " flex h-full flex-col  bg-white shadow-xl "}>
                {/*PORTADA*/}
                <div className="h-1 mt-1 bg-indigo-700 rounded-sm" />
                {/*FORMULARIO*/}
                <div className="px-0 py-0  ">
                    <div className="p-4 md:p-2">
                        <form className="" onSubmit={handleSubmit}>
                            <fieldset disabled={tipoEdicion == EnumTipoEdicion.VISUALIZAR} className="">

                                <div>
                                    <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Adjuntar archivo
                                    </label>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-4">
                                    <div className="md:col-span-2 ">
                                        <div className="max-w-lg flex justify-center px-2 pt-2 pb-2 border-2 border-dashed rounded-md border-gray-300">
                                            <div className="space-y-1 text-center items-center  ">
                                                <div>
                                                    <div style={{ width: 100 }} className="">
                                                        {formData.url_archivo_solicitud ?
                                                            <label className="button primary block cursor-pointer" htmlFor="single">
                                                                {uploading ? 'Actualizando archivo ...' : 'Actualizar Archivo'}
                                                            </label> :
                                                            <label className="button primary block cursor-pointer" htmlFor="single">
                                                                {uploading ? 'Subiendo archivo ...' : 'Subir Archivo'}
                                                            </label>
                                                        }

                                                        <p className="text-xs text-gray-500">Jpg, Png, Img </p>

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
                                    {/* <div className="md:col-span-2">

                                        {formData.url_archivo_solicitud ?
                                            clic == false ?
                                                <button type="button"
                                                    className="ml-3 h-2 text-xs w-36 inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm  leading-4 font-sm rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500     disabled:bg-indigo-300"
                                                    onClick={() => {
                                                        FndescargarImg()
                                                        setclic(true)
                                                    }}
                                                >
                                                    <EyeIcon className="h-5 w-5 mr-1 text-white "> </EyeIcon>
                                                    Visualizar Archivo
                                                </button>
                                                :
                                                <button type="button"
                                                    className="ml-3 h-2 text-xs w-36 inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm  leading-4 font-sm rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500     disabled:bg-indigo-300"
                                                    onClick={() => {
                                                        FndescargarImg()
                                                        setclic(false)
                                                    }}
                                                >
                                                    <EyeOffIcon className="h-5 w-5 mr-1 text-white "></EyeOffIcon>
                                                    Ocultar Archivo
                                                </button>
                                            :
                                            <p className="ml-3 h-2 text-md w-32 inline-flex items-center text-center px-3 py-2 border border-red-300 shadow-sm  leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500     disabled:bg-red-300">Sin Archivo</p>
                                        }
                                    </div> */}
                                </div>


                                {clic == true && <button type="button"
                                    className="ml-3 mt-4 h-6 text-xs w-38 inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm  leading-4 font-sm rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500     disabled:bg-indigo-300"
                                    onClick={() => {
                                        FnguardarImg()
                                    }}
                                    disabled={isDownload}>
                                    {
                                        isDownload &&
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    }

                                    <DownloadIcon className="h-5 w-5 mr-1 text-white "> </DownloadIcon>

                                    Descargar Archivo
                                </button>}
                                <div className="md:col-span-6 mt-6">
                                    {clic == true &&
                                        <div className="bg-white">
                                            {urlArchivo ? (
                                                <div className="">
                                                    <ul role="list" className="content-start sm:grid sm:grid-cols-1 sm:gap-x-1 sm:gap-y-1 sm:space-y-0 lg:grid-cols-1 lg:gap-x-1">
                                                        <li key={urlArchivo}>
                                                            <img className=" object-cover shadow-lg rounded-lg" src={urlArchivo} alt="" />
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

                            </fieldset>
                            {tipoEdicion != EnumTipoEdicion.VISUALIZAR && <div className="pt-5">
                                <div className="flex justify-end">
                                    <AxBtnModalCancelar setEstadoEdicion={setEstadoEdicion} />
                                    <AxSubmit loading={isSubmitting} />
                                </div>
                            </div>
                            }
                        </form >
                    </div >
                </div>

            </div >
        </>
    )
}
