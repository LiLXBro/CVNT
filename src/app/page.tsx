'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';


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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden bg-[#232323] flex flex-col justify-center items-center text-center p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="max-w-4xl space-y-6 relative z-10">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none break-words text-[#FF90E8]">
                        Wear CVNT
                    </h1>
                    <p className="text-xl md:text-2xl text-white font-bold bg-black inline-block px-4 py-1 -rotate-2 border border-white">
                        Curated experiences for the bold.
                    </p>
                </div>
                {/* Abstract shapes */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-[#B4F8C8] rounded-full border-2 border-black"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#A0E7E5] rotate-12 border-2 border-black"></div>
            </div>

            {/* Activity Grid */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-4 w-4 bg-[#FF6B6B] border-2 border-black rounded-full"></div>
                    <h2 className="text-4xl font-black text-black uppercase tracking-tight">
                        Drops & Events
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="group bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
                        >
                            <div className="h-48 bg-[#FFAEBC] relative border-b-2 border-black overflow-hidden group-hover:bg-[#FF90E8] transition-colors">
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    <span className="text-8xl font-black text-black rotate-12">CVNT</span>
                                </div>
                                <div className="absolute top-4 right-4 bg-white border-2 border-black px-3 py-1 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    {new Date(activity.date).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="p-6 space-y-4 flex-1 flex flex-col">
                                <h3 className="text-2xl font-black text-black uppercase leading-tight">
                                    {activity.title}
                                </h3>

                                <p className="text-gray-800 font-medium line-clamp-3 flex-1 border-l-4 border-[#A0E7E5] pl-3">
                                    {activity.description || "No description available."}
                                </p>

                                <div className="pt-4 space-y-4">
                                    <div className="flex items-center justify-between text-sm font-bold border-t-2 border-black pt-2 border-dashed">
                                        <span>CAPACITY</span>
                                        <span className="bg-black text-white px-2 py-0.5">{activity.capacity}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleBook(activity.id)}
                                            isLoading={bookingLoading === activity.id}
                                            className="flex-1"
                                        >
                                            Cop It
                                        </Button>

                                        {user?.role === 'admin' && (
                                            <>
                                                <button
                                                    onClick={() => router.push(`/admin/edit/${activity.id}`)}
                                                    className="px-3 py-2 bg-[#A0E7E5] border-2 border-black font-bold hover:bg-[#81d4d2] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                                    title="Edit"
                                                >
                                                    ✎
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(activity.id)}
                                                    className="px-3 py-2 bg-[#FF6B6B] border-2 border-black font-bold hover:bg-[#ff5252] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                                    title="Delete"
                                                >
                                                    ✕
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {activities.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border-2 border-black border-dashed flex flex-col items-center justify-center gap-4">
                        <p className="text-black font-bold text-xl uppercase">No drops available. Check back later.</p>
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => router.push('/admin/create')}
                                className="bg-[#A0E7E5] text-black px-8 py-3 rounded-lg font-bold border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wide"
                            >
                                + Create First Drop
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
