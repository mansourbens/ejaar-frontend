"use client";

import {useEffect, useState} from 'react';
import {Plus, Search, UserPlus, Users as UsersIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {useToast} from '@/hooks/use-toast';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import MainLayout from "@/components/layouts/main-layout";
import {Textarea} from "@/components/ui/textarea";
import {Quotation} from "@/lib/mock-data";
import {fetchWithToken, formatRelativeTime, rolePipe, UserRole} from "@/lib/utils";
import {useAuth} from "@/components/auth/auth-provider";
import {User} from "@/app/users/page";


export interface Supplier {
    id?: number;
    ICE: string;
    email: string;
    raisonSociale?: string;
    telephone?: string;
    address?: string;
    users?: User[];
    quotations?: Quotation[];
    createdAt?: Date,
    updatedAt?: Date
}
export interface Client {
    id?: number;
    ICE?: string;
    raisonSociale?: string;
    telephone?: string;
    address?: string;
    users?: User[];
    createdAt?: Date,
    updatedAt?: Date
}
const formSchema = z.object({
    name: z.string().min(1, { message: "Le nom est requis" }),
    email: z.string().email({ message: "Email invalide" }),
    userType: z.enum(["COMMERCIAL", "CLIENT"], {
        required_error: "Veuillez sélectionner un rôle",
    }),
    siren: z.string().optional(),
    raisonSociale: z.string().optional(),
    telephone: z
        .string()
        .regex(/^\d{9}$/, { message: "Le numéro doit contenir exactement 9 chiffres" })
        .optional(),
    adresse: z.string().optional(),
});

export default function SupplierUsersPage() {
    const {toast} = useToast();
    const {user} = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            email: '',
            userType: 'CLIENT',
        },
    });

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
            if (data.userType === 'CLIENT') {
                try {
                    const client: Client = {
                        address: data.adresse,
                        createdAt: new Date(),
                        raisonSociale: data.raisonSociale,
                        telephone: data.telephone,
                        ICE: data.siren
                    }
                    const newUser: User = {
                        role: {
                           name:  UserRole.CLIENT
                        },
                        client,
                        email: data.email,
                        createdAt: new Date().toLocaleDateString(),
                        supplier: user?.supplier,
                        fullName: data.name,
                    }
                    const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/clients`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newUser),
                    });
                    const result = await res.json();

                    if (!res.ok) {
                        // Handle errors returned from backend
                        console.error('Error:', result.message || 'Something went wrong');
                        toast({
                            title: 'Erreur',
                            description: "Erreur lors de la création de l'utilisateur. Veuillez réessayer.",
                            variant: 'destructive',
                        });
                    } else {
                        toast({
                            title: 'Succès',
                            description: "L'utilisateur a été créé avec succès.",
                        });
                        setIsDialogOpen(false);
                        form.reset();
                    }


                } catch (error) {
                    toast({
                        title: 'Erreur',
                        description: "Erreur lors de la création de l'utilisateur. Veuillez réessayer.",
                        variant: 'destructive',
                    });
                }
            }
            const newSupplier : Supplier = {
                raisonSociale: data.name,
                ICE: data.siren!,
                address: data.adresse!,
                email: data.email
            }

    };

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter(user => user.id !== userId));
        toast({
            title: 'Succès',
            description: 'Utilisateur supprimé avec succès',
        });
    };

    async function fetchUsers() {
        try {
            setLoading(true);
            const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/users/by-supplier/${user?.supplier?.id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: User[] = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);
    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
                        <p className="text-muted-foreground">
                            Gérer les comptes utilisateurs et leurs rôles.
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#266CA9] hover:bg-[#266CA9DD]">
                                <UserPlus className="mr-2 h-4 w-4"/> Ajouter un utilisateur
                            </Button>
                        </DialogTrigger>
                        <DialogContent >
                            <DialogHeader>
                                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                                <DialogDescription>
                                    Créez un nouveau compte utilisateur. L'utilisateur recevra un e-mail avec ses identifiants de connexion.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form} >
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="max-h-[70vh] overflow-y-auto p-2 mr-[-12px]" >
                                        {/* Name Field */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Entrer le nom de l'utilisateur" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email Field */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="Entrer l'email de l'utilisateur" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Role Select Field */}
                                        <FormField
                                            control={form.control}
                                            name="userType"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Type d'utilisateur</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder="Sélectionner un type d'utilisateur"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="CLIENT">Client</SelectItem>
                                                            <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        {form.watch("userType") === "CLIENT" && (
                                            <>
                                                {/* SIREN */}
                                                <FormField
                                                    control={form.control}
                                                    name="siren"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>SIREN</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Entrer le SIREN" {...field} />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                {/* RAISON SOCIALE */}
                                                <FormField
                                                    control={form.control}
                                                    name="raisonSociale"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Raison sociale</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Entrer la raison sociale" {...field} />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Telephone with +212 prefix */}
                                                <FormField
                                                    control={form.control}
                                                    name="telephone"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Téléphone</FormLabel>
                                                            <FormControl>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-gray-600">+212</span>
                                                                    <Input
                                                                        placeholder="6 12 34 56 78"
                                                                        {...field}
                                                                        onChange={(e) => {
                                                                            // Allow only numbers
                                                                            const onlyNums = e.target.value.replace(/\D/g, "");
                                                                            field.onChange(onlyNums);
                                                                        }}
                                                                        maxLength={9}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Adresse Textarea */}
                                                <FormField
                                                    control={form.control}
                                                    name="adresse"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Adresse</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Entrer l'adresse complète" {...field} />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        )}
                                    </div>
                                    {/* Submit Button */}
                                    <DialogFooter>
                                        <Button type="submit" className="bg-[#266CA9] hover:bg-[#266CA9DD]">
                                            Créer l'utilisateur
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Rechercher des utilisateurs..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-primary/10 p-4 mb-4">
                            <UsersIcon className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="text-lg font-semibold">Aucun utilisateur pour l'instant</h3>
                        <p className="text-muted-foreground mt-2 mb-4 max-w-sm">
                            Commencez par ajouter votre premier utilisateur. Il recevra un e-mail avec ses identifiants de connexion.
                        </p>
                        <Button className="bg-[#266CA9] hover:bg-[#266CA9DD]"
                                onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4"/> Ajouter un premier utilisateur
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rôle</TableHead>
                                    <TableHead>Dernière connexion</TableHead>
                                    <TableHead>Date de création</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.fullName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.role?.name === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rolePipe(user?.role?.name ?? UserRole.CLIENT)}
                    </span>
                                        </TableCell>
                                        <TableCell>
                                            {user.lastConnectionAt ? (
                                                <span
                                                    title={formatRelativeTime(user.lastConnectionAt).fullDate}
                                                    className="cursor-help"
                                                >{formatRelativeTime(user.lastConnectionAt).relativeTime}
                                              </span>
                                            ) : (
                                                '—'
                                            )}                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt ?? '').toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
