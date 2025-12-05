const path = require("path");
const { DefinePlugin } = require("webpack");
const ESLintWebpackPlugin = require("eslint-webpack-plugin"); // ESLint插件
const HtmlWebpackPlugin = require("html-webpack-plugin"); // HTML插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css成单独的文件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 压缩css
const TerserPlugin = require("terser-webpack-plugin"); // 压缩js
const CopyPlugin = require("copy-webpack-plugin"); // 复制文件 (复制public下的文件到dist目录)
const { VueLoaderPlugin } = require("vue-loader");

// 是否为生产环境
const isProduction = process.env.NODE_ENV === "production";

// 获取样式loader
const getStyleLoaders = (pre) => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : "vue-style-loader", // 生产环境将css提取到单独的文件中，开发环境使用vue-style-loader
    "css-loader",
    {
      // 处理css兼容性问题
      // 需在package.json中配置browserslist
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
    pre,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
    filename: isProduction
      ? "static/js/[name].[contenthash:10].js"
      : "static/js/[name].js",
    chunkFilename: isProduction
      ? "static/js/[name].[contenthash:10].chunk.js"
      : "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash][ext][query]",
    clean: isProduction, // 在打包前，先清空dist目录
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
      },
      // 处理图片
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片会转换为base64
          },
        },
      },
      // 处理其它资源
      {
        test: /\.(woff2?|ttf|eot|otf)$/,
        type: "asset/resource",
      },
      // 处理js
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",
        options: {
          cacheDirectory: true, // 缓存babel编译结果
          cacheCompression: false, // 不压缩缓存
        },
      },
      //  处理vue
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [
    //   ESLint插件
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      // ESLint 9 会自动查找 eslint.config.js
      eslintPath: require.resolve("eslint"),
    }),
    //   HTML插件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成单独的文件
    isProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:10].css",
        chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
      }),
    // 复制文件 (复制public下的文件到dist目录)
    isProduction &&
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "../public"),
            to: path.resolve(__dirname, "../dist"),
            globOptions: {
              ignore: ["**/index.html"], // 忽略index.html文件
            },
          },
        ],
      }),
    new VueLoaderPlugin(),
    // 定义全局变量
    new DefinePlugin({
      __VUE_OPTIONS_API__: true, // 是否使用选项式API
      __VUE_PROD_DEVTOOLS__: false, // 生产环境是否使用开发工具
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // 生产环境是否显示 hydration 不匹配的详细信息
    }),
  ].filter(Boolean),
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
    // 是否开启优化
    minimize: isProduction,
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin(), // 压缩js
    ],
  },

  // webpack 解析模块的规则
  resolve: {
    extensions: [".vue", ".js", ".json"], // 自动补全文件扩展名，让webpack自动补全后缀
    alias: {
      "@": path.resolve(__dirname, "../src"), // 配置别名，让路径更简洁
    },
  },

  devServer: {
    host: "localhost",
    port: 9527,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
};
