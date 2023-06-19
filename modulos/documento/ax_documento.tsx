import { useEffect, useReducer, useState } from "react";
import useSWRImmutable from "swr/immutable"
import useSWR from "swr"
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { default as dayjs } from 'dayjs';
import * as uuid from 'uuid'
import { AxInput, AxSelect, AxSubmit, AxCheck, AxBtnModalCancelar } from 'components/form'
import { EnumTipoEdicion, EnumEstadoEdicion, TypeFormularioProps } from 'lib/edicion'
import DocumentoModel from 'models/documento_model'
import supabase from "lib/supabase_config";
import TipoDocumentoModel from "models/tipo_documento_model";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
// import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage'
// import db from "lib/firebase-config";
// db.app
export const getServerSideProps = withPageAuthRequired();
const fetcherEmpleado = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherPersona = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherEmpresa = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherDocumento = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const formReducer = (state: DocumentoModel, event: any): DocumentoModel => {
    if (event.FORM_DATA) {
        return { ...event.FORM_DATA }
    }
    if (event.FORM_ADD) {
        return new DocumentoModel()
    }
    return { ...state, [event.name]: event.value }
}

export default function AxDocumento({ ID, setID, setEstadoEdicion, tipoEdicion, setOpen }: any) {
    const { user, error, isLoading: isLoadingUser } = useUser();
    const { data: listaEmpleado } = useSWR<any[]>('/api/entidad/empleado/v_empleado', fetcherEmpleado);
    const { data: listaPersona } = useSWR('/api/entidad/persona/v_persona', fetcherPersona);
    const { data: listaEmpresa } = useSWR('/api/entidad/empresa', fetcherEmpresa);
    const { data: listaTipoDocumento } = useSWR<TipoDocumentoModel[]>('/api/documento/tipo_documento', fetcherDocumento);
    const [formData, setFormData] = useReducer(formReducer, new DocumentoModel());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imagenupload, setImagen] = useState(null);
    const [clic, setclic] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [urlArchivo, setUrlArchivo] = useState("")
    // const storage = getStorage();
    const [listaimage, setListaimage] = useState<Array<any>>([]);
    useEffect(() => {
        setIsLoading(true)
        if (ID == 0) {
            setFormData({ FORM_ADD: true })
        }
        else {
            const fetchData = async () => {
                const response = await fetch(`/api/documento/documento/${ID}`);
                const data: DocumentoModel = await response.json();
                data.fecha_creacion = dayjs(data.fecha_creacion).format("YYYY-MM-DD")
                data.fecha_documento = dayjs(data.fecha_documento).format("YYYY-MM-DD")
                setFormData({ FORM_DATA: data });
                setFormData({ FORM_DATA: data });
            }
            fetchData().catch(console.error);
        }
        setIsLoading(false)
    }, [ID])

    useEffect(() => {
        if (ID == 0) {
            const empleado = listaEmpleado?.filter(x => x.email == user?.email);
            if (empleado && empleado[0]) {
                setFormData({ name: "id_empleado", value: empleado[0].id })
            }
        }
    }, [listaEmpleado])

    const changeImagen = (e: any) => {
        setImagen(e.target.files[0]);

    }
    const uploadimage = () => {
        // if (imagenupload == null) return;
        // const imageRef = ref(storage, `archivodocumento/${setImagen.name + uuid.v4()}`)
        // uploadBytes(imageRef, imagenupload).then((snapshot) => {
        //     alert('Uploaded a blob or file!');
        //     getDownloadURL(snapshot.ref).then((url) => {
        //         setListaimage((prev) => [...prev, url]);
        //         console.log(url)
        //         formData.url_archivo = (url)
        //     })
        // });
        // return;
    }

    const handleChange = (event: any) => {
        const isCheckbox = event.target.type === 'checkbox';
        setFormData({
            name: event.target.name,
            value: isCheckbox ? event.target.checked : event.target.value,
        })
        if (event.target.name == "id_tipo_documento" || event.target.name == "fecha_documento") {

        }
    }

    useEffect(() => {    
        if (formData.fecha_documento != "" && formData.fecha_documento.length == 10) {
            const tipoDocumento = listaTipoDocumento?.find(item => item.id == formData.id_tipo_documento);
            if (tipoDocumento) {
                console.log(tipoDocumento.codigo+ " " + formData.fecha_documento);
                const fetchData = async () => {
                    const response = await fetch(`/api/documento/documento/fn_documento_numero?codigo=${tipoDocumento.codigo}&year=${formData.fecha_documento.substring(0, 4)}`);
                    const numero: string = await response.json();
                    setFormData({ name: "numero_documento", value: numero })
                }
                fetchData().catch(console.error);
            }
        }
    }, [formData.fecha_documento, formData.id_tipo_documento])

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);
        const dataEnvio = JSON.stringify(formData);
        const response = await fetch('/api/documento/documento', {
            body: dataEnvio,
            headers: { 'Content-Type': 'application/json', },
            method: tipoEdicion == EnumTipoEdicion.EDITAR ? "PUT" : tipoEdicion == EnumTipoEdicion.ELIMINAR ? "DELETE" : "POST"
        })
        const result: DocumentoModel = await response.json()
        if (tipoEdicion == EnumTipoEdicion.AGREGAR) setID(result.id);
        setIsSubmitting(false);
        if (tipoEdicion == EnumTipoEdicion.ELIMINAR) setID(-1);
        setEstadoEdicion(EnumEstadoEdicion.GUARDADO);
    }
    async function FndescargarImg() {
        try {

            if (formData.url_archivo) {

                const { signedURL, error } = await supabase.storage.from('archivo-documento').createSignedUrl(formData.url_archivo, 60)
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

            let { error: uploadError } = await supabase.storage.from('archivo-documento').upload(filePath, file)
            if (uploadError) {
                throw uploadError
            }
            setFormData({ name: 'url_archivo', value: fileName })
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }
    return (
        <>
            <div className={isLoading ? "animate-pulse" : "" + " flex h-full flex-col  bg-white shadow-xl "}>
                <div className="divide-y divide-gray-200">
                    {/*PORTADA*/}
                    <div className="h-1 mt-1 bg-indigo-700 rounded-sm" />
                    {/*FORMULARIO*/}
                    <div className="px-0 py-0 m-2 ">
                        <div className="p-4 md:p-2">
                            <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
                                <fieldset disabled={tipoEdicion == EnumTipoEdicion.VISUALIZAR} className="space-y-8 divide-y divide-gray-200">
                                    <div className="">
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Información </h3>
                                        </div>
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">
                                            <div className="md:col-span-2">
                                                <AxSelect required={true} name="id_tipo_documento" value={formData.id_tipo_documento} label="Tipo Documento" handleChange={handleChange}>
                                                    {listaTipoDocumento && listaTipoDocumento.map((documento: any) => <option key={documento.id} value={documento.id}>{documento.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput required={true} name="fecha_documento" label="Fecha Documento" value={formData.fecha_documento} handleChange={handleChange} type="date" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput required={true} name="numero_documento" label="Nro Documento" value={formData.numero_documento} handleChange={handleChange} disabled={true} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxSelect required={true} name="tipo_entidad" value={formData.tipo_entidad} label="Tipo Entidad" handleChange={handleChange}>
                                                    <option key="NATURAL" value="NATURAL">NATURAL</option>
                                                    <option key="JURIDICO" value="JURIDICO">JURIDICO</option>
                                                </AxSelect>
                                            </div>
                                            {
                                                formData.tipo_entidad == "NATURAL"
                                                    ? <div className="md:col-span-3">
                                                        <AxSelect required={true} name="id_persona" value={formData.id_persona} label="Persona" handleChange={handleChange}>
                                                            {listaPersona && listaPersona.map((persona: any) => <option key={persona.id} value={persona.id}>{persona.nombre_apellido}</option>)}
                                                        </AxSelect>
                                                    </div>
                                                    : <div className="md:col-span-3">
                                                        <AxSelect required={true} name="id_empresa" value={formData.id_empresa} label="Empresa" handleChange={handleChange}>
                                                            {listaEmpresa && listaEmpresa.map((empresa: any) => <option key={empresa.id} value={empresa.id}>{empresa.razon_social}</option>)}
                                                        </AxSelect>
                                                    </div>
                                            }
                                            <div className="md:col-span-1">
                                                <AxInput required={true} name="fecha_creacion" label="Fecha Registro" value={formData.fecha_creacion} handleChange={handleChange} disabled type="date" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxSelect required={true} name="id_empleado" value={formData.id_empleado} label="Empleado" handleChange={handleChange} disabled={true}>
                                                    {listaEmpleado && listaEmpleado.map((item: any) => <option key={item.id} value={item.id}>{item.nombre_apellido}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-4">
                                                <AxInput required={true} name="observacion" label="Observacion" value={formData.observacion} handleChange={handleChange} type="text" />
                                            </div>
                                            <div className="md:col-span-5">
                                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                                    <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                        Adjuntar formato
                                                    </label>

                                                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                                                        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300">
                                                            <div className="space-y-1 text-center">
                                                                <div>
                                                                    <div style={{ width: 100 }}>
                                                                        {formData.url_archivo ?
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
                                            <div className="md:col-span-1">
                                                <div className=" sm:border-t sm:border-gray-200 sm:pt-5">
                                                    {formData.url_archivo ?
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
                                                </div>
                                            </div>
                                            <div className="md:col-span-6">
                                                {clic == true &&
                                                    <div className="bg-white">
                                                        {urlArchivo ? (
                                                            <div className="">
                                                                <ul role="list" className="content-start sm:grid sm:grid-cols-1 sm:gap-x-1 sm:gap-y-1 sm:space-y-0 lg:grid-cols-1 lg:gap-x-1">
                                                                    <li key={urlArchivo}>
                                                                        <img className="lg:ml-20 md:ml:2 object-cover shadow-lg rounded-lg" src={urlArchivo} alt="" />
                                                                    </li>
                                                                </ul>
                                                            </div>)
                                                            : (
                                                                <div className="archivo-requisito no-image" style={{ height: 100, width: 100 }} />
                                                            )}

                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <fieldset disabled={tipoEdicion == EnumTipoEdicion.AGREGAR}>
                                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">
                                            <div className="md:col-span-6">
                                                <label className="mt-2">Anulación de documento </label>
                                            </div>
                                            <div className="md:col-span-1" />
                                            <div className="md:col-span-1">
                                                <AxCheck id="es_anulado" name="es_anulado" value={formData.es_anulado} label="¿Es Anulado?" handleChange={handleChange} />
                                            </div>
                                            {/* <div className="md:col-span-1">
                                                <AxInput name="fecha_anulacion" label="Fecha Anulación" value={formData.fecha_anulacion} handleChange={handleChange} type="date" />
                                            </div> */}
                                            <div className="md:col-span-4">
                                                <AxInput name="motivo_anulacion" label="Motivo" value={formData.motivo_anulacion} handleChange={handleChange} type="text" />
                                            </div>
                                        </div>
                                    </fieldset>
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
                </div>
            </div >
        </>
    )
}
