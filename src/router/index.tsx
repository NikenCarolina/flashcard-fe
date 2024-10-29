import routes from "@/constants/routes";
import SetsPage from "../pages/sets";
import UserLayout from "@/layouts/UserLayout";
import { createBrowserRouter } from "react-router-dom";
import CardsPage from "@/pages/cards";
import LessonPage from "@/pages/lesson";
import LoginPage from "@/pages/login";
import AuthLayout from "@/layouts/AuthLayout";
import RegisterPage from "@/pages/register";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <UserLayout />,
    children: [
      {
        path: routes.sets,
        element: <SetsPage />,
      },
      {
        path: routes.setsById(),
        element: <CardsPage />,
      },
      {
        path: routes.lesson,
        element: <LessonPage />,
      },
    ],
  },
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        path: routes.auth.login,
        element: <LoginPage />,
      },
      {
        path: routes.auth.register,
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
