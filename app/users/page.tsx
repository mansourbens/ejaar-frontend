"use client";

import {useEffect, useState} from 'react';
import {
    CircleXIcon,
    FileDown,
    MoreVertical,
    Plus,
    Search,
    TextSearch,
    UserPlus,
    Users as UsersIcon
} from 'lucide-react';
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
import {fetchWithToken, formatRelativeTime, rolePipe, UserRole} from "@/lib/utils";
import {Client, Supplier} from "@/app/supplier-users/page";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useAuth} from "@/components/auth/auth-provider";

export interface User {
    id?: string;
    fullName: string;
    email: string;
    role: {
        id?: number;
        name: UserRole;
    };
    supplier?: Supplier;
    createdAt: string;
    lastConnectionAt?: Date;
    client?: Client;
}


const formSchema = z.object({
    name: z.string().min(1, {message: "Le nom est requis"}),
    email: z.string().email({message: "Email invalide"}),
    userType: z.enum(["FOURNISSEUR", "BANQUE"], {
        required_error: "Veuillez sélectionner un rôle",
    }),
    siren: z.string().optional(),
    telephone: z
        .string()
        .regex(/^\d{9}$/, {message: "Le numéro doit contenir exactement 9 chiffres"})
        .optional(),
    adresse: z.string().optional(),
});

