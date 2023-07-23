const path = require("path");
const sass = require("sass");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: {
		splitwise: path.resolve(__dirname, "index.js"),
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		clean: true,
		assetModuleFilename: "[name][ext]",
	},
	target: "web",
	resolve: {
		extensions: ["*", ".js", ".jsx"],
	},
	module: {
		rules: [
			{
				test: /\.scss$/i,
				exclude: /node_modules/,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false,
						},
					},
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
							implementation: sass,
						},
					},
				],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: "babel-loader",
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new HTMLWebpackPlugin({
			title: "Splitwise - React App",
			filename: "index.html",
			template: "src/pages/homepage.html",
		}),
	],
};
