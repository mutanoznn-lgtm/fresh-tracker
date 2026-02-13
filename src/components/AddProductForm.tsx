import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar } from "lucide-react";

interface AddProductFormProps {
  onAdd: (name: string, manufactureDate: string, expirationDate: string) => void;
}

function applyDateMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function maskedToIso(masked: string): string | null {
  const match = masked.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

const AddProductForm = ({ onAdd }: AddProductFormProps) => {
  const [name, setName] = useState("");
  const [manufDateText, setManufDateText] = useState("");
  const [expDateText, setExpDateText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mfDate = maskedToIso(manufDateText);
    const exDate = maskedToIso(expDateText);
    if (!name.trim() || !mfDate || !exDate) return;
    onAdd(name.trim(), mfDate, exDate);
    setName("");
    setManufDateText("");
    setExpDateText("");
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass-strong rounded-xl p-5"
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        <Plus className="h-5 w-5 text-primary" />
        Cadastro Rápido
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome do Produto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Leite Integral"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Fabricação</label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              inputMode="numeric"
              value={manufDateText}
              onChange={(e) => setManufDateText(applyDateMask(e.target.value))}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              className={`${inputClass} pl-9`}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Vencimento</label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              inputMode="numeric"
              value={expDateText}
              onChange={(e) => setExpDateText(applyDateMask(e.target.value))}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              className={`${inputClass} pl-9`}
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </motion.button>
      </div>
    </motion.form>
  );
};

export default AddProductForm;
