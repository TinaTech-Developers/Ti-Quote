/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ldfpdffkxwgnhsznaizv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "/**",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
