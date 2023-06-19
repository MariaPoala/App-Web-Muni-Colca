import { useEffect, useReducer, useState } from "react";
import useSWRImmutable from "swr/immutable"
import useSWR from "swr"

import { AxBtnCancelar, AxBtnEditar, AxCheck, AxInput, AxRadio, AxSelect, AxSubmit } from 'components/form'
import { EnumTipoEdicion, EnumEstadoEdicion, TypeFormularioProps } from 'lib/edicion'
import EmpleadoModel from 'models/empleado_model'
import { ChevronLeftIcon } from "@heroicons/react/outline";
// import { withPageAuthRequired } from "@auth0/nextjs-auth0";
// export const getServerSideProps = withPageAuthRequired();
const fetcherDistrito = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());
const fetcherAnexo = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const fetcherRol = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());

const fetcherArea = (url: string): Promise<any> =>
    fetch(url, { method: "GET" }).then(r => r.json());


const formReducer = (state: EmpleadoModel, event: any): EmpleadoModel => {
    if (event.FORM_DATA) {
        return { ...event.FORM_DATA }
    }
    if (event.FORM_ADD) {
        return new EmpleadoModel()
    }
    return { ...state, [event.name]: event.value }
}

export default function AxEmpleado({ ID, setID, setEstadoEdicion }: TypeFormularioProps) {
    const { data: listaDistrito } = useSWR('/api/entidad/distrito', fetcherDistrito);
    const { data: listaRol } = useSWR('/api/administracion/rol', fetcherRol);
    const { data: listaArea } = useSWR('/api/administracion/area', fetcherArea);
    const { data: listaAnexo } = useSWR('/api/entidad/anexo', fetcherAnexo);    
    const [formData, setFormData] = useReducer(formReducer, new EmpleadoModel());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tipoEdicion, setTipoEdicion] = useState(EnumTipoEdicion.VISUALIZAR)

    useEffect(() => {
        setIsLoading(true)
        setTipoEdicion(ID == 0 ? EnumTipoEdicion.AGREGAR : EnumTipoEdicion.VISUALIZAR);
        if (ID == 0) {
            setFormData({ FORM_ADD: true })
        }
        else {
            const fetchData = async () => {
                const response = await fetch(`/api/entidad/empleado/${ID}`);
                const data: EmpleadoModel = await response.json();
                setFormData({ FORM_DATA: data });
            }
            fetchData().catch(console.error);
        }
        setIsLoading(false)
    }, [ID])

    const handleChange = (event: any) => {
        const isCheckbox = event.target.type === 'checkbox';
        // if (event.target.name == "id_distrito") {
        //     const filtrado = listaAnexo?.filter(x => x.id_distrito == event.target.value && x.id == formData.id_tipo_documento);
        //     if (filtrado) setListaDocumentoFiltrado(filtrado);
        // }
        setFormData({
            name: event.target.name,
            value: isCheckbox ? event.target.checked : event.target.value,
        });
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);
        const dataEnvio = JSON.stringify(formData);
        const response = await fetch('/api/entidad/empleado', {
            body: dataEnvio,
            headers: { 'Content-Type': 'application/json', },
            method: tipoEdicion == EnumTipoEdicion.EDITAR ? "PUT" : "POST"
        })
        const result: EmpleadoModel = await response.json()
        if (tipoEdicion == EnumTipoEdicion.AGREGAR) setID(result.id);
        setIsSubmitting(false);
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
                    <span>Lista de Empleados</span>
                </button>
            </nav>
            <div className={isLoading ? "animate-pulse" : "" + " flex h-full flex-col  bg-white shadow-xl"}>
                <div className="divide-y divide-gray-200">
                    {/*PORTADA*/}
                    <div className="pb-6">
                        <div className="h-12 bg-indigo-700 rounded-md" />
                        <div className="-mt-8 flex items-end px-6">
                            {/*IMG PERFIL*/}
                            <div className="-m-4 inline-block relative">
                                {formData.url_imagen
                                    ? <img className="h-20 w-20 rounded-full border-4 border-white" src={formData.url_imagen} />
                                    : <svg className="bg-indigo-300 rounded-full text-white border-4 border-white h-20 w-20 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                }
                                <span className={(formData.estado == true ? "bg-green-400 " : "bg-red-400 ") + " absolute bottom-1 right-2 block h-4 w-4 rounded-full ring-2 ring-white"} />
                            </div>
                            {/*CABECERA*/}
                            <div className="ml-6 flex-1">
                                <div className="-mt-2">
                                    <h3 className="font-bold text-white text-2xl">{formData.nombre ? formData.nombre + " " + formData.apellido : "..."}</h3>
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
                                    </div>
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
                                            <div className="md:col-span-2">
                                                <AxInput name="numero_documento" required={true} label="DNI" value={formData.numero_documento} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxSelect name="id_distrito" required={true} value={formData.id_distrito} label="Distrito" handleChange={handleChange}>
                                                    {listaDistrito && listaDistrito.map((distrito: any) => <option key={distrito.id} value={distrito.id}>{distrito.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxInput name="nombre" label="Nombres" required={true} value={formData.nombre} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxInput name="apellido" required={true} label="Apellidos" value={formData.apellido} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxInput name="fecha_nacimiento" required={true} label="Fecha Nacimiento" value={formData.fecha_nacimiento} handleChange={handleChange} type="date" />
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxSelect name="sexo" value={formData.sexo} label="Sexo" handleChange={handleChange}>
                                                    <option>MUJER</option>
                                                    <option>VARON</option>
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-4">
                                                <AxInput name="email" label="Correo Electronico" required={true} value={formData.email} handleChange={handleChange} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxInput name="celular" label="Nro Celular" required={true} value={formData.celular} handleChange={handleChange} />
                                            </div>

                                            
                                            <div className="md:col-span-1">
                                                <AxSelect name="id_rol" required={true} value={formData.id_rol} label="Rol" handleChange={handleChange}>
                                                    {listaRol && listaRol.map((rol: any) => <option key={rol.id} value={rol.id}>{rol.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-2">
                                                <AxSelect name="id_area" required={true} value={formData.id_area} label="Area" handleChange={handleChange}>
                                                    {listaArea && listaArea.map((area: any) => <option key={area.id} value={area.id}>{area.nombre}</option>)}
                                                </AxSelect>
                                            </div>
                                            <div className="md:col-span-3">
                                                <AxInput name="direccion" required={true} label="Dirección" value={formData.direccion} handleChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-8">
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Condiciones</h3>
                                        </div>
                                        <div className="mt-6">
                                            <fieldset>
                                                <legend className="sr-only">By Email</legend>
                                                <div className="text-base font-medium text-gray-900" aria-hidden="true">
                                                    Laboral
                                                </div>
                                                <div className="mt-4 space-y-4">
                                                    <AxCheck id="estado" name="estado" value={formData.estado} label="¿Es Activo?" handleChange={handleChange} />
                                                </div>
                                            </fieldset>
                                            <fieldset className="mt-6">
                                                <legend className="contents text-base font-medium text-gray-900">Tipo de Contrato</legend>
                                                <div className="mt-4 space-y-4">
                                                    <AxRadio id="Indefinido" name="tipo_contrato" value={formData.tipo_contrato} label="Indefinido" handleChange={handleChange} />
                                                    <AxRadio id="Contrato3Meses" name="tipo_contrato" value={formData.tipo_contrato} label="Contrato 3 Meses" handleChange={handleChange} />
                                                    <AxRadio id="Contrato6Meses" name="tipo_contrato" value={formData.tipo_contrato} label="Contrato 6 Meses" handleChange={handleChange} />
                                                </div>
                                            </fieldset>
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
