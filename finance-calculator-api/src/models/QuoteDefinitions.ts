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

export interface SaveQuote {
    specification: QuoteSpecification;
    amount: QuoteAmount;
    quoteName: string;
}