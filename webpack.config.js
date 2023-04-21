const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
    assetModuleFilename: "assets/[hash][ext]",
  },
  devServer: {
    historyApiFallback: true,
    watchFiles: ["./src/*.html"],
    liveReload: true,
    static: path.resolve(__dirname, "./dist"),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.svg/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack Boilerplate",
      template: path.resolve(__dirname, "./src/template.html"),
      filename: "index.html",
    }),
    new MiniCssExtractPlugin(),
    new FaviconsWebpackPlugin({
      logo: "./src/images/favicon.svg",
      prefix: "assets/",
    }),
  ],
};
