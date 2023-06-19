import { PlusIcon, UserAddIcon } from "@heroicons/react/outline"
import Link from 'next/link'
export default function AxInicio({ nombre, icon }: any) {
  return (
    <>
      <div className="min-h-full pt-16 pb-12 flex flex-col">
        <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex-shrink-0 flex justify-center">
            <Link href="/">
              <a className="inline-flex">
                <span className="sr-only">Workflow</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d={nombre == "Distrito" ? "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" : nombre == "Empleado" ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" :
                      nombre == "Ciudadano" ? "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" :
                        nombre == "Requisito" ? "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" : ""
                    }>
                  </path>

                </svg>


              </a>
            </Link>
          </div>
          <div className="py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">{"Formulario de " + nombre}</p>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">{nombre + " No Seleccionado"}</h1>
            </div>
          </div>
        </main>
        <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-4">
            <a className="text-sm font-medium text-gray-500 hover:text-gray-600">
              {"Para agregar un nuevo " + nombre}
              <p>  hacer clic en  <button type="button" className="bg-indigo-200 p-1 rounded-full text-indigo-500  ">
                <span className="sr-only ">{"Agregar " + nombre}</span>
                {(nombre == "Empleado" || nombre == "Ciudadano") ? <UserAddIcon className="h-5 w-5 border-solid " aria-hidden="true" /> :
                  < PlusIcon className="h-5 w-5 border-solid " aria-hidden="true" />}

              </button> </p>
            </a>
            <span className="inline-block border-l border-gray-300" aria-hidden="true" />
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">
              Para la edición hacer clic en
              <p>{"uno de los " + nombre + "s"}</p>
            </a>
          </nav>
        </footer>
      </div>
    </>
  )
}
