/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['avatars.githubusercontent.com'],
    },
    webpack: (config, { webpack }) => {
        config.plugins.push(
            new webpack.IgnorePlugin({
                resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
            })
        );

        return config;
    },
};

export default nextConfig;
