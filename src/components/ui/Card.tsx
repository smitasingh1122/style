import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  asymmetric?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", asymmetric = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white shadow-sm border border-sand/50 overflow-hidden ${
          asymmetric ? "rounded-tr-[4rem] rounded-bl-[4rem]" : "rounded-none"
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
