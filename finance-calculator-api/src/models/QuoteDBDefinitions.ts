export interface PersistedQuote {
    baseCost: string;
    targetProfit: string;
    totalPrice: string;
    termMonths: number;
    downPayment: string;
    interestRate: string;
    taxRate: string;
    taxes: string;
    baseLoanAmount: string;
    interest: string;
    totalLoanAmount: string;
    monthlyPayment: string;
    quoteName: string;
    id: number;
    createdAt: string;
    updatedAt: string;
}

export interface QuoteDB {
    quotes: PersistedQuote[];
}