import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, User, Lock, Package, Mail, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const LoginScreen = () => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha");
      return;
    }
    if (isSignUp && !username.trim()) {
      setError("Preencha o nome de usuário");
      return;
    }

    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email.trim(), password, username.trim());
      if (error) setError(error);
      else setSuccess("Conta criada! Verifique seu e-mail para confirmar.");
    } else {
      const { error } = await signIn(email.trim(), password);
      if (error) setError("E-mail ou senha incorretos");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-2xl p-8 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20"
          >
            <Package className="h-10 w-10 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-2 text-center text-3xl font-bold text-foreground"
          >
            Controle de Validade
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-center text-muted-foreground"
          >
            {isSignUp ? "Crie sua conta" : "Acesse sua conta"}
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Nome de Usuário
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    placeholder="Seu nome"
                    className="w-full rounded-lg border border-border bg-muted/50 py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="seu@email.com"
                  className="w-full rounded-lg border border-border bg-muted/50 py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Sua senha"
                  className="w-full rounded-lg border border-border bg-muted/50 py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-neon-green">
                {success}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
            >
              {isSignUp ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {loading ? "Aguarde..." : isSignUp ? "Criar Conta" : "Entrar"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
              className="font-medium text-primary hover:underline"
            >
              {isSignUp ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
