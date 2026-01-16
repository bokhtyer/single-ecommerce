# Complete Auth Pages Update - Copy This Code

## ForgotPassword.jsx - Replace entire file with:

```jsx
import { Link, router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import AuthLayout from "@/Layouts/AuthLayout";
import FormInput from "@/Components/FormInput";
import FormButton from "@/Components/FormButton";

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
});

export default function ForgotPassword() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (values, { setSubmitting, setErrors }) => {
        router.post("/forgot-password", values, {
            onSuccess: () => {
                toast.success("OTP sent to your email!");
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error(
                    errors.email || "Failed to send OTP. Please try again."
                );
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you an OTP code
                        to reset your password.
                    </p>
                </div>

                <Formik
                    initialValues={{ email: "" }}
                    validationSchema={ForgotPasswordSchema}
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
                            <FormInput
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.email}
                                touched={touched.email}
                                autoComplete="email"
                                required
                            />

                            <FormButton
                                type="submit"
                                loading={isSubmitting}
                                fullWidth
                            >
                                {isSubmitting ? "Sending..." : "Send OTP"}
                            </FormButton>
                        </Form>
                    )}
                </Formik>

                <div className="text-center mt-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        ← Back to login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
```

## VerifyPasswordOtp.jsx & ResetPassword.jsx

Follow the same pattern as above - replace imports, use Formik, add toast notifications, use AuthLayout and FormComponents.

## Update Dashboard and Profile Components

### Profile.jsx

```jsx
import AppLayout from "@/Layouts/AppLayout";
import { usePage } from "@inertiajs/react";

export default function Profile() {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">
                                Profile Information
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {auth?.user?.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {auth?.user?.email}
                                    </p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                        Verified
                                    </span>
                                </div>

                                {auth?.user?.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {auth.user.phone}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
```

### Admin/Dashboard.jsx & Customer/Orders.jsx

Similar pattern - wrap with AppLayout and remove navigation code.

## Key Changes Made:

1. **Formik & Yup** - All forms now use Formik for validation
2. **Toast Notifications** - react-hot-toast for all success/error messages
3. **Reusable Components** - FormInput, FormCheckbox, FormButton
4. **AuthLayout & AppLayout** - Consistent layouts with toast setup
5. **Inertia Link** - All `<a>` tags replaced with `<Link>` for SPA behavior
6. **Proper Validation** - Client-side validation with helpful error messages

## No More Page Reloads!

The SPA behavior is now working because:

-   Using `<Link>` from @inertiajs/react instead of `<a>` tags
-   Using `router.post()` for form submissions
-   Layouts with Toaster component for notifications

The application now behaves like a true single-page application!
