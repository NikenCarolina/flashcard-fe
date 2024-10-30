import { ApiResponse } from "@/ts/interface";
import { Button } from "@/components";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { User } from "@/ts/interface";
import { commonContent } from "@/content";
import { endpoints, fullUrl } from "@/api";
import { toClassNames, ResponseError, post } from "@/utils";
import { useEffect, useState } from "react";
import { routes } from "@/constants";
import { Link } from "react-router-dom";
import style from "./index.module.css";

const LoginPage: React.FC = () => {
  const [isError, setIsError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [form, setForm] = useState<User>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    [properties in keyof User]: [boolean, string];
  }>({
    username: [false, ""],
    password: [false, ""],
  });

  const handleLogin = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setErrors({
      ...errors,
      username: [form.username.length === 0, commonContent.required],
      password: [form.password.length === 0, commonContent.required],
    });
    if (form.username.length === 0 || form.password.length === 0) return;
    try {
      setIsLoading(true);
      const res = await post<User, ApiResponse<{ redirect_url: string }>>(
        fullUrl(endpoints.auth.login),
        form
      );
      window.location.href = res.data.redirect_url;
    } catch (err) {
      if (err instanceof ResponseError) {
        setIsError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsError("");
  }, [form]);

  return (
    <>
      <div className={style.app}>
        <img src="/flashcard_app.svg" />
        <h1>{commonContent.appName}</h1>
        <h2>{commonContent.login}</h2>
      </div>
      <form onSubmit={handleLogin} className={style.form}>
        <div className={style.input_wrapper}>
          <p>{commonContent.username}</p>
          <input
            onChange={(e) => {
              setForm({ ...form, username: e.target.value });
              setErrors({
                ...errors,
                username: [e.target.value.length === 0, commonContent.required],
              });
            }}
            value={form.username}
            placeholder={commonContent.placeholderUsername}
            className={toClassNames(style.input, {
              [style.is_error]: errors.username[0],
            })}
          ></input>
          {errors.username[0] && (
            <p className={style.error_message}>{errors.username[1]}</p>
          )}
        </div>
        <div className={style.input_wrapper}>
          <p>{commonContent.password}</p>
          <div
            className={toClassNames(style.password_wrapper, {
              [style.is_error]: errors.password[0],
            })}
          >
            <input
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setErrors({
                  ...errors,
                  password: [
                    e.target.value.length === 0,
                    commonContent.required,
                  ],
                });
              }}
              value={form.password}
              placeholder={commonContent.placeholderPassword}
              type={isOpen ? "password" : "text"}
              className={toClassNames(style.input, style.password_input)}
            ></input>
            <Button
              variant="transparent"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={style.password_button}
            >
              {isOpen && <IoMdEye size={"1rem"} />}
              {!isOpen && <IoMdEyeOff size={"1rem"} />}
            </Button>
          </div>
          {errors.password[0] && (
            <p className={style.error_message}>{errors.password[1]}</p>
          )}
        </div>

        {isError.length !== 0 && (
          <p className={toClassNames(style.error_message, style.error_main)}>
            {isError}
          </p>
        )}
        <Button
          type="submit"
          onClick={handleLogin}
          disabled={isLoading || errors.username[0] || errors.password[0]}
        >
          {!isLoading ? commonContent.login : commonContent.loading}
        </Button>
      </form>

      <div className={toClassNames(style.navigate, style.form)}>
        <p>{commonContent.notRegisteredQuestion}</p>
        <Link to={routes.auth.register}>{commonContent.createAccount}</Link>
      </div>
    </>
  );
};

export default LoginPage;
