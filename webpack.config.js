module.exports = (config, { isProd, isDev, isTest }) => {
  /**
   * Customize the webpack by modifying the config object.
   * Consult https://webpack.js.org/configuration for more information
   */

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      loader: "file-loader?name=assets/[name].[hash].[ext]",
    },
    {
      test: /\.mjs$/,
      type: "javascript/auto",
    },
  ];

  return config;
};
