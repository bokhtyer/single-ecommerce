import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function AdminHeader({ onMenuClick }) {
    const { auth } = usePage().props;

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Hamburger Menu Button */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden mr-3 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">
                            Admin Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            Welcome, {auth?.user?.name}
                        </span>
                        <button
                            onClick={() => router.post("/logout")}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
