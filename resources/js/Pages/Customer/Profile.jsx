import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import FormInput from "@/Components/FormInput";
import FormButton from "@/Components/FormButton";

const ProfileSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters")
        .required("Full name is required"),
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
    phone: Yup.string()
        .matches(/^[0-9+\s-()]*$/, "Please enter a valid phone number")
        .min(10, "Phone number must be at least 10 digits")
        .nullable(),
    address: Yup.string()
        .max(200, "Address must be less than 200 characters")
        .nullable(),
    city: Yup.string()
        .max(100, "City must be less than 100 characters")
        .nullable(),
    postal_code: Yup.string()
        .max(20, "Postal code must be less than 20 characters")
        .nullable(),
});

export default function Profile() {
    const { auth, flash } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            setIsEditing(false);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (values, { setSubmitting, setErrors }) => {
        router.put("/profile", values, {
            onError: (errors) => {
                setErrors(errors);
                Object.values(errors).forEach((error) => {
                    toast.error(error);
                });
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    {/* Header */}
                    <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Profile Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Manage your personal information and account
                                    settings
                                </p>
                            </div>
                            {!isEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="px-4 py-5 sm:p-6">
                        {!isEditing ? (
                            /* View Mode */
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <p className="mt-1 text-base text-gray-900">
                                            {auth?.user?.name || "Not provided"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <div className="mt-1">
                                            <p className="text-base text-gray-900">
                                                {auth?.user?.email}
                                            </p>
                                            {auth?.user?.is_verified && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                                    <svg
                                                        className="w-3 h-3 mr-1"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <p className="mt-1 text-base text-gray-900">
                                            {auth?.user?.phone ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <p className="mt-1 text-base text-gray-900">
                                            {auth?.user?.city || "Not provided"}
                                        </p>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <p className="mt-1 text-base text-gray-900">
                                            {auth?.user?.address ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Postal Code
                                        </label>
                                        <p className="mt-1 text-base text-gray-900">
                                            {auth?.user?.postal_code ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Account Role
                                        </label>
                                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-1 capitalize">
                                            {auth?.user?.role || "Customer"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Edit Mode */
                            <Formik
                                initialValues={{
                                    name: auth?.user?.name || "",
                                    email: auth?.user?.email || "",
                                    phone: auth?.user?.phone || "",
                                    address: auth?.user?.address || "",
                                    city: auth?.user?.city || "",
                                    postal_code: auth?.user?.postal_code || "",
                                }}
                                validationSchema={ProfileSchema}
                                onSubmit={handleSubmit}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    isSubmitting,
                                    setFieldError,
                                    setFieldTouched,
                                }) => {
                                    const handleInputChange = (e) => {
                                        const fieldName = e.target.name;
                                        if (errors[fieldName]) {
                                            setFieldError(fieldName, undefined);
                                        }
                                        setFieldTouched(
                                            fieldName,
                                            false,
                                            false
                                        );
                                        handleChange(e);
                                    };

                                    return (
                                        <Form className="space-y-6">
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                <FormInput
                                                    label="Full Name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={values.name}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    error={errors.name}
                                                    touched={touched.name}
                                                    required
                                                />

                                                <FormInput
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={values.email}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    error={errors.email}
                                                    touched={touched.email}
                                                    autoComplete="email"
                                                    required
                                                />

                                                <FormInput
                                                    label="Phone Number"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="+880 1234567890"
                                                    value={values.phone}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    error={errors.phone}
                                                    touched={touched.phone}
                                                />

                                                <FormInput
                                                    label="City"
                                                    name="city"
                                                    type="text"
                                                    placeholder="Dhaka"
                                                    value={values.city}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    error={errors.city}
                                                    touched={touched.city}
                                                />

                                                <div className="sm:col-span-2">
                                                    <FormInput
                                                        label="Address"
                                                        name="address"
                                                        type="text"
                                                        placeholder="123 Main Street, Apartment 4B"
                                                        value={values.address}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        onBlur={handleBlur}
                                                        error={errors.address}
                                                        touched={
                                                            touched.address
                                                        }
                                                    />
                                                </div>

                                                <FormInput
                                                    label="Postal Code"
                                                    name="postal_code"
                                                    type="text"
                                                    placeholder="1000"
                                                    value={values.postal_code}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    error={errors.postal_code}
                                                    touched={
                                                        touched.postal_code
                                                    }
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setIsEditing(false)
                                                    }
                                                    disabled={isSubmitting}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                                <FormButton
                                                    type="submit"
                                                    loading={isSubmitting}
                                                >
                                                    {isSubmitting
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </FormButton>
                                            </div>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
