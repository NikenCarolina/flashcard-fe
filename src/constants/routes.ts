const routes = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  sets: "/sets",
  setsById: (id?: string) =>
    typeof id === "undefined" ? "/sets/:id" : `/sets/${id}`,
  lesson: "/lesson",
};

export default routes;
