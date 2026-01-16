import { Toaster } from "react-hot-toast";
import { Link, usePage, router } from "@inertiajs/react";

export default function AppLayout({ children }) {
    const { auth } = usePage().props;

    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#fff",
                        color: "#363636",
                        padding: "16px",
                        borderRadius: "8px",
                        boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    },
                    success: {
                        duration: 4000,
                        iconTheme: {
                            primary: "#10B981",
                            secondary: "#fff",
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: "#EF4444",
                            secondary: "#fff",
                        },
                    },
                }}
            />
            <div className="min-h-screen bg-gray-100">
                {auth?.user && (
                    <nav className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center space-x-8">
                                    <Link
                                        href="/"
                                        className="text-xl font-bold text-gray-900"
                                    >
                                        Store
                                    </Link>
                                    {auth.user.role === "customer" && (
                                        <div className="flex space-x-4">
                                            <Link
                                                href="/profile"
                                                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/orders"
                                                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Orders
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">
                                        {auth.user.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                )}
                <main>{children}</main>
            </div>
        </>
    );
}
