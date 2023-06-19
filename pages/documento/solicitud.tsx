import { Fragment, useEffect, useState } from 'react';
import useSWR from "swr";
import { CheckCircleIcon, LinkIcon, RefreshIcon, XIcon, UploadIcon, ExclamationIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';
import { AxSelectFiltro, AxBtnAgregarArchivoSolicitud, AxBtnEditarSolicitud, AxInput } from 'components/form';
import { EnumEstadoEdicion, EnumTipoEdicion } from 'lib/edicion';
import SolicitudModel from 'models/solicitud_model'
import AxSolicitud from 'modulos/documento/ax_solicitud';
import AxSolicitudEstado from 'modulos/documento/ax_solicitud_estado';
import AxSubirArchivo from 'modulos/documento/ax_subir_archivo';
import supabase from "lib/supabase_config";
import Head from 'next/head'
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
export const getServerSideProps = withPageAuthRequired();


const fetcherVSolicitud = (url: string): Promise<any> =>
  fetch(url, { method: "GET" }).then(r => r.json());
const fetcherPersona = (url: string): Promise<any> =>
  fetch(url, { method: "GET" }).then(r => r.json());
const fetcherEmpresa = (url: string): Promise<any> =>
  fetch(url, { method: "GET" }).then(r => r.json());
const fetcherTipoDocumento = (url: string): Promise<any> =>
  fetch(url, { method: "GET" }).then(r => r.json());

const campos = [
  { name: 'N° Documento' },
  { name: 'Entidad' },
  { name: 'Total' },
  { name: 'Empleado' },
  { name: 'Fecha Inicio' },
  { name: 'Fecha Plazo' },
  { name: 'Dias' },
  { name: 'Estado' }
]

const estados = [
  { name: 'REGISTRADO' },
  { name: 'VALIDADO' },
  { name: 'RECHAZADO' },
  { name: 'FINALIZADO' },
  { name: 'ENTREGADO' }
]
type TypeFiltro = {
  tipo_entidad: string
  id_persona: number,
  id_empresa: number,
  year_mes: string,
  id_tipo_documento: number[],
  estado: string[],
}

export default function AxPageDocumento() {
  const { data: listaTipoDocumento } = useSWR<any[]>('/api/documento/tipo_documento', fetcherTipoDocumento);
  const { data: listaPersona } = useSWR('/api/entidad/persona/v_persona', fetcherPersona);
  const { data: listaEmpresa } = useSWR('/api/entidad/empresa', fetcherEmpresa);
  const [ID, setID] = useState(-1)
  const [lista, setLista] = useState<SolicitudModel[]>([]);
  const [estadoEdicion, setEstadoEdicion] = useState(EnumEstadoEdicion.LISTAR)
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState<TypeFiltro>({ tipo_entidad: "NATURAL", id_persona: 0, id_empresa: 0, year_mes: '2022-08', id_tipo_documento: [], estado: ["REGISTRADO", "VALIDADO"] });
  const [listaFiltro, setListaFiltro] = useState<SolicitudModel[]>([]);
  const [tipoEdicion, setTipoEdicion] = useState(EnumTipoEdicion.VISUALIZAR)
  const [esModalOpen, setEsModalOpen] = useState(false)
  const [urlArchivo, setUrlArchivo] = useState("")
  const [archivo, setArchivo] = useState("")
  const [nombreAlmacenamiento, setNombreAlmacenamiento] = useState("")
  const [clic, setclic] = useState(false)
  const [tipoModal, setTipoModal] = useState<string>('EDICION')
  const [paginacion, setPaginacion] = useState({ inicio: 0, cantidad: 10 })

  useEffect(() => {

    if (estadoEdicion != EnumEstadoEdicion.LISTAR && estadoEdicion != EnumEstadoEdicion.GUARDADO) return;
    setIsLoading(true)
    const fetchData = async () => {
      const response = await fetch(`/api/documento/solicitud/v_solicitud?inicio=${paginacion.inicio}&cantidad=${paginacion.cantidad}`, {
        method: "GET"
      })
      const result: SolicitudModel[] = await response.json()
      setLista(result);
      setIsLoading(false)
    }
    fetchData().catch(console.error);
  }, [estadoEdicion, paginacion])

  useEffect(() => {
    FnFiltrarLista();
  }, [lista])




  const handleChange = (event: any) => {
    if (event.target.name == "FiltroGrupo") {
      const indexAnterior = filtro.id_tipo_documento.indexOf(event.target.value);
      if (indexAnterior != -1) filtro.id_tipo_documento.splice(indexAnterior, 1);
      else filtro.id_tipo_documento.push(event.target.value);
      setFiltro({ ...filtro });
    }
    if (event.target.name == "FiltroEstado") {
      const indexAnterior = filtro.estado.indexOf(event.target.value);
      if (indexAnterior != -1) filtro.estado.splice(indexAnterior, 1);
      else filtro.estado.push(event.target.value);
      setFiltro({ ...filtro });
    }
    else {
      setFiltro({ ...filtro, [event.target.name]: event.target.value });
    }
  }
  const resultado = Array.from(new Set(lista.map(s => s.id_tipo_documento)))
    .map(id => {
      return {
        id: id
      }
    });

  function FnFiltrarLista() {
    let filtrado = lista && lista.filter((item: any) =>
      (filtro.tipo_entidad == item.tipo_entidad) &&
      (filtro.id_persona != 0 ? item.id_persona == filtro.id_persona : true) &&
      (filtro.id_empresa != 0 ? item.id_empresa == filtro.id_empresa : true) &&
      (filtro.id_tipo_documento.indexOf(item.id_tipo_documento) != -1) &&
      (filtro.estado.indexOf(item.estado) != -1) &&
      (filtro.year_mes ? (item.fecha_inicio.substring(6, 10) + '-' + item.fecha_inicio.substring(3, 5)) == filtro.year_mes : true)
    )
    setListaFiltro(filtrado);
  }

  function FnLoadMas() {
    setPaginacion({ inicio: 0, cantidad: paginacion.cantidad + 10 });
  }
  async function FndescargarImg() {
    try {
      if (archivo) {
        console.log(archivo);

        const { signedURL, error } = await supabase.storage.from('archivo-' + nombreAlmacenamiento).createSignedUrl(archivo, 60)
        if (error) {
          throw error
        }
        if (signedURL) {
          //PARA ABRIR EN UNA NUEVA PESTAÑA
          const wPrint = window.open(signedURL);
          if (wPrint) wPrint.window.print();
          // setUrlArchivo(signedURL)
        }
      }
    } catch (error: any) {
      console.log('Error downloading image: ', error.message)
    }
  }
  useEffect(() => {
    FndescargarImg();
  }, [archivo])

  useEffect(() => {
    if (filtro.id_persona > 0) { filtro.id_persona = 0 }
    else if (filtro.id_empresa > 0) { filtro.id_empresa = 0 }
  }, [filtro.tipo_entidad])

  return (
    <>
    <Head><title>Solicitud</title></Head>
      <main className="flex-1 pb-8">
        <div className={(isLoading ? "animate-pulse" : "") + " bg-white shadow"}>
          <div className=" sm:px-4 lg:max-w-6xl ">
            <div className="py-2 lg:border-t lg:border-gray-200">
              <div className="flex-1 min-w-0">
                <dd className="mt-3 gap-2 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                  <CheckCircleIcon
                    className="flex-shrink-0 mr-0 h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                  Filtrar Por:
                </dd>
                <div className="mt-2 grid ml-14 grid-cols-1   gap-y-6 gap-x-4 md:grid-cols-6">
                  <div className="md:col-span-1">
                    <AxSelectFiltro name="tipo_entidad" value={filtro.tipo_entidad} label="Tipo Entidad" handleChange={handleChange} incluirTodos={false}>
                      <option key="NATURAL" value="NATURAL">NATURAL</option>
                      <option key="JURIDICO" value="JURIDICO">JURIDICO</option>
                    </AxSelectFiltro>
                  </div>
                  {
                    filtro.tipo_entidad == "NATURAL"
                      ? <div className="md:col-span-2">
                        <AxSelectFiltro name={"id_persona"} value={filtro.id_persona} filtro={true} label="Persona" handleChange={handleChange}>
                          {listaPersona && listaPersona.map((ciudadano: any) =>
                            <option key={ciudadano.id} value={ciudadano.id}>{ciudadano.nombre_apellido}</option>)}
                        </AxSelectFiltro>
                      </div>
                      : <div className="md:col-span-2">
                        <AxSelectFiltro name={"id_empresa"} value={filtro.id_empresa} filtro={true} label="Empresa" handleChange={handleChange}>
                          {listaEmpresa && listaEmpresa.map((empresa: any) =>
                            <option key={empresa.id} value={empresa.id}>{empresa.razon_social}</option>)}
                        </AxSelectFiltro>
                      </div>
                  }
                  <div className="md:col-span-1">
                    <AxInput name="year_mes" value={filtro.year_mes} label="Periodo" handleChange={handleChange} filtro={true} type="month" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="button"
                      onClick={() => FnFiltrarLista()}
                      className="ml-3 h-8 mt-0 w-20 bottom-0 right-0  inline-flex items-center px-3 py-2 border 
                                            border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                            disabled:bg-blue-300"
                    >
                      Filtrar
                      <RefreshIcon className='h-5 w-5 text-transparent'></RefreshIcon>
                    </button>
                    <button type="button"
                      onClick={() => FnLoadMas()
                      }
                      className="ml-3 bg-green-500 mr-2 h-8 mt-0 w-32 bottom-0 right-0  inline-flex items-center px-3 py-2 border 
                                            border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white  hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                                            disabled:bg-green-300"
                    >
                      Cargas Mas
                      <RefreshIcon className='h-4 w-4 mr-1'></RefreshIcon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="sm:flex sm:items-center px-16 ">
            <div className="sm:flex-auto">
              <div className="grid  gap-1 grid-cols-1 sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-10">
                {/* Card */}
                {(estados.map((item: any) =>
                  <ul key={item.name} className={(item.name == "REGISTRADO" ? " bg-indigo-600 hover:bg-indigo-700  ring-indigo-500"
                    : item.name == "RECHAZADO" ? "bg-red-600 hover:bg-red-700 ring-red-500"
                      : item.name == "VALIDADO" ? "bg-blue-600 hover:bg-blue-700 ring-blue-500"
                        : item.name == "FINALIZADO" ? "bg-black hover:bg-black ring-black"
                          : "bg-green-600 hover:bg-green-700 ring-green-500") + (filtro.estado.indexOf(item.name) != -1 && " ring-2 ring-offset-2 ") + " cursor-pointer font-Times h-5 w-28 inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white  focus:outline-none"}
                    onClick={() => {
                      handleChange({ target: { name: "FiltroEstado", value: item.name } });
                      FnFiltrarLista();
                    }}>
                    {item.name}
                  </ul>
                )
                )
                }
              </div>
            </div>


          </div>
          <div className="sm:flex sm:items-center px-16 mt-4">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Lista De Solicitudes</h1>
              <div className="mt-2 grid  gap-5 grid-cols-1 sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-5">
                {/* Card */}
                {(listaTipoDocumento && listaTipoDocumento.map((item: any) =>
                (resultado.map(s => s.id == item.id &&
                  <ul key={item.id} className="bg-indigo-400 cursor-pointer overflow-hidden shadow rounded-lg hover:bg-indigo-700"
                    onClick={() => {
                      handleChange({ target: { name: "FiltroGrupo", value: item.id } });
                      FnFiltrarLista();
                    }}>

                    <div className={(filtro.id_tipo_documento.indexOf(item.id) != -1 ? "bg-indigo-600" : "bg-indigo-400") + " p-2"}>
                      <div className="flex items-center">
                        <div className="ml-2 w-10 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-white truncate uppercase">{item.nombre}</dt>
                            {/* <dd>
                            <div className="text-sm font-medium text-indigo-100">{item.Descripcion}</div>
                          </dd> */}
                          </dl>
                        </div>
                      </div>
                    </div>
                  </ul>
                )))
                )
                }
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none ">
              <AxBtnEditarSolicitud setTipoModal={setTipoModal} estadoEdicion={ID > 0 ? EnumEstadoEdicion.SELECCIONADO : estadoEdicion} setTipoEdicion={setTipoEdicion} setEstadoEdicion={setEstadoEdicion} />
              <AxBtnAgregarArchivoSolicitud setTipoModal={setTipoModal} setEstadoEdicion={setEstadoEdicion} setID={setID} setTipoEdicion={setTipoEdicion}></AxBtnAgregarArchivoSolicitud>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="mx-auto px-14 sm:px-16 lg:px-8">
              <div className="flex flex-col mt-2">
                <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg ">
                  {filtro.id_tipo_documento.length == 0 ?
                    <dd className="mt-10 gap-2 p-10 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                      <ExclamationCircleIcon
                        className="flex-shrink-0 mr-0 h-5 w-5 text-orange-500"
                        aria-hidden="true"
                      />
                      ¡Seleccionar un Documento!
                    </dd> :
                    <table className="flex flex-col w-full h-[calc(100vh-24rem)] divide-gray-300">
                      <thead className='bg-indigo-200'>
                        <tr className='table table-fixed w-full divide-x divide-y divide-gray-200'>
                          <th scope="col" className="relative w-16 px-3">
                            ✔
                          </th>
                          <th scope="col" key='doc' className="py-3 text-center text-sm text-gray-900 relative w-44 px-3">
                            Tipo Documento
                          </th>
                          {campos.map((item) => (
                            <th key={item.name} className="px-1 py-3 text-center text-sm text-gray-900">
                              {item.name}
                            </th>
                          ))}
                          <th scope="col" key='archivo' className="py-3 text-center text-sm text-gray-900 relative w-16 px-1">
                            Archivo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-x divide-y overflow-x-auto overflow-y-auto divide-gray-200 bg-white">
                        {(listaFiltro && listaFiltro.map((item: any) => (
                          <tr key={item.id} className={item.id == ID ? "bg-indigo-100 table table-fixed w-full" : "bg-white table table-fixed w-full"}>
                            <td className="w-16 text-center whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              <input
                                onChange={(event) => {
                                  if (!event.target.checked) setID(-1);
                                  else setID(item.id);
                                }}
                                checked={item.id == ID}
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                            </td>
                            <td className="px-1 w-44 whitespace-nowrap text-sm text-gray-500 truncate">
                              <div className="text-gray-900 ">{item.tipo_documento_nombre}</div>
                              <div className="text-gray-500">

                                <span onClick={() => {
                                  setArchivo(item.archivo);
                                  setNombreAlmacenamiento("documento")
                                }} className={(item.archivo && "cursor-pointer text-blue-800  font-medium bg-blue-300 rounded-full hover:bg-blue-500 hover:text-white") + " text-[11px] whitespace-nowrap flex-shrink-0 inline-block px-2 italic  "} >
                                  {item.nombre_documento}</span>
                              </div>
                            </td>
                            <td className="px-1 py-3 text-center whitespace-nowrap text-sm text-gray-500 truncate">
                              {item.numero_documento}
                            </td>
                            <td className="whitespace-nowrap px-1 text-center text-sm text-gray-500 truncate">
                              <div className="text-gray-900">{item.tipo_entidad}</div>
                              {item.tipo_entidad == "NATURAL"
                                ? <div className="text-gray-500">{item.persona_nombre}</div>
                                : <div className="text-gray-500">{item.razon_social}</div>
                              }
                            </td>
                            <td className="px-1 text-center whitespace-nowrap text-sm text-gray-500 truncate">
                              {item.i_total}
                            </td>
                            <td className="px-1 text-center whitespace-nowrap text-sm text-gray-500 truncate">
                              {item.empleado_nombre}
                            </td>
                            <td className="px-1 text-center whitespace-nowrap text-sm text-gray-500 truncate">
                              {item.fecha_inicio}
                            </td>
                            <td className="px-1 text-center whitespace-nowrap text-sm text-gray-500 truncate">
                              {item.fecha_plazo}
                            </td>
                            <td className="px-1  text-center whitespace-nowrap text-sm text-gray-500 truncate flex">
                              <p className="mt-2 lg:ml-10 lg:md-10 flex items-center text-sm text-gray-500 font-sans italic">
                                {(item.estado=="ENTREGADO" || item.estado=="RECHAZADO") ? "": item.direfencia}
                                {(item.estado=="ENTREGADO" || item.estado=="RECHAZADO") ? "":<ExclamationIcon className={(item.direfencia>=3 ? "text-blue-500": item.direfencia>=0 ? " text-amber-500":  "text-red-500")+" flex-shrink-0 ml-2 h-4 w-4 text-blue-500"} aria-hidden="true" />}
                              </p>
                            </td>
                            <td className="px-1 text-center whitespace-nowrap text-sm text-gray-500 truncate">
                              <button type="button"
                                onClick={() => {
                                  setTipoEdicion(EnumTipoEdicion.EDITAR);
                                  setEstadoEdicion(EnumEstadoEdicion.EDITANDO);
                                  setTipoModal('ESTADO')
                                  setID(item.id)
                                }}
                                className={" inline-flex items-center w-24 h-5 text-xs px-3 py-2 border disabled:bg-indigo-300  border-gray-300 shadow-sm leading-4 font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 " +
                                  (item.estado == "REGISTRADO"
                                    ? "bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500 "
                                    : item.estado == "RECHAZADO"
                                      ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                                      : item.estado == "VALIDADO"
                                        ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 " :
                                        item.estado == "FINALIZADO"
                                          ? "bg-zinc-500 hover:bg-zinc-600 focus:ring-zinc-500 " :
                                          item.estado == "ENTREGADO" &&
                                          "bg-green-500 hover:bg-green-600 focus:ring-green-500 ")
                                }
                              >
                                {item.estado}
                              </button>
                            </td>
                            <td className="px-1 w-16 text-center whitespace-nowrap text-sm text-gray-500 truncate">
                              {item.estado == "VALIDADO" &&
                                <button type="button"
                                  onClick={() => {
                                    setTipoModal('ARCHIVO');
                                    setID(item.id)
                                    setTipoEdicion(EnumTipoEdicion.EDITAR);
                                    setEstadoEdicion(EnumEstadoEdicion.EDITANDO);
                                  }}
                                  className=" inline-flex items-center px-3 py-2 border  h-6 font-mono italic border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500     disabled:bg-indigo-300"
                                >
                                  <UploadIcon className='h-4 w-4'></UploadIcon>
                                </button>
                              }
                              {(item.estado == "FINALIZADO" || item.estado == "ENTREGADO") && item.url_archivo_solicitud != null &&
                                <button type="button"
                                  onClick={() => {
                                    setTipoModal('ARCHIVO');
                                    setID(item.id)
                                    setArchivo(item.url_archivo_solicitud);
                                    setNombreAlmacenamiento("solicitud")
                                  }}
                                  className=" inline-flex items-center px-3 py-2 border  h-6 font-mono italic border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500     disabled:bg-indigo-300"
                                >
                                  <LinkIcon className='h-4 w-4'></LinkIcon>
                                </button>
                              }

                            </td>
                          </tr>
                        )))}
                      </tbody>
                    </table>}
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
                        :
                        (
                          <div className="archivo-requisito no-image" style={{ height: 100, width: 100 }} />
                        )}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main >
      {tipoModal != "NINGUNO" &&
        <Transition.Root show={estadoEdicion == EnumEstadoEdicion.EDITANDO} as={Fragment}>

          <Dialog as="div" className="relative z-10 " onClose={setEsModalOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed z-10 inset-0 overflow-y-auto">

              <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">

                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative bg-white  rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:p-6 ">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {
                            tipoModal == "ESTADO" ? "Estado de la Solicitud" : "Registro de Solicitud [" + tipoEdicion + "]"
                          }

                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setEstadoEdicion(EnumEstadoEdicion.CANCELADO)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {tipoModal == "EDICION" && <AxSolicitud ID={ID} setID={setID} setEstadoEdicion={setEstadoEdicion} tipoEdicion={tipoEdicion}></AxSolicitud>}
                    {tipoModal == "ESTADO" && <AxSolicitudEstado ID={ID} setID={setID} setEstadoEdicion={setEstadoEdicion} tipoEdicion={tipoEdicion}></AxSolicitudEstado>}
                    {tipoModal == "ARCHIVO" && <AxSubirArchivo archivo={archivo} ID={ID} setID={setID} setEstadoEdicion={setEstadoEdicion} tipoEdicion={tipoEdicion}></AxSubirArchivo>}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      }
    </>
  )
}


