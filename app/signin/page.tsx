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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast({
        title: 'Succès',
        description: 'Connexion avec succès',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Identifiants invalides',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col justify-center ">

      <div className="bg-ejaar-beige flex flex-col items-center flex-1 py-12 sm:px-6 lg:px-8">
        <div className="my-auto">
          <div className="">
            <div className="flex justify-center">
              <Link href="/" className="flex items-center">
                <img alt='logo' src='/assets/logos/ejaar_logo_v4.svg' width={300} />
              </Link>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-ejaar-700">
              Connectez-vous à votre compte
            </h2>
            <p className="mt-2 text-center text-lg text-gray-600">
              Ou{' '}
              <Link
                  href="/signup"
                  className="font-medium text-ejaar-red"
              >
                créer un compte rapidement
              </Link>
            </p>
          </div>

          <div className="mt-8 min-w-[36rem] ">
            <div className="py-8  shadow sm:rounded-lg sm:px-10 bg-white/50 rounded-3xl hover:shadow-xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                  <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xl text-ejaar-700">Email</FormLabel>
                            <FormControl>
                              <Input
                                  className="outline-none bg-ejaar-beige ring-2 ring-ring ring-offset-2"
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
                                  placeholder="Entrez votre mot de passe"
                                  autoComplete="current-password"
                                  disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Rester connecté
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Mot de passe oublié ?
                      </a>
                    </div>
                  </div>

                  <Button
                      type="submit"
                      className="w-full bg-ejaar-red hover:bg-ejaar-redHover"
                      disabled={isLoading}
                  >
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                    ) : (
                        'Se connecter'
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
