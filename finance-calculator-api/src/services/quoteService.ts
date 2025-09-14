import quoteDao from "../daos/quoteDao";
import type { PersistedQuote } from "../models/QuoteDBDefinitions";
import type { QuoteSpecification, CompleteQuote, QuoteAmount, SaveQuote } from "../models/QuoteDefinitions";

export interface QuoteService {
    generateQuote: (spec: QuoteSpecification) => Promise<QuoteAmount>;
    fetchAllQuotes: () => Promise<CompleteQuote[]>;
    saveQuote: (request: SaveQuote) => Promise<CompleteQuote>;
    deleteQuote: (id: number) => Promise<void>;
}

class QuoteServiceImpl implements QuoteService {

    public fetchAllQuotes = async (): Promise<CompleteQuote[]> => {
        const quotes = await quoteDao.getAllQuotes();
        return quotes.map(this.mapToCompleteQuote);
    }

    public saveQuote = async (request: SaveQuote): Promise<CompleteQuote> => {
        // in a real application, the ID generation and timestamping would be handled by the database
        const currentQuotes = await quoteDao.getAllQuotes();
        const maxId = currentQuotes.reduce((max, quote) => Math.max(max, quote.id), 0);
        const now = new Date().toISOString();
        const newQuote: CompleteQuote = {
            specification: request.specification,
            amount: request.amount,
            quoteName: request.quoteName,
            id: maxId + 1,
            createdAt: now,
            updatedAt: now
        }

        await quoteDao.saveQuote(this.mapToPersistedQuote(newQuote));
        return newQuote;
    }

    public deleteQuote = async (id: number): Promise<void> => {
        await quoteDao.removeQuote(id);
    }

    // keeping this method async for consistency, though it doesn't do any async work currently
    public generateQuote = async (spec: QuoteSpecification): Promise<QuoteAmount> => {
        const baseCost = this.validateAndParsePrice(spec.baseCost);
        const targetProfit = this.validateAndParsePrice(spec.targetProfit);
        const totalPrice = this.validateAndParsePrice(spec.totalPrice);
        const termMonths = spec.termMonths;
        const interestRate = this.validateAndParseRate(spec.interestRate);
        const taxRate = this.validateAndParseRate(spec.taxRate);
        const downPayment = this.validateAndParsePrice(spec.downPayment);

        if ((baseCost + targetProfit).toFixed(2) !== totalPrice.toFixed(2)) {
            throw {
                name: 'InconsistentQuoteError',
                status: 400,
                message: 'Inconsistent quote values. baseCost + targetProfit must equal totalPrice.'
            };
        }

        const taxes = (totalPrice * taxRate) / 100;
        const principle = totalPrice + taxes - downPayment;
        const monthlyInterestRate = interestRate / 100 / 12;
        // https://en.wikipedia.org/wiki/Amortization_calculator#The_formula
        const monthlyPayment = (principle * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -termMonths));
        const totalPayment = monthlyPayment * termMonths;
        const totalInterest = totalPayment - principle;

        return Promise.resolve({
            // toFixed() rounding can lead to incorrect rounding in some edge cases, like 1.005 -> 1.00
            // but should be acceptable for this use case as any trailing digits corrects rounding error, i.e. 1.00500000000000001 -> 1.01
            // this drastically reduces the likelihood of real life rounding errors as floating point calculations produce higher precision values
            taxes: taxes.toFixed(2),
            baseLoanAmount: principle.toFixed(2),
            interest: totalInterest.toFixed(2),
            totalLoanAmount: (principle + totalInterest).toFixed(2),
            monthlyPayment: monthlyPayment.toFixed(2),
            downPayment: downPayment.toFixed(2),
        });
    }

    private validateAndParsePrice(value: string): number {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            throw {
                name: 'InvalidPriceError',
                status: 400,
                message: `Invalid price: ${value}`
            };
        }
        return parsed;
    }

    private validateAndParseRate(value: string): number {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || parsed < 0) {
            throw {
                name: 'InvalidRateError',
                status: 400,
                message: `Invalid rate: ${value}`
            };
        }
        return parsed;
    }

    // should move to a mapper file in a larger application
    private mapToPersistedQuote(quote: CompleteQuote): PersistedQuote {
        return {
            baseCost: quote.specification.baseCost,
            targetProfit: quote.specification.targetProfit,
            totalPrice: quote.specification.totalPrice,
            termMonths: quote.specification.termMonths,
            interestRate: quote.specification.interestRate,
            taxRate: quote.specification.taxRate,
            downPayment: quote.amount.downPayment,
            taxes: quote.amount.taxes,
            baseLoanAmount: quote.amount.baseLoanAmount,
            interest: quote.amount.interest,
            totalLoanAmount: quote.amount.totalLoanAmount,
            monthlyPayment: quote.amount.monthlyPayment,
            quoteName: quote.quoteName,
            id: quote.id,
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
        };
    }

    private mapToCompleteQuote(quote: PersistedQuote): CompleteQuote {
        return {
            specification: {
                baseCost: quote.baseCost,
                targetProfit: quote.targetProfit,
                totalPrice: quote.totalPrice,
                termMonths: quote.termMonths,
                downPayment: quote.downPayment,
                interestRate: quote.interestRate,
                taxRate: quote.taxRate,
            },
            amount: {
                taxes: quote.taxes,
                baseLoanAmount: quote.baseLoanAmount,
                interest: quote.interest,
                totalLoanAmount: quote.totalLoanAmount,
                monthlyPayment: quote.monthlyPayment,
                downPayment: quote.downPayment,
            },
            quoteName: quote.quoteName,
            id: quote.id,
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
        };
    }
}

const quoteService: QuoteService = new QuoteServiceImpl();
export default quoteService;