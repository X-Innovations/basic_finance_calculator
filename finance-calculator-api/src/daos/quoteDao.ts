import { JSONFilePreset } from "lowdb/node";
import config from "../config/config";
import type { QuoteDB, PersistedQuote } from "../models/QuoteDBDefinitions";

// separating DAO interface for future real database implementation
export interface QuoteDAO {
    getAllQuotes: () => Promise<PersistedQuote[]>;
    saveQuote: (quote: PersistedQuote) => Promise<void>;
    removeQuote: (id: number) => Promise<void>;
}

class FileSystemQuoteDAO implements QuoteDAO {

    public getAllQuotes = async () => {
        const db = await this.getDB();
        return db.read().then(() => db.data?.quotes || []);
    }

    public saveQuote = async (quote: PersistedQuote) => {
        const db = await this.getDB();
        return db.update(({ quotes }) => quotes.unshift(quote));
    }

    public removeQuote = async (id: number) => {
        const db = await this.getDB();
        db.data.quotes = db.data.quotes.filter(quote => quote.id !== id);
        await db.write();
    }

    // using simple file-based storage for simplicity in this example.
    // we can still map to external file system in a cloud environment for permanent persistence
    // in a real application, this would be replaced with a database connection
    private getDB = async () => {
        const db = await JSONFilePreset<QuoteDB>(config.dbPath, { quotes: [] });
        return db;
    }
}

const quoteDao: QuoteDAO = new FileSystemQuoteDAO();
export default quoteDao;