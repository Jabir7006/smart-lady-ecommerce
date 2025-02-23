const buildConfig = {
  webpack: {
    configure: (webpackConfig) => {
      // Enable tree shaking
      webpackConfig.optimization.usedExports = true;
      
      // Split chunks optimization
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };

      return webpackConfig;
    },
  },
};

export default buildConfig; 