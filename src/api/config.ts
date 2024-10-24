const config: Record<string, { baseUrl: string }> = {
  development: {
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  },
};

const environment: string = import.meta.env.MODE || "development";
export const { baseUrl } = config[environment];
