import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar } from "lucide-react";
import { calculateExpirationDate, generateId, type Product } from "@/lib/products";

interface AddProductFormProps {
  onAdd: (product: Product) => void;
}

const AddProductForm = ({ onAdd }: AddProductFormProps) => {
  const [name, setName] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [shelfLife, setShelfLife] = useState("");
  const [unit, setUnit] = useState<"months" | "years">("months");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !manufactureDate || !shelfLife || Number(shelfLife) <= 0) return;

    const expirationDate = calculateExpirationDate(manufactureDate, Number(shelfLife), unit);
    const product: Product = {
      id: generateId(),
      name: name.trim(),
      manufactureDate,
      shelfLife: Number(shelfLife),
      shelfLifeUnit: unit,
      expirationDate,
    };

    onAdd(product);
    setName("");
    setManufactureDate("");
    setShelfLife("");
  };

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
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Nome do Produto
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Leite Integral"
            className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Data de Fabricação
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="date"
              value={manufactureDate}
              onChange={(e) => setManufactureDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/50 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors [color-scheme:dark]"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Prazo de Validade
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={shelfLife}
              onChange={(e) => setShelfLife(e.target.value)}
              placeholder="Qtd"
              className="w-20 flex-shrink-0 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              required
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as "months" | "years")}
              className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="months">Meses</option>
              <option value="years">Anos</option>
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};

export default AddProductForm;
