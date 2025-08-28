
export type QuoteInput = {
  cost: number;
  profit: number;
  term: number; // months
  rate: number; // APR in %
  outOfPocket: number;
  taxRate: number; // in %
};

export type QuoteResult = {
  taxes: number;
  baseLoanAmount: number;
  payment: number;
  interest: number;
  totalLoanAmount: number;
};

function assertNumber(n: any, name: string) {
  if (typeof n !== 'number' || Number.isNaN(n)) {
    throw new Error(`${name} must be a number`);
  }
}

export function calcQuote(input: Partial<QuoteInput>): QuoteResult {
  const cost = Number(input.cost ?? 0);
  const profit = Number(input.profit ?? 0);
  const term = Math.max(0, Math.floor(Number(input.term ?? 0)));
  const rate = Number(input.rate ?? 0);
  const outOfPocket = Number(input.outOfPocket ?? 0);
  const taxRate = Number(input.taxRate ?? 0);

  [ ['cost', cost], ['profit', profit], ['term', term],
    ['rate', rate], ['outOfPocket', outOfPocket], ['taxRate', taxRate]
  ].forEach(([k, v]) => assertNumber(v, String(k)));

  const sellingPrice = cost + profit;
  const taxes = sellingPrice * (taxRate / 100);
  const baseLoanAmount = Math.max(0, sellingPrice + taxes - outOfPocket);

  const monthlyRate = rate / 100 / 12;
  let payment = 0;
  if (term > 0) {
    if (monthlyRate === 0) {
      payment = baseLoanAmount / term;
    } else {
      const factor = Math.pow(1 + monthlyRate, term);
      payment = baseLoanAmount * (monthlyRate * factor) / (factor - 1);
    }
  }

  const totalPaid = payment * term;
  const interest = Math.max(0, totalPaid - baseLoanAmount);
  const totalLoanAmount = baseLoanAmount + interest;

  return { taxes, baseLoanAmount, payment, interest, totalLoanAmount };
}
