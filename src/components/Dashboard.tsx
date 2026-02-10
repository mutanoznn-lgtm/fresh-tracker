import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Search, Copy, Package, CheckCircle, Eye, Users } from "lucide-react";
import type { Product } from "@/lib/products";
import {
  loadProducts,
  loadAllProducts,
  saveProducts,
  getDaysUntilExpiration,
  generateWhatsAppText,
} from "@/lib/products";
import AddProductForm from "./AddProductForm";
import ProductCard from "./ProductCard";

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const isAdmin = user === "gabriela";
  const [products, setProducts] = useState<Product[]>(() => loadProducts(user));
  const [allUsersData, setAllUsersData] = useState(() => isAdmin ? loadAllProducts() : []);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const refreshAllUsers = useCallback(() => {
    if (isAdmin) setAllUsersData(loadAllProducts());
  }, [isAdmin]);

  const updateProducts = useCallback(
    (newProducts: Product[]) => {
      setProducts(newProducts);
      saveProducts(user, newProducts);
      refreshAllUsers();
    },
    [user, refreshAllUsers]
  );

  const handleAdd = useCallback(
    (product: Product) => {
      updateProducts([...products, product]);
    },
    [products, updateProducts]
  );

  const handleDelete = useCallback(
    (id: string) => {
      updateProducts(products.filter((p) => p.id !== id));
    },
    [products, updateProducts]
  );

  const handleCopy = useCallback(async () => {
    const text = generateWhatsAppText(sortedFiltered);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [products, search]);

  const sortedFiltered = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    return filtered.sort(
      (a, b) =>
        getDaysUntilExpiration(a.expirationDate) -
        getDaysUntilExpiration(b.expirationDate)
    );
  }, [products, search]);

  const stats = useMemo(() => {
    const total = products.length;
    const expired = products.filter(
      (p) => getDaysUntilExpiration(p.expirationDate) < 0
    ).length;
    const warning = products.filter((p) => {
      const d = getDaysUntilExpiration(p.expirationDate);
      return d >= 0 && d <= 7;
    }).length;
    return { total, expired, warning };
  }, [products]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                Controle de Validade
              </h1>
              <p className="text-sm text-muted-foreground">
                Olá, <span className="font-medium text-secondary">{user}</span>
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </motion.button>
        </motion.header>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-3 gap-3"
        >
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Produtos</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-neon-yellow">{stats.warning}</p>
            <p className="text-xs text-muted-foreground">Atenção</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-neon-red">{stats.expired}</p>
            <p className="text-xs text-muted-foreground">Vencidos</p>
          </div>
        </motion.div>

        {/* Add Product Form */}
        <div className="mb-6">
          <AddProductForm onAdd={handleAdd} />
        </div>

        {/* Search & Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full rounded-lg border border-border bg-muted/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {products.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-neon-green" />
                  <span className="text-neon-green">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar Lista
                </>
              )}
            </motion.button>
          )}
        </motion.div>

        {/* Product List */}
        <div className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {sortedFiltered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">
              Nenhum produto cadastrado
            </p>
            <p className="text-sm text-muted-foreground/60">
              Use o formulário acima para adicionar seu primeiro produto
            </p>
          </motion.div>
        )}

        {products.length > 0 && sortedFiltered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              Nenhum produto encontrado para "{search}"
            </p>
          </motion.div>
        )}

        {/* Admin Panel - All Users */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Todos os Usuários
              </h2>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                Admin
              </span>
            </div>

            {allUsersData.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <Eye className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">Nenhum usuário cadastrou produtos ainda</p>
              </div>
            ) : (
              <div className="space-y-6">
                {allUsersData.map(({ user: userName, products: userProducts }) => (
                  <div key={userName} className="glass-strong rounded-xl p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/20 text-sm font-bold text-secondary">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      {userName}
                      <span className="text-sm font-normal text-muted-foreground">
                        ({userProducts.length} produto{userProducts.length !== 1 ? "s" : ""})
                      </span>
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {userProducts
                        .sort((a, b) => getDaysUntilExpiration(a.expirationDate) - getDaysUntilExpiration(b.expirationDate))
                        .map((product, index) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onDelete={() => {}}
                            index={index}
                            readOnly
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
