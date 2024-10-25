import routes from "@/constants/routes";
import SetsPage from "../pages/sets";
import UserLayout from "@/layouts/UserLayout";
import { createBrowserRouter } from "react-router-dom";
import CardsPage from "@/pages/cards";

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
    ],
  },
]);

export default router;
