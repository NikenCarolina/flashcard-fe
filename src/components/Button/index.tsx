import toClassNames from "@/utils/toClassNames";
import { ComponentProps } from "react";
import style from "./index.module.css";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...rest
}) => {
  const buttonClassName = toClassNames(style.button, style[`${variant}`]);
  return (
    <button className={buttonClassName} {...rest}>
      {children}
    </button>
  );
};

export default Button;