export default function UsersPage() {
    const {toast} = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [activeUser, setActiveUser] = useState<User |  null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            email: '',
            userType: 'FOURNISSEUR',
        },
    });
    const {user} = useAuth();
    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (data.userType === 'FOURNISSEUR') {
            const newSupplier: Supplier = {
                raisonSociale: data.name,
                ICE: data.siren!,
                address: data.adresse!,
                email: data.email,
                telephone: data.telephone
            }
            try {
                const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(newSupplier),
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
        } else {
            try {
                const createUserDTO: { fullName: string, email: string } = {
                    email: data.email,
                    fullName: data.name
                };
                const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/users/bank`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(createUserDTO),
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
    };

    const handleDeleteUser = async()  => {
        const activeUserId = activeUser?.id;
        setActiveUser(null);

        try {
            const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${activeUserId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            toast({
                title: 'Succès',
                description: "Utilisateur supprimé avec succès.",
                variant: 'success',
            });
            setIsDeleteDialogOpen(false);
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Erreur',
                description: "Erreur lors de la suppression de l'uilisateur. Veuillez réessayer.",
                variant: 'destructive',
            });
            console.error(error);
        } finally {
        }
    };

    async function fetchUsers() {
        try {
            setLoading(true);
            const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);

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
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                                <DialogDescription>
                                    Créez un nouveau compte utilisateur. L'utilisateur recevra un e-mail avec ses
                                    identifiants de connexion.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form} >
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="max-h-[70vh] overflow-y-auto p-2 mr-[-12px]">
                                        {/* Name Field */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Nom ou Raison Sociale</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Entrer le nom de l'utilisateur" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email Field */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email"
                                                               placeholder="Entrer l'email de l'utilisateur" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
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
                                                            <SelectItem value="FOURNISSEUR">Fournisseur</SelectItem>
                                                            <SelectItem value="BANQUE">Banque</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
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
                            Commencez par ajouter votre premier utilisateur. Il recevra un e-mail avec ses identifiants
                            de connexion.
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
                                    <TableHead>Nom ou Raison Sociale</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rôle</TableHead>
                                    <TableHead>Dernière connexion</TableHead>
                                    <TableHead>Date de création</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((rowUser) => (
                                    <TableRow key={rowUser.id}>
                                        <TableCell className="font-medium">{rowUser.fullName ?? (rowUser.client?.raisonSociale ?? rowUser.supplier?.raisonSociale)}</TableCell>
                                        <TableCell>{rowUser.email}</TableCell>
                                        <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rowUser?.role.name === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rolePipe(rowUser?.role.name)}
                    </span>
                                        </TableCell>
                                        <TableCell>
                                            {rowUser.lastConnectionAt ? (
                                                <span
                                                    title={formatRelativeTime(rowUser.lastConnectionAt).fullDate}
                                                    className="cursor-help"
                                                >{formatRelativeTime(rowUser.lastConnectionAt).relativeTime}
                                              </span>
                                            ) : (
                                                '—'
                                            )}                                        </TableCell>
                                        <TableCell>
                                            {new Date(rowUser.createdAt)?.toLocaleDateString('fr-FR')}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="icon" title="Actions">
                                                        <MoreVertical className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {user?.role.name === UserRole.SUPER_ADMIN && <DropdownMenuItem
                                                        onClick={() => {
                                                            setActiveUser(rowUser);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    >
                                                        <CircleXIcon className="w-4 h-4 mr-2"/>
                                                        Supprimer
                                                    </DropdownMenuItem>}
                                                    {user?.role.name === UserRole.SUPER_ADMIN  && (
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setActiveUser(rowUser);
                                                                setIsDetailsDialogOpen(true);
                                                            }}
                                                        >
                                                            <TextSearch className="w-4 h-4 mr-2"/>
                                                            Voir les détails
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg border border-red-100 shadow-xl">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-red-50">
                                <CircleXIcon className="h-5 w-5 text-red-600"/>
                            </div>
                            <DialogTitle className="text-red-900 text-lg font-semibold">
                                Suppression de l'utilisateur {activeUser?.email}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="py-4 px-2">
                        <p className="text-sm text-gray-700">
                            Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur? Cette action est irréversible.
                        </p>
                    </div>

                    <DialogFooter className="sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setActiveUser(null); setIsDeleteDialogOpen(false)}}
                            className="border-gray-700 text-gray-700 hover:bg-gray-50"
                        >
                            Non
                        </Button>
                        <Button
                            onClick={handleDeleteUser}
                            className="bg-red-900 hover:bg-red-800 text-white shadow-sm"
                        >
                            Oui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white rounded-lg border shadow-xl">
                    <DialogHeader>
                        <DialogTitle>Détails de l'utilisateur</DialogTitle>
                        <DialogDescription>
                            Informations complètes de l'utilisateur sélectionné.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-2">
                        <p><strong>Raison sociale:</strong> {activeUser?.client?.raisonSociale}</p>
                        <p><strong>Email :</strong> {activeUser?.email}</p>
                        <p><strong>Rôle :</strong> {rolePipe(activeUser?.role.name ?? UserRole.CLIENT)}</p>
                        {activeUser?.createdAt && (
                            <p><strong>Créé le :</strong> {new Date(activeUser.createdAt).toLocaleString('fr-FR')}</p>
                        )}
                        {activeUser?.lastConnectionAt && (
                            <p><strong>Dernière connexion :</strong> {new Date(activeUser.lastConnectionAt).toLocaleString('fr-FR')}</p>
                        )}
                        {activeUser?.supplier && (
                            <>
                                <p><strong>Type :</strong> Fournisseur</p>
                                <p><strong>ICE :</strong> {activeUser.supplier.ICE}</p>
                                <p><strong>Téléphone :</strong> {activeUser.supplier.telephone}</p>
                                <p><strong>Adresse :</strong> {activeUser.supplier.address}</p>
                            </>
                        )}
                        {activeUser?.client && (
                            <>
                                <p><strong>Type :</strong> Client</p>
                                <p><strong>ICE :</strong> {activeUser.client.ICE}</p>
                                <p><strong>Téléphone :</strong> {activeUser.client.telephone}</p>
                                <p><strong>Adresse :</strong> {activeUser.client.address}</p>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            className="bg-ejaar-800 hover:bg-ejaar-700"
                            onClick={() => {
                            setActiveUser(null);
                            setIsDetailsDialogOpen(false);
                        }}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </MainLayout>
    );
}
