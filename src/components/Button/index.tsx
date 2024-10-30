import { toClassNames } from "@/utils";
import { ComponentProps } from "react";
import style from "./index.module.css";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "delete" | "yellow" | "green" | "red" | "transparent";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...rest
}) => {
  const buttonClassName = toClassNames(
    style.button,
    style[`${variant}`],
    rest.className
  );
  return (
    <button {...rest} className={buttonClassName}>
      {children}
    </button>
  );
};

export default Button;
