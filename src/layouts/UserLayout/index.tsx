import { Outlet } from "react-router-dom";
import style from "./index.module.css";
import Header from "@/components/Header";
import { SesssionContextProvider } from "@/context";

const UserLayout = () => {
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
