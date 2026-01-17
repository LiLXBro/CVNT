'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            login(data.token, data.user);
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
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#FF90E8] border-2 border-black rounded-full z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#B4F8C8] border-2 border-black rotate-12 z-10"></div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 font-medium mt-2">Ready for the next adventure?</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-[#FF6B6B] text-black font-bold border-2 border-black rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-[#B4F8C8] p-4 rounded-lg mb-6 text-sm text-black border-2 border-black mb-6">
                    <p className="font-bold mb-1 uppercase tracking-wide">Demo Account:</p>
                    <p>Email: admin@example.com</p>
                    <p>Password: admin123</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        Let's Go
                    </Button>

                    <p className="text-center text-sm text-black font-medium">
                        New here?{' '}
                        <Link href="/register" className="text-[#FF90E8] hover:text-black transition-colors font-bold underline decoration-2">
                            Create Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
