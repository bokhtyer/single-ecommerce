import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import AuthLayout from "@/Layouts/AuthLayout";
import FormInput from "@/Components/FormInput";
import FormCheckbox from "@/Components/FormCheckbox";
import FormButton from "@/Components/FormButton";

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
    password: Yup.string().required("Password is required"),
    remember: Yup.boolean(),
});

export default function Login() {
    const { errors: serverErrors, flash } = usePage().props;
    const [unverifiedEmail, setUnverifiedEmail] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
            // Check if it's an unverified account error
            if (
                flash.error.includes("not verified") ||
                flash.error.includes("verification")
            ) {
                // Extract email from the last login attempt if available
                const emailInput = document.querySelector(
                    'input[name="email"]'
                );
                if (emailInput?.value) {
                    setUnverifiedEmail(emailInput.value);
                }
            }
        }
    }, [flash]);

    const handleSubmit = (values, { setSubmitting, setErrors }) => {
        router.post("/login", values, {
            onSuccess: () => {
                toast.success("Login successful! Welcome back.");
                setUnverifiedEmail(null);
            },
            onError: (errors) => {
                setErrors(errors);
                if (errors.email) {
                    toast.error(errors.email);
                    // Check if it's an unverified account error
                    if (
                        errors.email.includes("not verified") ||
                        errors.email.includes("verification")
                    ) {
                        setUnverifiedEmail(values.email);
                    }
                } else {
                    toast.error("Login failed. Please check your credentials.");
                }
            },
            onFinish: () => setSubmitting(false),
        });
    };

    const handleVerifyOtp = () => {
        if (unverifiedEmail) {
            router.visit(
                `/verify-otp?email=${encodeURIComponent(unverifiedEmail)}`
            );
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>

                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                        remember: false,
                    }}
                    validationSchema={LoginSchema}
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
                            // Clear error for this field when user starts typing
                            if (errors[fieldName]) {
                                setFieldError(fieldName, undefined);
                            }
                            // Clear touched state to prevent validation error from showing immediately
                            setFieldTouched(fieldName, false, false);
                            // Hide verification message when user changes input
                            if (unverifiedEmail) {
                                setUnverifiedEmail(null);
                            }
                            handleChange(e);
                        };

                        return (
                            <Form className="mt-8 space-y-6">
                                <div className="space-y-4">
                                    <FormInput
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={values.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={
                                            errors.email || serverErrors?.email
                                        }
                                        touched={touched.email}
                                        autoComplete="email"
                                        required
                                    />

                                    <FormInput
                                        label="Password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={values.password}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={
                                            errors.password ||
                                            serverErrors?.password
                                        }
                                        touched={touched.password}
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <FormCheckbox
                                        label="Remember me"
                                        name="remember"
                                        checked={values.remember}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />

                                    <div className="text-sm">
                                        <Link
                                            href="/forgot-password"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                <FormButton
                                    type="submit"
                                    loading={isSubmitting}
                                    fullWidth
                                >
                                    {isSubmitting ? "Signing in..." : "Sign in"}
                                </FormButton>

                                {unverifiedEmail && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <p className="text-sm text-yellow-800 mb-3">
                                            Your account needs verification.
                                            Please verify your email to
                                            continue.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                        >
                                            Verify OTP
                                        </button>
                                    </div>
                                )}
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </AuthLayout>
    );
}
