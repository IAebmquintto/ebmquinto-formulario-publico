import axios from "axios";

/** Instância única do Axios — sem interceptors de auth, este projeto nunca loga ninguém. */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default api;
