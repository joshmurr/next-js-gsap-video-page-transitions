/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["fastly.picsum.photos"],
  },
  transpilePackages: ["gsap"],
};

export default nextConfig;
