"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { HardDrive, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";

const formSchema = z.object({
    fullName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
    password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
    confirmPassword: z.string(),
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
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            userType: 'CLIENT',
        },
    });

    const onSubmit = async (data: FormValues) => {
        console.log(data);
        try {
            setIsLoading(true);
            await signup(data.fullName, data.email, data.password, data.userType);
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
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Header section remains the same */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Link href="/" className="flex items-center">
                        <img alt='logo' src='/assets/logos/ejaar_logo_v2.svg' width={328} height={80} />
                    </Link>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Créer un nouveau compte
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ou{' '}
                    <Link
                        href="/signin"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        connectez-vous à votre compte existant
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Form {...form}>
                        {/* User Type Tabs */}
                        <div className="mb-6">
                            <FormField
                                control={form.control}
                                name="userType"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="border-b border-gray-200">
                                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange('CLIENT')}
                                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                                        field.value === 'CLIENT'
                                                            ? 'border-blue-500 text-blue-600'
                                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                                >
                                                    Entreprise
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange('FOURNISSEUR')}
                                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                                        field.value === 'FOURNISSEUR'
                                                            ? 'border-blue-500 text-blue-600'
                                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                                >
                                                    Fournisseur
                                                </button>
                                            </nav>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Tab Content */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Common Fields (visible in both tabs) */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom complet</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Entrez votre nom complet"
                                                autoComplete="name"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="Entrez votre email"
                                                autoComplete="email"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

{/*                             Conditional Fields based on Tab
                            {form.watch('userType') === 'FOURNISSEUR' && (
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom de l'entreprise</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Entrez le nom de votre entreprise"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}*/}

                            {/* More common fields */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Créez un mot de passe"
                                                autoComplete="new-password"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Confirmez votre mot de passe"
                                                autoComplete="new-password"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Terms and Submit */}
                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    required
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                    J'accepte les{' '}
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        Conditions d'utilisation
                                    </a>{' '}
                                    et la{' '}
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        Politique de confidentialité
                                    </a>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-ejaar-800 hover:bg-ejaar-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Création du compte...
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
