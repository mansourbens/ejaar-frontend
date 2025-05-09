// Types for our leasing simulator
export interface ConfigurableConstant {
    id: string;
    name: string;
    value: number;
    description?: string;
    type: 'percentage' | 'decimal' | 'integer';
    min?: number;
    max?: number;
}

export interface SimulationInputs {
    totalAmount: number;
    durationMonths: number;
    residualValuePercentage: number;
    financingSpreadAnnual: number;
    leaserFinancingRateAnnual: number;
    fileFeesPercentage: number;
}

export interface SimulationResults {
    residualValue: number;
    leaserFinancingRateMonthly: number;
    ejaarFinancingRateAnnual: number;
    ejaarFinancingRateMonthly: number;
    monthlyPayment: number;
    totalPayment: number;
}

export interface ConfigConstantsFormData {
    residualValuePercentage: number;
    financingSpreadAnnual: number;
    fileFeesPercentage: number;
    leaserFinancingRateAnnual: number;

}
