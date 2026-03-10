import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = ({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
} = {}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-900",
    secondary: "bg-gold-500 text-white hover:bg-gold-600",
    outline:
      "border border-gray-200 bg-transparent hover:bg-gray-50 text-black",
    ghost: "bg-transparent hover:bg-gray-100 text-black",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-8 text-sm",
    lg: "h-14 px-10 text-base",
  };

  return cn(baseStyles, variants[variant], sizes[size], className);
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
