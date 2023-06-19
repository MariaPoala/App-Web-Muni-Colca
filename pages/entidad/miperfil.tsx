import Head from 'next/head'
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
export const getServerSideProps = withPageAuthRequired();

export default function AxpMiPerfil({ user }: any) {
    return (<>
        <Head>
            <title>Mi Perfil - Municipalidad de Colca</title>
        </Head>
        <div className="mt-10 max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0">
                    <div className="divide-y divide-gray-200 lg:col-span-2 " ></div>
                    <form className="divide-y divide-gray-200 lg:col-span-8 " action="#" method="POST" >
                        <div className="py-6 px-4 sm:p-6 lg:pb-8">
                            <div>
                                <h2 className="text-lg leading-6 font-medium text-gray-900">Mi Perfil</h2>
                            </div>
                            <div className="mt-6 flex flex-col lg:flex-row">
                                <div className="flex-grow space-y-6">
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <div className="mt-1 rounded-md shadow-sm flex">
                                            <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                                                Usuario
                                            </span>
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                disabled
                                                autoComplete="username"
                                                className="cursor-not-allowed focus:ring-sky-500 focus:border-sky-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                defaultValue={user?.email || ""}
                                            />
                                        </div>
                                        <p className="mt-6 text-sm font-medium text-gray-700" aria-hidden="true">
                                            Imagen
                                        </p>
                                        <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0">
                                            <div className="hidden relative rounded-full overflow-hidden lg:block">
                                                <img className="relative rounded-full w-40 h-40" src={user?.picture || ""} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
    )
}