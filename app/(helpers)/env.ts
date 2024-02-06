export const isDevVercel = process.env.VERCEL_ENV === "development";
export const isDevNetlify = process.env.NODE_ENV === "development";

export const getBaseUrl = () => {
  const hostname = window.location.hostname;

  if (isDevVercel || isDevNetlify) {
    return "https://dev-kn-interagente.netlify.app";
  }

  if (hostname.includes("kn-interagente.")) {
    return "https://kn-interagente.vercel.app";
  }

  if (hostname.includes("localhost")) {
    // Local development
    return "http://localhost:3000";
  }
};
