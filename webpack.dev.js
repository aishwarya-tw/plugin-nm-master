module.exports = (config, { isProd, isDev, isTest }) => {
  /**
   * Customize the webpack dev-server by modifying the config object.
   * Consult https://webpack.js.org/configuration/dev-server for more information.
   */

  config.module = {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: "file-loader?name=assets/[name].[hash].[ext]",
      },
      {
        test: /\.mjs$/,
        type: "javascript/auto",
      },
    ],
  };
};
