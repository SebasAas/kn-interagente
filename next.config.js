/** @type {import('next').NextConfig} */
const nextConfig = {
  domains: ["drive.google.com", "i.ibb.co"],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "drive.google.com",
      pathname: "**",
    },

    {
      protocol: "https",
      hostname: "i.ibb.co",
      pathname: "*/**",
    },
  ],
};

module.exports = nextConfig;
