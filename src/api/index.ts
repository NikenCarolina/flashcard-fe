import { baseUrl } from "./config";

const fullUrl = (path: string) => `${baseUrl}${path}`;

export { fullUrl };
export { default as endpoints } from "./endpoints";
