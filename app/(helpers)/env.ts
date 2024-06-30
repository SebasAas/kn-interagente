export const getBaseUrl = () => {
  const hostname = window.location.hostname;

  if (hostname.includes("kn-interagente.vercel.app")) {
    return "https://kn-interagente.vercel.app";
  }

  // Local development
  if (hostname.includes("127")) {
    return "http://127.0.0.1:3000";
  } else if (hostname.includes("localhost")) {
    return "http://localhost:3000";
  } else {
    return "https://dev-kn-interagente.netlify.app/";
  }
};
