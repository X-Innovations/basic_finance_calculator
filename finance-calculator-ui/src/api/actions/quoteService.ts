import api from '../api';
import type { QuoteSpecification, QuoteAmount, CompleteQuote } from '@/types';

export const getAllQuotes = async (): Promise<CompleteQuote[]> => {
    const { data } = await api.get<CompleteQuote[]>('/');
    return data;
}

export const createQuote = async (spec: QuoteSpecification): Promise<QuoteAmount> => {
    const { data } = await api.post<QuoteAmount>('/generate', spec);
    return data;
}

export const saveQuote = async (spec: QuoteSpecification, amount: QuoteAmount, quoteName: string): Promise<CompleteQuote> => {
    const payload = {
        specification: spec,
        amount,
        quoteName
    };
    const { data } = await api.post<CompleteQuote>('/', payload);
    return data;
}

export const deleteQuote = async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
}