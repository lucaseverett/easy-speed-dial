import type { ButtonHTMLAttributes, ReactNode } from "react";

interface SwitchProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "role" | "aria-checked"
  > {
  checked: boolean;
  children?: ReactNode;
}

export const Switch = ({ checked, children, ...props }: SwitchProps) => {
  return (
    <button type="button" role="switch" aria-checked={checked} {...props}>
      {children}
    </button>
  );
};
