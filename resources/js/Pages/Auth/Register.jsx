import { Link, router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import AuthLayout from "@/Layouts/AuthLayout";
import FormInput from "@/Components/FormInput";
import FormButton from "@/Components/FormButton";

const RegisterSchema = Yup.object().shape({
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
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .required("Password is required"),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
});

export default function Register() {
    const { errors: serverErrors, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (values, { setSubmitting, setErrors }) => {
        router.post("/register", values, {
            onSuccess: () => {
                toast.success(
                    "Registration successful! Please check your email."
                );
            },
            onError: (errors) => {
                setErrors(errors);
                if (errors.email) {
                    toast.error(errors.email);
                } else {
                    toast.error(
                        "Registration failed. Please check the form and try again."
                    );
                }
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        phone: "",
                        password: "",
                        password_confirmation: "",
                    }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        isSubmitting,
                    }) => (
                        <Form className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <FormInput
                                    label="Full Name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.name || serverErrors?.name}
                                    touched={touched.name}
                                    required
                                />

                                <FormInput
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.email || serverErrors?.email}
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
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.phone || serverErrors?.phone}
                                    touched={touched.phone}
                                />

                                <FormInput
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        errors.password ||
                                        serverErrors?.password
                                    }
                                    touched={touched.password}
                                    autoComplete="new-password"
                                    required
                                />

                                <FormInput
                                    label="Confirm Password"
                                    name="password_confirmation"
                                    type="password"
                                    placeholder="••••••••"
                                    value={values.password_confirmation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.password_confirmation}
                                    touched={touched.password_confirmation}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <FormButton
                                type="submit"
                                loading={isSubmitting}
                                fullWidth
                            >
                                {isSubmitting
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </FormButton>
                        </Form>
                    )}
                </Formik>
            </div>
        </AuthLayout>
    );
}
