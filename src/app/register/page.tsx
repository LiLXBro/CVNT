'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#A0E7E5] border-2 border-black rounded-full z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#FFAEBC] border-2 border-black rotate-45 z-10"></div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase">
                        Join the Clique
                    </h1>
                    <p className="text-gray-600 font-medium mt-2">Unlock exclusive drops</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-[#FF6B6B] text-black font-bold border-2 border-black rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-black uppercase mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            placeholder="REKHA AMITABH"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black uppercase mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            placeholder="YOU@EXAMPLE.COM"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black uppercase mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full py-4 text-lg" isLoading={loading}>
                        Sign Up
                    </Button>

                    <p className="text-center text-sm text-black font-medium">
                        Already in?{' '}
                        <Link href="/login" className="text-[#FF90E8] hover:text-black transition-colors font-bold underline decoration-2">
                            Log In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
