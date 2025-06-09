"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {User} from "@/app/users/page";
import {UserRole} from "@/lib/utils";
import {CategorieCA} from "@/components/ejaar-settings/rate-config";


type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (signupDto: SignupDto) => Promise<void>;
    logout: () => void;
    loading: boolean;
};
export type SignupDto = {
    ICE: string;
    address: string;
    raisonSociale: string;
    caCategory: CategorieCA;
    email: string;
    password: string;
    userType: string;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

const publicRoutes = ['/', '/signin', '/signup', '/set-password', '/contact'];

export default function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = async (token: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch user');
            console.log(res);
            const data = await res.json();
            console.log(data);
            setUser(data.user);
        } catch (err) {
            console.error('Error fetching user:', err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('ejaar_token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user && !publicRoutes.includes(pathname)) {
                router.push('/signin');
            }
            if (user && (pathname === '/signin' || pathname === '/signup')) {
                if (user.role.name === UserRole.CLIENT) {
                    router.push('/quotations');
                } else {
                    router.push('/dashboard');
                }
            }
        }
    }, [user, loading, pathname, router]);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            if (!res.ok) throw new Error('Login failed');
            const {access_token, user} = await res.json();
            console.log(res);
            localStorage.setItem('ejaar_token', access_token);
            setUser(user);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (signupDto: SignupDto) => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(signupDto),
            });

            if (!res.ok) throw new Error('Signup failed');
            const {token, user} = await res.json();

            localStorage.setItem('ejaar_token', token);
            setUser(user);
            router.push('/dashboard');
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('ejaar_token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{user, login, signup, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
}
