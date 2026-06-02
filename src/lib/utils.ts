export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function formatUSD(amount: number): string {
  return '$' + amount.toFixed(2);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateOrderNumber(): string {
  return 'BH-' + Date.now().toString(36).toUpperCase();
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
