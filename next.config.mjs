/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    backend_url:
      process.env.NODE_ENV === "production"
        ? "https://tire-hunt-expressjs.vercel.app/"
        // : "https://backend.trymytires.com/",
        : "http://localhost:8482/",
    socket_url:
      process.env.NODE_ENV === "production"
        ? "https://tire-hunt-expressjs.vercel.app/"
        : "http://localhost:8483/",
    wheel_size_key: "66f25e9e1cd7865024af83098b5a2e83",
    platetovin: "KEWimev9tfTiwLv"
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trymytires.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;