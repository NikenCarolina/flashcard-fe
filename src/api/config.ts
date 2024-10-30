const config: Record<string, { baseUrl: string }> = {
  production: {
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  },
  development: {
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  },
};

const environment: string = import.meta.env.MODE || "development";
export const { baseUrl } = config[environment];
