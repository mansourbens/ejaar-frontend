import { v4 as uuidv4 } from 'uuid';
import {Supplier} from "@/app/supplier-users/page";
import {ServerFile} from "@/types/file-upload";
export interface Device {
  type: string;
  unitCost: number;
  units: number;
}
export interface Client {
  raisonSociale: string;
  fullName: string;
}
enum QuotationStatusEnum {
  GENERE= 'Généré',
  VALIDE_CLIENT = 'Validé client',
  VERIFICATION = 'En cours de vérification',
  SENT_TO_BANK = 'Envoyé à la banque',
  VALIDE = 'Validé'
}
export interface Quotation {
  id: string;
  userId: string;
  devices: string;
  number: string;
  price: number;
  duration: string;
  returnRate: number;
  amount: number;
  supplier: Supplier;
  client: Client;
  status: QuotationStatusEnum
  createdAt: string;
  documents: ServerFile[];
}

// Hardware type options
export const hardwareTypes = [
  'Ordinateur de bureau',
  'Ordinateur portable',
  'Serveur',
  'Équipement réseau',
  'Imprimante/Scanner',
  'Système de stockage',
  'Smartphone',
  'Workstation',
  'Autre'
];
export const durationOptions = [
  { value: '24', label: '24 mois' },
  { value: '36', label: '36 mois' },
];

// Return rate options (percentage of original value)
export const returnRateOptions = [
  { value: '0', label: '0%' },
  { value: '10', label: '10%' },
  { value: '20', label: '20%' },
  { value: '30', label: '30%' },
  { value: '40', label: '40%' },
  { value: '50', label: '50%' }
];

// Mock quotations data

// Helper function to calculate lease amount
export const calculateLeaseAmount = (price: number, duration: string, returnRate: number) => {
  const durationInMonths = parseInt(duration);
  const returnValue = price * (returnRate / 100);
  const depreciationValue = price - returnValue;
  const monthlyDepreciation = depreciationValue / durationInMonths;
  const serviceCharge = price * 0.05; // 5% service charge
  
  // Calculate total lease amount
  const totalAmount = depreciationValue + serviceCharge;
  
  return {
    monthlyPayment: (totalAmount / durationInMonths).toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    returnValue: returnValue.toFixed(2)
  };
};

export const calculateTotalAmount = (devices: Device[]) => {
  return devices.reduce((total, device) => total + (device.unitCost * device.units), 0);
};
