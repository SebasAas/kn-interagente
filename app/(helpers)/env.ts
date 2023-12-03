export const isDev = process.env.NODE_ENV === "development";

export const getBaseUrl = () => {
    return isDev ? "http://localhost:3000" : "https://kn-interagente.vercel.app";
};
