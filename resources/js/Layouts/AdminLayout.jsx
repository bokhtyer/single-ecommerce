import { useState } from "react";
import { Toaster } from "react-hot-toast";
import AdminHeader from "@/Components/Admin/AdminHeader";
import AdminSidebar from "@/Components/Admin/AdminSidebar";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gray-100">
                <AdminHeader
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <div className="flex relative">
                    <AdminSidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />

                    <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 w-full lg:w-auto max-w-7xl">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
