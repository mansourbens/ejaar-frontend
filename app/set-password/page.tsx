'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Token is missing.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/set-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'An error occurred');
            }

            setSuccess(true);

            setTimeout(() => {
                router.push('/signin');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md flex flex-col">
                <div className="flex m-auto items-center mb-6">
                    <img alt='logo' src='/assets/logos/ejaar_logo_v3.svg' width={164} height={40}  />
                </div>
                <h1 className="mb-6 text-2xl font-bold text-center">Créer votre mot de passe</h1>

                {success ? (
                    <div className="text-green-600 text-center mb-4">Mot de passe créé avec succès ! Redirection...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded border p-2"
                        />
                        <input
                            type="password"
                            placeholder="Confirmez le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="rounded border p-2"
                        />
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'En cours...' : 'Créer le mot de passe'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
