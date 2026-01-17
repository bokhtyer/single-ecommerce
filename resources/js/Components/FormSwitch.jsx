export default function FormSwitch({
    label,
    name,
    checked,
    onChange,
    onBlur,
    error,
    touched,
    disabled = false,
    description,
    className = "",
}) {
    return (
        <div className={className}>
            <div className="flex items-center gap-5">
                <button
                    type="button"
                    id={name}
                    name={name}
                    role="switch"
                    aria-checked={checked}
                    onClick={() => {
                        const event = {
                            target: {
                                name: name,
                                type: "checkbox",
                                checked: !checked,
                            },
                        };
                        onChange(event);
                    }}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`
                        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer 
                        rounded-full border-2 border-transparent transition-colors 
                        duration-200 ease-in-out focus:outline-none focus:ring-2 
                        focus:ring-indigo-600 focus:ring-offset-2
                        ${checked ? "bg-indigo-600" : "bg-gray-200"}
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                        ${error && touched ? "ring-2 ring-red-500" : ""}
                    `}
                >
                    <span
                        className={`
                            pointer-events-none inline-block h-5 w-5 transform 
                            rounded-full bg-white shadow ring-0 transition 
                            duration-200 ease-in-out
                            ${checked ? "translate-x-5" : "translate-x-0"}
                        `}
                    />
                </button>
                <div className="flex-1">
                    {label && (
                        <label
                            htmlFor={name}
                            className="block text-sm font-medium text-gray-700"
                        >
                            {label}
                        </label>
                    )}
                    {description && (
                        <p className="text-sm text-gray-500 mt-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {error && touched && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
