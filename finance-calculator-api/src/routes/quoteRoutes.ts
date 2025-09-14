import { Router } from "express";
import * as quoteController from "../controllers/quoteController";

const router = Router();

router.post("/generate", quoteController.generateQuote);
router.get("/", quoteController.getAllQuotes);
router.post("/", quoteController.saveQuote);
router.delete("/:id", quoteController.deleteQuote);

export default router;
