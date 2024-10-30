import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import style from "./index.module.css";
import Header from "@/components/Header";
import { SesssionContextProvider } from "@/context";
import { useEffect } from "react";
import { routes } from "@/constants";

const UserLayout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = searchParams.get("isLoggedIn");
    if (isLoggedIn !== null)
      document.cookie = "isLoggedIn=" + isLoggedIn + ";path=/";

    const isLoggedInCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)isLoggedIn\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (isLoggedInCookie !== "true") navigate(routes.auth.login);
    if (location.pathname === "/") navigate(routes.sets);
  }, [location.pathname, navigate, searchParams]);

  return (
    <>
      <Header />
      <div className={style["outlet_wrapper"]}>
        <SesssionContextProvider>
          <Outlet />
        </SesssionContextProvider>
      </div>
    </>
  );
};

export default UserLayout;
