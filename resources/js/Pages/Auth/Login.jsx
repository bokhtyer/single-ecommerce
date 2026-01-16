import { Link, router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
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

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (values, { setSubmitting, setErrors }) => {
        router.post("/login", values, {
            onSuccess: () => {
                toast.success("Login successful! Welcome back.");
            },
            onError: (errors) => {
                setErrors(errors);
                if (errors.email) {
                    toast.error(errors.email);
                } else {
                    toast.error("Login failed. Please check your credentials.");
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
                    }) => (
                        <Form className="mt-8 space-y-6">
                            <div className="space-y-4">
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
                        </Form>
                    )}
                </Formik>
            </div>
        </AuthLayout>
    );
}
