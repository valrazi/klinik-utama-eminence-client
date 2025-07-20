/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
         optimizePackageImports: ["@chakra-ui/react"],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com'
            }
        ]
    }
};

export default nextConfig;
