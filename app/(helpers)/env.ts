export const isDevVercel = process.env.VERCEL_ENV === "development";
export const isDevNetlify = process.env.NODE_ENV === "development";

export const getBaseUrl = () => {
  const hostname = window.location.hostname;

  if (hostname.includes("kn-interagente.vercel.app")) {
    return "https://kn-interagente.vercel.app";
  }

  if (hostname.includes("localhost")) {
    // Local development
    return "http://localhost:3000";
  } else {
    return "https://dev-kn-interagente.netlify.app";
  }
};
