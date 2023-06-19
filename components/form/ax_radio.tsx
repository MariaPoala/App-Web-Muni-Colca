export default function AxRadio({ id, name, value, label, handleChange }: any) {
    return (
        <div className="flex items-center">
            <input id={id} name={name} type="radio"
                value={id}
                checked={value == id || false}
                onChange={handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor={id} className="ml-3 block text-sm font-medium text-gray-700" >
                {label}
            </label>
        </div>
    )
}