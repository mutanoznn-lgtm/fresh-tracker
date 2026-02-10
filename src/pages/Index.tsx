import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import LoginScreen from "@/components/LoginScreen";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="aurora-bg flex min-h-screen items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="aurora-bg min-h-screen">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
            <LoginScreen />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
