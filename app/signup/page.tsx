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
            if (data.userType === 'FOURNISSEUR') {
                router.push('/dashboard');
            } else {
                router.push('/quotations');
            }
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
        <div className="min-h-screen flex flex-col justify-center">
            <div className="bg-ejaar-beige flex flex-col items-center flex-1 py-12 sm:px-6 lg:px-8">
                <div className="my-auto">
                    <div className="">
                        <div className="flex justify-center">
                            <Link href="/" className="flex items-center">
                                <img alt='logo' src='/assets/logos/ejaar_logo_v4.svg' width={300} />
                            </Link>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-ejaar-700">
                            Créer un nouveau compte
                        </h2>
                        <p className="mt-2 text-center text-lg text-gray-600">
                            Déjà un compte?{' '}
                            <Link
                                href="/signin"
                                className="font-medium text-ejaar-red"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 min-w-[36rem]">
                        <div className="py-8 shadow sm:rounded-lg sm:px-10 bg-white/50 rounded-3xl hover:shadow-xl">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                                    {/* User Type Toggle */}
                                    <FormField
                                        control={form.control}
                                        name="userType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange('CLIENT')}
                                                        className={`py-3 px-4 rounded-md text-lg font-medium ${
                                                            field.value === 'CLIENT'
                                                                ? 'bg-ejaar-700 text-ejaar-beige border border-ejaar-700'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        Entreprise
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange('FOURNISSEUR')}
                                                        className={`py-3 px-4 rounded-md text-lg font-medium ${
                                                            field.value === 'FOURNISSEUR'
                                                                ? 'bg-ejaar-700 text-ejaar-beige border border-ejaar-700'
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
                                    <div className="divider-ejaar border-t-2 !mt-4 border-dashed border-gray-400 w-[200px] h-1 mx-auto"></div>
                                    {/* Form Fields with signin styling */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="raisonSociale"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xl text-ejaar-700">Raison sociale <span className="text-ejaar-red">*</span> </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="outline-none bg-ejaar-beige ring-2 ring-ring ring-offset-2"
                                                                {...field}
                                                                placeholder="Raison sociale"
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
                                                        <FormLabel className="text-xl text-ejaar-700">Email  <span className="text-ejaar-red">*</span> </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="outline-none bg-ejaar-beige ring-2 ring-ring ring-offset-2"
                                                                {...field}
                                                                type="email"
                                                                placeholder="email@exemple.com"
                                                                disabled={isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="ICE"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xl text-ejaar-700">ICE  <span className="text-ejaar-red">*</span> </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="outline-none bg-ejaar-beige ring-2 ring-ring ring-offset-2"
                                                                {...field}
                                                                placeholder="ICE"
                                                                disabled={isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xl text-ejaar-700">Adresse</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                className="outline-none bg-ejaar-beige ring-2 ring-ring ring-offset-2 min-h-[60px]"
                                                                {...field}
                                                                placeholder="Adresse"
                                                                disabled={isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xl text-ejaar-700">Mot de passe</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="outline-none bg-ejaar-beige ring-2 ring-ring ring-offset-2"
                                                                {...field}
                                                                type="password"
                                                                placeholder="••••••"
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
                                                        <FormLabel className="text-xl text-ejaar-700">Confirmation</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="outline-none bg-ejaar-beige ring-2 ring-ring ring-offset-2"
                                                                {...field}
                                                                type="password"
                                                                placeholder="••••••"
                                                                disabled={isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
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
                                        <label htmlFor="terms" className="text-sm text-gray-600">
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
                                        className="w-full bg-ejaar-red hover:bg-ejaar-redHover"
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
            </div>

            <div className="bg-ejaar-700 py-12 sm:px-6 lg:px-8 max-h-[300px]"></div>
        </div>
    );
}
