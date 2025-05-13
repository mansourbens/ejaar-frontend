"use client";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import React, {useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useFieldArray, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {DownloadIcon, Loader2, Plus, Trash2, UploadIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {useToast} from '@/hooks/use-toast';
import {calculateTotalAmount, durationOptions, hardwareTypes} from '@/lib/mock-data';
import MainLayout from "@/components/layouts/main-layout";
import {useAuth} from "@/components/auth/auth-provider";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {CategorieCA} from "@/components/ejaar-settings/rate-config";

const deviceSchema = z.object({
    type: z.string({
        required_error: "Veuillez sélectionner un type de matériel",
    }),
    reference: z.string().optional(),
    designation: z.string().optional(),
    unitCost: z.coerce.number({
        required_error: "Veuillez entrer un coût unitaire",
        invalid_type_error: "Le coût unitaire doit être un nombre",
    }).min(1, {message: "Le coût unitaire doit être d'au moins 1 MAD"}),
    units: z.coerce.number({
        required_error: "Veuillez entrer le nombre d'unités",
        invalid_type_error: "Le nombre d'unités doit être un nombre",
    }).min(1, {message: "Il doit y avoir au moins 1 unité"}),
    duration: z.string({
        required_error: "Veuillez sélectionner une durée",
    }),
});

const formSchema = z.object({
    devices: z.array(deviceSchema).min(1, {message: "Ajoutez au moins un appareil"}),
});

export default function NewQuotationPage() {
    const {user} = useAuth();
    const router = useRouter();
    const {toast} = useToast();
    const [isCalculating, setIsCalculating] = useState(false);
    const [clientCA, setClientCA] = useState<CategorieCA>(CategorieCA.MOINS_DE_5M);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            devices: [{
                type: '',
                reference: '',
                designation: '',
                unitCost: 0,
                units: 1,
                duration: '24'
            }],
        },
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "devices",
    });

    const devices = form.watch('devices');
    const totalAmount = calculateTotalAmount(devices);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        if (file.name.endsWith('.csv')) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    validateAndSetData(results.data);
                },
                error: (error) => {
                    console.error('CSV Parsing Error:', error);
                    toast({
                        title: "Erreur",
                        description: "Erreur lors de la lecture du fichier CSV.",
                        variant: "destructive",
                    });
                },
            });
        } else if (file.name.endsWith('.xlsx')) {
            reader.onload = (evt) => {
                const data = new Uint8Array(evt.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, {type: 'array'});
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                validateAndSetData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        } else {
            toast({
                title: "Format non supporté",
                description: "Veuillez utiliser un fichier CSV ou Excel.",
                variant: "destructive",
            });
        }
    };

    const validateAndSetData = (data: any[]) => {
        try {
            console.log( data.filter((row, index) => !isNaN(Number(row['Prix Unitaire HT']))));
            const mappedDevices = data.filter((row, index) => !isNaN(Number(row['Prix Unitaire HT']))).map((row, index) => {
                if (!row['Type de matériel'] || isNaN(Number(row['Prix Unitaire HT'])) || isNaN(Number(row['Quantité']))) {
                    throw new Error(`Erreur de format à la ligne ${index + 1}.`);
                }
                return {
                    type: String(row['Type de matériel']),
                    reference: row['Reference_constructeur'] ? String(row['Reference_constructeur']) : undefined,
                    designation: row['Designation'] ? String(row['Designation']) : undefined,
                    unitCost: Number(row['Prix Unitaire HT']),
                    units: Number(row['Quantité']),
                    duration: String(row['Durée Location (mois)']) || '24',
                };
            });
            form.setValue('devices', mappedDevices);
            toast({
                title: "Import réussi",
                description: `${mappedDevices.length} appareils ont été importés.`,
            });
        } catch (error: any) {
            console.error('Validation Error:', error);
            toast({
                title: "Erreur d'import",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        setIsCalculating(true);
        try {
            const response = user?.role.name === UserRole.CLIENT ? await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations/generate`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ...data,
                    clientId: user?.id,
                    supplierId: user?.supplier?.id
                }),
            }) : await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations/simulate`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ...data,
                    clientCA,
                    clientId: user?.id,
                    supplierId: user?.supplier?.id
                }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'devis.pdf';
                link.click();
                toast({
                    title: user?.role.name === UserRole.CLIENT ? "Devis créé" : "Simulation générée",
                    description: user?.role.name === UserRole.CLIENT ?
                        "Votre devis a été créé avec succès et est en attente de validation." : "",
                });
               // router.push('/quotations')
            } else {
                toast({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la création du devis. Veuillez réessayer.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error generating quotation:', error);
            toast({
                title: "Erreur",
                description: "Une erreur inattendue est survenue.",
                variant: "destructive",
            });
        } finally {
            setIsCalculating(false);
        }
    };

    const downloadTemplate = async() => {
        try {
            const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations/template`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `template-devis.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.error('Failed to download quotation');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Nouveau devis</h1>
                        <p className="text-sm text-muted-foreground">
                            Remplissez le formulaire pour {user?.role.name === UserRole.CLIENT ? `demander ` : `simuler `}
                            un devis de location de matériel
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={downloadTemplate}
                            className="gap-2 bg-white hover:bg-ejaar-100 text-gray-800"
                        >
                            <DownloadIcon className="w-4 h-4"/>
                            Télécharger le template
                        </Button>
                        <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} className="hidden"
                               ref={fileInputRef}/>
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2 bg-ejaar-900 hover:bg-ejaar-800 text-gray-100 hover:text-gray-100"
                        >
                            <UploadIcon className="w-4 h-4"/>
                            Importer Excel/CSV
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Summary Card */}
                    <Card className="lg:col-span-1 order-1 lg:order-2">
                        <CardHeader>
                            <CardTitle>Résumé</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <span className="text-sm font-medium text-muted-foreground">Montant total du matériel</span>
                                    <span className="text-lg font-bold text-primary">
                                        {totalAmount.toFixed(2)} MAD
                                    </span>
                                </div>
                                {user?.role.name !== UserRole.CLIENT && <div className="space-y-2">
                                    <Label>Catégorie CA client</Label>
                                    <Select
                                        value={clientCA}
                                        onValueChange={(value) => setClientCA(value as CategorieCA)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.values(CategorieCA).map(ca => (
                                                <SelectItem key={ca} value={ca}>{ca}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>}
                            </div>

                            {user?.role.name === UserRole.CLIENT &&
                                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4">
                                <h3 className="text-sm font-medium mb-2">Note</h3>
                                <p className="text-sm text-muted-foreground">
                                    Vérifiez bien les informations avant de soumettre votre demande.
                                    Le devis sera envoyé pour validation.
                                </p>
                            </div>}

                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={isCalculating}
                            >
                                {isCalculating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Génération...
                                    </>
                                ) : (
                                    <span>{user?.role.name === UserRole.CLIENT ? "Générer le devis"
                                        : "Simuler le devis"}</span>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Form Card */}
                    <Card className="lg:col-span-2 order-2 lg:order-1">
                        <CardHeader>
                            <CardTitle>Détails du matériel</CardTitle>
                            <CardDescription>
                                Ajoutez les appareils à inclure dans votre devis
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="max-h-[300px] space-y-4 overflow-auto">
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="p-4 border rounded-lg relative group">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`devices.${index}.type`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Type de matériel</FormLabel>
                                                                    <Select onValueChange={field.onChange}
                                                                            value={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger className="bg-white">
                                                                                <SelectValue placeholder="Sélectionner"/>
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {hardwareTypes.map((type) => (
                                                                                <SelectItem key={type} value={type}>
                                                                                    {type}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`devices.${index}.reference`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Référence constructeur</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Optionnel"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`devices.${index}.designation`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Désignation</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Optionnel"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`devices.${index}.unitCost`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Prix unitaire (HT)</FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="0,00"
                                                                                className="pr-10"
                                                                                {...field}
                                                                            />
                                                                            <span
                                                                                className="absolute right-3 top-2.5 text-gray-500 text-sm">MAD</span>
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`devices.${index}.units`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Quantité</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            min="1"
                                                                            placeholder="1"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`devices.${index}.duration`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Durée (mois)</FormLabel>
                                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger className="bg-white">
                                                                                <SelectValue placeholder="Sélectionner"/>
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {durationOptions.map((option) => (
                                                                                <SelectItem key={option.value} value={option.value}>
                                                                                    {option.label}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    {fields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500"/>
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-blue-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() => append({
                                                type: '',
                                                reference: '',
                                                designation: '',
                                                unitCost: 0,
                                                units: 1,
                                                duration: '24'
                                            })}
                                        >
                                            <Plus className="mr-2 h-4 w-4"/>
                                            Ajouter un appareil
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
