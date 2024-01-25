export const isDev = process.env.VERCEL_ENV === "development";

export const getBaseUrl = () => {
  const hostname = window.location.hostname;

  if (hostname.includes("kn-interagente.")) {
    return "https://kn-interagente.vercel.app";
  }

  if (hostname.includes("localhost")) {
    // Local development
    return "http://localhost:3000";
  } else {
    // Remote development
    return "https://kn-interagente-git-develop-sebastians-projects-cf418221.vercel.app";
  }
};
