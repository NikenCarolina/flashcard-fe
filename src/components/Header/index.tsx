import style from "./index.module.css";
import { IoSettingsSharp } from "react-icons/io5";
import { commonContent } from "@/content";
import { Link } from "react-router-dom";
import routes from "@/constants/routes";

const Header = () => {
  return (
    <header className={style.wrapper}>
      <Link to={routes.sets}>
        <h1>{commonContent.appName}</h1>
      </Link>
      <IoSettingsSharp />
    </header>
  );
};

export default Header;
