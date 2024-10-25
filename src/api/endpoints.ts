const endpoints = {
  sets: "/sets",
  setById: (id?: string) => `/sets/${id}`,
  cardsBySetId: (id?: string) => `/sets/${id}/cards`,
  cardById: (id: string, cardId: string) => `/sets/${id}/cards/${cardId}`,
};

export default endpoints;
