'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function EditActivityPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { user, token } = useAuth();
    const router = useRouter();
    const id = params.id;

    useEffect(() => {
        if (!token) return;

        // Fetch existing data
        fetch(`/api/activities/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setTitle(data.title);
                setDescription(data.description || '');
                // Format date for datetime-local input (YYYY-MM-DDThh:mm)
                const d = new Date(data.date);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                setDate(d.toISOString().slice(0, 16));
                setCapacity(data.capacity.toString());
            })
            .catch(err => {
                console.error(err);
                alert('Failed to load activity');
                router.push('/');
            })
            .finally(() => setLoading(false));
    }, [id, token, router]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <p className="text-[#FF6B6B] text-xl font-black uppercase">Access Denied. Admins only.</p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/activities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    date,
                    capacity: Number(capacity),
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to update activity');
            }

            router.push('/');
        } catch (error) {
            alert('Error updating activity');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center font-bold">Loading...</div>;

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#A0E7E5] border-2 border-black rounded-full z-10"></div>

                <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-8 text-center">
                    Edit Activity
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-black uppercase mb-2">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black uppercase mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-black uppercase mb-2">Date</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-black uppercase mb-2">Capacity</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-white hover:bg-gray-50 text-black border-2 border-black"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" isLoading={saving}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
