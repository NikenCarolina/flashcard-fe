import { ApiResponse } from "@/ts/interface";
import { Button } from "@/components";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { RegisterUser, User } from "@/ts/interface/user.interface";
import { commonContent } from "@/content";
import { endpoints, fullUrl } from "@/api";
import {
  ResponseError,
  isConfirmPasswordValid,
  isPasswordValid,
  isUsernameValid,
  post,
} from "@/utils";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "@/constants";
import style from "./index.module.css";
import toClassNames from "@/utils/toClassNames";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [form, setForm] = useState<RegisterUser>({
    username: "",
    password: "",
    confirm_password: "",
  });

  const [isValid, setIsValid] = useState<{
    [properties in keyof RegisterUser]: [boolean, string];
  }>({
    username: [true, ""],
    password: [true, ""],
    confirm_password: [true, ""],
  });

  const handleRegister = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsValid({
      ...isValid,
      username: isUsernameValid(form.username),
      password: isPasswordValid(form.password),
      confirm_password: isConfirmPasswordValid(
        form.password,
        form.confirm_password
      ),
    });
    if (
      !isUsernameValid(form.username)[0] ||
      !isPasswordValid(form.password)[0] ||
      !isConfirmPasswordValid(form.password, form.confirm_password)[0]
    )
      return;
    try {
      setIsLoading(true);
      await post<User, ApiResponse<undefined>>(
        fullUrl(endpoints.auth.register),
        form
      );
      navigate(routes.auth.login);
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
        <h1>{commonContent.appName}</h1>
        <h2>{commonContent.register}</h2>
      </div>
      <form onSubmit={handleRegister} className={style.form}>
        <div className={style.input_wrapper}>
          <p>{commonContent.username}</p>
          <input
            onChange={(e) => {
              setForm({ ...form, username: e.target.value });
              setIsValid({
                ...isValid,
                username: isUsernameValid(e.target.value),
              });
            }}
            value={form.username}
            placeholder={commonContent.placeholderUsername}
            className={toClassNames(style.input, {
              [style.is_error]: !isValid.username[0],
            })}
          ></input>
          {!isValid.username[0] && (
            <p className={style.error_message}>{isValid.username[1]}</p>
          )}
        </div>

        <div className={style.input_wrapper}>
          <p>{commonContent.password}</p>
          <div
            className={toClassNames(style.password_wrapper, {
              [style.is_error]: !isValid.password[0],
            })}
          >
            <input
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setIsValid({
                  ...isValid,
                  password: isPasswordValid(e.target.value),
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
          {!isValid.password[0] && (
            <p className={style.error_message}>{isValid.password[1]}</p>
          )}
        </div>

        <div className={style.input_wrapper}>
          <p>{commonContent.password}</p>
          <div
            className={toClassNames(style.password_wrapper, {
              [style.is_error]: !isValid.confirm_password[0],
            })}
          >
            <input
              onChange={(e) => {
                setForm({ ...form, confirm_password: e.target.value });
                setIsValid({
                  ...isValid,
                  confirm_password: isConfirmPasswordValid(
                    form.password,
                    e.target.value
                  ),
                });
              }}
              value={form.confirm_password}
              placeholder={commonContent.placeholderConfirmPassword}
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
          {!isValid.confirm_password[0] && (
            <p className={style.error_message}>{isValid.confirm_password[1]}</p>
          )}
        </div>
        {isError.length !== 0 && (
          <p className={toClassNames(style.error_message, style.error_main)}>
            {isError}
          </p>
        )}
        <Button
          type="submit"
          onClick={handleRegister}
          disabled={
            isLoading ||
            !isValid.username[0] ||
            !isValid.password[0] ||
            !isValid.confirm_password[0]
          }
        >
          {!isLoading ? commonContent.register : commonContent.loading}
        </Button>
      </form>

      <div className={toClassNames(style.navigate, style.form)}>
        <p>{commonContent.registeredQuestion}</p>
        <Link to={routes.auth.login}>{commonContent.login}</Link>
      </div>
    </>
  );
};

export default RegisterPage;
