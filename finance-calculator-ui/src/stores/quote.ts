import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAllQuotes, createQuote, saveQuote, deleteQuote } from '@/api';
import type { QuoteSpecification, QuoteAmount, CompleteQuote } from '@/types';

export const useQuoteStore = defineStore('quote', () => {
    // state
    const quotes = ref<CompleteQuote[]>([]);
    // in case a user updates values in the form but does not re-quote, and save the quote results
    // the correct spec is used to persist to db.
    const currentQuoteSpec = ref<QuoteSpecification | null>(null);
    const currentQuoteAmount = ref<QuoteAmount>({
        taxes: "0.00",
        baseLoanAmount: "0.00",
        interest: "0.00",
        totalLoanAmount: "0.00",
        monthlyPayment: "0.00",
        downPayment: "0.00",
    });
    // could potentially plug into global loading indicator
    const loading = ref(false);
    // currently not used. need to handle: cascading down to components, or alert with toast
    const error = ref<string | null>(null);

    // Actions
    async function fetchAllQuotes() {
        error.value = null;
        try {
            quotes.value = await getAllQuotes();
        } catch (err) {
            error.value = (err as Error).message;
        }
    }

    async function generateQuote(value: QuoteSpecification) {
        currentQuoteSpec.value = value;
        try {
            loading.value = true;
            const newQuote = await createQuote(value);
            currentQuoteAmount.value = newQuote;
        } catch (err) {
            console.error('Error generating quote:', err);
            error.value = (err as Error).message;
        } finally {
            loading.value = false;
        }
    }
    
    async function saveCurrentQuote(quoteName: string) {
        if (!currentQuoteSpec.value || !currentQuoteAmount.value) {
            error.value = 'Current quote specification or amount is not set.';
            return;
        }
        try {
            loading.value = true;
            const updatedQuote = await saveQuote(currentQuoteSpec.value, currentQuoteAmount.value, quoteName);
            // unshift to add to the top of the list
            quotes.value.unshift(updatedQuote);
        } catch (err) {
            error.value = (err as Error).message;
        } finally {
            loading.value = false;
        }
    }

    async function removeQuote(id: number) {
        try {
            // could potentially create inconsistencies with db if delete fails
            // update to re-load list from db instead
            await deleteQuote(id);
            quotes.value = quotes.value.filter(quote => quote.id !== id);
        } catch (err) {
            error.value = (err as Error).message;
        }
    }

    return {
        // State
        quotes,
        currentQuoteSpec,
        currentQuoteAmount,
        loading,
        error,
        // Actions
        fetchAllQuotes,
        generateQuote,
        saveCurrentQuote,
        removeQuote
    };
});