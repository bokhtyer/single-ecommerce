import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';

export default function Profile() {
    const { auth } = usePage().props;

    return (
        <AppLayout>
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <p className="mt-1 text-sm text-gray-900">{auth?.user?.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">{auth?.user?.email}</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                        Verified
                                    </span>
                                </div>

                                {auth?.user?.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <p className="mt-1 text-sm text-gray-900">{auth.user.phone}</p>
                                    </div>
                                )}

                                {auth?.user?.address && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <p className="mt-1 text-sm text-gray-900">{auth.user.address}</p>
                                    </div>
                                )}

                                <div className="pt-5 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        Edit Profile
                                    </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
