"use client";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useForm, useFieldArray} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {ImportIcon, Loader2, Plus, Trash2, UploadIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {useToast} from '@/hooks/use-toast';
import {hardwareTypes, durationOptions, calculateTotalAmount} from '@/lib/mock-data';
import {v4 as uuidv4} from 'uuid';
import MainLayout from "@/components/layouts/main-layout";
import {useAuth} from "@/components/auth/auth-provider";

const deviceSchema = z.object({
    type: z.string({
        required_error: "Veuillez sélectionner un type de matériel",
    }),
    unitCost: z.coerce.number({
        required_error: "Veuillez entrer un coût unitaire",
        invalid_type_error: "Le coût unitaire doit être un nombre",
    }).min(1, {message: "Le coût unitaire doit être d'au moins 1 MAD"}),
    units: z.coerce.number({
        required_error: "Veuillez entrer le nombre d'unités",
        invalid_type_error: "Le nombre d'unités doit être un nombre",
    }).min(1, {message: "Il doit y avoir au moins 1 unité"}),
});

const formSchema = z.object({
    devices: z.array(deviceSchema).min(1, {message: "Ajoutez au moins un appareil"}),
    duration: z.string({
        required_error: "Veuillez sélectionner une durée",
    }),
});


export default function NewQuotationPage() {
    const {user} = useAuth();
    const router = useRouter();
    const {toast} = useToast();
    const [isCalculating, setIsCalculating] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            devices: [{type: '', unitCost: 0, units: 1}],
            duration: '24',
        },
    });

// eslint-disable-next-line react-hooks/rules-of-hooks
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
                    alert('Erreur lors de la lecture du fichier CSV.');
                },
            });
        } else if (file.name.endsWith('.xlsx')) {
            reader.onload = (evt) => {
                const data = new Uint8Array(evt.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                validateAndSetData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Format de fichier non supporté. Veuillez utiliser un CSV ou un Excel.');
        }
    };

    const validateAndSetData = (data: any[]) => {
        try {
            const mappedDevices = data.map((row, index) => {
                if (!row.type || isNaN(Number(row.unitCost)) || isNaN(Number(row.units))) {
                    throw new Error(`Erreur de format à la ligne ${index + 1}.`);
                }
                return {
                    type: String(row.type),
                    unitCost: Number(row.unitCost),
                    units: Number(row.units),
                };
            });

            form.setValue('devices', mappedDevices);
        } catch (error: any) {
            console.error('Validation Error:', error);
            alert(error.message);
        }
    };
    interface QuotationCreationDTO {
        devices: {
            type: string;
            unitCost: number;
            units: number;
        }[];

        duration: number;

        clientId: number;

        supplierId: number;
    }
    const onSubmit = async (data: z.infer<typeof formSchema>) => {

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
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
                        title: "Devis créé",
                        description: "Votre devis a été créé avec succès et est en attente de validation.",
                    });
                    router.push('/quotations')
                } else {
                    toast({
                        title: "Erreur",
                        description: "Une erreur est survenue lors de la création du devis. Veuillez réessayer.",
                        variant: "destructive",
                    });                }
            } catch (error) {
                console.error('Error generating quotation:', error);
            }
    };

    return (
        <MainLayout>
            <div className="space-y-4">
                <div className="flex items-end space-x-4"> {/* Added items-baseline */}
                    <div>
                        <h1 className="text-2xl md:text-xl font-bold tracking-tight">Nouveau devis</h1>
                        <p className="md:text-sm text-muted-foreground">
                            Remplissez le formulaire ci-dessous pour demander un devis de location de matériel.
                        </p>
                    </div>
                    <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-500 text-white h-8 px-3 text-xs"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadIcon className="w-4 h-4 mr-2" />
                        Importer Excel/CSV
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="md:text-xl">Détails du devis</CardTitle>
                            <CardDescription  className="md:text-sm">
                                Entrez les détails du matériel et vos préférences de location.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-4 max-h-[45vh] sm:max-h-[20vh] md:max-h-[30vh] lg:max-h-[35vh] overflow-y-auto">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="space-y-4 p-4 border rounded-lg relative">
                                                <FormField
                                                    control={form.control}
                                                    name={`devices.${index}.type`}
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Type de matériel</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Sélectionner un type de matériel"/>
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent >
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

                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`devices.${index}.unitCost`}
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel>Prix unitaire (HT)</FormLabel>
                                                                <FormControl>
                                                                    <div className="relative">
                                                                        <span className="absolute right-3 top-2.5 text-gray-500">MAD</span>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="0,00"
                                                                            className="pl-7"
                                                                            {...field}
                                                                        />
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
                                                                <FormLabel>Nombre d'unités</FormLabel>
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
                                                </div>

                                                {fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute !mt-0 top-2  right-2"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500"/>
                                                    </Button>
                                                )}
                                            </div>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => append({type: '', unitCost: 0, units: 1})}
                                        >
                                            <Plus className=" mr-2 h-4 w-4"/> Ajouter un appareil
                                        </Button>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="duration"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Durée de location</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sélectionner une durée"/>
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
                                                <FormDescription>
                                                    Choisissez la durée de location souhaitée.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full bg-[#266CA9] hover:bg-[#266CA9DD] hover:text-white">
                                        Demander un devis
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="md:text-xl">Résumé du devis</CardTitle>
                            <CardDescription className="md:text-sm">
                                Vérifiez votre sélection de matériel et le coût total.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-4 max-h-[45vh] sm:max-h-[20vh] md:max-h-[30vh] lg:max-h-[35vh] overflow-y-auto">

                                {devices.map((device, index) => (
                                    <div key={index} className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">
                                            Appareil {index + 1}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-secondary rounded-md">
                                                <div className="text-sm text-muted-foreground">Type</div>
                                                <div className="font-medium">
                                                    {device.type || 'Non sélectionné'}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-secondary rounded-md">
                                                <div className="text-sm text-muted-foreground">Unités</div>
                                                <div className="font-medium">{device.units || 0}</div>
                                            </div>
                                            <div className="col-span-2 p-3 bg-secondary rounded-md">
                                                <div className="text-sm text-muted-foreground">Sous-total</div>
                                                <div className="font-medium">
                                                    {((device.unitCost || 0) * (device.units || 0)).toFixed(2)} MAD
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Conditions de location
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-secondary rounded-md">
                                            <div className="text-sm text-muted-foreground">Durée</div>
                                            <div className="font-medium">
                                                {durationOptions.find(option => option.value === form.watch('duration'))?.label || 'Non sélectionné'}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-md">
                                            <div className="text-sm font-medium">Montant total</div>
                                            <div className="text-lg font-bold">
                                                {totalAmount.toFixed(2)} MAD
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
                                    <h3 className="text-sm font-medium mb-2">Note</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Vérifiez bien les informations avant de soumettre votre demande.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
