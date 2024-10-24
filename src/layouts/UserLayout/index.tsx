import { Outlet } from "react-router-dom";
import style from "./index.module.css";
import Header from "@/components/Header";

const UserLayout = () => {
  return (
    <>
      <Header />
      <div className={style["outlet_wrapper"]}>
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
