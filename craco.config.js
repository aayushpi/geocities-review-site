module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add rule for markdown files
      webpackConfig.module.rules.push({
        test: /\.md$/,
        type: 'asset/source'
      });
      
      return webpackConfig;
    }
  }
}; 