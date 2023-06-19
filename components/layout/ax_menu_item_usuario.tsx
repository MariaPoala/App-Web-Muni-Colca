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

const navigation_usuario = [
    { name: 'Inicio', href: '/', icon: HomeIcon, current: true },
    
    {
        name: 'Entidades', href: '', icon: UserGroupIcon, current: false,
        children: [
            { name: 'Distrito', href: '/entidad/distrito', icon: OfficeBuildingIcon, current: false },
            { name: 'Anexo', href: '/entidad/anexo', icon: OfficeBuildingIcon, current: false },
            { name: 'Personas', href: '/entidad/persona', icon: UserIcon, current: false },
            { name: 'Empresas', href: '/entidad/empresa', icon: UsersIcon, current: false }
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


export { navigation_usuario }

