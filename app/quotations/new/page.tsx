"use client";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useFieldArray, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {DownloadIcon, Loader2, Plus, PlusCircleIcon, Trash2, UploadIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {useToast} from '@/hooks/use-toast';
import {calculateTotalAmount, Device, durationOptions, hardwareTypes} from '@/lib/mock-data';
import MainLayout from "@/components/layouts/main-layout";
import {useAuth} from "@/components/auth/auth-provider";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {CategorieCA} from "@/components/ejaar-settings/rate-config";
import {performCalculations} from "@/components/ejaar-settings/calculations";

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
const formatPrice = (value: number) => {
    return `${Math.floor(value).toLocaleString('fr-FR')} DH HT`;
};

const formatDuration = (value: number) => {
    return `${value} mois`;
};
export default function NewQuotationPage() {
    const {user} = useAuth();
    const router = useRouter();
    const {toast} = useToast();
    const [isCalculating, setIsCalculating] = useState(false);
    const [clientCA, setClientCA] = useState<CategorieCA | null>(CategorieCA.MOINS_DE_5M);
    const [tauxLoyerConfig, setTauxLoyerConfig] = useState<TauxLoyerEntry[]>([]);
    const [residualConfig, setResidualConfig] = useState<ResidualConfigEntry[]>([]);
    type ResidualConfigEntry = {
        device: string;
        months24: string;
        months36: string;
    };
    type TauxLoyerEntry = {
        categorieCA: string;
        tauxBanque: string;
        spread: string;
    };
    type DurationKey = 'months24' | 'months36';
    function toDurationKey(months: number): DurationKey {
        if (months === 24) return 'months24';
        if (months === 36) return 'months36';
        throw new Error(`Unsupported duration: ${months}`);
    }
    useEffect(() => {
        const loadConfigs = async () => {
            try {
                const [tauxResponse, residualResponse] = await Promise.all([
                    fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/rate-config`),
                    fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/residual-config`)
                ]);

                setTauxLoyerConfig(await tauxResponse.json());
                setResidualConfig(await residualResponse.json());
            } catch (error) {
                console.error('Failed to load configuration:', error);
            }
        };
        loadConfigs();
    }, []);
    function buildResidualValueMap(data: ResidualConfigEntry[]) {
        return data.reduce((acc, curr) => {
            acc[curr.device] = {
                months24: parseFloat(curr.months24),
                months36: parseFloat(curr.months36),
            };
            return acc;
        }, {} as Record<string, { months24: number; months36: number }>);
    }

    function buildTauxLoyerMap(data: TauxLoyerEntry[]) {
        return data.reduce((acc, curr) => {
            acc[curr.categorieCA] = {
                tauxBanque: parseFloat(curr.tauxBanque),
                spread: parseFloat(curr.spread),
            };
            return acc;
        }, {} as Record<string, { tauxBanque: number; spread: number }>);
    }
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
    useEffect(() => {
        setClientCA(user?.caCategory ?? null)
    }, [user]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "devices",
    });
    const calculateAmount = (devices: any[]) => {
        return devices.reduce((total, device) => total + (device.unitCost * device.units), 0);
    };

    const devices = form.watch('devices');
    const totalAmount24 = calculateAmount(devices.filter(device => device.duration === `24`));
    const totalAmount36 = calculateAmount(devices.filter(device => device.duration === `36`));

    const monthlyAmount24 = calculateMonthlyAmounts().monthly24;
    const monthlyAmount36 = calculateMonthlyAmounts().monthly36;

    function calculateMonthlyAmounts() {
        if (devices.length && clientCA && tauxLoyerConfig.length && residualConfig.length) {

            const tauxMap = buildTauxLoyerMap(tauxLoyerConfig);
            const residualMap = buildResidualValueMap(residualConfig);
            const durationKey24 = toDurationKey(24); // type-safe conversion
            const durationKey36 = toDurationKey(36); // type-safe conversion
            const spread = tauxMap[clientCA].spread;
            const leasingRate = tauxMap[clientCA].tauxBanque;
            let monthly24 = 0;
            let monthly36 = 0;
            for (let device of devices.filter(device => device.duration === `24` && device.type)) {
                console.log(residualMap);
                console.log(device.type);
                const residualValuePercentage = residualMap[device.type][durationKey24];
                const res = performCalculations(
                    device.unitCost * device.units,
                    24,
                    residualValuePercentage,
                    spread,
                    leasingRate
                );
                monthly24 += res.monthlyPayment;
            }
            for (let device of devices.filter(device => device.duration === `36` && device.type)) {

                const residualValuePercentage = residualMap[device.type][durationKey36];
                const res = performCalculations(
                    device.unitCost * device.units,
                    36,
                    residualValuePercentage,
                    spread,
                    leasingRate
                );
                monthly36 += res.monthlyPayment;
            }
            return  {
                monthly24,
                monthly36
        };
        }
        return {
          monthly24: 0,
          monthly36: 0
        }
    }

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
            console.log(data.filter((row, index) => !isNaN(Number(row['Prix Unitaire HT']))));
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

    const downloadTemplate = async () => {
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
            <div className="">
                <div className="flex justify-between items-center ml-8">
                    <div>
                        <h1 className="text-4xl text-ejaar-700 md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">
                            Nouveau devis
                        </h1>

                        <p className="text-2xl text-justify text-ejaar-800 max-w-xl lat-bold">
                            Remplissez le formulaire
                            pour {user?.role.name === UserRole.CLIENT ? `demander ` : `simuler `}
                            un devis de location de matériel
                        </p>
                    </div>
                </div>
                {/* Summary Card */}

                <div className="flex flex-col gap-4">

                    {/* Form Card */}
                    <div className="flex gap-4 ml-auto mr-20">
                        <Button
                            variant="outline"
                            onClick={downloadTemplate}
                            className="gap-2 bg-ejaar-beige hover:bg-white/20 text-ejaar-700"
                        >
                            <DownloadIcon className="w-4 h-4"/>
                            Télécharger le template
                        </Button>
                        <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} className="hidden"
                               ref={fileInputRef}/>
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2 bg-ejaar-700 hover:bg-ejaar-900 text-white hover:text-white"
                        >
                            <UploadIcon className="w-4 h-4"/>
                            Importer Excel/CSV
                        </Button>
                    </div>
                    <Card className="rounded-2xl bg-white/50 mx-20">
                        <CardHeader>
                            <CardTitle className="text-ejaar-red">Détails du matériel</CardTitle>
                            <CardDescription className="text-ejaar-700">
                                Ajoutez les appareils à inclure dans votre devis
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="max-h-[300px] space-y-4 overflow-auto">
                                            <div className="grid grid-cols-6">
                                                <FormLabel className="text-ejaar-700 text-xl ml-6">Type de
                                                    matériel</FormLabel>
                                                <FormLabel className="text-ejaar-700 text-xl ml-5">Référence
                                                    constructeur</FormLabel>
                                                <FormLabel className="text-ejaar-700 text-xl ml-3">Désignation</FormLabel>
                                                <FormLabel className="text-ejaar-700 text-xl ml-2">Prix unitaire
                                                    (HT)</FormLabel>
                                                <FormLabel className="text-ejaar-700 text-xl">Quantité</FormLabel>
                                                <FormLabel className="text-ejaar-700 text-xl">Durée (mois)</FormLabel>

                                            </div>
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="p-4 border rounded-lg relative group">
                                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`devices.${index}.type`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <Select onValueChange={field.onChange}
                                                                            value={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger className="bg-white">
                                                                                <SelectValue
                                                                                    placeholder="Sélectionner"/>
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
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="0,00"
                                                                                className="pr-10"
                                                                                {...field}
                                                                            />
                                                                            <span
                                                                                className="absolute right-3 top-2.5 text-gray-500 text-sm">DH</span>
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
                                                                <FormItem className="text-ejaar-700 text-xl">
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
                                                        <div className="flex gap-2">
                                                            <FormField
                                                                control={form.control}
                                                                name={`devices.${index}.duration`}
                                                                render={({field}) => (
                                                                    <FormItem className="text-ejaar-700 text-xl w-full">
                                                                        <Select onValueChange={field.onChange}
                                                                                value={field.value}>
                                                                            <FormControl>
                                                                                <SelectTrigger className="bg-white">
                                                                                    <SelectValue
                                                                                        placeholder="Sélectionner"/>
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                {durationOptions.map((option) => (
                                                                                    <SelectItem key={option.value}
                                                                                                value={option.value}>
                                                                                        {option.label}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage/>
                                                                    </FormItem>

                                                                )}
                                                            />
                                                            {fields.length > 1 && index !== 0 && (
                                                                <Button
                                                                    type="button"
                                                                    size="icon"
                                                                    className="bg-ejaar-red my-auto hover:bg-ejaar-redHover"
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-white"/>
                                                                </Button>
                                                            )}
                                                        </div>


                                                    </div>


                                                </div>
                                            ))}
                                        </div>
                                        <div className="w-full flex">
                                            <Button
                                                type="button"
                                                className="ml-auto bg-ejaar-red hover:bg-ejaar-redHover"
                                                onClick={() => append({
                                                    type: '',
                                                    reference: '',
                                                    designation: '',
                                                    unitCost: 0,
                                                    units: 1,
                                                    duration: '24'
                                                })}
                                            >
                                                <PlusCircleIcon className="mr-2 h-4 w-4"/>
                                                Ajouter un appareil
                                            </Button>
                                        </div>
                                        <div className="w-full flex gap-10">

                                            <div className="bg-ejaar-700 text-white p-4 rounded-lg w-3/5">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-2xl font-medium">Mensualité calculée sur 24 mois
                                                       <span className="text-sm text-white italic ml-2">
                                                        ( Pour {formatPrice(totalAmount24)} sur {formatDuration(24)} )
                                                       </span>
                                                    </p>
                                                        <span className="text-xl font-bold">
                                {formatPrice(monthlyAmount24)}
                            </span>
                                                </div>
                                                <div className="divider-ejaar border-t-2 my-6 border-dashed border-white w-2/4 h-1 mx-auto"></div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-2xl font-medium">Mensualité calculée sur 36 mois
                                                       <span className="text-sm text-white italic ml-2">
                                                        ( Pour {formatPrice(totalAmount36)} sur {formatDuration(36)} )
                                                       </span>
                                                    </p>
                                                        <span className="text-xl font-bold">
                                {formatPrice(monthlyAmount36)}
                            </span>
                                                </div>
                                            </div>
                                            {user?.role.name === UserRole.CLIENT &&
                                                <Card className="rounded-xl bg-white/50 flex flex-col gap-2 p-4">
                                                    <Button
                                                        onClick={form.handleSubmit(onSubmit)}
                                                        className="bg-ejaar-red hover:bg-ejaar-redHover text-xl"
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
                                                    <p className="text-sm text-muted-foreground">
                                                        Vérifiez bien les informations avant de soumettre votre demande.
                                                        Le devis sera envoyé pour validation.
                                                    </p>

                                                </Card>}

                                        </div>
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
