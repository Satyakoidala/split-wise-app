const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: "development",
	entry: {
		bundle: path.resolve(__dirname, "index.js"),
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "debug_[name]_[contenthash].js",
		clean: true,
		assetModuleFilename: "[name][ext]",
	},
	target: "web",
	devServer: {
		port: "9009",
		static: {
			directory: path.resolve(__dirname, "dist"),
		},
		open: true,
		hot: true,
		compress: true,
		historyApiFallback: true,
		liveReload: true,
	},
	resolve: {
		extensions: [".js", ".jsx", ".json"],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/, // kind of file extension this rule should look for and apply in test
				exclude: /node_modules/, // folder to be excluded
				use: "babel-loader", // loader which we are going to use
			},
			{
				test: /\.scss$/i,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							sourceMap: true,
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "debug_[name]_[contenthash].css",
		}),
		new HTMLWebpackPlugin({
			title: "Splitwise - React App",
			filename: "index.html",
			template: "src/pages/homepage.html",
		}),
	],
};
