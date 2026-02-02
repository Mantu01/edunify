import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo/logo";

const Loader = ({ isLoading = true }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          return 99;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const getLoadingMessage = () => {
    if (progress < 20) return "Initializing systems";
    if (progress < 45) return "Loading components";
    if (progress < 70) return "Optimizing performance";
    if (progress < 90) return "Finalizing setup";
    return "Ready to launch";
  };

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        isDark ? "bg-black" : "bg-white"
      )}
    >
      <div className="relative w-full max-w-sm px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className={cn(
            "border border-white/10 bg-black/20 backdrop-blur-md shadow-2xl",
            !isDark && "border-black/10 bg-white/20"
          )}>
            <div className="p-8">
              <div className="flex flex-col items-center space-y-8">
                
                <div className="relative">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Card className={cn(
                      "w-24 h-24 flex items-center justify-center border bg-black shadow-lg",
                      isDark 
                        ? "border-white/20" 
                        : "border-black/20 bg-white shadow-black/10"
                    )}>
                      <motion.div 
                        className={cn(
                          "text-2xl font-bold",
                          isDark ? "text-white" : "text-black"
                        )}
                        animate={{ 
                          rotate: [0, 2, -2, 0]
                        }}
                        transition={{ 
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Logo />
                      </motion.div>
                    </Card>
                  </motion.div>
                </div>

                <motion.div 
                  className="text-center space-y-1 w-full"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <h1 className={cn(
                    "text-2xl font-semibold tracking-tight",
                    isDark ? "text-white" : "text-black"
                  )}>
                    Edunify
                  </h1>
                </motion.div>

                <motion.div 
                  className="w-full space-y-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <div className="flex justify-between items-center">
                    <motion.span 
                      key={getLoadingMessage()}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        "text-xs font-medium tracking-wide uppercase",
                        isDark ? "text-white/70" : "text-black/70"
                      )}
                    >
                      {getLoadingMessage()}
                    </motion.span>
                    <Badge 
                      variant="secondary"
                      className={cn(
                        "text-xs font-semibold tabular-nums min-w-12 justify-center border",
                        isDark
                          ? "bg-black/20 text-white border-white/20"
                          : "bg-white/20 text-black border-black/20"
                      )}
                    >
                      {progress}%
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className={cn(
                      "h-1.5 border",
                      isDark
                        ? "bg-white/5 border-white/20 [&>div]:bg-white"
                        : "bg-black/5 border-black/20 [&>div]:bg-black"
                    )}
                  />
                </motion.div>

                <div className="flex items-center space-x-1.5 h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isDark ? "bg-white/40" : "bg-black/40"
                      )}
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{ 
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loader;