const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: "development",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name]_debug.js",
	},
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
	stats: {
		errorDetails: true,
	},
	devtool: "source-map", // to enable normal view of es6 js and sass code in browser
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name]_debug.css",
		}),
	],
};
