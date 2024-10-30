const endpoints = {
  profile: "/profile",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
  sets: "/sets",
  setById: (id?: string) => `/sets/${id}`,
  cardsBySetId: (id?: string) => `/sets/${id}/cards`,
  cardById: (id: string, cardId: string) => `/sets/${id}/cards/${cardId}`,
  sessions: "/sessions",
  sessionById: (id?: string) => `/sessions/${id}`,
};

export default endpoints;
