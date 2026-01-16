import { Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function VerifyPasswordOtp({ email }) {
    const { flash } = usePage().props;
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: email,
        otp: "",
    });

    const { post: resendPost, processing: resendProcessing } = useForm({
        email: email,
    });

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/verify-password-otp");
    };

    const handleResend = () => {
        resendPost("/resend-password-otp", {
            onSuccess: () => {
                setTimer(60);
                setCanResend(false);
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Verify OTP
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent a 6-digit OTP code to
                        <br />
                        <span className="font-medium text-gray-900">
                            {email}
                        </span>
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 p-4">
                        <p className="text-sm text-green-800">
                            {flash.success}
                        </p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="otp"
                            className="block text-sm font-medium text-gray-700 text-center"
                        >
                            Enter OTP Code
                        </label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            maxLength="6"
                            value={data.otp}
                            onChange={(e) =>
                                setData(
                                    "otp",
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            className="mt-2 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-widest sm:text-3xl"
                            placeholder="000000"
                            autoComplete="off"
                        />
                        {errors.otp && (
                            <p className="mt-2 text-sm text-red-600 text-center">
                                {errors.otp}
                            </p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing || data.otp.length !== 6}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>

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
                                disabled={resendProcessing}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                            >
                                {resendProcessing ? "Sending..." : "Resend OTP"}
                            </button>
                        )}
                    </div>
                </form>

                <div className="text-center">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to forgot password
                    </Link>
                </div>
            </div>
        </div>
    );
}
