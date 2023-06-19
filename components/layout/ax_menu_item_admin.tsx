import {
    CogIcon, FingerPrintIcon, DocumentReportIcon, XIcon,
    HomeIcon, UserIcon, UserGroupIcon, DocumentDuplicateIcon, OfficeBuildingIcon,
    CloudUploadIcon, DocumentTextIcon, DuplicateIcon, DatabaseIcon, CloudIcon,
    UsersIcon, DocumentSearchIcon, IdentificationIcon, LibraryIcon, ClipboardCheckIcon, ClipboardListIcon,
    DesktopComputerIcon, PaperClipIcon
} from '@heroicons/react/outline'
// const fetcherGrupo = (url: string): Promise<any> =>
//     fetch(url, { method: "GET" }).then(r => r.json());
// const { data: listaGrupo } = useSWRImmutable('/api/grupo/edicion', fetcherGrupo);

const navigation = [
    { name: 'Inicio', href: '/', icon: HomeIcon, current: true },
    {
        name: 'Seguridad', href: '', icon: FingerPrintIcon, current: false,
        children: [
            { name: 'Roles', href: '/administracion/rol', icon: IdentificationIcon, current: false },
            { name: 'Areas', href: '/administracion/area', icon: LibraryIcon, current: false },
        ],
    },
    {
        name: 'Entidades', href: '', icon: UserGroupIcon, current: false,
        children: [
            { name: 'Distrito', href: '/entidad/distrito', icon: OfficeBuildingIcon, current: false },
            { name: 'Anexo', href: '/entidad/anexo', icon: OfficeBuildingIcon, current: false },
            { name: 'Empleado', href: '/entidad/empleado', icon: UserIcon, current: false },
            { name: 'Persona', href: '/entidad/persona', icon: UserIcon, current: false },
            { name: 'Empresa', href: '/entidad/empresa', icon: UsersIcon, current: false }
        ],
    },
    {
        name: 'Configuración', href: '', icon: DatabaseIcon, current: false,
        children: [
            { name: 'Grupo', href: '/administracion/grupo', icon: DuplicateIcon, current: false },
            { name: 'Consideraciones', href: '/documento/consideracion', icon: ClipboardListIcon, current: false },
            { name: 'Requisitos', href: '/documento/requisito', icon: ClipboardCheckIcon, current: false },
            { name: 'Tipo Documento', href: '/documento/tipo_documento', icon: DocumentDuplicateIcon, current: false }      
        ],
    },
    {
        name: 'Digitalización', href: '', icon: CloudIcon, current: false,
        children: [
            { name: 'Documentos', href: '/documento/documento', icon: CloudUploadIcon, current: false }
        ],
    },
    {
        name: 'Tramites', href: '', icon: DesktopComputerIcon, current: false,
        children: [
            
            {    name: 'Solicitud' , href: '/documento/solicitud', icon: DocumentSearchIcon, current: false },
        ],
    },
    {
        name: 'Reporte', href: 'https://datastudio.google.com/reporting/1fd75105-1bfd-4a80-bcaa-24c24cbd87f5', icon: DocumentReportIcon, current: false,
       
    },
]



export { navigation }

