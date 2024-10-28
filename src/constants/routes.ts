const routes = {
  home: "/",
  sets: "/sets",
  setsById: (id?: string) =>
    typeof id === "undefined" ? "/sets/:id" : `/sets/${id}`,
  lesson: "/lesson",
};

export default routes;
