'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Activity {
    id: number;
    title: string;
    description: string;
    date: string;
    capacity: number;
}

export default function Home() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();
    const router = useRouter();
    const [bookingLoading, setBookingLoading] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/activities')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setActivities(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleBook = async (activityId: number) => {
        if (!user) {
            router.push('/login');
            return;
        }

        setBookingLoading(activityId);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ activityId }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Booking failed');
            } else {
                alert('Booking successful!');
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Booking error', error);
            alert('An error occurred');
        } finally {
            setBookingLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-sm bg-[#Fdf5e6] flex flex-col justify-center items-center text-center p-8 border border-stone-100">
                <div className="max-w-3xl space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">
                        Discover Your Next<br />
                        <span className="text-stone-600">
                            Epic Adventure
                        </span>
                    </h1>
                    <p className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
                        Explore and book exclusive activities curated just for you. Simple, seamless, and memorable.
                    </p>
                </div>
            </div>

            {/* Activity Grid */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white pl-2 border-l-4 border-blue-500">
                    Available Activities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="group bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col"
                        >
                            <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                                {/* Placeholder for activity specific image if available, else usage pattern */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                                    {new Date(activity.date).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="p-6 space-y-4 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                                    {activity.title}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
                                    {activity.description || "No description available."}
                                </p>

                                <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                                    <div className="text-sm text-gray-500 dark:text-gray-500">
                                        Capacity: <span className="font-semibold text-gray-900 dark:text-gray-300">{activity.capacity}</span>
                                    </div>
                                    <Button
                                        onClick={() => handleBook(activity.id)}
                                        isLoading={bookingLoading === activity.id}
                                        className="px-6"
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {activities.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <p className="text-gray-500 dark:text-gray-400 text-xl">No activities found. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
