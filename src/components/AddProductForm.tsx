import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface AddProductFormProps {
  onAdd: (name: string, manufactureDate: string, expirationDate: string) => void;
}

const AddProductForm = ({ onAdd }: AddProductFormProps) => {
  const [name, setName] = useState("");
  const [manufactureDate, setManufactureDate] = useState<Date>();
  const [expirationDate, setExpirationDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !manufactureDate || !expirationDate) return;
    const fmtDate = (d: Date) => format(d, "yyyy-MM-dd");
    onAdd(name.trim(), fmtDate(manufactureDate), fmtDate(expirationDate));
    setName("");
    setManufactureDate(undefined);
    setExpirationDate(undefined);
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
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome do Produto</label>
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
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Data de Fabricação</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-border bg-muted/50 hover:bg-muted/70 h-[42px]",
                  !manufactureDate && "text-muted-foreground/50"
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                {manufactureDate ? format(manufactureDate, "dd/MM/yyyy") : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={manufactureDate}
                onSelect={setManufactureDate}
                locale={ptBR}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Data de Vencimento</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-border bg-muted/50 hover:bg-muted/70 h-[42px]",
                  !expirationDate && "text-muted-foreground/50"
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                {expirationDate ? format(expirationDate, "dd/MM/yyyy") : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expirationDate}
                onSelect={setExpirationDate}
                locale={ptBR}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
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
