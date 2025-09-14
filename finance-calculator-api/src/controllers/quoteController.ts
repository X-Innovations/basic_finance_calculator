import type { Request, Response, NextFunction } from 'express';
import type { QuoteSpecification, SaveQuote } from '../models/QuoteDefinitions';
import quoteService from '../services/quoteService';

export const generateQuote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Request body:', req.body);
        res.json(await quoteService.generateQuote(req.body as QuoteSpecification));
    } catch (error) {
        next(error);
    }
};

export const getAllQuotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await quoteService.fetchAllQuotes());
    } catch (error) {
        next(error);
    }
};

export const saveQuote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await quoteService.saveQuote(req.body as SaveQuote));
    } catch (error) {
        next(error);
    }
};

export const deleteQuote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await quoteService.deleteQuote(id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};