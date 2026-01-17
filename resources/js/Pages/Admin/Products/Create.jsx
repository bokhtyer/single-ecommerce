import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useFormik } from "formik";
import AdminLayout from "@/Layouts/AdminLayout";
import toast from "react-hot-toast";
import FormInput from "@/Components/FormInput";
import FormTextarea from "@/Components/FormTextarea";
import FormCheckbox from "@/Components/FormCheckbox";
import FormSwitch from "@/Components/FormSwitch";
import FormButton from "@/Components/FormButton";
import ImageUpload from "@/Components/ImageUpload";

export default function CreateProduct() {
    const { errors: serverErrors } = usePage().props;
    const [attributes, setAttributes] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    // Validation function
    const validateProductForm = (values) => {
        const errors = {};

        // Title validation
        if (!values.title || values.title.trim().length < 3) {
            errors.title = "Title must be at least 3 characters";
        } else if (values.title.trim().length > 255) {
            errors.title = "Title must be less than 255 characters";
        }

        // Price validation
        if (
            values.price === null ||
            values.price === "" ||
            parseFloat(values.price) < 0
        ) {
            errors.price = "Price must be 0 or greater";
        }

        // Discount price validation
        if (
            values.discount_price &&
            parseFloat(values.discount_price) >= parseFloat(values.price)
        ) {
            errors.discount_price =
                "Discount price must be less than regular price";
        }

        // Quantity validation
        if (!values.quantity || parseInt(values.quantity) < 0) {
            errors.quantity = "Quantity must be 0 or greater";
        }

        // Min/Max order quantity validation
        if (
            values.min_order_quantity &&
            parseInt(values.min_order_quantity) < 1
        ) {
            errors.min_order_quantity =
                "Minimum order quantity must be at least 1";
        }

        if (values.max_order_quantity && values.min_order_quantity) {
            if (
                parseInt(values.max_order_quantity) <
                parseInt(values.min_order_quantity)
            ) {
                errors.max_order_quantity =
                    "Maximum must be greater than minimum";
            }
        }

        return errors;
    };

    // Submit handler
    const handleSubmitForm = (values, { setSubmitting }) => {
        const formData = new FormData();

        // Append all text fields
        Object.keys(values).forEach((key) => {
            if (key === "thumbnail" && values[key]) {
                formData.append(key, values[key]);
            } else if (key === "gallery_images" && values[key].length > 0) {
                values[key].forEach((file, index) => {
                    formData.append(`gallery_images[${index}]`, file);
                });
            } else if (key === "attributes") {
                // Only send attributes if there are values
                if (attributes.length > 0) {
                    const attributesJson = JSON.stringify(attributes);
                    console.log("Sending attributes:", attributesJson);
                    formData.append(key, attributesJson);
                }
            } else if (key === "tags") {
                // Only send tags if there are values
                if (tags.length > 0) {
                    const tagsJson = JSON.stringify(tags);
                    console.log("Sending tags:", tagsJson);
                    formData.append(key, tagsJson);
                }
            } else if (key === "variations") {
                // Only send variations if there are values
                if (Array.isArray(values[key]) && values[key].length > 0) {
                    const variationsJson = JSON.stringify(values[key]);
                    console.log("Sending variations:", variationsJson);
                    formData.append(key, variationsJson);
                }
            } else if (
                key === "free_shipping" ||
                key === "is_landing_page" ||
                key === "is_active"
            ) {
                // Send boolean values as 1 or 0 for Laravel validation
                formData.append(key, values[key] ? "1" : "0");
            } else if (values[key] !== null && values[key] !== "") {
                formData.append(key, values[key]);
            }
        });

        router.post("/admin/products", formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Product created successfully!");
            },
            onError: (errors) => {
                console.log("Validation errors:", errors);
                Object.values(errors).forEach((error) => {
                    toast.error(error);
                });
                setSubmitting(false);
            },
            onFinish: () => {
                setSubmitting(false);
            },
        });
    };

    // Formik hook
    const formik = useFormik({
        initialValues: {
            title: "",
            slug: "",
            short_description: "",
            full_details: "",
            price: "",
            discount_price: "",
            discount_start_date: "",
            discount_end_date: "",
            quantity: "",
            min_order_quantity: 1,
            max_order_quantity: "",
            sku: "",
            thumbnail: null,
            gallery_images: [],
            attributes: [],
            variations: [],
            meta_title: "",
            meta_description: "",
            tags: [],
            free_shipping: false,
            shipping_cost_dhaka: "",
            shipping_cost_outside_dhaka: "",
            is_landing_page: false,
            is_active: true,
        },
        validateOnChange: true,
        validateOnBlur: true,
        validate: validateProductForm,
        onSubmit: handleSubmitForm,
    });

    // Attribute handlers
    const addAttribute = () => {
        setAttributes([...attributes, { name: "", values: [] }]);
    };

    const removeAttribute = (index) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const updateAttribute = (index, field, value) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    // Tag handlers
    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            const newTags = [...tags, tagInput.trim()];
            setTags(newTags);
            setTagInput("");
        }
    };

    const handleTagInput = (e) => {
        const value = e.target.value;

        // Check if comma was entered
        if (value.includes(",")) {
            const newTagsArray = value
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t && !tags.includes(t));
            if (newTagsArray.length > 0) {
                setTags([...tags, ...newTagsArray]);
            }
            setTagInput("");
        } else {
            setTagInput(value);
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
            // Remove last tag when backspace is pressed and input is empty
            const newTags = [...tags];
            newTags.pop();
            setTags(newTags);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // Image handlers
    const handleThumbnailChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            formik.setFieldValue("thumbnail", file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleThumbnailRemove = () => {
        formik.setFieldValue("thumbnail", null);
        setThumbnailPreview(null);
    };

    const handleGalleryChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const existingFiles = formik.values.gallery_images || [];
            const combinedFiles = [...existingFiles, ...newFiles];
            const newPreviews = newFiles.map((file) =>
                URL.createObjectURL(file),
            );
            const combinedPreviews = [...galleryPreviews, ...newPreviews];

            formik.setFieldValue("gallery_images", combinedFiles);
            setGalleryPreviews(combinedPreviews);

            // Reset the input so the same file can be selected again
            e.target.value = "";
        }
    };

    const handleGalleryRemove = (index) => {
        const newFiles = formik.values.gallery_images.filter(
            (_, i) => i !== index,
        );
        const newPreviews = galleryPreviews.filter((_, i) => i !== index);
        formik.setFieldValue("gallery_images", newFiles);
        setGalleryPreviews(newPreviews);
    };

    return (
        <AdminLayout>
            <div className="py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Add New Product
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Fill in the details below to create a new product
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <FormInput
                                    label="Product Title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter product title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.errors.title ||
                                        serverErrors?.title
                                    }
                                    touched={formik.touched.title}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <FormInput
                                    label="Slug (URL)"
                                    name="slug"
                                    type="text"
                                    placeholder="auto-generated if left empty"
                                    value={formik.values.slug}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.errors.slug || serverErrors?.slug
                                    }
                                    touched={formik.touched.slug}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <FormTextarea
                                    label="Short Description"
                                    name="short_description"
                                    placeholder="Brief product description"
                                    value={formik.values.short_description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.errors.short_description}
                                    touched={formik.touched.short_description}
                                    rows={3}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <FormTextarea
                                    label="Full Details"
                                    name="full_details"
                                    placeholder="Complete product details"
                                    value={formik.values.full_details}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.errors.full_details}
                                    touched={formik.touched.full_details}
                                    rows={6}
                                />
                            </div>

                            <FormInput
                                label="SKU"
                                name="sku"
                                type="text"
                                placeholder="Product SKU"
                                value={formik.values.sku}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.sku}
                                touched={formik.touched.sku}
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Pricing
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Regular Price (৳)"
                                name="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.errors.price || serverErrors?.price
                                }
                                touched={formik.touched.price}
                                required
                            />

                            <FormInput
                                label="Discount Price (৳)"
                                name="discount_price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formik.values.discount_price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.discount_price}
                                touched={formik.touched.discount_price}
                            />

                            <FormInput
                                label="Discount Start Date"
                                name="discount_start_date"
                                type="datetime-local"
                                value={formik.values.discount_start_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.discount_start_date}
                                touched={formik.touched.discount_start_date}
                            />

                            <FormInput
                                label="Discount End Date"
                                name="discount_end_date"
                                type="datetime-local"
                                value={formik.values.discount_end_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.discount_end_date}
                                touched={formik.touched.discount_end_date}
                            />
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Inventory
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormInput
                                label="Quantity"
                                name="quantity"
                                type="number"
                                placeholder="0"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.errors.quantity ||
                                    serverErrors?.quantity
                                }
                                touched={formik.touched.quantity}
                                required
                            />

                            <FormInput
                                label="Min Order Quantity"
                                name="min_order_quantity"
                                type="number"
                                placeholder="1"
                                value={formik.values.min_order_quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.min_order_quantity}
                                touched={formik.touched.min_order_quantity}
                            />

                            <FormInput
                                label="Max Order Quantity"
                                name="max_order_quantity"
                                type="number"
                                placeholder="Optional"
                                value={formik.values.max_order_quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.max_order_quantity}
                                touched={formik.touched.max_order_quantity}
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Images
                        </h2>
                        <div className="space-y-6">
                            <ImageUpload
                                label="Thumbnail Image"
                                name="thumbnail"
                                onChange={handleThumbnailChange}
                                onRemove={handleThumbnailRemove}
                                preview={thumbnailPreview}
                                error={formik.errors.thumbnail}
                                touched={formik.touched.thumbnail}
                                accept="image/*"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gallery Images
                                </label>
                                <input
                                    id="gallery-images-input"
                                    type="file"
                                    onChange={handleGalleryChange}
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "gallery-images-input",
                                            )
                                            .click()
                                    }
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg
                                        className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Add New Image
                                </button>
                                {galleryPreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {galleryPreviews.map(
                                            (preview, index) => (
                                                <div
                                                    key={index}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="h-32 w-full object-cover rounded-lg border-2 border-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleGalleryRemove(
                                                                index,
                                                            )
                                                        }
                                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
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
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Attributes */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                Attributes (Size, Color, etc.)
                            </h2>
                            <button
                                type="button"
                                onClick={addAttribute}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg
                                    className="-ml-1 mr-2 h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Add Attribute
                            </button>
                        </div>
                        {attributes.length > 0 ? (
                            <div className="space-y-4">
                                {attributes.map((attr, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <FormInput
                                                label="Attribute Name"
                                                name={`attribute_name_${index}`}
                                                type="text"
                                                placeholder="e.g., Size, Color, Material"
                                                value={attr.name}
                                                onChange={(e) =>
                                                    updateAttribute(
                                                        index,
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <FormInput
                                                label="Values (comma-separated)"
                                                name={`attribute_values_${index}`}
                                                type="text"
                                                placeholder="e.g., Small, Medium, Large"
                                                value={attr.values.join(", ")}
                                                onChange={(e) =>
                                                    updateAttribute(
                                                        index,
                                                        "values",
                                                        e.target.value
                                                            .split(",")
                                                            .map((v) =>
                                                                v.trim(),
                                                            ),
                                                    )
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeAttribute(index)
                                            }
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <svg
                                                className="-ml-0.5 mr-1.5 h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    />
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">
                                    No attributes added yet.
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    Click "Add Attribute" to add product
                                    attributes like Size, Color, etc.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Shipping */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Shipping
                        </h2>
                        <div className="space-y-4">
                            <FormSwitch
                                label="Free Shipping"
                                name="free_shipping"
                                checked={formik.values.free_shipping}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        "free_shipping",
                                        e.target.checked,
                                    )
                                }
                                onBlur={formik.handleBlur}
                                error={formik.errors.free_shipping}
                                touched={formik.touched.free_shipping}
                                description="Enable free shipping for this product"
                            />

                            {!formik.values.free_shipping && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <FormInput
                                        label="Shipping Cost (Dhaka) ৳"
                                        name="shipping_cost_dhaka"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={
                                            formik.values.shipping_cost_dhaka
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.errors.shipping_cost_dhaka
                                        }
                                        touched={
                                            formik.touched.shipping_cost_dhaka
                                        }
                                    />

                                    <FormInput
                                        label="Shipping Cost (Outside Dhaka) ৳"
                                        name="shipping_cost_outside_dhaka"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={
                                            formik.values
                                                .shipping_cost_outside_dhaka
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.errors
                                                .shipping_cost_outside_dhaka
                                        }
                                        touched={
                                            formik.touched
                                                .shipping_cost_outside_dhaka
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SEO & Tags */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            SEO & Tags
                        </h2>
                        <div className="space-y-6">
                            <FormInput
                                label="Meta Title"
                                name="meta_title"
                                type="text"
                                placeholder="SEO title"
                                value={formik.values.meta_title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.meta_title}
                                touched={formik.touched.meta_title}
                            />

                            <FormTextarea
                                label="Meta Description"
                                name="meta_description"
                                placeholder="SEO description"
                                value={formik.values.meta_description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.meta_description}
                                touched={formik.touched.meta_description}
                                rows={3}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags
                                </label>
                                <div className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                                            >
                                                <svg
                                                    className="-ml-0.5 mr-1 h-3.5 w-3.5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTag(tag)
                                                    }
                                                    className="ml-1 inline-flex items-center justify-center w-4 h-4 text-indigo-400 hover:text-indigo-600 focus:outline-none"
                                                >
                                                    <svg
                                                        className="w-3 h-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={handleTagInput}
                                            onKeyDown={handleTagKeyDown}
                                            placeholder={
                                                tags.length === 0
                                                    ? "Type tags separated by commas or press Enter..."
                                                    : "Add more..."
                                            }
                                            className="flex-1 min-w-[200px] border-0 p-0 focus:ring-0 focus:outline-none text-sm placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Separate tags with commas or press Enter.
                                    Press Backspace to remove the last tag.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Settings */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Additional Settings
                        </h2>
                        <div className="space-y-6">
                            <FormSwitch
                                label="Landing Page Product"
                                name="is_landing_page"
                                checked={formik.values.is_landing_page}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        "is_landing_page",
                                        e.target.checked,
                                    )
                                }
                                onBlur={formik.handleBlur}
                                error={formik.errors.is_landing_page}
                                touched={formik.touched.is_landing_page}
                                description="Enable this to feature product as a landing page"
                            />

                            <FormSwitch
                                label="Product Active"
                                name="is_active"
                                checked={formik.values.is_active}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        "is_active",
                                        e.target.checked,
                                    )
                                }
                                onBlur={formik.handleBlur}
                                error={formik.errors.is_active}
                                touched={formik.touched.is_active}
                                description="Toggle to activate/deactivate this product"
                            />
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-4">
                        <FormButton
                            type="button"
                            variant="secondary"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </FormButton>
                        <FormButton type="submit" loading={formik.isSubmitting}>
                            {formik.isSubmitting
                                ? "Creating..."
                                : "Create Product"}
                        </FormButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
