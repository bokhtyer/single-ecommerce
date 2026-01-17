export default function ImageUpload({
    label,
    name,
    onChange,
    onRemove,
    preview,
    error,
    touched,
    required = false,
    disabled = false,
    accept = "image/*",
    className = "",
}) {
    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="space-y-3">
                {/* Upload Button */}
                <div>
                    <input
                        id={name}
                        name={name}
                        type="file"
                        onChange={onChange}
                        accept={accept}
                        disabled={disabled}
                        className="hidden"
                    />
                    <label
                        htmlFor={name}
                        className={`
                            inline-flex items-center px-4 py-2 border border-gray-300 
                            rounded-md shadow-sm text-sm font-medium text-gray-700 
                            bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
                            focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer
                            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        Choose Image
                    </label>
                </div>

                {/* Preview */}
                {preview && (
                    <div className="relative inline-block">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        {onRemove && (
                            <button
                                type="button"
                                onClick={onRemove}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {error && touched && (
                    <p className="text-sm text-red-600 flex items-center">
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
        </div>
    );
}
