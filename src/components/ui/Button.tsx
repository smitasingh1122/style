import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-charcoal text-ivory hover:bg-charcoal/90 shadow-sm",
      secondary: "bg-rosegold text-white hover:bg-rosegold/90 shadow-sm",
      outline: "border border-charcoal/20 text-charcoal hover:border-charcoal/50 hover:bg-charcoal/5",
      ghost: "text-charcoal hover:bg-charcoal/5",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-xs tracking-wider uppercase",
      md: "h-11 px-8 text-sm tracking-wide uppercase",
      lg: "h-14 px-10 text-base tracking-wide uppercase",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
