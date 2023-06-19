import Link from 'next/link'
import Head from 'next/head'

export default function Axp404() {
    return (
        <>
            <Head>
                <title>Pagina no encontrada</title>
            </Head>
            <div className="rgb(249 250 251 / var(--tw-bg-opacity) min-h-full pt-16 pb-12 flex flex-col">
                <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex-shrink-0 flex justify-center">
                        <Link href="/">
                            <a className="inline-flex">
                                <span className="sr-only">Workflow</span>
                                <img className="h-12 w-auto" src="/logo.svg" alt="" />
                            </a>
                        </Link>
                    </div>
                    <div className="py-16">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">404 error</p>
                            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Pagina no encontrada.</h1>
                            <p className="mt-2 text-base text-gray-500">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
                            <div className="mt-6">
                                <Link href="/">
                                    <a className="text-base font-medium text-blue-600 hover:text-indigo-500">
                                        Regresar al Inicio<span aria-hidden="true"> &rarr;</span>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex justify-center space-x-4">
                        <Link href="/resultados">
                            <a className="text-sm font-medium text-gray-500 hover:text-gray-600">
                                Resultados
                            </a>
                        </Link>
                        <span className="inline-block border-l border-gray-300" aria-hidden="true" />
                        <Link href="/miperfil">
                            <a className="text-sm font-medium text-gray-500 hover:text-gray-600">
                                Mi Perfil
                            </a>
                        </Link>
                    </nav>
                </footer>
            </div>
        </>
    )
}