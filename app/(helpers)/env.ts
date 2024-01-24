export const isDev = process.env.VERCEL_ENV === "development";

export const getBaseUrl = () => {
  if (!isDev) {
    // Production URL
    return "https://kn-interagente.vercel.app";
  }

  // For development, check the hostname to determine the correct URL
  const hostname = window.location.hostname;

  if (hostname.includes("localhost")) {
    // Local development
    return "http://localhost:3000";
  } else {
    // Remote development
    return "https://kn-interagente-git-develop-sebastians-projects-cf418221.vercel.app";
  }
};
