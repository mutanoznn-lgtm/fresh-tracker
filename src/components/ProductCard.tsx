import { motion } from "framer-motion";
import { Trash2, Calendar, Clock } from "lucide-react";
import type { Product } from "@/lib/products";
import { getDaysUntilExpiration, getStatusColor, getStatusLabel, formatDate } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  index: number;
}

const statusClasses = {
  green: "neon-green border-2",
  yellow: "neon-yellow border-2",
  red: "neon-red border-2",
};

const statusBadgeClasses = {
  green: "bg-neon-green/20 text-neon-green",
  yellow: "bg-neon-yellow/20 text-neon-yellow",
  red: "bg-neon-red/20 text-neon-red",
};

const ProductCard = ({ product, onDelete, index }: ProductCardProps) => {
  const days = getDaysUntilExpiration(product.expirationDate);
  const status = getStatusColor(days);
  const label = getStatusLabel(days);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -50 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`float-card glass rounded-xl p-4 ${statusClasses[status]} transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-foreground">
            {product.name}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Fab: {formatDate(product.manufactureDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Venc: {formatDate(product.expirationDate)}
            </span>
          </div>

          <div className="mt-3">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses[status]}`}
            >
              {label}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(product.id)}
          className="flex-shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
          aria-label="Excluir produto"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
