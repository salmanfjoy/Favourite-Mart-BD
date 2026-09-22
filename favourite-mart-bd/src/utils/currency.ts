// Currency formatting utility for Favourite Mart BD

export function formatBDT(amount: number): string {
  return `৳ ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatBanglaNumber(amount: number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const str = amount.toLocaleString('en-US');
  return str.replace(/[0-9]/g, (w) => bnDigits[+w]);
}
