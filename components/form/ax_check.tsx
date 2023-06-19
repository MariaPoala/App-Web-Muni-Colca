export default function AxCheck({ id, name, value, label, handleChange }: any) {
    return (
        <div className="relative flex items-start">
            <div className="flex items-center h-5">
                <input id={id} name={name} type="checkbox"
                    checked={value || false}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor="EsActivo" className="font-medium text-gray-700">
                    {label}
                </label>
            </div>
        </div>
    )
}