export interface Product {
  id: string;
  name: string;
  manufactureDate: string;
  expirationDate: string;
}

export function getDaysUntilExpiration(expirationDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expirationDate);
  exp.setHours(0, 0, 0, 0);
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getStatusColor(days: number): "green" | "yellow" | "red" {
  if (days < 3) return "red";
  if (days <= 7) return "yellow";
  return "green";
}

export function getStatusLabel(days: number): string {
  if (days < 0) return `Venceu há ${Math.abs(days)} dia${Math.abs(days) !== 1 ? "s" : ""}`;
  if (days === 0) return "Vence hoje!";
  return `Vence em ${days} dia${days !== 1 ? "s" : ""}`;
}

export function loadProducts(user: string): Product[] {
  try {
    const data = localStorage.getItem(`produtos_${user}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProducts(user: string, products: Product[]): void {
  localStorage.setItem(`produtos_${user}`, JSON.stringify(products));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function generateWhatsAppText(products: Product[]): string {
  const lines = products.map((p) => {
    const days = getDaysUntilExpiration(p.expirationDate);
    const status = getStatusLabel(days);
    return `📦 ${p.name} — Fab: ${formatDate(p.manufactureDate)} — Venc: ${formatDate(p.expirationDate)} — ${status}`;
  });
  return `🗂️ *Lista de Produtos*\n\n${lines.join("\n")}`;
}
