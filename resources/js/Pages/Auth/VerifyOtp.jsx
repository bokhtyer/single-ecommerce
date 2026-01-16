import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import AuthLayout from "@/Layouts/AuthLayout";
import FormButton from "@/Components/FormButton";

const OtpSchema = Yup.object().shape({
    otp: Yup.string()
        .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits")
        .required("OTP is required"),
});

export default function VerifyOtp({ email }) {
    const { flash } = usePage().props;
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleSubmit = (values, { setSubmitting, setErrors }) => {
        router.post(
            "/verify-otp",
            { ...values, email },
            {
                onSuccess: () => {
                    toast.success("Email verified successfully!");
                },
                onError: (errors) => {
                    setErrors(errors);
                    toast.error(
                        errors.otp || "Verification failed. Please try again."
                    );
                },
                onFinish: () => setSubmitting(false),
            }
        );
    };

    const handleResend = () => {
        setResending(true);
        router.post(
            "/resend-otp",
            { email },
            {
                onSuccess: () => {
                    setTimer(60);
                    setCanResend(false);
                },
                onError: () => {
                    toast.error("Failed to resend OTP. Please try again.");
                },
                onFinish: () => setResending(false),
            }
        );
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Verify Your Email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent a 6-digit OTP code to
                        <br />
                        <span className="font-medium text-gray-900">
                            {email}
                        </span>
                    </p>
                </div>

                <Formik
                    initialValues={{ otp: "" }}
                    validationSchema={OtpSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        isSubmitting,
                        setFieldValue,
                    }) => (
                        <Form className="mt-8 space-y-6">
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="block text-sm font-medium text-gray-700 text-center mb-2"
                                >
                                    Enter OTP Code
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    value={values.otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(
                                            /\D/g,
                                            ""
                                        );
                                        if (value.length <= 6) {
                                            setFieldValue("otp", value);
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    maxLength={6}
                                    autoComplete="off"
                                    className={`
                                        mt-2 appearance-none relative block w-full px-3 py-3 
                                        border rounded-md placeholder-gray-500 text-gray-900
                                        focus:outline-none focus:z-10 text-center text-2xl tracking-widest
                                        ${
                                            errors.otp && touched.otp
                                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                        }
                                    `}
                                    placeholder="000000"
                                />
                                {errors.otp && touched.otp && (
                                    <p className="mt-2 text-sm text-red-600 text-center flex items-center justify-center">
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
                                        {errors.otp}
                                    </p>
                                )}
                            </div>

                            <FormButton
                                type="submit"
                                loading={isSubmitting}
                                disabled={values.otp.length !== 6}
                                fullWidth
                            >
                                {isSubmitting ? "Verifying..." : "Verify Email"}
                            </FormButton>

                            <div className="text-center">
                                {!canResend ? (
                                    <p className="text-sm text-gray-600">
                                        Resend OTP in{" "}
                                        <span className="font-medium text-indigo-600">
                                            {timer}s
                                        </span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resending}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                                    >
                                        {resending
                                            ? "Sending..."
                                            : "Resend OTP"}
                                    </button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>

                <div className="text-center mt-4">
                    <Link
                        href="/register"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to registration
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
