import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card = ({
  children,
  className = "",
  onClick,
  hover = false,
}: CardProps) => {
  const baseStyles =
    "bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-soft border border-gray-100/50 dark:border-gray-700/50 p-6 backdrop-blur-md transition-all duration-300";
  const hoverStyles = hover
    ? "cursor-pointer hover:shadow-strong hover:scale-[1.02] hover:bg-white/95 dark:hover:bg-gray-800/95"
    : "";

  const content = (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
};
