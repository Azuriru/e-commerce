module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/products',
                permanent: true
            }
        ];
    },
    sassOptions: {
        prependData: '@import "src/lib/scss/index.scss";'
    },
    webpack: (config) => {
        const rules = config.module.rules
            .find((rule) => typeof rule.oneOf === 'object')
            .oneOf.filter((rule) => Array.isArray(rule.use));
        rules.forEach((rule) => {
            rule.use.forEach((moduleLoader) => {
                if (
                    moduleLoader.loader !== undefined
                    && moduleLoader.loader.includes('css-loader')
                    && typeof moduleLoader.options.modules === 'object'
                ) {
                    moduleLoader.options = {
                        ...moduleLoader.options,
                        modules: {
                            ...moduleLoader.options.modules,

                            // This is where we allow camelCase class names
                            exportLocalsConvention: 'camelCase'
                        }
                    };
                }
            });
        });

        return config;
    }
};