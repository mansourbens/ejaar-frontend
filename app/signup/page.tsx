"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { SignupDto, useAuth } from '@/components/auth/auth-provider';
import {Textarea} from "@/components/ui/textarea";

const formSchema = z.object({
    raisonSociale: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
    password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
    confirmPassword: z.string(),
    address: z.string(),
    ICE: z.string(),
    userType: z.enum(['FOURNISSEUR', 'CLIENT']),
}).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUp() {
    const router = useRouter();
    const { toast } = useToast();
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            raisonSociale: '',
            email: '',
            ICE: '',
            password: '',
            address: '',
            confirmPassword: '',
            userType: 'CLIENT',
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true);
            const signupDto: SignupDto = {
                ICE: data.ICE,
                address: data.address,
                raisonSociale: data.raisonSociale,
                email: data.email,
                userType: data.userType,
                password: data.password
            }
            await signup(signupDto);
            toast({
                title: 'Compte créé',
                description: 'Votre compte a été créé avec succès',
                variant: 'default',
            });
            router.push('/dashboard');
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la création de votre compte',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Link href="/" className="flex items-center">
                        <img alt='logo' src='/assets/logos/ejaar_logo_v3.svg' width={200} />
                    </Link>
                </div>
                <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
                    Créer un nouveau compte
                </h2>
                <p className="mt-1 text-center text-sm text-gray-600">
                    Déjà un compte?{' '}
                    <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                        Se connecter
                    </Link>
                </p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-3xl">
                <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* User Type Toggle */}
                            <FormField
                                control={form.control}
                                name="userType"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => field.onChange('CLIENT')}
                                                className={`py-2 px-4 rounded-md text-sm font-medium ${
                                                    field.value === 'CLIENT'
                                                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Entreprise
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => field.onChange('FOURNISSEUR')}
                                                className={`py-2 px-4 rounded-md text-sm font-medium ${
                                                    field.value === 'FOURNISSEUR'
                                                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Fournisseur
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Compact Form Fields */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name="raisonSociale"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm">Raison sociale</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Raison sociale"
                                                    className="py-2 text-sm"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="email@exemple.com"
                                                    className="py-2 text-sm"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="ICE"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-sm">ICE</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="ICE"
                                                        className="py-2 text-sm"
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-sm">Adresse</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Adresse"
                                                        className="text-sm resize-none"
                                                        rows={3}
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-sm">Mot de passe</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder="••••••"
                                                        className="py-2 text-sm"
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-sm">Confirmation</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder="••••••"
                                                        className="py-2 text-sm"
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start space-x-2">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    required
                                />
                                <label htmlFor="terms" className="text-xs text-gray-600">
                                    J'accepte les{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-500">
                                        conditions
                                    </a>{' '}
                                    et la{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-500">
                                        politique de confidentialité
                                    </a>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-2 px-4 bg-ejaar-800 hover:bg-ejaar-700 text-sm font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Création...
                                    </>
                                ) : (
                                    'Créer un compte'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
