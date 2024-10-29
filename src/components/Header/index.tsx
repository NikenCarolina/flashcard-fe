import Button from "../Button";
import routes from "@/constants/routes";
import style from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { ApiResponse, Profile, User } from "@/ts/interface";
import { commonContent } from "@/content";
import { endpoints, fullUrl } from "@/api";
import { get } from "@/utils";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>();
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      document.cookie = "isLoggedIn=;path=/";
      await get(fullUrl(endpoints.auth.logout));
      navigate(routes.auth.login);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleProfile = async () => {
      if (profile !== undefined) return;
      try {
        const res = await get<ApiResponse<User>>(fullUrl(endpoints.profile));
        setProfile(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    handleProfile();
  }, [profile]);
  return (
    <header className={style.wrapper}>
      <Link to={routes.sets}>
        <h1>{commonContent.appName}</h1>
      </Link>
      <div className={style.profile_wrapper}>
        <p>{commonContent.greet + profile?.username}</p>
        <Button
          disabled={isLoading}
          onClick={handleLogout}
          variant="transparent"
          className={style.logout_button}
        >
          {!isLoading ? "" : commonContent.loading}
          <MdLogout />
        </Button>
      </div>
    </header>
  );
};

export default Header;
