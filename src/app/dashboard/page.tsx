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

interface Activity {
    id: number;
    title: string;
    description: string;
    date: string;
    capacity: number;
    _count?: {
        bookings: number;
    };
}

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]); // For admin
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token || !user) return;

        const fetchData = async () => {
            try {
                // Always fetch user bookings
                const bookingsRes = await fetch('/api/bookings/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const bookingsData = await bookingsRes.json();
                if (Array.isArray(bookingsData)) setBookings(bookingsData);

                // If Admin, fetch ALL activities
                if (user.role === 'admin') {
                    const activitiesRes = await fetch('/api/activities', {
                        headers: { Authorization: `Bearer ${token}` }, // Token likely needed if API changes, good practice
                    });
                    const activitiesData = await activitiesRes.json();
                    if (Array.isArray(activitiesData)) setActivities(activitiesData);
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, user]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this activity?')) return;

        try {
            const res = await fetch(`/api/activities/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setActivities(activities.filter(a => a.id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting activity');
        }
    };

    if (!user && !loading) return null;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">

            {/* Admin Management Section */}
            {user?.role === 'admin' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-8">
                        <h1 className="text-4xl font-black text-black uppercase tracking-tighter">
                            Admin Dashboard
                        </h1>
                        <button
                            onClick={() => router.push('/admin/create')}
                            className="bg-black text-white px-6 py-3 rounded-none border-2 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none hover:bg-gray-900 transition-all"
                        >
                            + Add Activity
                        </button>
                    </div>

                    <div className="bg-white border-2 border-black p-6 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-2xl font-bold uppercase mb-6 flex items-center gap-2">
                            <span className="w-4 h-4 bg-[#A0E7E5] border-2 border-black inline-block"></span>
                            Manage Activities
                        </h2>

                        {activities.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex flex-col md:flex-row items-center justify-between p-4 border-2 border-black bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg uppercase">{activity.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-1">{activity.description}</p>
                                            <div className="text-xs font-mono mt-1 bg-black text-white inline-block px-1">
                                                {new Date(activity.date).toLocaleString()} | Cap: {activity.capacity}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 md:mt-0">
                                            <button
                                                onClick={() => router.push(`/admin/edit/${activity.id}`)}
                                                className="px-4 py-1 bg-[#A0E7E5] border-2 border-black font-bold text-sm uppercase hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(activity.id)}
                                                className="px-4 py-1 bg-red-600 text-white border-2 border-black font-bold text-sm uppercase hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic border-l-4 border-gray-300 pl-4">No activities created yet.</p>
                        )}
                    </div>
                </div>
            )}


            {/* My Bookings Section (Visible to everyone) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-black uppercase tracking-tight">Your Bookings</h2>
                    <div className="text-sm font-bold bg-black text-white px-3 py-1">
                        COUNT: {bookings.length}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="flex flex-col md:flex-row bg-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden border-2 border-black"
                        >
                            <div className="p-6 flex-1 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-black text-black uppercase">{booking.activity.title}</h3>
                                    <span className="bg-[#B4F8C8] text-black border-2 border-black px-3 py-1 text-xs font-bold uppercase">
                                        Confirmed
                                    </span>
                                </div>
                                <p className="text-gray-800 font-medium">{booking.activity.description}</p>
                                <div className="flex items-center space-x-6 text-sm font-bold border-t-2 border-dashed border-gray-300 pt-3">
                                    <div className="flex items-center">
                                        📅 {new Date(booking.activity.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        🕒 Booked: {new Date(booking.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {bookings.length === 0 && (
                        <div className="text-center py-16 bg-white border-2 border-dashed border-black">
                            {user?.role === 'admin' ? (
                                <p className="text-black font-bold uppercase">You haven't booked anything personally.</p>
                            ) : (
                                <>
                                    <p className="text-black font-bold uppercase mb-4">You haven't booked any activities yet.</p>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="bg-[#A0E7E5] text-black px-6 py-2 rounded-none font-black border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase"
                                    >
                                        Find an Event
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
