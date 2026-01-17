'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-bold text-stone-800 tracking-tight">
                            ActivityBooker
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-stone-600 hover:text-stone-900 transition-colors">
                            Browse
                        </Link>
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link href="/admin/create" className="text-stone-600 hover:text-stone-900 hover:underline">
                                        Create
                                    </Link>
                                )}
                                <Link href="/dashboard" className="text-stone-600 hover:text-stone-900 transition-colors">
                                    My Bookings
                                </Link>
                                <div className="flex items-center space-x-2 pl-4 border-l border-stone-200">
                                    <span className="text-sm font-medium text-stone-700">{user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-x-4">
                                <Link href="/login" className="text-stone-600 hover:text-stone-900 transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
