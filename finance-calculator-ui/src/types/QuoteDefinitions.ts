// using string for all price related fields to avoid floating point precision issues in transit
export interface QuoteSpecification {
    baseCost: string;
    targetProfit: string;
    totalPrice: string;
    termMonths: number;
    downPayment: string;
    interestRate: string;
    taxRate: string;
}

export interface QuoteAmount {
    taxes: string;
    baseLoanAmount: string;
    interest: string;
    totalLoanAmount: string;
    monthlyPayment: string;
    downPayment: string;
}

export interface CompleteQuote {
    specification: QuoteSpecification;
    amount: QuoteAmount;
    quoteName: string;
    id: number;
    createdAt: string;
    updatedAt: string;
}