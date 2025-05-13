export const DEFAULT_VALUES = {
    residualValuePercentage: 10, // Default 10%
    financingSpreadAnnual: 2, // Default 2%
    leaserFinancingRateAnnual: 7, // Default 7%
    fileFeesPercentage: 1, // Default 1%
};

export const DURATION_OPTIONS = [
    { value: 24, label: '24 mois' },
    { value: 36, label: '36 mois' },
];

export const LEASER_RATE_OPTIONS = [
    { value: 6, label: '6%' },
    { value: 7, label: '7%' },
    { value: 8, label: '8%' },
    { value: 9, label: '9%' },
];

export const CONFIG_CONSTANTS = [
    {
        id: 'financingSpreadAnnual',
        name: 'Spread financement (Annuel)',
        description: 'Spread de financement annuel appliqué',
        type: 'percentage',
        min: 0,
        max: 20,
    },
    {
        id: 'leaserFinancingRateAnnual',
        name: 'Taux de financement - Leaser (Annuel)',
        description: 'Taux de financement annuel du Leaser',
        type: 'percentage',
        min: 6,
        max: 9,
    }
];
