import { routes } from "@/constants";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import style from "./index.module.css";

const AuthLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedInCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)isLoggedIn\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (isLoggedInCookie === "true") navigate(routes.sets);
  });

  return (
    <div className={style.wrapper}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
