export default function FormCheckbox({
    label,
    name,
    checked,
    onChange,
    onBlur,
    error,
    touched,
    disabled = false,
    className = "",
}) {
    return (
        <div className={className}>
            <div className="flex items-center">
                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`
                        h-4 w-4 rounded border-gray-300
                        focus:ring-2 focus:ring-offset-2
                        disabled:cursor-not-allowed disabled:opacity-50
                        ${
                            error && touched
                                ? "text-red-600 focus:ring-red-500"
                                : "text-indigo-600 focus:ring-indigo-500"
                        }
                    `}
                />
                {label && (
                    <label
                        htmlFor={name}
                        className="ml-2 block text-sm text-gray-900"
                    >
                        {label}
                    </label>
                )}
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
