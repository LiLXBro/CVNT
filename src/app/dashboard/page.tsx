'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Booking {
    id: number;
    activity: {
        title: string;
        date: string;
        description: string;
    };
    createdAt: string;
}

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token) return;

        fetch('/api/bookings/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setBookings(data);
            })
            .finally(() => setLoading(false));
    }, [token]);

    if (!user && !loading) {
        router.push('/login');
        return null;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Bookings: {bookings.length}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800"
                    >
                        <div className="p-6 flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{booking.activity.title}</h3>
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                                    Confirmed
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{booking.activity.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    {new Date(booking.activity.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {bookings.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">You haven't booked any activities yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
