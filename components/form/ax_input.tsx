export default function AxInput({ name, value, label, handleChange, type, filtro, placeholder, disabled, onChange, required }: any) {
    return (
        <>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
            {filtro == true ?
                <input type={type || "text"}
                    name={name}
                    value={value || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}                                   
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full md:text-sm border-gray-300 rounded-md disabled:text-gray-500"
                    // className= {( setIsSubmitting == true ?( value==""? "border-red-300 ": "border-green-300 " ) :  "border-white"  ) + " shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full md:text-sm border-gray-300 rounded-md disabled:text-gray-500"}
                />:
                <input type={type || "text"}
                    name={name}
                    value={value || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled }
                    required={required}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full md:text-sm border-gray-300 rounded-md disabled:text-gray-500"
                    // className= {( setIsSubmitting == true ?( value==""? "border-red-300 ": "border-green-300 " ) :  "border-white"  ) + " shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full md:text-sm border-gray-300 rounded-md disabled:text-gray-500"}
                />
            }
            </div>
        </>
    )
}
