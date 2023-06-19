import { useEffect, useReducer, useState } from "react";
import useSWRImmutable from "swr/immutable"
import useSWR from "swr"
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { default as dayjs } from 'dayjs';
import * as uuid from 'uuid'
import { AxInput, AxSelect, AxSubmit, AxCheck, AxBtnModalCancelar, AxRadio } from 'components/form'
import { LinkIcon, CheckCircleIcon, CheckIcon } from '@heroicons/react/outline';
import { EnumTipoEdicion, EnumEstadoEdicion, TypeFormularioProps } from 'lib/edicion'
import SolicitudModel from 'models/solicitud_model'
import DocumentoModel from "models/documento_model";
import supabase from "lib/supabase_config";
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
const fetcherTipoDocumento = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherArea = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherDocumento = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherTipoDocRequisito = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherTipoDocConsideracion = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const formReducer = (state: SolicitudModel, event: any): SolicitudModel => {
    if (event.FORM_DATA) {
        return { ...event.FORM_DATA }
    }
    if (event.FORM_ADD) {
        return new SolicitudModel()
    }
    return { ...state, [event.name]: event.value }
}

export default function AxDocumento({ ID, setID, setEstadoEdicion, tipoEdicion, setOpen }: any) {
    const { user, error, isLoading: isLoadingUser } = useUser();
    const { data: listaEmpleado } = useSWR<any[]>('/api/entidad/empleado/v_empleado', fetcherEmpleado);
    const { data: listaPersona } = useSWR<any[]>('/api/entidad/persona/v_persona', fetcherPersona);
    const { data: listaTipoDocRequisito } = useSWR<any[]>('/api/documento/solicitud/v_tipo_doc_requisito', fetcherTipoDocRequisito);
    const { data: listaTipoDocConsideracion } = useSWR<any[]>('/api/documento/solicitud/v_tipo_doc_consideracion', fetcherTipoDocConsideracion);
    const { data: listaEmpresa } = useSWR('/api/entidad/empresa', fetcherEmpresa);
    const { data: listaArea } = useSWR('/api/administracion/area', fetcherArea);
    const { data: listaDocumento } = useSWR<DocumentoModel[]>('/api/documento/documento/documento_filtro', fetcherDocumento);
    const [listaDocumentoFiltrado, setListaDocumentoFiltrado] = useState<DocumentoModel[]>([])
    const { data: listaTipoDocumento } = useSWR<any[]>('/api/documento/tipo_documento', fetcherTipoDocumento);
    const [formData, setFormData] = useReducer(formReducer, new SolicitudModel());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imagenupload, setImagen] = useState(null);
    const [idTipoDoc, setIdTipoDoc] = useState(0)
    const [archivo, setArchivo] = useState("")
    const [isDownload, setIsDownload] = useState(true);
    // const storage = getStorage();
    const [listaimage, setListaimage] = useState<Array<any>>([]);
    useEffect(() => {
        setIsLoading(true)
        if (ID == 0) {
            setFormData({ FORM_ADD: true })
        }
        else {
            const fetchData = async () => {
                const response = await fetch(`/api/documento/solicitud/${ID}`);
                const data: SolicitudModel = await response.json();
                data.fecha_creacion = dayjs(data.fecha_creacion).format("YYYY-MM-DD")
                data.fecha_inicio = dayjs(data.fecha_inicio).format("YYYY-MM-DD")
                data.fecha_plazo = dayjs(data.fecha_plazo).format("YYYY-MM-DD")
                data.fecha_edicion = dayjs().format("YYYY-MM-DD")
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
                setFormData({ name: "id_area", value: empleado[0].id_area, })
            }
        }
    }, [listaEmpleado])

    useEffect(() => {
        if (ID > 0) {
            const filtrado = listaDocumento?.filter(x => x.id_persona == formData.id_persona && x.id_tipo_documento == formData.id_tipo_documento);
            if (filtrado) setListaDocumentoFiltrado(filtrado);
        }
    }, [listaDocumento, formData.id_tipo_documento, formData.id_persona])

    const handleChange = (event: any) => {
        const isCheckbox = event.target.type === 'checkbox';
        if (event.target.name == "id_tipo_documento") {
            const item = listaTipoDocumento?.filter(x => x.id == event.target.value);
            if (item && item[0]) {
                const fechaFinal = dayjs().add(item[0].tiempo_entrega, 'days').format("YYYY-MM-DD")
                setFormData({ name: "fecha_plazo", value: fechaFinal })
                setFormData({ name: "i_total", value: item[0].costo })
            }
            const filtrado = listaDocumento?.filter(x => x.id_persona == formData.id_persona && x.id_tipo_documento == event.target.value);
            if (filtrado) setListaDocumentoFiltrado(filtrado);
        }
        else if (event.target.name == "id_persona") {
            const filtrado = listaDocumento?.filter(x => x.id_persona == event.target.value && x.id_tipo_documento == formData.id_tipo_documento);
            if (filtrado) setListaDocumentoFiltrado(filtrado);
        }
        else if (event.target.name == "id_tipo_documento" || event.target.name == "fecha_documento") {

        }
        setFormData({
            name: event.target.name,
            value: isCheckbox ? event.target.checked : event.target.value,
        })
    }


    useEffect(() => {
        if (formData.fecha_creacion != "" && formData.fecha_creacion && formData.fecha_creacion.length == 10) {
            const tipoDocumento = listaTipoDocumento?.find(item => item.id == formData.id_tipo_documento);
            if (tipoDocumento) {

                console.log(tipoDocumento.codigo);
                const fetchData = async () => {
                    const response = await fetch(`/api/documento/solicitud/fn_solicitud_numero?codigo=${tipoDocumento.codigo}&year=${formData.fecha_creacion && formData.fecha_creacion.substring(0, 4)}`);
                    const numero: string = await response.json();
                    setFormData({ name: "numero_documento", value: numero })
                }
                fetchData().catch(console.error);
            }
        }
    }, [formData.fecha_creacion, formData.id_tipo_documento])

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
        console.log(archivo);


        try {
            if (archivo) {
                const { signedURL, error } = await supabase.storage.from('archivo-requisito').createSignedUrl(archivo, 60)
                if (error) {
                    throw error
                }
                if (signedURL) {
                    window.open(signedURL, "_blank")?.focus();
                }
            }
        } catch (error: any) {
            console.log('Error downloading image: ', error.message)
        }
    }
    useEffect(() => {
        FndescargarImg()
    }, [archivo])
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
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Información</h3>
                                        </div>
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-8">
                                            <div className="md:col-span-2">
                                                <AxSelect required={true} name="id_tipo_documento" value={formData.id_tipo_documento} label="Tipo Documento" handleChange={handleChange}>
                                                    {listaTipoDocumento && listaTipoDocumento.map((tipoDoc: any) => <option key={tipoDoc.id} value={tipoDoc.id}>{tipoDoc.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput required={true} name="numero_documento" label="NroDocumento" value={formData.numero_documento} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput required={true} name="fecha_inicio" label="Fecha Inicio" value={formData.fecha_inicio} handleChange={handleChange} disabled={true} type="date" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput required={true} name="fecha_plazo" label="Fecha Plazo" value={formData.fecha_plazo} handleChange={handleChange} disabled={true} type="date" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxSelect name="tipo_entidad" value={formData.tipo_entidad} label="Tipo Entidad" handleChange={handleChange}>
                                                    <option key="NATURAL" value="NATURAL">NATURAL</option>
                                                    <option key="JURIDICO" value="JURIDICO">JURIDICO</option>
                                                </AxSelect>
                                            </div>
                                            {
                                                formData.tipo_entidad == "NATURAL"
                                                    ? <div className="md:col-span-3">
                                                        <AxSelect name="id_persona" value={formData.id_persona} label="Persona" handleChange={handleChange}>
                                                            {listaPersona && listaPersona.map((persona: any) => <option key={persona.id} value={persona.id}>{persona.nombre_apellido}</option>)}
                                                        </AxSelect>
                                                    </div>
                                                    : <div className="md:col-span-3">
                                                        <AxSelect name="id_empresa" value={formData.id_empresa} label="Empresa" handleChange={handleChange}>
                                                            {listaEmpresa && listaEmpresa.map((empresa: any) => <option key={empresa.id} value={empresa.id}>{empresa.razon_social}</option>)}
                                                        </AxSelect>
                                                    </div>
                                            }

                                            <div className="md:col-span-3">
                                                <AxSelect required={true} name="id_documento" value={formData.id_documento} label="Documento" handleChange={handleChange}>
                                                    {listaDocumentoFiltrado && listaDocumentoFiltrado.map((item: any) => <option key={item.id} value={item.id}>{item.numero_documento}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-6">
                                                <AxInput required={true} name="motivo" label="Motivo" value={formData.motivo} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput required={true} name="i_total" label="Total a Pagar" value={formData.i_total} handleChange={handleChange} disabled={true} />
                                            </div>

                                            <div className="md:col-span-2">
                                                <AxSelect required={true} name="id_empleado" value={formData.id_empleado} label="Empleado" handleChange={handleChange} disabled={true}>
                                                    {listaEmpleado && listaEmpleado.map((item: any) => <option key={item.id} value={item.id}>{item.nombre_apellido}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxSelect required={true} name="id_area" value={formData.id_area} label="Area" handleChange={handleChange} disabled={true}>
                                                    {listaArea && listaArea.map((area: any) => <option key={area.id} value={area.id}>{area.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput required={true} name="fecha_creacion" label="Fecha Registro" value={formData.fecha_creacion} handleChange={handleChange} disabled type="date" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxSelect name="estado" value={formData.estado} label="Estado" handleChange={handleChange}>
                                                    <option key="REGISTRADO" value="REGISTRADO">REGISTRADO</option>
                                                    <option key="VALIDADO" value="VALIDADO">VALIDADO</option>
                                                    <option key="RECHAZADO" value="RECHAZADO">RECHAZADO</option>
                                                    <option key="FINALIZADO" value="FINALIZADO">FINALIZADO</option>
                                                    <option key="ENTREGADO" value="ENTREGADO">ENTREGADO</option>
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-8">
                                                <AxInput name="asunto" label="Observaciones" value={formData.asunto} handleChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset >
                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">
                                        <div className="md:col-span-3">
                                            <h2 className=" font-extralight">Consideraciones</h2>
                                            <ul key={"consideracion"} role="list" className="divide-y divide-gray-200">
                                                {listaTipoDocConsideracion && listaTipoDocConsideracion.filter(item => item.id_tipo_documento == formData.id_tipo_documento).map((item: any) =>
                                                    <li
                                                        key={item.nombre_consideracion}
                                                        className="relative bg-white  hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                                                    >
                                                        <div className="flex justify-between space-x-3">
                                                            <div className="min-w-0 flex-1">
                                                                <p className="mt-2 flex items-center text-sm text-gray-600  font-sans">
                                                                    <CheckIcon className="flex-shrink-0 mr-1 h-4 w-4 text-green-600" aria-hidden="true" />
                                                                    {item.nombre_consideracion}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                        <div className="md:col-span-3">
                                            <h2 className="font-extralight">Listado de requisitos</h2>
                                            <ul key={"requisito"} role="list" className="divide-y divide-gray-200">
                                                {listaTipoDocRequisito && listaTipoDocRequisito.filter(item => item.id_tipo_documento == formData.id_tipo_documento).map((item: any) =>
                                                    <li onClick={() => {
                                                        setArchivo(item.imagen)
                                                    }}
                                                        key={item.id}
                                                        className="relative bg-whitecursor-pointer  hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 "
                                                    >
                                                        <div className="flex justify-between space-x-3">
                                                            <div className="min-w-0 flex-1 cursor-pointer">
                                                                <p className="mt-2 flex items-center text-sm text-gray-500 font-sans italic">
                                                                    {item.nombre_requisito}
                                                                    <LinkIcon className="flex-shrink-0 ml-2 h-4 w-4 text-blue-500" aria-hidden="true" />
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
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
                </div>
            </div >
        </>
    )
}
